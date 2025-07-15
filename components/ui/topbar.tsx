'use client';

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div>
        <h2 className="text-lg font-semibold text-cardForeground">Welcome back, Ilin</h2>
        <p className="text-sm text-mutedForeground">Here’s what’s happening with your account today.</p>
      </div>
      <img
        src="https://api.dicebear.com/7.x/thumbs/svg?seed=ilin"
        alt="Avatar"
        className="w-12 h-12 rounded-full shadow-md"
      />
    </header>
  );
}
