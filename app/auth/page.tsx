'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    else router.replace('/dashboard');
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback', // Matches Google console + Supabase settings
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0e17] to-[#141824] text-white font-sans px-4">
      <div className="w-full max-w-md bg-[#11131b] border border-white/10 rounded-xl p-6 shadow-glass backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-center mb-6">
          Sign in to <span className="text-gradient">KeepFlow</span>
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white placeholder:text-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white placeholder:text-gray-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleEmailAuth}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded hover:opacity-90 transition font-bold"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 bg-white text-black rounded hover:bg-gray-100 transition font-semibold"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-400">
          {isSignUp ? 'Already have an account?' : 'New to KeepFlow?'}{' '}
          <span
            className="text-white underline cursor-pointer"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}