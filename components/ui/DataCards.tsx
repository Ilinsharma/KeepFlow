'use client';

export default function DataCards() {
  const metrics = [
    { title: 'Total Clients', value: '42', delta: '+5 this week', trend: 'up' },
    { title: 'Monthly Revenue', value: '$12,400', delta: '+3.2%', trend: 'up' },
    { title: 'Monthly Ad Spend', value: '$6,300', delta: '-1.1%', trend: 'down' },
   
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div key={metric.title} className="bg-card rounded-xl p-5 shadow-lg border border-border">
          <h3 className="text-sm text-mutedForeground font-medium">{metric.title}</h3>
          <p className="text-2xl font-bold text-cardForeground mt-2">{metric.value}</p>
          <p
            className={`text-sm mt-1 font-medium ${
              metric.trend === 'up'
                ? 'text-green-500'
                : metric.trend === 'down'
                ? 'text-red-500'
                : 'text-mutedForeground'
            }`}
          >
            {metric.delta}
          </p>
        </div>
      ))}
    </section>
  );
}