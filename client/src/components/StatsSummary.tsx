interface StatsSummaryProps {
  label: string;
  value: string;
  color: "blue" | "red" | "cyan";
}

export default function StatsSummary({
  label,
  value,
  color,
}: StatsSummaryProps) {
  const colorClasses = {
    blue: "from-cyan-400 to-blue-500",
    red: "from-orange-400 to-rose-500",
    cyan: "from-teal-400 to-cyan-500",
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden`}>
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-30 blur-xl`}
      />
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-[1.03] transition-transform">
        <p className="text-white/70 text-sm mb-1">{label}</p>
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
