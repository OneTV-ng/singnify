// src/app/(auth)/forgot-password/page.tsx
'use client';
import { useState } from 'react';
import { AuthContainer } from '@/app/components/ui/auth/AuthContainer';
import { AuthInput } from '@/app/components/ui/auth/AuthInput';
import { Button } from '@/components/ui/button';
import { AUTH_CONSTANTS } from '@/app/constants/auth';

import Link from 'next/link';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateIdentifier = (value: string) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = value.length >= 3 && !value.includes('@');
    return isEmail || isUsername;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email or username');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('id', identifier);
        formData.append('API_KEY', AUTH_CONSTANTS.API_KEY);
    

    try {
      const res = await fetch('https://singnify.com/api/v2/php/forgot-password.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.status === '200') {
        setStep(2);
        setSuccessMessage(`A verification code has been sent to your ${identifier.includes('@') ? 'email' : 'registered email address'}`);
      } else {
        setError('We could not find an account with that information. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (otp.length < 6) {
      setError('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('id', identifier);
    formData.append('otp', otp);

    try {
      const res = await fetch('https://singnify.com/api/v2/php/verify-otp-forgot-password.php', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.status === '200') {
        setSuccessMessage('Verification successful! You can now reset your password.');
        // Here you would typically redirect to a password reset page
        // or show the password reset form
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer title="Reset Password">
      {error && (
        <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 text-sm text-green-500 bg-green-500/10 rounded-md">
          {successMessage}
        </div>
      )}
      
      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your email address or username and we'll send you a code to reset your password.
          </p>
          <AuthInput
            label="Email or Username"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError('');
            }}
            placeholder="Enter your email or username"
            autoComplete="username"
            autoFocus
            required
            error={error ? ' ' : undefined}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Code'
            )}
          </Button>
          <div className="text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please enter the verification code we sent you.
          </p>
          <AuthInput
            label="Verification Code"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/[^0-9]/g, ''));
              setError('');
            }}
            placeholder="Enter verification code"
            maxLength={6}
            autoFocus
            required
            error={error ? ' ' : undefined}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </Button>
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleRequestOTP}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Resend Code
            </button>
            <div>
              <Link href="/login" className="text-sm text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      )}
    </AuthContainer>
  );
}