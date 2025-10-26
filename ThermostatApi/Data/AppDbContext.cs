using Microsoft.EntityFrameworkCore;
using ThermostatApi.Models;

namespace ThermostatApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Reading> Readings { get; set; }
    }
}