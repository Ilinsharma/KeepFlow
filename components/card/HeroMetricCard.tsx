// Reusable stat card
type Props = {
  label: string;
  value: string;
};

export const HeroMetricCard = ({ label, value }: Props) => {
  return (
    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-5 flex flex-col justify-between shadow-md">
      <p className="text-sm opacity-70">{label}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
};