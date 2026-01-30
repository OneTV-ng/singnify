// app/auth/signin/page.tsx
'use client';

import { useState,useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Checkbox }from "@/components/ui/checkbox";
import Link from 'next/link';


//import {

//
// 
//import { Github, Twitter, Facebook,Spotify, Google } from 'lucide-react';
var email:string="" ;
var password:string="";
export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });   
  
useEffect(() => {

   email  = formData.email;
 password = formData.password;

}, [formData])

 // Load saved credentials on mount
 useEffect(() => {
  if (typeof window !== "undefined") { // Ensure code runs only in the client
    const savedId = localStorage.getItem('saved_username');
    const savedPassword = localStorage.getItem('saved_password');
    const savedRememberMe = localStorage.getItem('remember_me') === 'true';

    if (savedId && savedPassword && savedRememberMe) {
      setSavedCredentials({
        email: savedId,
        password: savedPassword
      });
      setRememberMe(true);
    }
  }
}, []);


  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState({
    email: '',
    password: ''
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };


  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

   
    // Validate input format
    const isEmail = email.includes('@');
    const isUsername = !isEmail && email.length >= 3;
    
    if (!isEmail && !isUsername) {
      return;
    }

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

   
    // Save credentials if remember me is checked
    if (rememberMe) {
      if (typeof window !== "undefined") { 
      localStorage.setItem('saved_username', email);
      localStorage.setItem('saved_password', password);
      localStorage.setItem('remember_me', 'true');
      }
    } else {
      // Clear saved credentials if remember me is unchecked
      if (typeof window !== "undefined") { 
      localStorage.removeItem('saved_username');
      localStorage.removeItem('saved_password');
      localStorage.removeItem('remember_me');
      }
    }
 
   // await login(email, password);




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
              type="text"
              required
              placeholder="Enter email or username"
              
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
            />     <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          </div>
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="data-[state=checked]:bg-primary"
            />
            <label 
              htmlFor="remember" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
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
            < img  src="/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />  
            Google
          </button>

          <button
            onClick={() => handleOAuthSignIn('facebook')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
           < img  src="/images/facebook.svg" alt="facebook" className="w-5 h-5 mr-2" /> 
            Facebook
          </button>

          <button
            onClick={() => handleOAuthSignIn('twitter')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >
           < img  src="/images/twitter.svg" alt="twitter" className="w-5 h-5 mr-2" /> 
            Twitter
          </button>

          <button
            onClick={() => handleOAuthSignIn('spotify')}
            className="flex items-center justify-center px-4 py-2 border border-secondary rounded-md hover:bg-secondary/10"
          >   
            <img src="/images/spotify.svg" alt="Spotify" className="w-5 h-5 mr-2" />
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