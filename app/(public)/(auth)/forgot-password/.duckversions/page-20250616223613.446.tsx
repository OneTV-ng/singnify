'use client';

import React, { useState, useCallback } from 'react';
import { Mail, Lock, Music, ArrowLeft, Shield, Clock, CheckCircle } from 'lucide-react';

/**
 * InputField component matching the login page style
 */
const InputField = React.memo(({ type = 'text', placeholder, value, onChange, error, icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {icon}
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-yellow-500'
      } rounded-xl focus:ring-2 focus:ring-yellow-500/20 transition-all text-white placeholder-gray-400 ${
        error ? 'shake' : ''
      } ${icon ? 'pl-10' : ''}`}
      {...props}
    />
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateIdentifier = useCallback((value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = value.length >= 3 && !value.includes('@');
    return isEmail || isUsername;
  }, []);

  const handleRequestOTP = useCallback(async () => {
    setError('');
    setSuccessMessage('');
    
    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email or username');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    try {
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      setStep(2);
      setSuccessMessage(`A verification code has been sent to your ${identifier.includes('@') ? 'email' : 'registered email address'}`);
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [identifier, validateIdentifier]);

  const handleVerifyOTP = useCallback(async () => {
    setError('');
    setSuccessMessage('');
    
    if (otp.length < 6) {
      setError('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful verification
      setSuccessMessage('Verification successful! You can now reset your password.');
      
      // In a real app, you would redirect after success
      setTimeout(() => {
        alert('Redirecting to password reset page...');
      }, 2000);
    } catch (error) {
      console.error(error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [otp]);

  const handleBackToLogin = () => {
    alert('Redirecting to login page...');
  };

  const handleResendCode = () => {
    setOtp('');
    setError('');
    handleRequestOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden font-inter">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse-slow delay-500"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="flex items-center space-x-3 text-3xl font-bold">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-7 h-7 text-black" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Singnify
              </span>
            </div>
            <p className="mt-6 text-xl text-gray-300 leading-relaxed">
              {step === 1 
                ? "Don't worry, we'll help you get back to your musical journey. Reset your password securely."
                : "We've sent you a verification code. Check your email and enter it below to continue."
              }
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Reset</h3>
                <p className="text-gray-400">Your account security is our top priority</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quick Process</h3>
                <p className="text-gray-400">Get back to your music in just a few steps</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email Verification</h3>
                <p className="text-gray-400">We'll send a code to your registered email</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400 space-x-6">
            <a href="#" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
          
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
          </button>

          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {step === 1 ? '🔐 Reset Password' : '📧 Enter Verification Code'}
            </h2>
            <p className="text-gray-400 text-lg">
              {step === 1 
                ? "Enter your email or username to receive a reset code"
                : "We've sent a 6-digit code to your email"
              }
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Request OTP */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <InputField
                  placeholder="Email Address or Username"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  error={error && !validateIdentifier(identifier) ? 'Invalid email or username' : ''}
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                  autoFocus
                  required
                />
              </div>

              <button
                onClick={handleRequestOTP}
                disabled={isLoading || !identifier.trim()}
                className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                  isLoading || !identifier.trim()
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Reset Code</span>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <InputField
                  placeholder="Enter 6-digit verification code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                    setError('');
                  }}
                  error={error && otp.length < 6 ? 'Please enter a valid 6-digit code' : ''}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length < 6}
                className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                  isLoading || otp.length < 6
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>

              {/* Resend Code Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline text-sm"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          )}

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg">
              Remember your password?{' '}
              <button
                onClick={handleBackToLogin}
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;