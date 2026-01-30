'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Mail, Lock, Music, ArrowLeft, Shield, Clock, CheckCircle, Eye, EyeOff, Key } from 'lucide-react';
import {UserType, InputFieldProps} from "@/app/lib/types";

const PLATFORM_API_KEY = '7c6a180b36896a0a8c02787eeafb0e4c';





const InputField = React.memo(({ type = 'text', placeholder, value, onChange, error, icon, showPasswordToggle, onTogglePassword, ...props }: InputFieldProps) => (
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
      } ${icon ? 'pl-10' : ''} ${showPasswordToggle ? 'pr-10' : ''}`}
      {...props}
    />
    {showPasswordToggle && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
      >
        {type === 'password' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    )}
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));

// OTP Input Component
const OtpInput = ({ length = 6, onComplete, error }: { length?: number; onComplete: (otp: string) => void; error?: string }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    
    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.currentTarget.previousSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? '' : d))]);
      }
    }
  };
  
  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      onComplete(otp.join(''));
    }
  }, [otp, onComplete]);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-center space-x-3">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className={`w-12 h-12 text-center text-xl font-bold bg-gray-800/50 backdrop-blur-sm border ${
              error ? 'border-red-500' : 'border-gray-700 focus:border-yellow-500'
            } rounded-xl focus:ring-2 focus:ring-yellow-500/20 text-white transition-all ${
              error ? 'shake' : ''
            }`}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={e => e.target.select()}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>
      )}
    </div>
  );
};

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email/Username, 2: OTP, 3: New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateIdentifier = useCallback((value: string) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = value.length >= 3 && !value.includes('@');
    return isEmail || isUsername;
  }, []);

  const validatePassword = useCallback((password: string) => {
    return password.length >= 8;
  }, []);

  const handleRequestReset = useCallback(async () => {
    setError('');
    setSuccessMessage('');
    
    if (!validateIdentifier(identifier)) {
      setError('Please enter a valid email or username');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('id', identifier);
      formData.append('API_KEY', PLATFORM_API_KEY);

      const response = await fetch('https://singnify.com/api/v2/php/forgot-password.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === "200" && data.message === "success") {
        setStep(2);
        setResetToken(data.member.Token);
        setUserInfo(data.member);
        setSuccessMessage(`OTP sent successfully to ${data.member.FirstName} ${data.member.LastName}'s registered contact`);
        setOtpTimer(120); // 2 minutes
        setCanResendOtp(false);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [identifier, validateIdentifier]);

  const handleVerifyOtp = useCallback(async (otpValue: string) => {
    setError('');
    setOtp(otpValue);
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the actual OTP verification API
      const formData = new FormData();
      formData.append('id', identifier); // Use the email/username from step 1
      formData.append('otp', otpValue);
      formData.append('API_KEY', PLATFORM_API_KEY);

      const response = await fetch('https://singnify.com/api/v2/php/verify-otp-forgot-password.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      console.log(data);
      
      if (data.status === "200" && data.message === "success") {
        // Update user info with the verified data
        setUserInfo(data.member);
        setResetToken(data.member.Token); // Update token if needed
        setStep(3);
        setSuccessMessage('OTP verified successfully! Now set your new password.');
      } else {
        setError(data.message || 'Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  const handleResendOtp = useCallback(async () => {
    if (!canResendOtp) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      // Resend OTP by calling the forgot-password endpoint again
      const formData = new FormData();
      formData.append('id', identifier);
      formData.append('API_KEY', PLATFORM_API_KEY);

      const response = await fetch('https://singnify.com/api/v2/php/forgot-password.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === "200" && data.message === "success") {
        setSuccessMessage('OTP resent successfully!');
        setOtpTimer(120);
        setCanResendOtp(false);
        setOtp('');

        console.log(data);
        // Clear OTP inputs
        const otpInputs = document.querySelectorAll('input[maxlength="1"]');
        otpInputs.forEach((input: any) => input.value = '');
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [canResendOtp, identifier]);

  const handleResetPassword = useCallback(async () => {
    setError('');
    setSuccessMessage('');
    
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('token', resetToken);
      formData.append('password', password);
      formData.append('API_KEY', PLATFORM_API_KEY);

      const response = await fetch('https://singnify.com/api/v2/php/reset-password.php', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === "200" && data.message === "success") {
        setSuccessMessage('Password reset successful! You can now sign in with your new password.');
        
        setTimeout(() => {
          alert('Redirecting to login page...');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [password, confirmPassword, resetToken, validatePassword]);

  const handleBackToLogin = () => {
    alert('Redirecting to login page...');
  };

  const handleBackToPrevious = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
    } else if (step === 3) {
      setStep(2);
      setPassword('');
      setConfirmPassword('');
    }
    setError('');
    setSuccessMessage('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return '🔐 Reset Password';
      case 2: return '🔢 Verify OTP';
      case 3: return '🔑 Set New Password';
      default: return '🔐 Reset Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your email or username to receive an OTP';
      case 2: return 'Enter the 6-digit OTP sent to your registered contact';
      case 3: return 'Create a new secure password for your account';
      default: return 'Enter your email or username to receive an OTP';
    }
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
                : step === 2
                ? "Check your registered contact for the OTP code. Enter it to verify your identity."
                : "Almost there! Create a new secure password for your account."
              }
            </p>
            
            {/* User Info Display */}
            {userInfo && step >= 2 && (
              <div className="mt-6 p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">
                  {step === 2 ? 'Verifying OTP for:' : 'Resetting password for:'}
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={userInfo.Picture || "https://nextxtar.com/assets/images/ProfilePicture/user.png"} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                    onError={(e: any) => {
                      e.target.src = 'https://nextxtar.com/assets/images/ProfilePicture/user.png';
                    }}
                  />
                  <div>
                    <p className="font-semibold text-white">{userInfo?.FirstName} {userInfo?.LastName}</p>
                    <p className="text-sm text-gray-400">@{userInfo?.uname}</p>
                  </div>
                </div>
              </div>
            )}
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
                <Key className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">OTP Verification</h3>
                <p className="text-gray-400">Secure OTP-based password reset</p>
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
            onClick={step === 1 ? handleBackToLogin : handleBackToPrevious}
            className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>
              {step === 1 
                ? 'Back to Login' 
                : step === 2 
                ? 'Back to Email/Username' 
                : 'Back to OTP Verification'
              }
            </span>
          </button>

          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {getStepTitle()}
            </h2>
            <p className="text-gray-400 text-lg">
              {getStepDescription()}
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

          {/* Step 1: Request Reset Token */}
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
                onClick={handleRequestReset}
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
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mb-4">
                  <Key className="w-16 h-16 text-yellow-400 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">
                    We've sent a 6-digit OTP to your registered contact.
                    {userInfo && (
                      <span className="block font-medium text-white mt-1">
                        {userInfo.FirstName} {userInfo.LastName}
                      </span>
                    )}
                  </p>
                </div>
                
                <OtpInput
                  length={6}
                  onComplete={handleVerifyOtp}
                  error={error}
                />
              </div>

              {/* OTP Timer and Resend */}
              <div className="text-center space-y-3">
                {otpTimer > 0 ? (
                  <p className="text-gray-400 text-sm">
                    Resend OTP in <span className="font-mono text-yellow-400 font-medium">{formatTime(otpTimer)}</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-yellow-400 hover:text-yellow-300 font-medium text-sm transition-colors hover:underline disabled:opacity-50"
                  >
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              {/* Manual verify button for cases where auto-verify doesn't work */}
              {otp.length === 6 && (
                <button
                  onClick={() => handleVerifyOtp(otp)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                    isLoading
                      ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying OTP...</span>
                    </>
                  ) : (
                    <span>Verify OTP</span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password (min. 8 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  error={error && !validatePassword(password) ? 'Password must be at least 8 characters' : ''}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <InputField
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  error={error && password !== confirmPassword ? 'Passwords do not match' : ''}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  required
                />
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li className={password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>
                    At least 8 characters long
                  </li>
                  <li className={password === confirmPassword && password.length > 0 ? 'text-green-400' : 'text-gray-400'}>
                    Passwords match
                  </li>
                </ul>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading || !validatePassword(password) || password !== confirmPassword}
                className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                  isLoading || !validatePassword(password) || password !== confirmPassword
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
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