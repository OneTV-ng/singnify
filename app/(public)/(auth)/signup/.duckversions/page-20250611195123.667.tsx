"use client";
//@/app/up
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronLeft, User, Mail, Lock, Globe, Phone, Music, Heart, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useShowMessage } from '@/app/context/ShowMessageContext';


/**
 * Memoized InputField component for performance.
 * Defined outside the main component to prevent re-creation on every render.
 * @param {object} props - Component props (type, placeholder, value, onChange, error, etc.)
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 'type' is already included in React.InputHTMLAttributes, but we keep it here
  // to explicitly show it's expected and can have a default value in destructuring.
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}


const InputField = React.memo(({ type = 'text', placeholder, value, onChange, error, ...props }:InputFieldProps) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-yellow-500'
      } rounded-xl focus:ring-2 focus:ring-yellow-500/20 transition-all text-white placeholder-gray-400 ${
        error ? 'shake' : ''
      }`}
      {...props}
    />
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));

/**
 * Memoized SelectField component for performance.
 * Defined outside the main component to prevent re-creation on every render.
 * @param {object} props - Component props (value, onChange, options, placeholder, error)
 */
const SelectField = React.memo(({ value, onChange, options, placeholder, error }:InputFieldProp) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-yellow-500'
      } rounded-xl focus:ring-2 focus:ring-yellow-500/20 transition-all text-white appearance-none cursor-pointer`}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value || option} value={option.value || option} className="bg-gray-800">
          {option.label || option}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-400 text-sm mt-1 animate-pulse">{error}</p>
    )}
  </div>
));


const RegisterPage = () => {
    const { showMessage } = useShowMessage();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    stageName: '',
    email: '',
    gender: '',
    phone: '',
    about: '',
    recordLabel: '',
    country: '',
    password: '',
    referralCode: '',
    isArtist: true // Default to artist for music platform
  });
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const steps = [
    { title: 'Personal Info', icon: User, fields: ['firstName', 'lastName'] },
    { title: 'Identity', icon: Music, fields: ['username', 'stageName'] },
    { title: 'Contact', icon: Mail, fields: ['email', 'phone', 'gender'] },
    { title: 'Profile', icon: Globe, fields: ['country', 'recordLabel', 'about'] },
    { title: 'Security', icon: Lock, fields: ['password', 'referralCode'] }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Nigeria', 'Brazil', 'Japan', 'India', 'South Africa', 'Mexico', 'Spain',
    'Italy', 'Netherlands'
  ];

  /**
   * Handles changes to input fields, updating formData and clearing relevant validation errors.
   * @param {string} field - The name of the form field.
   * @param {string | boolean} value - The new value of the field.
   */
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for the specific field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [validationErrors]);

  /**
   * Validates a single form field based on its type.
   * @param {string} field - The name of the field to validate.
   * @param {string} value - The value of the field.
   * @returns {string} An error message if invalid, otherwise an empty string.
   */
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address';
      case 'password':
        // Stronger password requirements could be added here (e.g., regex for mix of chars)
        return value.length >= 8 ? '' : 'Password must be at least 8 characters long';
      case 'phone':
        // Basic phone number validation, allows '+' and digits, up to 15 chars
        return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')) ? '' : 'Please enter a valid phone number';
      case 'username':
        return /^[a-zA-Z0-9_]{3,20}$/.test(value) ? '' : 'Username must be 3-20 characters (letters, numbers, underscore only)';
      default:
        return '';
    }
  }, []);

  /**
   * Validates all fields within the current step.
   * @param {number} stepIndex - The index of the current step.
   * @returns {{isValid: boolean, errors: object}} An object indicating validity and any errors.
   */
  const validateStep = useCallback((stepIndex) => {
    const stepFields = steps[stepIndex].fields;
    let isValid = true;
    const errors = {};

    stepFields.forEach(field => {
      if (field === 'about' || field === 'referralCode' || field === 'recordLabel') {
        // These fields are optional, skip validation for emptiness
        // However, if a value is provided, it can still be validated for format if needed
        return;
      }

      const value = formData[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field] = 'This field is required';
        isValid = false;
      } else {
        const fieldError = validateField(field, value);
        if (fieldError) {
          errors[field] = fieldError;
          isValid = false;
        }
      }
    });

    return { isValid, errors };
  }, [formData, validateField]);

  // Memoize current step validation to prevent unnecessary re-renders
  const currentStepValidation = useMemo(() => {
    return validateStep(currentStep);
  }, [validateStep, currentStep]);

  /**
   * Handles moving to the next step or submitting the form.
   */
  const handleNext = useCallback(() => {
    const { isValid, errors } = currentStepValidation; // Use memoized validation result

    if (isValid) {
      setValidationErrors({});
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(); // If last step, submit the form
      }
    } else {
      setValidationErrors(errors);
      toast.error('Please correct the highlighted errors before proceeding.'); // Using toast.error
    }
  }, [currentStep, currentStepValidation, steps.length]); // handleSubmit is now a direct call in the else branch.

  /**
   * Handles moving to the previous step.
   */
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * Handles the form submission by sending data to the backend API.
   */
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Prepare the data for the API using FormData
const registrationFormData = new FormData();
registrationFormData.append('first_name', formData.firstName);
registrationFormData.append('last_name', formData.lastName);
registrationFormData.append('uname', formData.username);
registrationFormData.append('stage_name', formData.stageName);
registrationFormData.append('email', formData.email);
registrationFormData.append('password', formData.password);
registrationFormData.append('phone', formData.phone);
registrationFormData.append('gender', formData.gender);
registrationFormData.append('country', formData.country);
registrationFormData.append('record_label', formData.recordLabel || ''); // Optional
registrationFormData.append('about', formData.about || ''); // Optional
registrationFormData.append('ref_code', formData.referralCode || ''); // Optional
registrationFormData.append('is_artist', formData.isArtist ? '1' : '0'); // Send '1' or '0'
registrationFormData.append('api_key', '7c6a180b36896a0a8c02787eeafb0e4c');


console.log(formData);console.log({formData});


      const response = await fetch('https://singnify.com/register-user.php', {
        method: 'POST',
        body: registrationFormData
      });

  

      const data = await response.json();
    console.log("rsponse ", response);
      console.log("Data",data);
      if (response.ok && data.status ==="200") {
        setRegistrationSuccess(true);
        setCompletedSteps(new Set(steps.map((_, i) => i))); // Mark all steps as completed

        //toast.success(`🎉 Welcome to Singnify, ${formData.firstName}! Your account has been created successfully!  and a welcome message in your email inBox`); // Using toast.success
        showMessage(`🎉 Welcome to Singnify, ${formData.firstName}! Your account has been created successfully!  and a welcome message in your email inBox`,"success"); // Using toast.success
// You might want to redirect the user or show a success screen here
        // router.push('/dashboard'); // Example redirect

        console.log('Registration successful:', data.member);

      } else {
        // Handle API error
        const errorMessage = data.message || 'Registration failed. Please try again.';
        showMessage(`❌ Registration Error: ${errorMessage}`,"error");
        toast.error(`❌ Registration Error: ${errorMessage}`); // Using toast.error
        console.error('Registration error:', data);
      }

    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Network error:', error);
      toast.error('❌ Network error. Please check your connection and try again.'); // Using toast.error
    } finally {
      setIsLoading(false);
    }
  };


  /**
   * Provides personalized messages based on the current step and user's first name.
   */
  const getPersonalizedMessage = useMemo(() => {
    if (!formData.firstName) return "Let's get started on your musical journey!";

    switch (currentStep) {
      case 0:
        return `Nice to meet you, ${formData.firstName}! Let's create your profile`;
      case 1:
        return `${formData.firstName}, let's set up your unique artist identity`;
      case 2:
        return `How can we reach you, ${formData.firstName}?`;
      case 3:
        return `Tell us more about your musical journey, ${formData.firstName}`;
      case 4:
        return `Almost there, ${formData.firstName}! Let's secure your account`;
      default:
        return `Welcome to Singnify, ${formData.firstName}!`;
    }
  }, [formData.firstName, currentStep]);


  /**
   * Renders the content for the current step of the registration form.
   * @returns {JSX.Element | null} The JSX for the current step's content.
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={validationErrors.firstName}
              />
              <InputField
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={validationErrors.lastName}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                error={validationErrors.username}
              />
              <InputField
                placeholder="Stage Name or Alias (Optional)" // Added optional hint
                value={formData.stageName}
                onChange={(e) => handleInputChange('stageName', e.target.value)}
                error={validationErrors.stageName} // Still show error if any
              />
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-gray-300 text-sm">
                Choose a memorable username and stage name that represents your musical style. This is how other artists will find you!
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <InputField
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={validationErrors.email}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                placeholder="Select Gender"
                error={validationErrors.gender}
                options={[
                  'Male',
                  'Female',
                  'Non-binary',
                  'Other',
                  'Prefer not to say'
                ]}
              />
              <InputField
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={validationErrors.phone}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Select Country"
                error={validationErrors.country}
                options={countries}
              />
              <InputField
                placeholder="Record Label (Optional)"
                value={formData.recordLabel}
                onChange={(e) => handleInputChange('recordLabel', e.target.value)}
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Tell us about your musical journey... (Optional)"
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all text-white placeholder-gray-400 resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {formData.about.length}/500
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="relative">
              <InputField
                type={showPassword ? 'text' : 'password'}
                placeholder="Create Password (min. 8 characters)"
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={validationErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'} // Accessibility
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <InputField
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={(e) => handleInputChange('referralCode', e.target.value)}
            />
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-blue-400 mb-2">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Security & Account Type</span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Your password is encrypted and secure. We'll never share your personal information.
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isArtist"
                  checked={formData.isArtist}
                  onChange={(e) => handleInputChange('isArtist', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <label htmlFor="isArtist" className="text-sm text-gray-300">
                  Register as an Artist (recommended for musicians and creators)
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse delay-500"></div>
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
              Your gateway to musical stardom. Connect, collaborate, and create with artists worldwide.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Discover New Talent</h3>
                <p className="text-gray-400">Connect with emerging artists and music producers</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Share Your Music</h3>
                <p className="text-gray-400">Upload tracks and build your fanbase</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 group">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Global Community</h3>
                <p className="text-gray-400">Join artists from around the world</p>
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

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(index);
                const isCurrent = currentStep === index;

                return (
                  <div key={index} className="flex flex-col items-center relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-110' :
                      isCurrent ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg scale-110' :
                      'bg-gray-700/50 text-gray-400 backdrop-blur-sm'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`text-xs mt-3 transition-colors font-medium ${
                      isCurrent ? 'text-yellow-400' : isCompleted ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-6 left-12 w-full h-0.5 ${
                        isCompleted ? 'bg-green-400' : 'bg-gray-700'
                      } transition-colors duration-300`} style={{ width: 'calc(100% + 1rem)' }}></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-gray-700/50 rounded-full h-3 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              {currentStep === 0 ? '🎵 Welcome!' : steps[currentStep].title}
            </h2>
            <p className="text-gray-400 text-lg">{getPersonalizedMessage}</p>
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl transition-all font-medium ${
                currentStep === 0
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed backdrop-blur-sm'
                  : 'bg-gray-700/50 text-white hover:bg-gray-600/50 backdrop-blur-sm shadow-lg hover:scale-105'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!currentStepValidation.isValid || isLoading}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl transition-all font-bold shadow-lg ${
                currentStepValidation.isValid && !isLoading
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 hover:scale-105 shadow-yellow-500/25'
                  : 'bg-gray-700/50 text-gray-400 cursor-not-allowed backdrop-blur-sm'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? '🎉 Complete Registration' : 'Next'}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-lg">
              Already have an account?{' '}
              <a href="#" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors hover:underline">
                Sign In Here
              </a>
            </p>
          </div>

          {/* Terms */}
          {currentStep === steps.length - 1 && (
            <div className="mt-8 text-center text-sm text-gray-500 bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm">
              By completing registration, you agree to our{' '}
              <a href="#" className="text-yellow-400 hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-yellow-400 hover:underline font-medium">Privacy Policy</a>
            </div>
          )}
        </div>
      </div>

      {/* Toaster component to render toasts */}
      <Toaster
        position="top-right" // You can change this to "bottom-right", "top-center", etc.
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
              primary: '#FCD34D', // yellow-400
              secondary: '#111827', // gray-900
            },
            style: {
              background: '#22C55E', // green-500
              color: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444', // red-500
              secondary: '#fff',
            },
            style: {
              background: '#EF4444', // red-500
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

export default RegisterPage;