// app/login/page.tsx
"use client"; // This component is a Client Component

import React, { useState, useCallback, useMemo } from 'react';
import { Mail, Lock, Music, Eye, EyeOff, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

/**
 * Memoized InputField component for performance.
 * Reused from your RegisterPage.
 * @param {object} props - Component props (type, placeholder, value, onChange, error, icon, etc.)
 */
const InputField = React.memo(({ type = 'text', placeholder, value, onChange, error, icon, ...props }) => (
  <div className="relative">
    {/* Render the icon if provided */}
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
      } ${icon ? 'pl-10' : ''}`} {/* Corrected: Removed extra ' `' from template literal closing */}
      {...props}
    />
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Handles changes to input fields, updating formData and clearing relevant validation errors.
   * @param {string} field - The name of the form field.
   * @param {string} value - The new value of the field.
   */
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for the specific field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [validationErrors]);

  /**
   * Validates all fields for the login form.
   * @returns {{isValid: boolean, errors: object}} An object indicating validity and any errors.
   */
  const validateForm = useCallback(() => {
    let isValid = true;
    const errors = {};

    if (!formData.emailOrUsername || formData.emailOrUsername.trim() === '') {
      errors.emailOrUsername = 'Email or Username is required';
      isValid = false;
    }

    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [formData]);

  /**
   * Handles the form submission for login.
   */
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Send data as JSON for login, which is typical and easier to parse on server
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: formData.emailOrUsername,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        toast.success(`Welcome back, ${data.member_data.FirstName || data.uname}!`);
        console.log('Login successful:', data);
        // Here you would typically store the passkey/token (e.g., in localStorage or a cookie)
        // and redirect the user to a dashboard or home page.
        // Example: router.push('/dashboard');
      } else {
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        toast.error(`❌ Login Error: ${errorMessage}`);
        console.error('Login error:', data);
      }

    } catch (error) {
      console.error('Network error during login:', error);
      toast.error('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Left Side - Branding (Reused from RegisterPage) */}
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
              Log in to your gateway to musical stardom. Connect, collaborate, and create with artists worldwide.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Seamless Access</h3>
                <p className="text-gray-400">Quickly get back to your music and connections</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Private</h3>
                <p className="text-gray-400">Your account is protected with advanced security</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Personalized Experience</h3>
                <p className="text-gray-400">Continue your journey where you left off</p>
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              🎵 Welcome Back!
            </h2>
            <p className="text-gray-400 text-lg">Sign in to continue your musical journey.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <InputField
                placeholder="Email Address or Username"
                value={formData.emailOrUsername}
                onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                error={validationErrors.emailOrUsername}
                // Pass the Mail icon component as a prop
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            </div>
            <div className="relative">
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={validationErrors.password}
                // Pass the Lock icon component as a prop
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
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
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg">
              Don't have an account?{' '}
              <a href="/up" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Toaster component to render toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            padding: '16px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#FCD34D',
              secondary: '#111827',
            },
            style: {
              background: '#22C55E',
              color: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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

export default LoginPage;
