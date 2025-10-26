namespace ThermostatApi.Models
{
    public class Reading
    {
        public int Id { get; set; }
        public double TemperatureC { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAtUtc { get; set; }
    }
}