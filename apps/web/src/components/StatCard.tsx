import React from 'react';

export function StatCard({
  label,
  value,
  icon: Icon,
  tone
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-ink">{value}</p>
        </div>
        <span className={`grid size-12 place-items-center rounded-lg ${tone}`}>
          <Icon className="size-6" />
        </span>
      </div>
    </section>
  );
}
