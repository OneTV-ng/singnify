"use client";
import React, { useState, useEffect } from 'react';
import { Music, Upload, User, Mail, Phone, MapPin, Globe, CreditCard, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Track, UserType } from "@/app/lib/types";
import { useRouter } from 'next/navigation';
import { useShowMessage } from '@/app/context/ShowMessageContext';
import { useSession } from "next-auth/react";
import ImageUploadComponent from "@/app/components/singnify/ImageUploadComponent"
import Image from "next/image";
import AccountDetailsComponent from "@/app/components/AccountDetailsComponent"
import SocialMediaAccountsComponent from "@/app/components/SocialMediaAccountsComponent"

const PLATFORM_API_KEY  = process.env.PLATFORM_API_KEY;

console.log("api-key=", PLATFORM_API_KEY);

// Extended UserType to match the provided data structure
interface ExtendedUserType extends UserType {
  ID?: string;
  Username?: string;
  EmailAddress?: string;
  FirstName?: string;
  LastName?: string;
  Picture?: string;
  Gender?: string;
  Phone?: string;
  Country?: string;
  Facebook?: string;
  Twitter?: string;
  Instagram?: string;
  YouTube?: string;
  StageName?: string;
  About?: string;
  Signature?: string;
  Contract?: string;
  RecordLabel?: string;
  IsVerified?: string;
  IsArtist?: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  text?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  value?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  accept?: string;
  onFileSelect?: any;
  uploadProgress?: number;
  uploadedFile?: File | null;
  onChange?: any;
  options?: { value: string; label: string }[] | string[];
  error?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  minWords?: number;
  maxWords?: number;
}

// Utility function to count words
const countWords = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Input Field Component with validation
const InputField = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  className = ''
}: SelectFieldProps) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all backdrop-blur-sm ${
        error
          ? 'border-red-500 focus:border-red-400 shake'
          : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

// Enhanced Textarea Field Component with word count
const TextareaField = ({
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  minLength = 0,
  maxLength = 1000,
  minWords = 0,
  maxWords = 0,
  required = false,
  disabled = false
}: SelectFieldProps) => {
  const wordCount = countWords(value || '');
  const charCount = value?.length || 0;
  
  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`w-full p-4 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all backdrop-blur-sm resize-none ${
          error
            ? 'border-red-500 focus:border-red-400 shake'
            : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      />
      <div className="flex justify-between items-center mt-1">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="text-xs text-gray-400 ml-auto flex flex-col items-end">
          <div>
            {charCount}/{maxLength} characters
          </div>
          {minWords > 0 && (
            <div className={wordCount < minWords ? 'text-yellow-400' : 'text-green-400'}>
              {wordCount} words {wordCount < minWords && `(min ${minWords})`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Select Field Component
const SelectField = ({
  options,
  value,
  onChange,
  error,
  placeholder = "Select...",
  icon,
  required = false,
  disabled = false
}: SelectFieldProps) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white focus:outline-none transition-all backdrop-blur-sm appearance-none ${
        error
          ? 'border-red-500 focus:border-red-400 shake'
          : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options && options.map((option, index) => (
        <option key={typeof option === 'string' ? option : option.value || index}
                value={typeof option === 'string' ? option : option.value}
                className="bg-gray-800 text-white">
          {typeof option === 'string' ? option : option.label}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

// Progress Step Indicator
const ProgressSteps = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center space-x-4 mb-8 flex-wrap">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center my-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          index < currentStep
            ? 'bg-green-500 text-white'
            : index === currentStep
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-600 text-gray-400'
        }`}>
          {index < currentStep ? '✓' : index + 1}
        </div>
        <span className={`ml-2 text-sm ${
          index === currentStep ? 'text-yellow-400 font-medium' : 'text-gray-400'
        }`}>
          {step}
        </span>
        {index < steps.length - 1 && (
          <div className={`w-12 h-px mx-4 ${
            index < currentStep ? 'bg-green-500' : 'bg-gray-600'
          }`} />
        )}
      </div>
    ))}
  </div>
);

// Countries data
const countries = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

// Utility function to capitalize first letter of each word
const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Utility function to format full name
const formatFullName = (firstName: string, lastName: string): string => {
  const formattedFirstName = capitalizeWords(firstName || '');
  const formattedLastName = capitalizeWords(lastName || '');
  return `${formattedFirstName} ${formattedLastName}`.trim();
};

// Main Verification Form Component
function VerificationForm() { 
  const { data: session, status } =  useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const steps = ['Personal Info', 'Artist Details', 'Documents', 'Review'];

  const [user, setUser] = useState<ExtendedUserType | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    artistName: '',
    email: 'manny@1tv.ng',
    picture:"",
    avata:"",
    phone: '',
    gender: '',
    country: '',
    homeAddress: '',
    whatsappNumber: '',
    nationalityCountryCode: '',

    // Financial Information (as strings for now)
    bankDetails: '',
    paypalEmail: '',

    // Social Media
    socialMediaAccounts: '',

    // Artist Information
    aboutYourself: '',
    musicalStyleGenre: '',
    latestSongOrProject: '',
    latestSongInspiration: '',
    keyCollaborators: '',
    mediaCoverage: '',
    targetAudienceEngagement: '',
    musicPlatforms: '',
    industryContact: '',
    bio: '',

    // Document URLs (replaces file uploads)
    governmentIdUrl: '',
    signatureImageUrl: '',
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Function to collect social media URLs
  const collectSocialMediaUrls = (userData: ExtendedUserType): string => {
    const socialUrls: string[] = [];
    
    if (userData.Facebook) socialUrls.push(userData.Facebook);
    if (userData.Twitter) socialUrls.push(userData.Twitter);
    if (userData.Instagram) socialUrls.push(userData.Instagram);
    if (userData.YouTube) socialUrls.push(userData.YouTube);
    
    return socialUrls.join(', ');
  };

  // Function to pre-fill form data with user information
  const prefillFormData = (userData: ExtendedUserType) => {
    const fullName = formatFullName(userData.FirstName || '', userData.LastName || '');
    const socialMediaUrls = collectSocialMediaUrls(userData);
    
    setFormData(prev => ({
      ...prev,
      name: fullName,
      artistName: capitalizeWords(userData.StageName || userData.Username || ''),
      email: userData.EmailAddress || '',
      phone: userData.Phone || '',
      gender: userData.Gender || '',
      picture: userData.Picture || '',
      country: userData.Country || '',
      homeAddress: '', // Not available in user data
      whatsappNumber: userData.Phone || '', // Assuming same as phone
      nationalityCountryCode: userData.Country || '',
      
      // Social Media
      socialMediaAccounts: socialMediaUrls,
      
      // Artist Information
      aboutYourself: userData.About || '',
      bio: userData.About || '',
      
      // Document URLs
      signatureImageUrl: userData.Signature || '',
      governmentIdUrl: userData.Contract || '', // Using contract as placeholder
    }));
    
    setIsDataLoaded(true);
  };

  // Effect to load user data when session is available
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    if (status === 'authenticated' && session?.user && !isDataLoaded) {
      const userData = session.user as ExtendedUserType;
      console.log('User data received:', userData);
      
      setUser(userData);
      prefillFormData(userData);
    }
  }, [session, status, isDataLoaded]);

  // Form validation
  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // Personal Info
        if (!formData.name.trim()) errors.name = 'Full name is required';
        if (!formData.artistName.trim()) errors.artistName = 'Artist name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        
        // Phone validation
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (formData.phone.trim().length < 7) errors.phone = 'Phone number is too short.';
        const phoneRegex = /^\d+$/;
        if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
            errors.phone = 'Phone number must contain only digits.';
        } 
        
        if (!formData.gender) errors.gender = 'Gender selection is required';
        if (!formData.country) errors.country = 'Country selection is required';
        if (!formData.homeAddress.trim()) errors.homeAddress = 'Home address is required';
        break;

      case 1: // Artist Details
        // Bio validation - check word count instead of character count
        const bioWordCount = countWords(formData.bio);
        if (bioWordCount < 200) {
          errors.bio = `Bio must be at least 200 words (current: ${bioWordCount} words)`;
        }
        
        const aboutWordCount = countWords(formData.aboutYourself);
        if (aboutWordCount < 50) {
          errors.aboutYourself = `Must be at least 50 words (current: ${aboutWordCount} words)`;
        }
        
        if (!formData.musicalStyleGenre.trim()) errors.musicalStyleGenre = 'Musical style is required';
        if (!formData.socialMediaAccounts.trim()) errors.socialMediaAccounts = 'At least 3 social media URLs required';
        break;

      case 2: // Documents
        if (!formData.governmentIdUrl.trim()) errors.governmentIdUrl = 'Government ID URL is required';
        if (!formData.signatureImageUrl.trim()) errors.signatureImageUrl = 'Signature image URL is required';
        
        // URL format validation
        const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
        if (formData.governmentIdUrl.trim() && !urlRegex.test(formData.governmentIdUrl.trim())) {
            errors.governmentIdUrl = 'Invalid URL format';
        }
        if (formData.signatureImageUrl.trim() && !urlRegex.test(formData.signatureImageUrl.trim())) {
            errors.signatureImageUrl = 'Invalid URL format';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    const API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY || '7c6a180b36896a0a8c02787eeafb0e4c';
    const apiUrl = `https://singnify.com/api/v2/php/submit-verification.php?API_KEY=${API_KEY}`;

    console.log('=== BIO DEBUG INFO ===');
    console.log('Bio content:', formData.bio);
    console.log('Bio length (characters):', formData.bio?.length || 0);
    console.log('Bio word count:', countWords(formData.bio));
    console.log('About content:', formData.aboutYourself);
    console.log('About word count:', countWords(formData.aboutYourself));
    console.log('=== END BIO DEBUG ===');

    const form = new FormData();

    // Add all required fields matching the curl command exactly
    form.append('token', session?.accessToken || '');
    form.append('name', formData.name || '');
    form.append('artist_name', formData.artistName || '');
    form.append('email_address', formData.email || '');
    form.append('phone', formData.phone || '');
    form.append('homeaddress', formData.homeAddress || '');
    form.append('doc', formData.governmentIdUrl || '');
    form.append('signature', formData.signatureImageUrl || '');
    form.append('bank_details', formData.bankDetails || '');
    form.append('paypal_email', formData.paypalEmail || '');
    form.append('social_media_accounts', formData.socialMediaAccounts || '');
    form.append('bio', formData.bio || '');
    form.append('about', formData.bio || '');
    form.append('gender', formData.gender || '');
    form.append('country', formData.country || '');
    form.append('whatsapp_number', formData.whatsappNumber || '');
    form.append('nationality_country_code', formData.nationalityCountryCode || '');
    form.append('about_yourself', formData.aboutYourself || '');
    form.append('musical_style_genre', formData.musicalStyleGenre || '');
    form.append('latest_song_or_project', formData.latestSongOrProject || '');
    form.append('latest_song_inspiration', formData.latestSongInspiration || '');
    form.append('key_collaborators', formData.keyCollaborators || '');
    form.append('media_coverage', formData.mediaCoverage || '');
    form.append('target_audience_engagement', formData.targetAudienceEngagement || '');
    form.append('music_platforms', formData.musicPlatforms || '');
    form.append('industry_contact', formData.industryContact || '');

    console.log('Submitting form data:');
    for (let [key, value] of form.entries()) {
      if (key === 'bio' || key === 'about' || key === 'about_yourself') {
        const stringValue = typeof value === 'string' ? value : value instanceof File ? `[File: ${value.name}]` : String(value);
        const charCount = typeof value === 'string' ? value.length : 0;
        const wordCount = typeof value === 'string' ? countWords(value) : 0;
        console.log(`${key}: "${stringValue}" (${charCount} chars, ${wordCount} words)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: form,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        result = { 
          success: response.ok,
          message: responseText || (response.ok ? 'Success' : 'Request failed'),
          status: response.status.toString()
        };
      }

      console.log('Parsed response:', result);

      const isSuccess = response.ok && 
                       (result.success === true || 
                        result.status === "200" || 
                        (result.status !== "352" && !result.message?.toLowerCase().includes('error')));

      if (isSuccess) {
        const responseMessage = document.createElement('div');
        responseMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        responseMessage.innerHTML = `
          <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-white text-center max-w-md">
            <div class="text-green-400 text-4xl mb-4">✓</div>
            <p class="text-xl font-bold mb-2">Verification Submitted Successfully!</p>
            <p class="text-gray-300 mb-4">Your verification request has been received and is under review.</p>
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" onclick="this.parentNode.parentNode.remove()">Close</button>
          </div>
        `;
        document.body.appendChild(responseMessage);
      } else {
        const errorMessage = result.message || `Request failed with status ${result.status || response.status}`;
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      const errorMsg = error instanceof Error ? error.message : 
                       typeof error === 'string' ? error :
                       'An error occurred while submitting your verification. Please try again.';
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      errorMessage.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl text-white text-center max-w-md">
          <div class="text-red-400 text-4xl mb-4">✗</div>
          <p class="text-xl font-bold mb-2">Submission Failed</p>
          <p class="text-gray-300 mb-4">${errorMsg}</p>
          <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors" onclick="this.parentNode.parentNode.remove()">Close</button>
        </div>
      `;
      document.body.appendChild(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                error={validationErrors.name}
                icon={<User className="w-5 h-5 text-gray-400" />}
                required
              />
              <InputField
                label="Artist Name"
                placeholder="Artist Name"
                value={formData.artistName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('artistName', e.target.value)}
                error={validationErrors.artistName}
                icon={<Music className="w-5 h-5 text-gray-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                error={validationErrors.email}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                required
              />
              <InputField
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                error={validationErrors.phone}
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                options={genderOptions}
                value={formData.gender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('gender', e.target.value)}
                error={validationErrors.gender}
                placeholder="Select Gender"
                icon={<User className="w-5 h-5 text-gray-400" />}
                required
              />
              <SelectField
                options={countries}
                value={formData.country}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('country', e.target.value)}
                error={validationErrors.country}
                placeholder="Select Country"
                icon={<Globe className="w-5 h-5 text-gray-400" />}
                required
              />
            </div>

            <TextareaField
              placeholder="Home Address"
              value={formData.homeAddress}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('homeAddress', e.target.value)}
              error={validationErrors.homeAddress}
              rows={3}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                placeholder="WhatsApp Number"
                value={formData.whatsappNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('whatsappNumber', e.target.value)}
                icon={<Phone className="w-5 h-5 text-gray-400" />}
              />
              <InputField
                placeholder="Nationality and Country Phone Code"
                value={formData.nationalityCountryCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('nationalityCountryCode', e.target.value)}
                icon={<Globe className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        );

      case 1: // Artist Details
        return (
          <div className="space-y-6">
            <TextareaField
              placeholder="Tell us about yourself (minimum 50 words)"
              value={formData.aboutYourself}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('aboutYourself', e.target.value)}
              error={validationErrors.aboutYourself}
              minWords={50}
              maxLength={1000}
              required
            />

            <TextareaField
              placeholder="How would you describe your musical style and genre?"
              value={formData.musicalStyleGenre}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('musicalStyleGenre', e.target.value)}
              error={validationErrors.musicalStyleGenre}
              required
            />

            <TextareaField
              placeholder="What is the title of your latest song or project?"
              value={formData.latestSongOrProject}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('latestSongOrProject', e.target.value)}
            />

            <TextareaField
              placeholder="What inspired your latest song or project?"
              value={formData.latestSongInspiration}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('latestSongInspiration', e.target.value)}
            />

            <SocialMediaAccountsComponent 
              value={formData.socialMediaAccounts}
              onChange={(jsonString) => handleInputChange('socialMediaAccounts', jsonString)}
              error={validationErrors.socialMediaAccounts}
              required={true}
            />

            <TextareaField
              placeholder="Bio (Enter complete details about yourself - minimum 200 words)"
              value={formData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
              error={validationErrors.bio}
              minWords={200}
              maxLength={2000}
              rows={8}
              required
            />
          </div>
        );

      case 2: // Documents (using text inputs for URLs)
        return (
          <div className="space-y-8">
            <InputField
              label="Government Recognized ID URL"
              placeholder="Enter URL for Government ID (e.g., https://example.com/id.jpg)"
              value={formData.governmentIdUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('governmentIdUrl', e.target.value)}
              error={validationErrors.governmentIdUrl}
              icon={<FileText className="w-5 h-5 text-gray-400" />}
              required
            />
            <Image
              src={formData.governmentIdUrl|| "/assets/images/governmentid.png"}
              alt={user?.FirstName || "User Avatar"}
              width={140}
              height={140}
              className="h-8 w-8 rounded-full"
            />

            <ImageUploadComponent  
              value={formData.governmentIdUrl|| "/assets/images/governmentid.png"}
              onChange={(iurl, resp) => {
                console.log(resp);
                console.log(iurl);
                if (iurl) {
                  handleInputChange('governmentIdUrl', iurl);
                }
              }}
            />

            <InputField
              label="Signature Image URL"
              placeholder="Enter URL for Signature Image (e.g., https://example.com/signature.png)"
              value={formData.signatureImageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('signatureImageUrl', e.target.value)}
              error={validationErrors.signatureImageUrl}
              icon={<ImageIcon className="w-5 h-5 text-gray-400" />}
              required
            />
            
            <Image
              src={formData.signatureImageUrl|| "/assets/images/signature.png"}
              alt={user?.FirstName || "User Avatar"}
              width={140}
              height={140}
              className="h-8 w-8 rounded-full"
            />

            <ImageUploadComponent  
              value={formData.signatureImageUrl|| "/assets/images/signature.png"}
              onChange={(iurl, resp) => {
                console.log(resp);
                console.log(iurl);
                if (iurl) {
                  handleInputChange('signatureImageUrl', iurl);
                }
              }}
              onError={(error) => {
                console.error("Image upload error:", error);
              }}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Financial Information</h3>
        
              <AccountDetailsComponent 
                value={formData.bankDetails}
                onChange={(jsonString) => handleInputChange('bankDetails', jsonString)}
                error={validationErrors.bankDetails}
                required={false}
              />

              <InputField
                type="email"
                placeholder="PayPal Email Address (optional)"
                value={formData.paypalEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('paypalEmail', e.target.value)}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Review Your Information</h3>

            <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
              <h4 className="text-white font-medium mb-2">Personal Info:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{formData.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Artist Name:</span>
                  <span className="text-white ml-2">{formData.artistName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{formData.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white ml-2">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400">Gender:</span>
                  <span className="text-white ml-2">{formData.gender}</span>
                </div>
                <div>
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white ml-2">{formData.country}</span>
                </div>
                <div>
                  <span className="text-gray-400">Home Address:</span>
                  <span className="text-white ml-2">{formData.homeAddress}</span>
                </div>
                <div>
                  <span className="text-gray-400">WhatsApp:</span>
                  <span className="text-white ml-2">{formData.whatsappNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Nationality Code:</span>
                  <span className="text-white ml-2">{formData.nationalityCountryCode || 'N/A'}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-2">Artist Details:</h4>
                <p className="text-gray-400 text-sm mb-2">
                  About Yourself ({countWords(formData.aboutYourself)} words): 
                  <span className="text-white">{formData.aboutYourself}</span>
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  Musical Style: <span className="text-white">{formData.musicalStyleGenre}</span>
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  Latest Project: <span className="text-white">{formData.latestSongOrProject || 'N/A'}</span>
                </p>
                <p className="text-gray-400 text-sm mb-2">
                  Social Media: <span className="text-white break-all">{formData.socialMediaAccounts}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  Bio ({countWords(formData.bio)} words): 
                  <span className="text-white">{formData.bio}</span>
                </p>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-2">Documents & Financial:</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-400 text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Government ID URL: <span className="text-white ml-1 break-all">{formData.governmentIdUrl}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Signature URL: <span className="text-white ml-1 break-all">{formData.signatureImageUrl}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Bank Details: <span className="text-white">{formData.bankDetails || 'N/A'}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    PayPal Email: <span className="text-white">{formData.paypalEmail || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-yellow-200 text-sm">
                  <p className="font-medium mb-1">Important Notice:</p>
                  <p>Please review all information carefully before submitting. Once submitted, changes may require additional verification.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse"></div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full">
          <div className="flex items-center space-x-3 text-3xl font-bold mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-black" />
            </div>
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Singnify
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4">Artist Verification</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            Complete your verification to unlock full access to our platform and start monetizing your music.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Secure document handling</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Fast verification process</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">24/7 support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <ProgressSteps currentStep={currentStep} steps={steps} />

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {steps[currentStep]}
              </h3>
              <p className="text-gray-400">
                {currentStep === 0 && "Let's start with your basic information"}
                {currentStep === 1 && "Tell us about your music and artistry"}
                {currentStep === 2 && "Provide links to your verification documents"}
                {currentStep === 3 && "Review and submit your application"}
              </p>
            </div>

            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-700">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Previous
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 font-bold rounded-xl transition-all transform shadow-lg ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationForm;