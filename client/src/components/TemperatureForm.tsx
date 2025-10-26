interface TemperatureFormProps {
  temp: string;
  setTemp: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TemperatureForm({
  temp,
  setTemp,
  onSubmit,
}: TemperatureFormProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold gradient-text mb-6">Add Reading</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder="Enter temperature"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            required
          />
          <p className="text-white/40 text-xs mt-2">Range: -100°C to 100°C</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-transform duration-200 transform hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          ✨ Add Reading
        </button>
      </form>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60 text-xs">
          💡 <span className="font-medium">Tip:</span> Track your temperature
          readings over time to identify patterns and trends.
        </p>
      </div>
    </div>
  );
}
