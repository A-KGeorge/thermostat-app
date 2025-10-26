interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  gradient: string;
}

export default function StatCard({
  icon,
  label,
  value,
  subtitle,
  gradient,
}: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg border border-white/10 hover:scale-105 hover:-translate-y-[2px] transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <svg
          className="w-5 h-5 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
      <div>
        <p className="text-white/70 text-xs font-medium tracking-wider mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-bold mb-1">{value}</p>
        <p className="text-white/60 text-xs">{subtitle}</p>
      </div>
    </div>
  );
}
