// /app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}