'use client';

export default function ChartSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl p-6 border border-border shadow-md">
        <h3 className="text-lg font-semibold text-cardForeground mb-2">Revenue Growth</h3>
        <div className="h-64 bg-mutedForeground/10 rounded-md flex items-center justify-center text-mutedForeground text-sm">
          Line Chart Placeholder
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md">
        <h3 className="text-lg font-semibold text-cardForeground mb-2">Client Spend Overview</h3>
        <div className="h-64 bg-mutedForeground/10 rounded-md flex items-center justify-center text-mutedForeground text-sm">
          Bar Chart Placeholder
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-md lg:col-span-2">
        <h3 className="text-lg font-semibold text-cardForeground mb-2">Funnel Distribution</h3>
        <div className="h-64 bg-mutedForeground/10 rounded-md flex items-center justify-center text-mutedForeground text-sm">
          Donut Chart Placeholder
        </div>
      </div>
    </section>
  );
}