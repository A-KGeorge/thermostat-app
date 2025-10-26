import { useRef, useState, useEffect } from "react";

interface TemperatureControlProps {
  targetTemp: number;
  setTargetTemp: (temp: number) => void;
  temp: string;
  setTemp: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TemperatureControl({
  targetTemp,
  setTargetTemp,
  temp,
  setTemp,
  onSubmit,
}: TemperatureControlProps) {
  const [inputMode, setInputMode] = useState<"knob" | "text">("knob");
  const percentage = ((targetTemp + 100) / 200) * 100;
  const knobRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync targetTemp with temp input
  useEffect(() => {
    setTemp(targetTemp.toString());
  }, [targetTemp, setTemp]);

  const calculateAngleFromEvent = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
  ) => {
    if (!knobRef.current) return null;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX =
        e.touches[0]?.clientX ||
        (e as TouchEvent).changedTouches[0]?.clientX ||
        0;
      clientY =
        e.touches[0]?.clientY ||
        (e as TouchEvent).changedTouches[0]?.clientY ||
        0;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    return angle;
  };

  const angleToTemperature = (angle: number) => {
    // Normalize angle to 0-360 degrees, starting from top (-90 degrees)
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    // Map 0-360 degrees to -100 to 100 temperature range
    const temp = Math.round((degrees / 360) * 200 - 100);
    return Math.max(-100, Math.min(100, temp));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const angle = calculateAngleFromEvent(e);
    if (angle !== null) {
      setTargetTemp(angleToTemperature(angle));
    }
  };

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const angle = calculateAngleFromEvent(e);
    if (angle !== null) {
      setTargetTemp(angleToTemperature(angle));
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const angle = calculateAngleFromEvent(e);
    if (angle !== null) {
      setTargetTemp(angleToTemperature(angle));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const angle = calculateAngleFromEvent(e);
    if (angle !== null) {
      setTargetTemp(angleToTemperature(angle));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners for mouse/touch move and up
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleGlobalTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchend", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("touchmove", handleGlobalTouchMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("touchend", handleGlobalMouseUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div className="bg-purple-800/40 backdrop-blur-md rounded-2xl p-6 border border-purple-600/30 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <h2 className="text-lg font-bold text-white">Temperature Control</h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-purple-900/50 rounded-lg p-1">
          <button
            onClick={() => setInputMode("knob")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              inputMode === "knob"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-purple-300 hover:text-white"
            }`}
          >
            🎛️ Knob
          </button>
          <button
            onClick={() => setInputMode("text")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
              inputMode === "text"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "text-purple-300 hover:text-white"
            }`}
          >
            ⌨️ Text
          </button>
        </div>
      </div>

      {/* Input Mode: Knob */}
      {inputMode === "knob" && (
        <>
          <div className="relative flex items-center justify-center mb-6">
            <svg
              ref={knobRef}
              className={`w-64 h-64 transform -rotate-90 ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ touchAction: "none" }}
              viewBox="0 0 192 192"
            >
              {/* Tick marks */}
              {Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * 2 * Math.PI;
                const isMajor = i % 5 === 0;
                const innerRadius = isMajor ? 74 : 78;
                const outerRadius = 84;
                const x1 = 96 + innerRadius * Math.cos(angle);
                const y1 = 96 + innerRadius * Math.sin(angle);
                const x2 = 96 + outerRadius * Math.cos(angle);
                const y2 = 96 + outerRadius * Math.sin(angle);

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={isMajor ? "2" : "1"}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${
                  2 * Math.PI * 70 * (1 - percentage / 100)
                }`}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
              {/* Knob indicator - positioned ON the circle track */}
              <circle
                cx={96 + 70 * Math.cos((percentage / 100) * 2 * Math.PI)}
                cy={96 + 70 * Math.sin((percentage / 100) * 2 * Math.PI)}
                r="10"
                fill="white"
                stroke="#ec4899"
                strokeWidth="3"
                className={`${
                  isDragging ? "scale-110" : ""
                } transition-transform duration-150 drop-shadow-xl`}
                style={{ transformOrigin: "center" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center pointer-events-none">
              <p className="text-6xl font-bold text-white">{targetTemp}</p>
              <p className="text-sm text-purple-300 mt-1">Target °C</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-xs text-purple-300">
              {isDragging ? "🎯 Adjusting..." : "👆 Drag the knob to adjust"}
            </p>
          </div>
        </>
      )}

      {/* Input Mode: Text */}
      {inputMode === "text" && (
        <div className="mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-white mb-2">{targetTemp}</p>
              <p className="text-sm text-purple-300">Target °C</p>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 text-sm mb-2">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={temp}
              onChange={(e) => {
                setTemp(e.target.value);
                const numValue = parseFloat(e.target.value);
                if (!isNaN(numValue) && numValue >= -100 && numValue <= 100) {
                  setTargetTemp(Math.round(numValue));
                }
              }}
              placeholder="Enter temperature"
              className="w-full px-4 py-3 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white text-center text-lg placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              required
            />
            <p className="text-purple-400 text-xs mt-2 text-center">
              Range: -100°C to 100°C
            </p>
          </div>
        </div>
      )}

      {/* Add Reading Button */}
      <form onSubmit={onSubmit} className="mb-6">
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
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

      <div className="mb-6 p-3 bg-purple-900/30 rounded-lg border border-purple-600/20">
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
            <span className="font-medium">Tip:</span> Switch between knob and
            text input using the toggle above.
          </p>
        </div>
      </div>

      {/* Status Info */}
      <div className="space-y-3 border-t border-purple-600/30 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-white/90">System Status</span>
          </div>
          <span className="text-sm font-semibold text-green-400 status-active">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-sm text-white/90">Fan Speed</span>
          </div>
          <span className="text-sm font-semibold text-cyan-400">Medium</span>
        </div>
      </div>
    </div>
  );
}
