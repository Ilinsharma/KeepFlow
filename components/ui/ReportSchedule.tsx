'use client';

export default function ReportSchedule() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl p-5 shadow border border-border">
        <h3 className="text-lg font-semibold text-cardForeground">Last Report Sent</h3>
        <p className="text-2xl font-bold text-primary mt-1">Aug 11, 2025</p>
      </div>
      <div className="bg-card rounded-xl p-5 shadow border border-border">
        <h3 className="text-lg font-semibold text-cardForeground">Next Report Due</h3>
        <p className="text-2xl font-bold text-primary mt-1">Aug 18, 2025</p>
        <p className="text-sm text-mutedForeground">Automated by KeepFlow AI</p>
      </div>
    </section>
  );
}