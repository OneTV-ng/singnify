import React, { useState } from 'react';
import { Music, Upload, User, Mail, Phone, MapPin, Globe, CreditCard, FileText, Image, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

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
}) => (
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
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
    )}
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

// Textarea Field Component
const TextareaField = ({ 
  placeholder, 
  value, 
  onChange, 
  error, 
  rows = 4, 
  minLength = 0,
  maxLength = 1000,
  required = false,
  disabled = false 
}) => (
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
      <p className="text-xs text-gray-400 ml-auto">
        {value.length}/{maxLength} characters
        {minLength > 0 && value.length < minLength && (
          <span className="text-yellow-400"> (min {minLength})</span>
        )}
      </p>
    </div>
  </div>
);

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
}) => (
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
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
          {option.label}
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

// File Upload Component with Progress Bar
const FileUploadField = ({ 
  label, 
  accept, 
  onFileSelect, 
  uploadProgress, 
  uploadedFile, 
  error, 
  required = false,
  disabled = false 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          dragOver 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : error 
              ? 'border-red-500 bg-red-500/10' 
              : 'border-gray-600 hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`).click()}
      >
        <input
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="text-center">
          {uploadedFile ? (
            <div className="space-y-2">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-green-400 font-medium">{uploadedFile.name}</p>
              <p className="text-xs text-gray-400">File uploaded successfully</p>
            </div>
          ) : uploadProgress > 0 ? (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-yellow-400 font-medium">{uploadProgress}% Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-300 font-medium">Click to select or drag and drop</p>
              <p className="text-xs text-gray-400">
                Supported formats: {accept.replace(/\./g, '').toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

// Progress Step Indicator
const ProgressSteps = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center space-x-4 mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
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
  // Add more countries as needed
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

// Main Verification Form Component
const VerificationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const steps = ['Personal Info', 'Artist Details', 'Documents', 'Review'];

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    artistName: '',
    email: 'manny@1tv.ng',
    phone: '',
    gender: '',
    country: '',
    homeAddress: '',
    whatsappNumber: '',
    nationalityCountryCode: '',
    
    // Financial Information
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
    bio: ''
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // File upload simulation
  const handleFileUpload = async (file, fieldName) => {
    setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
    
    // Simulate file upload with progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
          setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
        } else {
          setUploadProgress(prev => ({ ...prev, [fieldName]: Math.round(progress) }));
        }
      }, 200);
    };

    simulateUpload();
  };

  // Form validation
  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData.name.trim()) errors.name = 'Full name is required';
        if (!formData.artistName.trim()) errors.artistName = 'Artist name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        if (!formData.gender) errors.gender = 'Gender selection is required';
        if (!formData.country) errors.country = 'Country selection is required';
        if (!formData.homeAddress.trim()) errors.homeAddress = 'Home address is required';
        break;
        
      case 1: // Artist Details
        if (formData.bio.length < 200) errors.bio = 'Bio must be at least 200 characters';
        if (formData.aboutYourself.length < 50) errors.aboutYourself = 'Must be at least 50 words';
        if (!formData.musicalStyleGenre.trim()) errors.musicalStyleGenre = 'Musical style is required';
        if (!formData.socialMediaAccounts.trim()) errors.socialMediaAccounts = 'At least 3 social media URLs required';
        break;
        
      case 2: // Documents
        if (!uploadedFiles.governmentId) errors.governmentId = 'Government ID is required';
        if (!uploadedFiles.signature) errors.signature = 'Signature image is required';
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would implement your server action
      console.log('Form submitted:', formData);
      console.log('Uploaded files:', uploadedFiles);
      
      alert('Verification submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
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
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={validationErrors.name}
                icon={<User className="w-5 h-5 text-gray-400" />}
                required
              />
              <InputField
                placeholder="Artist Name"
                value={formData.artistName}
                onChange={(e) => handleInputChange('artistName', e.target.value)}
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={validationErrors.email}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                required
              />
              <InputField
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={validationErrors.phone}
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                error={validationErrors.gender}
                placeholder="Select Gender"
                icon={<User className="w-5 h-5 text-gray-400" />}
                required
              />
              <SelectField
                options={countries}
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                error={validationErrors.country}
                placeholder="Select Country"
                icon={<Globe className="w-5 h-5 text-gray-400" />}
                required
              />
            </div>
            
            <TextareaField
              placeholder="Home Address"
              value={formData.homeAddress}
              onChange={(e) => handleInputChange('homeAddress', e.target.value)}
              error={validationErrors.homeAddress}
              rows={3}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                placeholder="WhatsApp Number"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                icon={<Phone className="w-5 h-5 text-gray-400" />}
              />
              <InputField
                placeholder="Nationality and Country Phone Code"
                value={formData.nationalityCountryCode}
                onChange={(e) => handleInputChange('nationalityCountryCode', e.target.value)}
                icon={<Globe className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        );
        
      case 1: // Artist Details
        return (
          <div className="space-y-6">
            <TextareaField
              placeholder="Tell us about yourself (aim for at least 50 words)"
              value={formData.aboutYourself}
              onChange={(e) => handleInputChange('aboutYourself', e.target.value)}
              error={validationErrors.aboutYourself}
              minLength={50}
              maxLength={500}
              required
            />
            
            <TextareaField
              placeholder="How would you describe your musical style and genre?"
              value={formData.musicalStyleGenre}
              onChange={(e) => handleInputChange('musicalStyleGenre', e.target.value)}
              error={validationErrors.musicalStyleGenre}
              required
            />
            
            <TextareaField
              placeholder="What is the title of your latest song or project?"
              value={formData.latestSongOrProject}
              onChange={(e) => handleInputChange('latestSongOrProject', e.target.value)}
            />
            
            <TextareaField
              placeholder="What inspired your latest song or project?"
              value={formData.latestSongInspiration}
              onChange={(e) => handleInputChange('latestSongInspiration', e.target.value)}
            />
            
            <TextareaField
              placeholder="Enter at least 3 of your Social Media Account URLs"
              value={formData.socialMediaAccounts}
              onChange={(e) => handleInputChange('socialMediaAccounts', e.target.value)}
              error={validationErrors.socialMediaAccounts}
              required
            />
            
            <TextareaField
              placeholder="Bio (Enter complete details about yourself - minimum 200 words)"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              error={validationErrors.bio}
              minLength={200}
              maxLength={1000}
              rows={6}
              required
            />
          </div>
        );
        
      case 2: // Documents
        return (
          <div className="space-y-8">
            <FileUploadField
              label="Government Recognized ID"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onFileSelect={(file) => handleFileUpload(file, 'governmentId')}
              uploadProgress={uploadProgress.governmentId || 0}
              uploadedFile={uploadedFiles.governmentId}
              error={validationErrors.governmentId}
              required
            />
            
            <FileUploadField
              label="Signature Image (on white background)"
              accept=".jpg,.jpeg,.png"
              onFileSelect={(file) => handleFileUpload(file, 'signature')}
              uploadProgress={uploadProgress.signature || 0}
              uploadedFile={uploadedFiles.signature}
              error={validationErrors.signature}
              required
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Financial Information</h3>
              <TextareaField
                placeholder="Bank Account Details (for withdrawal purposes)"
                value={formData.bankDetails}
                onChange={(e) => handleInputChange('bankDetails', e.target.value)}
                rows={3}
              />
              <InputField
                type="email"
                placeholder="PayPal Email Address (optional)"
                value={formData.paypalEmail}
                onChange={(e) => handleInputChange('paypalEmail', e.target.value)}
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
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white ml-2">{formData.country}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-white font-medium mb-2">Uploaded Documents:</h4>
                <div className="space-y-2">
                  {uploadedFiles.governmentId && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Government ID: {uploadedFiles.governmentId.name}
                    </div>
                  )}
                  {uploadedFiles.signature && (
                    <div className="flex items-center text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Signature: {uploadedFiles.signature.name}
                    </div>
                  )}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex relative overflow-hidden font-inter">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full animate-pulse-slow delay-500"></div>
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
              <span className="text-gray-300">Secure document upload</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Fast verification process</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">Enhanced account features</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-4xl bg-gray-800/30 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
          <ProgressSteps currentStep={currentStep} steps={steps} />
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep]}
            </h2>
            <p className="text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          <form className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  currentStep ===