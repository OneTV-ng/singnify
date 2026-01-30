"use client";
//@/app/artist/upload/page.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Music, Image, Globe, Flag, AlertTriangle, User, FileText, Calendar, Star, Check, X, Play, Pause,
  ChevronLeft, ChevronRight, Loader2, Info, Link, Users
} from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

import ImageUploadComponent from '@/app/components/singnify/ImageUploadComponent';
import TrackUploadComponent from '@/app/components/singnify/TrackUplaodComponent';

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

interface MusicFormData {
  token: string;
  artist_name?: string;
name?: string;

  label: string;
  genre: string;
  is_edit: string;
  language: string;
  image: string | null;
  
  audio: string | null;
  duration: string;
  country: string;
  choice: 'solo' | 'collaboration';
  someone_full_name: string;
  someone_name: string;
  someone_phone: string;
  someone_email: string;
  track_name: string;
  track_id: string;
  is_cover: boolean;
  description: string;
  last_name: string;
  middle_name: string;
  first_name: string;
  contact_phone: string;
  
  // Composer fields (matching PHP backend com_* pattern)
  com_lname1: string;
  com_mname1: string;
  com_fname1: string;
  com_lname2: string;
  com_mname2: string;
  com_fname2: string;
  com_lname3: string;
  com_mname3: string;
  com_fname3: string;
  
  lyrics: string;
  lyrics_file: File | null;
  feature: string;
  compose: string;
  record_label: string;
  is_explicit: boolean;
  spotify_url: string;
  itunes_url: string;
  video_url: string;
  music_upload_date: string;
  biography: string;
  
  // Additional fields from PHP backend
  is_admin?: string;
  arg?: string;
}

interface UploadProgress {
  audio: number;
  image: number;
  lyrics_file: number;
}

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
}

interface FileUploadProps {
  field: 'lyrics_file';
  accept: string;
  label: string;
  icon: React.ComponentType<any>;
  preview?: React.ReactNode;
}

// API Configuration
const API_CONFIG = {
  endpoint: 'https://singnify.com/api/v2/php/save-audio.php',
  apiKey: '7c6a180b36896a0a8c02787eeafb0e4c',
};

const MusicSubmissionForm: React.FC = () => {
  const { data: session } = useSession();
  console.log("Session data:", session);
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<MusicFormData>({
    token: '',
    name: '',
    label: '',
    genre: '',
    is_edit: '',
    language: '',
    image: null,
    audio: null,
    duration: '',
    country: '',
    choice: 'solo',
    someone_full_name: '',
    someone_name: '',
    someone_phone: '',
    someone_email: '',
    track_name: '',
    track_id: '',
    is_cover: false,
    description: '',
    last_name: '',
    middle_name: '',
    first_name: '',
    contact_phone: '',
    
    // Composer fields (the missing ones causing the error)
    com_lname1: '',
    com_mname1: '',
    com_fname1: '',
    com_lname2: '',
    com_mname2: '',
    com_fname2: '',
    com_lname3: '',
    com_mname3: '',
    com_fname3: '',
    
    lyrics: '',
    lyrics_file: null,
    feature: '',
    compose: '',
    record_label: '',
    is_explicit: false,
    spotify_url: '',
    itunes_url: '',
    video_url: '',
    music_upload_date: new Date().toISOString().split('T')[0],
    biography: '',
  });

  // Auto-populate form data from session when session is available
  useEffect(() => {
    if (session?.user) {
      const user = session.user as ExtendedUserType;
      setFormData(prev => ({
        ...prev,
        token: session.accessToken || user.Token || '',
        //name: user.StageName || user.Username || '',
        first_name: user.FirstName || '',
        last_name: user.LastName || '',
        contact_phone: user.Phone || '',
        country: user.Country || '',
        biography: user.About || '',
        record_label: user.RecordLabel || '',
        // Set label to record_label if available
        label: user.RecordLabel || '',
      }));
    }
  }, [session]);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    audio: 0,
    image: 0,
    lyrics_file: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const steps: Step[] = [
    { id: 1, title: 'Track Info', icon: Music },
    { id: 2, title: 'Media Upload', icon: Upload },
    { id: 3, title: 'Artist Details', icon: User },
    { id: 4, title: 'Additional Info', icon: FileText },
    { id: 5, title: 'Review & Submit', icon: Check }
  ];

  const genres: string[] = [
    'Afrobeats', 'Pop', 'Hip-Hop', 'R&B', 'Gospel', 'Highlife', 'Fuji', 'Juju',
    'Rock', 'Jazz', 'Reggae', 'Electronic', 'Classical', 'Folk', 'Country', 'Blues', 'Amapiano', 'Alternative'
  ];

  const languages: string[] = [
    'English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin', 'French', 'Spanish', 'Portuguese', 'Swahili', 'Arabic'
  ];

  const countries: string[] = [
    'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Brazil', 'India'
  ];

  const handleInputChange = (field: keyof MusicFormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload for lyrics file only (since audio and image are handled by separate components)
  const handleFileUpload = async (field: 'lyrics_file', file: File | null): Promise<void> => {
    if (!file) return;

    setFormData(prev => ({ ...prev, [field]: file }));

    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [field]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);
  };

  // File upload component for lyrics file only
  const FileUploadComponent: React.FC<FileUploadProps> = ({ field, accept, label, icon: Icon, preview = null }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-purple-400" />
        {label}
      </label>

      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileUpload(field, e.target.files?.[0] || null)}
          className="hidden"
          id={field}
        />
        <label
          htmlFor={field}
          className="block w-full p-6 border-2 border-dashed border-purple-500/50 rounded-xl hover:border-purple-400 transition-all cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 group"
        >
          <div className="text-center">
            <Icon className="w-9 h-9 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold">
              {formData[field] ? formData[field]!.name : `Drag & Drop or Click to Upload ${label.toLowerCase()}`}
            </p>
            <p className="text-slate-400 text-xs mt-1">{accept}</p>
          </div>
        </label>

        {uploadProgress[field] > 0 && uploadProgress[field] < 100 && (
          <div className="mt-3">
            <div className="bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress[field]}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{uploadProgress[field]}% uploaded</p>
          </div>
        )}

        {uploadProgress[field] === 100 && (
          <div className="mt-3 flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">Upload complete!</span>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg shadow-inner">
          {preview}
        </div>
      )}
    </div>
  );

  const nextStep = (): void => {
    let isValid = true;
    let errorMsg = '';

    if (currentStep === 1) {
      const requiredFields = {
        'Track Name': formData.track_name?.trim(),
        'Artist Name': formData.artist_name?.trim(),
        'Genre': formData.genre?.trim(),
        'Language': formData.language?.trim(),
        'Country': formData.country?.trim(),
      //  'Label': formData.label?.trim(),
        'Record Label': formData.label?.trim()
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field, _]) => field);

      if (missingFields.length > 0) {
        isValid = false;
        errorMsg = `Please fill in the following required fields: ${missingFields.join(', ')}`;
      }
    } else if (currentStep === 2) {
      if (!formData.audio || !formData.image) {
        isValid = false;
        errorMsg = 'Please upload both Audio File and Cover Image.';
      }
    } else if (currentStep === 3) {
      if (!formData.first_name || !formData.last_name || !formData.contact_phone) {
        isValid = false;
        errorMsg = 'Please fill in all required fields for Artist Details.';
      }
      if (formData.choice === 'collaboration' && (!formData.someone_full_name || !formData.someone_email)) {
        isValid = false;
        errorMsg = 'Please fill in collaborator details for collaboration tracks.';
      }
    }

    if (!isValid) {
      setErrorMessage(errorMsg);
      setSubmissionStatus('error');
    } else {
      setErrorMessage('');
      setSubmissionStatus(null);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSubmissionStatus(null);
      setErrorMessage('');
    }
  };

  const parseApiResponse = (responseText: string) => {
    try {
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (e) {
      try {
        const messageMatch = responseText.match(/"message":"({.*?})"/);
        if (messageMatch) {
          const innerJson = JSON.parse(messageMatch[1].replace(/\\"/g, '"'));
          return innerJson;
        }
      } catch (e2) {
        return { status: 'unknown', message: responseText };
      }
    }
    return { status: 'unknown', message: responseText };
  };

  const submitForm = async (): Promise<void> => {
    const user = session?.user as ExtendedUserType;
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    console.log("=== EXACT PHP BACKEND MATCH DEBUG ===");
    console.log("User session:", user);
    console.log("Form data:", formData);

    // CRITICAL: User session validation
    if (!user?.Token) {
      setSubmissionStatus('error');
      setErrorMessage('Invalid user session. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    // STEP 1: Pre-validate required fields based on EXACT PHP logic
    const requiredValidation = {
      track_name: formData.track_name?.trim() || '',
      genre: formData.genre?.trim() || '',
      language: formData.language?.trim() || '',
      duration: formData.duration?.trim() || '',
      country: formData.country?.trim() || '',
      choice: formData.choice?.trim() || '',
      label: formData.label?.trim() || '',
      description: formData.description?.trim() || '',
      is_cover: formData.is_cover || false
    };

    console.log("Required field validation:", requiredValidation);

    const validationErrors = [];
    
    if (!requiredValidation.track_name) validationErrors.push('Song name is required');
    if (!requiredValidation.genre) validationErrors.push('Genre is required');
    if (!requiredValidation.language) validationErrors.push('Language is required');
    if (!requiredValidation.duration) validationErrors.push('Duration is required');
    if (!requiredValidation.country) validationErrors.push('Country is required');
    if (!requiredValidation.choice) validationErrors.push('Choice is required');
    if (!requiredValidation.label) validationErrors.push('Record label name is required');
    if (!requiredValidation.description) validationErrors.push('Song description is required');

    if (validationErrors.length > 0) {
      console.error("VALIDATION ERRORS:", validationErrors);
      setSubmissionStatus('error');
      setErrorMessage(validationErrors.join('. '));
      setIsSubmitting(false);
      return;
    }

    // STEP 2: Build FormData with EXACT field mapping from PHP
    const formDataToSubmit = new FormData();

    // Authentication (PHP checks token for user validation)
    formDataToSubmit.append('token', user.Token);

    // EXACT required fields from PHP validation
    formDataToSubmit.append('track_name', requiredValidation.track_name);
        formDataToSubmit.append('name', requiredValidation.track_name);

    formDataToSubmit.append('label', formData.label?.trim());
    formDataToSubmit.append('genre', requiredValidation.genre);
    formDataToSubmit.append('language', requiredValidation.language);
    formDataToSubmit.append('duration', requiredValidation.duration);
    formDataToSubmit.append('country', requiredValidation.country);
    formDataToSubmit.append('choice', requiredValidation.choice);

    // File handling - now using the uploaded file URLs from components
    if (formData.audio) {
      formDataToSubmit.append('audio', formData.audio);
    } else {
      formDataToSubmit.append('audio', '');
    }

    formDataToSubmit.append('is_cover', requiredValidation.is_cover ? '1' : '0');
    if (formData.image) {
      formDataToSubmit.append('image', formData.image);
    } else {
      formDataToSubmit.append('image', '');
    }

    // Required for 321 prevention
    formDataToSubmit.append('record_label', requiredValidation.label);
    formDataToSubmit.append('label', requiredValidation.label);

    formDataToSubmit.append('description', requiredValidation.description);

    // ALL other fields from PHP (ensuring none are undefined)
    formDataToSubmit.append('someone_full_name', formData.someone_full_name?.trim() || '');
    formDataToSubmit.append('someone_name', formData.someone_name?.trim() || '');
    formDataToSubmit.append('someone_phone', formData.someone_phone?.trim() || '');
    formDataToSubmit.append('someone_email', formData.someone_email?.trim() || '');
    formDataToSubmit.append('is_admin', '0');
    formDataToSubmit.append('track_name', formData.track_name?.trim() || '');
 formDataToSubmit.append('artist_name', formData.artist_name?.trim() ||'');
 formDataToSubmit.append('name', formData.artist_name?.trim() ||'');


    formDataToSubmit.append('is_edit', formData.is_edit?.trim() || '');
    formDataToSubmit.append('track_id', formData.track_id?.trim() || '');
    formDataToSubmit.append('arg', formData.arg?.trim() || '');
    formDataToSubmit.append('last_name', formData.last_name?.trim() || '');
    formDataToSubmit.append('middle_name', formData.middle_name?.trim() || '');
    formDataToSubmit.append('first_name', formData.first_name?.trim() || '');
    formDataToSubmit.append('contact_phone', formData.contact_phone?.trim() || '');

    // Composer fields (all from PHP)
    formDataToSubmit.append('com_lname1', formData.com_lname1?.trim() || '');
    formDataToSubmit.append('com_mname1', formData.com_mname1?.trim() || '');
    formDataToSubmit.append('com_fname1', formData.com_fname1?.trim() || '');
    formDataToSubmit.append('com_lname2', formData.com_lname2?.trim() || '');
    formDataToSubmit.append('com_mname2', formData.com_mname2?.trim() || '');
    formDataToSubmit.append('com_fname2', formData.com_fname2?.trim() || '');
    formDataToSubmit.append('com_lname3', formData.com_lname3?.trim() || '');
    formDataToSubmit.append('com_mname3', formData.com_mname3?.trim() || '');
    formDataToSubmit.append('com_fname3', formData.com_fname3?.trim() || '');

    // Additional metadata fields
    formDataToSubmit.append('lyrics', formData.lyrics?.trim() || '');
    formDataToSubmit.append('feature', formData.feature?.trim() || '');
    formDataToSubmit.append('compose', formData.compose?.trim() || '');
    formDataToSubmit.append('is_explicit', formData.is_explicit ? '1' : '0');
    formDataToSubmit.append('spotify_url', formData.spotify_url?.trim() || '');
    formDataToSubmit.append('itunes_url', formData.itunes_url?.trim() || '');
    formDataToSubmit.append('video_url', formData.video_url?.trim() || '');
    formDataToSubmit.append('biography', formData.biography?.trim() || '');

    // Date handling - PHP uses strtotime() conversion
    if (formData.music_upload_date) {
      try {
        const timestamp = Math.floor(new Date(formData.music_upload_date).getTime() / 1000);
        formDataToSubmit.append('music_upload_date', timestamp.toString());
      } catch (e) {
        formDataToSubmit.append('music_upload_date', '0');
      }
    } else {
      formDataToSubmit.append('music_upload_date', '0');
    }

    // Lyrics file
    if (formData.lyrics_file && formData.lyrics_file.size > 0) {
      formDataToSubmit.append('lyrics_file', formData.lyrics_file, formData.lyrics_file.name);
    } else {
      formDataToSubmit.append('lyrics_file', '');
    }

    try {
      console.log("Making API request...");
      
      const response = await fetch(`${API_CONFIG.endpoint}?API_KEY=${API_CONFIG.apiKey}`, {
        method: 'POST',
        body: formDataToSubmit,
      });

      console.log("Response status:", response.status);

      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log('Raw API response:', textResult);
        
        try {
          result = JSON.parse(textResult);
        } catch (e) {
          result = parseApiResponse(textResult);
        }
      }

      console.log('Parsed result:', result);

      // Handle response based on exact PHP status codes
      if (result.status) {
        const statusCode = result.status.toString();
        
        switch (statusCode) {
          case '200':
            setSubmissionStatus('success');
            setErrorMessage('');
            console.log("SUCCESS: Track uploaded!");
            break;
            
          case '301':
            setSubmissionStatus('error');
            setErrorMessage('Music Information Incomplete! Check console for detailed analysis of missing fields.');
            break;
            
          case '321':
            setSubmissionStatus('error');
            if (result.message.includes('record label')) {
              setErrorMessage('Record label name is required.');
            } else {
              setErrorMessage('Song description is required.');
            }
            break;
            
          case '326':
            setSubmissionStatus('error');
            setErrorMessage('Invalid user access. Please log in again.');
            break;
            
          case '302':
            setSubmissionStatus('error');
            setErrorMessage(`Song "${formData.track_name}" already exists in your channel.`);
            break;
            
          case '401':
            setSubmissionStatus('error');
            setErrorMessage('Please add an email address to your profile.');
            break;
            
          case '411':
            setSubmissionStatus('error');
            setErrorMessage('Payment required for cover art service.');
            break;
            
          case '501':
            setSubmissionStatus('error');
            setErrorMessage('Your account must be active to upload tracks.');
            break;
            
          case '372':
          case '382':
          case '392':
          case '412':
            setSubmissionStatus('error');
            setErrorMessage('Database error occurred. Please try again.');
            break;
            
          default:
            setSubmissionStatus('error');
            setErrorMessage(result.message || `Upload failed with status: ${statusCode}`);
        }
      } else {
        setSubmissionStatus('error');
        setErrorMessage(result.message || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = (): number => (currentStep / steps.length) * 100;


  const renderStepContent = (): React.ReactNode => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Track Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Track Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.track_name}
                  onChange={(e) => handleInputChange('track_name', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter your track name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Artist Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.artist_name}
                  onChange={(e) => handleInputChange('artist_name', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your artist name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Genre <span className="text-red-400">*</span></label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none pr-8 cursor-pointer transition-all"
                  required
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre.toLowerCase()}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Language <span className="text-red-400">*</span></label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none pr-8 cursor-pointer transition-all"
                  required
                >
                  <option value="">Select language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Country <span className="text-red-400">*</span></label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none pr-8 cursor-pointer transition-all"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country.toLowerCase()}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       

              <div>
                <label className="block text-sm font-medium text-white mb-2">Record Label <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your record label name"
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_explicit}
                  onChange={(e) => handleInputChange('is_explicit', e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500 transition-all"
                />
                <span className="text-white flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Explicit Content
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_cover}
                  onChange={(e) => handleInputChange('is_cover', e.target.checked)}
                  className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500 transition-all"
                />
                <span className="text-white text-sm">Cover Song</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Tell us about your track, its inspiration, or any interesting facts..."
              />
            </div>
          </div>
        );


 case 2:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Your Media Files</h2>
            
            {/* Audio Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                Audio File (MP3) <span className="text-red-400">*</span>
              </label>

              <TrackUploadComponent
                value={formData.audio}
                onChange={(fileUrl, response) => {

                  console.log("Feed back response", response);
                  console.log("Feed back file URL",fileUrl);

                  
                  setFormData((prev) => ({
                    ...prev,
                    audio: fileUrl,
                    duration: response?.duration ?? prev.duration,
                  }));

                  alert(formData.duration);

                }}
                onError={(error:any) => {
                  console.error('Audio upload error:', error);
                  setErrorMessage(`Audio upload failed: ${error?.message||"Error in upload"}`);
                  setSubmissionStatus('error');
                }}
                onSuccess={(fileUrl, response) => {
                  console.log('Audio upload success:', response);
                  setErrorMessage('');
                  setSubmissionStatus(null);
                }}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Image className="w-4 h-4 text-purple-400" />
                Cover Image (JPEG, PNG, GIF) <span className="text-red-400">*</span>
              </label>
              <ImageUploadComponent
                value={formData.image}
                onChange={(imageUrl, response) => {
                  console.log(response);
                  setFormData((prev) => ({
                    ...prev,
                    image: imageUrl,
                  }));
                }}
                onError={(error) => {
                  console.error('Image upload error:', error);
                  setErrorMessage(`Image upload failed: ${error.message}`);
                  setSubmissionStatus('error');
                }}
                onSuccess={(imageUrl, response) => {
                  console.log('Image upload success:', response);
                  setErrorMessage('');
                  setSubmissionStatus(null);
                }}
                accept="image/jpeg,image/png,image/gif"
                showPreview={true}
                className="w-full"
              />
            </div>

            {/* Lyrics File Upload */}
            <FileUploadComponent
              field="lyrics_file"
              accept=".txt,.pdf,.doc,.docx"
              label="Lyrics File (Optional - TXT, PDF, DOCX)"
              icon={FileText}
            />

            {/* Lyrics Text Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Lyrics (Text - Optional)</label>
              <textarea
                value={formData.lyrics}
                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                rows={8}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Enter your lyrics here..."
              />
            </div>
          </div>
        );



      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Artist Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">First Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Middle Name</label>
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your middle name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Last Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Contact Phone <span className="text-red-400">*</span></label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="+234 801 234 5678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Biography</label>
              <textarea
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                rows={4}
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="Tell us about yourself as an artist, your journey, and achievements..."
              />
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />Collaboration Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Track Type</label>
                  <select
                    value={formData.choice}
                    onChange={(e) => handleInputChange('choice', e.target.value as "solo" | "collaboration")}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 appearance-none pr-8 cursor-pointer transition-all"
                  >
                    <option value="solo">Solo Track</option>
                    <option value="collaboration">Collaboration Track</option>
                  </select>
                </div>

                {formData.choice === 'collaboration' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Collaborator Full Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        value={formData.someone_full_name}
                        onChange={(e) => handleInputChange('someone_full_name', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Collaborator's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Collaborator Email <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        value={formData.someone_email}
                        onChange={(e) => handleInputChange('someone_email', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="collaborator@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Collaborator Name/Alias (Optional)</label>
                      <input
                        type="text"
                        value={formData.someone_name}
                        onChange={(e) => handleInputChange('someone_name', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="Stage name or alias"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Collaborator Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.someone_phone}
                        onChange={(e) => handleInputChange('someone_phone', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder="+234 xxx xxx xxxx"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Additional Track Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Featured Artists (Optional)</label>
                <input
                  type="text"
                  value={formData.feature}
                  onChange={(e) => handleInputChange('feature', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="e.g., feat. Wizkid, Burna Boy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Composer (Optional)</label>
                <input
                  type="text"
                  value={formData.compose}
                  onChange={(e) => handleInputChange('compose', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Who composed this track?"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4 text-blue-400" />
                  Spotify URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.spotify_url}
                  onChange={(e) => handleInputChange('spotify_url', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="https://open.spotify.com/track/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4 text-pink-400" />
                  iTunes URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.itunes_url}
                  onChange={(e) => handleInputChange('itunes_url', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="https://music.apple.com/us/album/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4 text-red-400" />
                  Video URL (YouTube/Vimeo - Optional)
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6">Review Your Submission</h2>

            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" /> Track & Artist Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">
                <div>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Track Name:</span> {formData.track_name || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Artist Name:</span> {formData.artist_name || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Genre:</span> {formData.genre || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Language:</span> {formData.language || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Country:</span> {formData.country || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Record Label:</span> {formData.label || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Duration:</span> {formData.duration}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Explicit Content:</span> {formData.is_explicit ? 'Yes' : 'No'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Cover Song:</span> {formData.is_cover ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Full Name:</span> {`${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim() || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Contact Phone:</span> {formData.contact_phone || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Track Type:</span> {formData.choice === 'solo' ? 'Solo' : `Collaboration with ${formData.someone_full_name || 'N/A'}`}</p>
                  {formData.choice === 'collaboration' && formData.someone_email && (
                    <p className="mb-2"><span className="text-slate-400 font-medium">Collaborator Email:</span> {formData.someone_email}</p>
                  )}
                  <p className="mb-2"><span className="text-slate-400 font-medium">Featured Artists:</span> {formData.feature || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Composer:</span> {formData.compose || 'N/A'}</p>
                  <p className="mb-2"><span className="text-slate-400 font-medium">Upload Date:</span> {formData.music_upload_date}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> File Status
                </h4>
                <div className="space-y-1 text-sm text-slate-200">
                  <p className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-300" />
                    Audio File: {formData.audio ? <span className="text-green-400">✓ Uploaded ({formData.audio})</span> : <span className="text-red-400">✗ Missing</span>}
                  </p>
                  <p className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-300" />
                    Cover Image: {formData.image ? <span className="text-green-400">✓ Uploaded ({formData.image})</span> : <span className="text-red-400">✗ Missing</span>}
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-300" />
                    Lyrics (Text/File): {formData.lyrics_file || formData.lyrics ? <span className="text-green-400">✓ Provided</span> : <span className="text-slate-500">Optional (Not provided)</span>}
                  </p>
                </div>
              </div>

              {(formData.spotify_url || formData.itunes_url || formData.video_url) && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4" /> Social Links
                  </h4>
                  <div className="space-y-1 text-sm text-slate-200">
                    {formData.spotify_url && <p><span className="text-slate-400">Spotify:</span> {formData.spotify_url}</p>}
                    {formData.itunes_url && <p><span className="text-slate-400">iTunes:</span> {formData.itunes_url}</p>}
                    {formData.video_url && <p><span className="text-slate-400">Video:</span> {formData.video_url}</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30 shadow-md">
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-300" /> Important Notice
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                By clicking "Submit", you acknowledge that you own all necessary rights to this music and its components (audio, lyrics, artwork). You grant Singnify.com the non-exclusive right to distribute your music across its platforms and partners in accordance with our Terms of Service. Ensure all information is accurate to avoid delays.
              </p>
            </div>

            {submissionStatus === 'success' && (
              <div className="bg-green-600/20 text-green-300 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
                <Check className="w-6 h-6" />
                <p className="font-semibold">Track submitted successfully! Thank you for your submission.</p>
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="bg-red-600/20 text-red-300 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
                <X className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Submission Failed</p>
                  {errorMessage && <p className="text-sm mt-1">{errorMessage}</p>}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 sm:p-8 font-sans text-slate-100">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        /* Custom styles for select arrow */
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a78bfa' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.7rem center;
          background-size: 1.5em 1.5em;
        }
      `}</style>
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            Submit Your Music to Singnify
          </h1>
          <p className="text-slate-300 text-xl">Empower your sound. Share your creativity with the world.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1 md:flex-initial">
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out shadow-lg
                    ${isActive
                      ? 'bg-purple-600 border-purple-600 text-white transform scale-110'
                      : isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}>
                    {isCompleted ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                    <span className={`absolute -bottom-7 text-xs font-semibold whitespace-nowrap transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 transition-colors duration-300
                      ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2 mt-8">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-slate-700/50 shadow-2xl">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-7 py-3 rounded-xl flex items-center gap-2 transition-all duration-300
              ${currentStep === 1 || isSubmitting
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-slate-700 hover:bg-slate-600 text-white shadow-md'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={submitForm}
              disabled={isSubmitting || submissionStatus === 'success'}
              className={`px-10 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 text-lg font-semibold
                ${isSubmitting || submissionStatus === 'success'
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg'
                }`}
            >
              {isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
              {submissionStatus === 'success' ? 'Submitted!' : 'Submit Track'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicSubmissionForm;