"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Music, User, Mail, Phone, MapPin, Globe, Camera, Save, X,
  Upload, AlertCircle, CheckCircle, Edit, Instagram, Facebook,
  Twitter, Youtube, Loader2
} from 'lucide-react';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


import ImageUploadComponent from "@/app/components/singnify/ImageUploadComponent";

// Import your existing ImageUploadComponent


// Extended UserType to match the API structure
interface ExtendedUserType {
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
  TimeNumber?: string;
  Token?: string;
}

interface FormData {
  fname: string;
  lname: string;
  uname: string;
  gender: string;
  phone: string;
  country: string;
  stage_name: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  about: string;
  Picture: string; // Changed from 'image' to 'Picture' to match your component
}

interface FormErrors {
  [key: string]: string;
}

// Get API key from environment
const PLATFORM_API_KEY = process.env.NEXT_PUBLIC_PLATFORM_API_KEY;

// Country options
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Colombia',
  'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Ghana',
  'India', 'Indonesia', 'Italy', 'Japan', 'Kenya', 'Malaysia',
  'Mexico', 'Netherlands', 'Nigeria', 'Norway', 'Pakistan', 'Philippines',
  'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'South Africa', 'Spain',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam'
];

// Form Input Component
const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  icon,
  required = false,
  disabled = false
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${error
          ? 'border-red-500 focus:ring-red-500/50'
          : 'border-gray-600 focus:ring-yellow-500/50 focus:border-yellow-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
    {error && (
      <p className="text-red-400 text-sm flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// Form Select Component
const FormSelect = ({
  label,
  value,
  onChange,
  options,
  error,
  icon,
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${error
          ? 'border-red-500 focus:ring-red-500/50'
          : 'border-gray-600 focus:ring-yellow-500/50 focus:border-yellow-500'
        }`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-800">
          {option}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-400 text-sm flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// Form Textarea Component
const FormTextarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  maxLength
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-300">
      {label}
      {maxLength && (
        <span className="text-gray-400 text-xs ml-2">
          ({value.length}/{maxLength})
        </span>
      )}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${error
          ? 'border-red-500 focus:ring-red-500/50'
          : 'border-gray-600 focus:ring-yellow-500/50 focus:border-yellow-500'
        }`}
    />
    {error && (
      <p className="text-red-400 text-sm flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fname: '',
    lname: '',
    uname: '',
    gender: '',
    phone: '',
    country: '',
    stage_name: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    about: '',
    Picture: '' // Changed from 'image' to 'Picture'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize form data from session
  useEffect(() => {
    if (session?.user) {
      const user = session.user as ExtendedUserType;
      setFormData({
        fname: user.FirstName || '',
        lname: user.LastName || '',
        uname: user.Username || '',
        gender: user.Gender || '',
        phone: user.Phone || '',
        country: user.Country || '',
        stage_name: user.StageName || '',
        facebook: user.Facebook || '',
        twitter: user.Twitter || '',
        instagram: user.Instagram || '',
        youtube: user.YouTube || '',
        about: user.About || '',
        Picture: user.Picture || '' // Changed from 'image' to 'Picture'
      });
    }
  }, [session]);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fname.trim()) {
      newErrors.fname = 'First name is required';
    }

    if (!formData.lname.trim()) {
      newErrors.lname = 'Last name is required';
    }

    if (!formData.uname.trim()) {
      newErrors.uname = 'Username is required';
    } else if (formData.uname.length < 3) {
      newErrors.uname = 'Username must be at least 3 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate social media URLs
    const urlPattern = /^https?:\/\/.+/;
    if (formData.facebook && !urlPattern.test(formData.facebook)) {
      newErrors.facebook = 'Please enter a valid Facebook URL';
    }
    if (formData.twitter && !urlPattern.test(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter URL';
    }
    if (formData.instagram && !urlPattern.test(formData.instagram)) {
      newErrors.instagram = 'Please enter a valid Instagram URL';
    }
    if (formData.youtube && !urlPattern.test(formData.youtube)) {
      newErrors.youtube = 'Please enter a valid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const user = session?.user as ExtendedUserType;
      const updateFormData = new FormData();

      // Add all form fields
      updateFormData.append('api_key', '7c6a180b36896a0a8c02787eeafb0e4c');
      updateFormData.append('API_KEY', '7c6a180b36896a0a8c02787eeafb0e4c');
      updateFormData.append('token', user.Token || '');
      updateFormData.append('fname', formData.fname);
      updateFormData.append('lname', formData.lname);
      updateFormData.append('uname', formData.uname);
      updateFormData.append('gender', formData.gender);
      updateFormData.append('phone', formData.phone);
      updateFormData.append('country', formData.country);
      updateFormData.append('stage_name', formData.stage_name);
      updateFormData.append('facebook', formData.facebook);
      updateFormData.append('twitter', formData.twitter);
      updateFormData.append('instagram', formData.instagram);
      updateFormData.append('youtube', formData.youtube);
      updateFormData.append('about', formData.about);
      updateFormData.append('image', formData.Picture);
      updateFormData.append('picture', formData.Picture);
      updateFormData.append('avata', formData.Picture);

 // Map Picture to image for API

      const response = await fetch('https://singnify.com/api/v2/php/update-profile.php?API_KEY=7c6a180b36896a0a8c02787eeafb0e4c', {
        method: 'POST',
        body: updateFormData,
      });

      const result = await response.json();


      if (result.status === '200' && result.message === 'success') {
        setSubmitMessage({ type: 'success', text: 'Profile updated successfully!' });

        // Update the session with new user data if available
        if (result.member) {
          // Refresh the session to get updated user data
          // You might want to trigger a session update here
        }

        // Redirect to profile page after successful update
        setTimeout(() => {
          router.push('/member/profile');
        }, 2000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please log in to edit your profile</p>
          <Link href="/auth/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Edit className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
              <p className="text-gray-400">Update your artist profile information</p>
            </div>
          </div>
          <Link
            href="/member/profile"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${submitMessage.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
            {submitMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{submitMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Picture</h2>
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-300">Profile Picture</label>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={formData.Picture || "/assets/images/ProfilePictures/default-avatar.png"}
                    alt="Profile Preview"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-yellow-400 shadow-lg object-cover"
                  />
                </div>

                {/* Your ImageUploadComponent */}
                <ImageUploadComponent
                  value={formData.Picture || "/assets/images/ProfilePictures/default-avatar.png"}
                  onChange={(iurl, resp) => {
                    console.log(resp);
                    console.log(iurl);
                    if (iurl) {
                      handleInputChange("Picture", iurl);
                    }
                  }}
                  onError={(error) => {
                    console.error("Image upload error:", error);
                  }}
                />

                <p className="text-xs text-gray-400 text-center max-w-sm">
                  Upload a new profile picture. Supported formats: JPG, PNG, GIF. Max size: 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="First Name"
                value={formData.fname}
                onChange={(value) => handleInputChange('fname', value)}
                error={errors.fname}
                placeholder="Enter your first name"
                icon={<User className="w-4 h-4 text-yellow-400" />}
                required
              />
              <FormInput
                label="Last Name"
                value={formData.lname}
                onChange={(value) => handleInputChange('lname', value)}
                error={errors.lname}
                placeholder="Enter your last name"
                icon={<User className="w-4 h-4 text-yellow-400" />}
                required
              />
              <FormInput
                label="Username"
                value={formData.uname}
                onChange={(value) => handleInputChange('uname', value)}
                error={errors.uname}
                placeholder="Enter your username"
                icon={<User className="w-4 h-4 text-yellow-400" />}
                required
              />
              <FormInput
                label="Stage Name"
                value={formData.stage_name}
                onChange={(value) => handleInputChange('stage_name', value)}
                error={errors.stage_name}
                placeholder="Enter your stage name"
                icon={<Music className="w-4 h-4 text-yellow-400" />}
              />
              <FormSelect
                label="Gender"
                value={formData.gender}
                onChange={(value) => handleInputChange('gender', value)}
                options={['Male', 'Female', 'Other']}
                error={errors.gender}
                icon={<User className="w-4 h-4 text-yellow-400" />}
                required
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                error={errors.phone}
                placeholder="Enter your phone number"
                icon={<Phone className="w-4 h-4 text-yellow-400" />}
              />
              <FormSelect
                label="Country"
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                options={countries}
                error={errors.country}
                icon={<MapPin className="w-4 h-4 text-yellow-400" />}
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Social Media Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Facebook"
                type="url"
                value={formData.facebook}
                onChange={(value) => handleInputChange('facebook', value)}
                error={errors.facebook}
                placeholder="https://facebook.com/your-profile"
                icon={<Facebook className="w-4 h-4 text-blue-400" />}
              />
              <FormInput
                label="Twitter"
                type="url"
                value={formData.twitter}
                onChange={(value) => handleInputChange('twitter', value)}
                error={errors.twitter}
                placeholder="https://twitter.com/your-profile"
                icon={<Twitter className="w-4 h-4 text-blue-400" />}
              />
              <FormInput
                label="Instagram"
                type="url"
                value={formData.instagram}
                onChange={(value) => handleInputChange('instagram', value)}
                error={errors.instagram}
                placeholder="https://instagram.com/your-profile"
                icon={<Instagram className="w-4 h-4 text-pink-400" />}
              />
              <FormInput
                label="YouTube"
                type="url"
                value={formData.youtube}
                onChange={(value) => handleInputChange('youtube', value)}
                error={errors.youtube}
                placeholder="https://youtube.com/your-channel"
                icon={<Youtube className="w-4 h-4 text-red-400" />}
              />
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">About</h2>
            <FormTextarea
              label="About Yourself"
              value={formData.about}
              onChange={(value) => handleInputChange('about', value)}
              error={errors.about}
              placeholder="Tell us about yourself, your music, and your journey..."
              rows={6}
              maxLength={500}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/member/profile"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSubmitting ? 'Updating...' : 'Update Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}