'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiBarChart2,
  FiUsers,
  FiClipboard,
  FiDollarSign,
  FiActivity,
  FiFileText,
} from 'react-icons/fi';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <FiBarChart2 size={22} /> },
  { name: 'Clients', href: '/clients', icon: <FiUsers size={22} /> },
  { name: 'Reports', href: '/reports', icon: <FiClipboard size={22} /> },
  { name: 'Calculator', href: '/calculator', icon: <FiDollarSign size={22} /> },
  { name: 'Funnel', href: '/funnel', icon: <FiActivity size={22} /> },
  { name: 'Notes', href: '/notes', icon: <FiFileText size={22} /> },
];

type Props = {
  activePath?: string;
};

export default function Sidebar({ activePath }: Props) {
  const pathname = activePath || usePathname();

  return (
    <aside className="w-80 bg-card text-cardForeground px-8 py-10 flex flex-col justify-between border-r border-border shadow-xl">
      {/* 🔷 Logo Block */}
      <div className="mb-12">
        <div className="w-full h-16">
          <img
            src="/keepflow-Dashboard.png"
            alt="KeepFlow Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* 🧭 Navigation Links */}
      <nav className="space-y-6 text-[17px] font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-primaryForeground shadow-md'
                    : 'hover:bg-mutedForeground/10'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* 🟣 Upgrade CTA */}
      <div className="mt-16">
        <Link href="/upgrade">
          <button className="w-full px-5 py-3 text-[16px] font-semibold bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-lg hover:brightness-110 hover:shadow-xl transition">
            Upgrade to Pro 🔐
          </button>
        </Link>
      </div>
    </aside>
  );
}
