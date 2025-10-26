import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import TemperatureControl from "./components/TemperatureControl";
import ReadingsList from "./components/ReadingsList";
import { useAllReadings, useCreateReading } from "./lib/queries";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ThermostatApp() {
  const [temp, setTemp] = useState("");
  const [targetTemp, setTargetTemp] = useState(22);

  const { readings } = useAllReadings();
  const createReadingMutation = useCreateReading();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createReadingMutation.mutateAsync(parseFloat(temp));
      setTemp("");
    } catch (error) {
      console.error("Failed to submit reading:", error);
    }
  }

  const currentTemp = readings.length > 0 ? readings[0].temperatureC : 0;

  const avgTemp =
    readings.length > 0
      ? parseFloat(
          (
            readings.reduce((sum, r) => sum + r.temperatureC, 0) /
            readings.length
          ).toFixed(1)
        )
      : 0;

  const maxTemp =
    readings.length > 0 ? Math.max(...readings.map((r) => r.temperatureC)) : 0;

  const minTemp =
    readings.length > 0 ? Math.min(...readings.map((r) => r.temperatureC)) : 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Subtle background vignette */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="❄️"
              label="CURRENT"
              value={`${currentTemp.toFixed(1)}°C`}
              subtitle="Real-time Data"
              gradient="from-cyan-500 to-blue-600"
            />
            <StatCard
              icon="📊"
              label="AVERAGE"
              value={`${avgTemp}°C`}
              subtitle="Total Avg"
              gradient="from-blue-500 to-indigo-600"
            />
            <StatCard
              icon="🔥"
              label="MAXIMUM"
              value={`${maxTemp.toFixed(1)}°C`}
              subtitle="Todays Peak"
              gradient="from-orange-500 to-red-600"
            />
            <StatCard
              icon="🌡️"
              label="MINIMUM"
              value={`${minTemp.toFixed(1)}°C`}
              subtitle="Today's Low"
              gradient="from-teal-500 to-cyan-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Temperature Control with Add Reading */}
            <div>
              <TemperatureControl
                targetTemp={targetTemp}
                setTargetTemp={setTargetTemp}
                temp={temp}
                setTemp={setTemp}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Right Column - Readings List */}
            <div className="lg:col-span-2">
              <ReadingsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with QueryClientProvider
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThermostatApp />
    </QueryClientProvider>
  );
}
