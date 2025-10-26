interface Reading {
  id: number;
  temperatureC: number;
  createdAtUtc: string;
  location?: string;
  notes?: string;
}

interface TemperatureCardProps {
  reading: Reading;
}

export default function TemperatureCard({ reading }: TemperatureCardProps) {
  const date = new Date(reading.createdAtUtc);
  const tempColor =
    reading.temperatureC < 0
      ? "text-blue-400"
      : reading.temperatureC < 15
      ? "text-cyan-400"
      : reading.temperatureC < 25
      ? "text-green-400"
      : reading.temperatureC < 35
      ? "text-yellow-400"
      : "text-red-400";

  const tempEmoji =
    reading.temperatureC < 0
      ? "❄️"
      : reading.temperatureC < 15
      ? "🧊"
      : reading.temperatureC < 25
      ? "😊"
      : reading.temperatureC < 35
      ? "🌡️"
      : "🔥";

  return (
    <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 transition-all hover:scale-[1.02] hover:border-white/30 hover:shadow-lg animate-fade-in cursor-pointer">
      {/* Shimmer line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-3xl">{tempEmoji}</div>
          <div>
            <div className={`text-2xl font-bold ${tempColor}`}>
              {reading.temperatureC.toFixed(1)}°C
            </div>
            <div className="text-white/50 text-sm mt-1">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </div>
        <div className="text-right text-white/40 text-xs">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-white/30 mt-1">ID: {reading.id}</div>
        </div>
      </div>

      {(reading.location || reading.notes) && (
        <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
          {reading.location && (
            <p className="text-white/50 text-xs">📍 {reading.location}</p>
          )}
          {reading.notes && (
            <p className="text-white/50 text-xs">📝 {reading.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
