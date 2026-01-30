// app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Github, Twitter, Facebook } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/discover');
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/discover' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleCredentialsSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-background border border-secondary rounded-md"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-background border border-secondary rounded-md"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-surface text-secondary">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('facebook')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
            <Facebook className="w-5 h-5 mr-2" />
            Facebook
          </button>

          <button
            onClick={() => handleOAuthSignIn('twitter')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
            <Twitter className="w-5 h-5 mr-2" />
            Twitter
          </button>

          <button
            onClick={() => handleOAuthSignIn('spotify')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
            <img src="/spotify.svg" alt="Spotify" className="w-5 h-5 mr-2" />
            Spotify
          </button>
        </div>

        <p className="text-center text-sm text-secondary">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}