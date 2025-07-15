'use client';
import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/SideBar';
import { Topbar } from '@/components/ui/Topbar';
import { useEffect, useRef } from 'react';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <html lang="en">
      <body className="bg-gradient-to-tr from-[#0b0e17] to-[#141824] text-white font-sans">
        {/* Slide-in Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 bg-[#11131b] border-r border-white/10`}
        >
          <Sidebar />
        </div>

        <div className="relative ml-0 transition-all">
          <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Dashboard Content */}
          <main className="p-6 mt-4">
            <h1 className="text-3xl font-bold mb-6"> KeepFlow Calculator </h1>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}