interface EventDetailSectionHeaderProps {
  label?: string;
  title: string;
  className?: string;
}

export function EventDetailSectionHeader({
  label,
  title,
  className = "",
}: EventDetailSectionHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
          {label}
        </p>
      )}
      <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
      <div className="mt-5 h-px bg-white/10" aria-hidden />
    </div>
  );
}
