using Microsoft.EntityFrameworkCore;
using ThermostatApi.Data;
using ThermostatApi.Models;

namespace ThermostatApi.Services
{
    public class ReadingService
    {
        private readonly AppDbContext _context;

        public ReadingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<Reading>> GetPaginatedReadingsAsync(int page, int pageSize)
        {
            var query = _context.Readings.OrderByDescending(r => r.CreatedAtUtc);
            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Reading>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        public async Task<Reading> CreateReadingAsync(Reading reading)
        {
            _context.Readings.Add(reading);
            await _context.SaveChangesAsync();
            return reading;
        }
    }
}
