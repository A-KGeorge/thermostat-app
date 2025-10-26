using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ThermostatApi.Data;
using ThermostatApi.Models;
using ThermostatApi.Services;
using Xunit;

namespace ThermostatApi.Tests;

public class ReadingServiceTests
{
    private AppDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetPaginatedReadingsAsync_ReturnsCorrectPage()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new ReadingService(context);

        // Add test data
        for (int i = 1; i <= 25; i++)
        {
            context.Readings.Add(new Reading
            {
                TemperatureC = i,
                CreatedAtUtc = DateTime.UtcNow.AddMinutes(-i)
            });
        }
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetPaginatedReadingsAsync(page: 1, pageSize: 10);

        // Assert
        result.Items.Should().HaveCount(10);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);
        result.TotalCount.Should().Be(25);
        result.TotalPages.Should().Be(3);
    }

    [Fact]
    public async Task GetPaginatedReadingsAsync_OrdersByCreatedAtUtcDescending()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new ReadingService(context);

        var oldest = new Reading { TemperatureC = 10, CreatedAtUtc = DateTime.UtcNow.AddDays(-2) };
        var middle = new Reading { TemperatureC = 20, CreatedAtUtc = DateTime.UtcNow.AddDays(-1) };
        var newest = new Reading { TemperatureC = 30, CreatedAtUtc = DateTime.UtcNow };

        context.Readings.AddRange(oldest, middle, newest);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetPaginatedReadingsAsync(page: 1, pageSize: 10);

        // Assert
        var items = result.Items.ToList();
        items[0].TemperatureC.Should().Be(30); // Newest first
        items[1].TemperatureC.Should().Be(20);
        items[2].TemperatureC.Should().Be(10); // Oldest last
    }

    [Fact]
    public async Task CreateReadingAsync_AddsReadingToDatabase()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new ReadingService(context);
        var reading = new Reading
        {
            TemperatureC = 22.5,
            CreatedAtUtc = DateTime.UtcNow,
            Location = "Living Room",
            Notes = "Test reading"
        };

        // Act
        var result = await service.CreateReadingAsync(reading);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);
        context.Readings.Should().ContainEquivalentOf(reading);
    }

    [Fact]
    public async Task GetPaginatedReadingsAsync_WithEmptyDatabase_ReturnsEmptyResult()
    {
        // Arrange
        using var context = CreateInMemoryContext();
        var service = new ReadingService(context);

        // Act
        var result = await service.GetPaginatedReadingsAsync(page: 1, pageSize: 10);

        // Assert
        result.Items.Should().BeEmpty();
        result.TotalCount.Should().Be(0);
        result.TotalPages.Should().Be(0);
    }
}
