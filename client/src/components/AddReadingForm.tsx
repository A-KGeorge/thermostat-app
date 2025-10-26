interface AddReadingFormProps {
  temp: string;
  setTemp: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddReadingForm({
  temp,
  setTemp,
  onSubmit,
}: AddReadingFormProps) {
  return (
    <div className="bg-purple-800/40 backdrop-blur-md rounded-2xl p-6 border border-purple-600/30 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-purple-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 className="text-lg font-bold text-white">Add Reading</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-purple-200 text-sm mb-2">
            Temperature (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder="Enter temperature"
            className="w-full px-4 py-3 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
            required
          />
          <p className="text-purple-400 text-xs mt-2">Range: -100°C to 100°C</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Reading
        </button>
      </form>

      <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-600/20">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-purple-300 text-xs">
            <span className="font-medium">Tip:</span> Track your temperature
            readings over time to identify patterns and optimize energy usage.
          </p>
        </div>
      </div>
    </div>
  );
}
