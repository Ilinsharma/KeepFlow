'use client';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={clsx(
        'flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium',
        isActive
          ? 'bg-ring text-white shadow-md'
          : 'text-mutedForeground hover:bg-ring/20 hover:text-ring'
      )}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}