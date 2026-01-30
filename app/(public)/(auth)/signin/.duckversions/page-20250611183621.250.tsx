"use client"; // This component is a Client Component

import React, { useState, useCallback, useMemo } from 'react';
import { Mail, Lock, Music, Eye, EyeOff, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useShowMessage } from '@/app/context/ShowMessageContext';

/**
 * @typedef {Object} InputFieldProps
 * @property {string} [type='text'] - The type of the input field (e.g., 'text', 'password', 'email').
 * @property {string} placeholder - The placeholder text for the input.
 * @property {string} value - The current value of the input.
 * @property {(e: React.ChangeEvent<HTMLInputElement>) => void} onChange - Callback function for input value changes.
 * @property {string | undefined} [error] - Error message to display below the input if validation fails.
 * @property {React.ReactNode} [icon] - An optional icon component to display inside the input.
 */

// Define an interface for InputFieldProps to provide strong TypeScript typing.
// Extending React.InputHTMLAttributes<HTMLInputElement> allows the component to accept
// all standard HTML input attributes (like 'id', 'name', 'readOnly', etc.)
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 'type' is already included in React.InputHTMLAttributes, but we keep it here
  // to explicitly show it's expected and can have a default value in destructuring.
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Memoized InputField component for performance and reusability.
 * It provides a consistent look and handles icon placement and error display.
 * Props are explicitly typed with InputFieldProps.
 * @param {InputFieldProps} props - Component props
 */
const InputField = React.memo(({ type = 'text', placeholder, value, onChange, error, icon, ...props }: InputFieldProps) => (
  <div className="relative">
    {/* Render the icon if provided, positioned absolutely */}
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
      // Apply conditional styling based on error presence and icon presence
      className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-yellow-500'
      } rounded-xl focus:ring-2 focus:ring-yellow-500/20 transition-all text-white placeholder-gray-400 ${
        error ? 'shake' : ''
      } ${icon ? 'pl-10' : ''}`} // Add left padding if an icon is present
      {...props} // Spread any additional input props
    />
    {/* Display error message if present */}
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));





/**
 * The main LoginPage component.
 * Handles user login, form validation, and displays a visually appealing UI.
 */
const LoginPage = () => {

    const { showMessage } = useShowMessage();

  // State for form data (email/username and password)
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  // State for managing loading spinner during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for storing validation errors for each form field
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  // New state for the "Remember Me" checkbox
  const [rememberMe, setRememberMe] = useState(false);

  /**
   * Handles changes to input fields, updating formData and clearing relevant validation errors.
   * Uses useCallback for memoization to prevent unnecessary re-renders.
   * @param {string} field - The name of the form field (e.g., 'emailOrUsername', 'password').
   * @param {string} value - The new value of the field.
   */
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for the specific field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [validationErrors]); // Dependency on validationErrors to ensure correct state updates

  /**
   * Validates all fields for the login form.
   * Uses useCallback for memoization.
   * @returns {boolean} An object indicating validity and any errors found.
   */
  const validateForm = useCallback(() => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    // Validate email or username field
    if (!formData.emailOrUsername || formData.emailOrUsername.trim() === '') {
      errors.emailOrUsername = 'Email or Username is required';
      isValid = false;
    }

    // Validate password field
    if (!formData.password || formData.password.trim() === '') {
      errors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(errors); // Update validation errors state
    return isValid;
  }, [formData]); // Dependency on formData to ensure validation runs on latest data

  /**
   * Handles the form submission for login.
   * Uses useCallback for memoization.
   * @param {React.FormEvent} event - The form submission event.
   */










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





  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default browser form submission behavior

    // Perform client-side validation
    if (!validateForm()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true); // Set loading state to true to show spinner

    try {
      // Simulate an API call to a login endpoint
      // In a real application, you would replace '/api/login' with your actual backend URL.
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: formData.emailOrUsername,
          password: formData.password,
          rememberMe: rememberMe, // Include the rememberMe state in the payload
        }),
      });

      const data = await response.json(); // Parse the JSON response from the server

      // Check if the response was successful based on HTTP status and custom 'status' field
      if (response.ok && data.status === 'success') {
        toast.success(`Welcome back, ${data.member_data?.FirstName || data.uname || 'user'}!`);
        console.log('Login successful:', data);
        // Here, you would typically:
        // 1. Store the authentication token (e.g., JWT) received from the server
        //    in localStorage, sessionStorage, or a secure cookie.
        // 2. Redirect the user to a protected route (e.g., '/dashboard').
        //    Example if using Next.js router: router.push('/dashboard');
      } else {
        // Handle login failure, display server-provided error message or a generic one
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        toast.error(`❌ Login Error: ${errorMessage}`);
        console.error('Login error:', data);
      }

    } catch (error) {
      // Catch network errors or issues with the fetch request
      console.error('Network error during login:', error);
      toast.error('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false); // Always reset loading state after the request
    }
  }, [formData, rememberMe, validateForm]); // Dependencies for useCallback

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden font-inter">
      {/* Animated Background Elements for visual appeal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse-slow delay-500"></div>
      </div>

      {/* Left Side - Branding and Promotional Content (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Semi-transparent gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-purple-600/20"></div>
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        {/* Content of the left branding section */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3 text-3xl font-bold">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-7 h-7 text-black" />
              </div>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Singnify
              </span>
            </div>
            {/* Tagline */}
            <p className="mt-6 text-xl text-gray-300 leading-relaxed">
              Log in to your gateway to musical stardom. Connect, collaborate, and create with artists worldwide.
            </p>
          </div>

          {/* Feature highlights */}
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

          {/* Footer links */}
          <div className="text-sm text-gray-400 space-x-6">
            <a href="#" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-yellow-400 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              🎵 Welcome Back!
            </h2>
            <p className="text-gray-400 text-lg">Sign in to continue your musical journey.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Username Input */}
            <div>
              <InputField
                placeholder="Email Address or Username"
                value={formData.emailOrUsername}
                onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                error={validationErrors.emailOrUsername}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* Password Input with Toggle Button */}
            <div className="relative">
              <InputField
                type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={validationErrors.password}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
              />
              <button
                type="button" // Important: type="button" to prevent form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility label
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* "Remember Me" checkbox and "Forgot Password" link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-600 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline text-sm">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                isLoading
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm' // Loading state styles
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25' // Default state styles
              }`}
            >
              {isLoading ? (
                <>
                  {/* Spinner for loading state */}
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

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

      {/* Toaster component to render toast notifications */}
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
              background: '#22C55E', // Green for success
              color: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // Red for error
              secondary: '#fff',
            },
            style: {
              background: '#EF4444', // Red for error
              color: '#fff',
            },
          },
        }}
      />

      {/* Tailwind CSS and Custom CSS Animations */}
      <style jsx>{`
        /* Import Inter font from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Keyframe animation for subtle pulsing background elements */
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.05; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }

        /* Keyframe animation for fading in the form card */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Keyframe animation for shake effect on validation error */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        /* Apply animations to elements using Tailwind's arbitrary values */
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

export default LoginPage;
