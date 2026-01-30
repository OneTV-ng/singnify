'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";


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

// Types for our form data
interface UploadFormData {
  isAlbum: string;
  label: string;
  name: string;
  genre: string;
  language: string;
  recordLabel: string;
  isExplicit: string;
  country: string;
  choice: string;
  spotifyUrl: string;
  itunesUrl: string;
  musicUploadDate: string;
  lyrics: string;
  description: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactPhone: string;
  trackEmail: string;
  someoneFullName: string;
  someoneName: string;
  someonePhone: string;
  someoneEmail: string;
}

// Types for featured artists and composers
interface Contributor {
  id: number;
  name: string;
}

export default function UploadMusic() {
      const { data: session } = useSession();
    //  console.log("Session data:", session);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadType, setUploadType] = useState<'track' | 'album' | null>(null);
  const [uploadSignal, setUploadSignal] = useState('0');
  const [formData, setFormData] = useState<UploadFormData>({
    isAlbum: 'No',
    label: 'Manny',
    name: '',
    genre: '',
    language: '',
    recordLabel: 'no',
    isExplicit: '',
    country: 'United Kingdom',
    choice: 'Uploading For Myself',
    spotifyUrl: '',
    itunesUrl: '',
    musicUploadDate: '2025-08-27',
    lyrics: '',
    description: '',
    firstName: 'Manny',
    middleName: '',
    lastName: 'Studios',
    contactPhone: '08055787878',
    trackEmail: 'manny@1tv.ng',
    someoneFullName: '',
    someoneName: '',
    someonePhone: '',
    someoneEmail: ''
  });
  
  const [featuredArtists, setFeaturedArtists] = useState<Contributor[]>([]);
  const [composers, setComposers] = useState<Contributor[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Auto-populate form data from session when session is available
  useEffect(() => {
    if (session?.user) {
      const user = session.user as ExtendedUserType;
      setFormData(prev => ({
        ...prev,
        token: session.accessToken || user.Token || '',
        name: user.StageName || user.Username || '',
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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle step navigation
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle upload type selection
  const handleUploadTypeSelect = (type: 'track' | 'album') => {
    setUploadType(type);
    setFormData(prev => ({
      ...prev,
      isAlbum: type === 'album' ? 'Yes' : 'No'
    }));
    setCurrentStep(2);
  };

  // Handle upload signal (for self or others)
  const handleUploadSignal = (signal: string) => {
    setUploadSignal(signal);
    setCurrentStep(3);
  };

  // Add featured artist
  const addFeaturedArtist = () => {
    setFeaturedArtists(prev => [
      ...prev,
      { id: Date.now(), name: '' }
    ]);
  };

  // Add composer
  const addComposer = () => {
    setComposers(prev => [
      ...prev,
      { id: Date.now(), name: '' }
    ]);
  };

  // Handle contributor name change
  const handleContributorChange = (id: number, value: string, type: 'featured' | 'composer') => {
    if (type === 'featured') {
      setFeaturedArtists(prev => 
        prev.map(artist => 
          artist.id === id ? { ...artist, name: value } : artist
        )
      );
    } else {
      setComposers(prev => 
        prev.map(composer => 
          composer.id === id ? { ...composer, name: value } : composer
        )
      );
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        featuredArtists: featuredArtists.filter(artist => artist.name.trim() !== ''),
        composers: composers.filter(composer => composer.name.trim() !== ''),
        coverImage,
        audioFiles,
        videoFile
      };
      
      // In a real app, you would send this data to your API
      console.log('Submitting:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect on success
      router.push('/success');
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your music. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available genres for select dropdown
  const genres = [
    "Instrumental (Does Not Contain Lyrics)",
    "Acoustic",
    "Gospel",
    "Blues",
    "Classical",
    "Country",
    "Highlife",
    "Folk",
    "Hip-Hop",
    "African",
    "Jazz",
    "Pop",
    "Reggae",
    "R&B",
    "Rock",
    "Soul",
    "World"
  ];

  // Available languages for select dropdown
  const languages = [
    "No Human Vocals",
    "No linguistic content - zxx",
    "Afrikaans - afr",
    "Arabic - ara",
    // ... more languages would be added here
    "English - eng",
    // ... more languages
    "Yoruba - yor"
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
  
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <div 
          className="relative bg-cover bg-center py-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://singnify.com/assets/images/CoverArt/Thumb/1701338278_cover_art_52497921.jpg)`
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              <i className="fa fa-upload mr-3" aria-hidden="true"></i> Upload Music
            </h1>
          </div>
        </div>

        {/* Upload Form */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-dark-light rounded-lg p-6">
            {/* Step 1: Upload Type Selection */}
            {currentStep === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-8">What would you like to upload?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Single Track Option */}
                  <div 
                    className="border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gold transition-colors"
                    onClick={() => handleUploadTypeSelect('track')}
                  >
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
                        <h3 className="text-2xl font-semibold">Upload Track</h3>
                        <p className="text-gray-400 mt-2">A track is a single</p>
                      </div>
                      <div className="md:w-1/2 text-center">
                        <span className="text-3xl text-gold">
                          <i className="fas fa-music"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Album Option */}
                  <div 
                    className="border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gold transition-colors"
                    onClick={() => handleUploadTypeSelect('album')}
                  >
                    <div className="flex flex-col md:flex-row items-center">
                      <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
                        <h3 className="text-2xl font-semibold">Upload Album</h3>
                        <p className="text-gray-400 mt-2">An album is two or more tracks</p>
                      </div>
                      <div className="md:w-1/2 text-center">
                        <span className="text-3xl text-gold">
                          <i className="fas fa-play"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Upload Instructions */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Get your music out there</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <i className="fa fa-image text-gold mt-1 mr-4"></i>
                    <p>Artwork image, perfect square 3000 X 3000 pixels</p>
                  </div>
                  
                  <div className="flex items-start">
                    <i className="fa fa-music text-gold mt-1 mr-4"></i>
                    <p>High-quality audio, 44.1KHz, 16-bit stereo of MP3</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleUploadSignal('0')}
                    className="bg-blue-600 text-white py-3 rounded font-medium"
                  >
                    Upload A New Release
                  </button>
                  
                  <button 
                    onClick={() => handleUploadSignal('1')}
                    className="bg-red-600 text-white py-3 rounded font-medium"
                  >
                    Upload For A New Artist
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Artist Information */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold text-gold mb-6">
                  <i className="fa fa-user mr-2"></i> Artist Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Middle Name (optional)</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Phone</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Email Address</label>
                    <input
                      type="email"
                      name="trackEmail"
                      value={formData.trackEmail}
                      onChange={handleInputChange}
                      disabled
                      className="w-full p-3 rounded bg-gray-200 text-black"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    Previous
                  </button>
                  
                  <button 
                    onClick={handleNextStep}
                    className="bg-gold text-black px-6 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Track/Album Details */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Track Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block mb-2">Artiste Stage Name</label>
                    <input
                      type="text"
                      name="label"
                      value={formData.label}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">
                      {formData.isAlbum === 'Yes' ? 'Album Name' : 'Track Name'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Genre</label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded bg-white text-black"
                    >
                      <option value="">- Select -</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* More form fields would go here */}
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    Previous
                  </button>
                  
                  <button 
                    onClick={handleNextStep}
                    className="bg-gold text-black px-6 py-2 rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Additional steps would be implemented similarly */}
            
            {/* Final Step: Review and Submit */}
            {currentStep === 7 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Review and Submit</h2>
                
                <div className="bg-gray-800 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold mb-4">Upload Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Artist Name:</p>
                      <p className="font-medium">{formData.label}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">Track Name:</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">Genre:</p>
                      <p className="font-medium">{formData.genre}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400">Release Date:</p>
                      <p className="font-medium">{formData.musicUploadDate}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <input 
                    type="checkbox" 
                    id="terms-agreement" 
                    className="mt-1 mr-3" 
                  />
                  <label htmlFor="terms-agreement" className="text-sm">
                    I have read the <Link href="/terms-of-service" className="text-gold underline">Terms of Use</Link> which 
                    includes <Link href="/publishing-licensing" className="text-gold underline">Distribution, Publishing and Licensing</Link> Agreements. 
                    I understand that my choice to select this box gives Singnify, at their sole discretion, 
                    exclusive rights to Distribute, Publish and License my songs and videos worldwide.
                  </label>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    Previous
                  </button>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gold text-black px-6 py-2 rounded disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    
    </div>
  );
}