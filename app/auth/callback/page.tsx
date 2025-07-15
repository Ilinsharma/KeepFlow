'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>Completing sign-in with Google...</p>
    </div>
  );
}