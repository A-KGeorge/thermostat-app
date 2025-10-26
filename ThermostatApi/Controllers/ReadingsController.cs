using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThermostatApi.Data;
using ThermostatApi.Models;
using ThermostatApi.Services;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ReadingsController : ControllerBase
{
    private readonly ReadingService _readingService;

    public ReadingsController(ReadingService readingService) => _readingService = readingService;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _readingService.GetPaginatedReadingsAsync(page, pageSize);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Reading reading)
    {
        if (reading.TemperatureC < -100 || reading.TemperatureC > 100)
            return BadRequest("Temperature out of range.");

        reading.CreatedAtUtc = DateTime.UtcNow;
        await _readingService.CreateReadingAsync(reading);
        return Ok(reading);
    }

}