using System.Net;
using System.Net.Http.Json;
using System.Data.Common;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using ThermostatApi.Data;
using ThermostatApi.Models;
using Xunit;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Hosting;

namespace ThermostatApi.Tests;

public class ReadingsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public ReadingsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetReadings_ReturnsPagedResult()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/readings?page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<PagedResult<Reading>>();
        result.Should().NotBeNull();
        result!.Items.Should().NotBeNull();
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task CreateReading_WithValidData_ReturnsOk()
    {
        // Arrange
        var reading = new { temperatureC = 22.5 };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/readings", reading);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<Reading>();
        result.Should().NotBeNull();
        result!.TemperatureC.Should().Be(22.5);
        result.CreatedAtUtc.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Theory]
    [InlineData(-101)]
    [InlineData(101)]
    public async Task CreateReading_WithOutOfRangeTemperature_ReturnsBadRequest(double temperature)
    {
        // Arrange
        var reading = new { temperatureC = temperature };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/readings", reading);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateReading_MultipleTimes_IncrementsCount()
    {
        // Arrange
        var reading1 = new { temperatureC = 20.0 };
        var reading2 = new { temperatureC = 25.0 };

        // Act
        await _client.PostAsJsonAsync("/api/v1/readings", reading1);
        await _client.PostAsJsonAsync("/api/v1/readings", reading2);

        var response = await _client.GetAsync("/api/v1/readings?page=1&pageSize=10");
        var result = await response.Content.ReadFromJsonAsync<PagedResult<Reading>>();

        // Assert
        result!.TotalCount.Should().BeGreaterOrEqualTo(2);
        result.Items.Should().Contain(r => r.TemperatureC == 20.0);
        result.Items.Should().Contain(r => r.TemperatureC == 25.0);
    }
}

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (dbContextDescriptor != null)
            {
                services.Remove(dbContextDescriptor);
            }

            // Create a SQLite in-memory connection that stays open
            var connection = new SqliteConnection("DataSource=:memory:");
            connection.Open();

            // Add the new DbContext with SQLite in-memory provider
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(connection);
            });

            // Ensure the database is created
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        });
    }
}
