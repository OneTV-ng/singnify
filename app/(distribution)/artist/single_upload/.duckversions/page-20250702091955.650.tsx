"use client";
import React, { useState } from 'react';
import { Upload, Music, Image, Calendar, Settings, Check, X, FileAudio, Clock, User } from 'lucide-react';
import { useSession } from "next-auth/react";
import Link from 'next/link';  
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
mport { useShowMessage } from '@/app/context/ShowMessageContext';
export default function UploadPage() {
    //import { useShowMessage } from '@/app/context/ShowMessageContext';

  const { showMessage } = useShowMessage();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  //const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);




  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    releaseDate: '',
    privacy: 'public'
  });



 const { data: session, status } = useSession();


useEffect(() => {
if(!session.user.IsVerified==="1"){

showMessage("Please verify your account to upload songs.");
  const router = useRouter();
  setTimeout(() => {
    router.push('/member/verify');
  }, 3000); // Redirect after 3 seconds
  return; // Exit early if not

}
  

}, [session])



 console.log("Session Data:", session);


  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading Upload..</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please log in to Upload Songs</p>
          <Link href="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    setUploadedFile(files[0]);
    simulateUpload();
  }
};
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

(e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleInputChange = (field : string, value : any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Upload Your Music</h1>
            <p className="text-slate-300">Share your latest tracks with the world</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-6">
            {/* Drag and Drop Upload */}
            <div 
              className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed transition-all duration-300 ${
                dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {uploadedFile ? uploadedFile.name : 'Drop your music file here'}
                </h3>
                <p className="text-slate-400 mb-4">or click to browse</p>
                
                {/* File Format Badges */}
                <div className="flex justify-center gap-2 mb-6">
                  <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm">MP3</span>
                  <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">WAV</span>
                  <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm">FLAC</span>
                </div>

                {/* Upload Progress */}
                {uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="bg-slate-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-slate-300 text-sm">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <input type="file" className="hidden" accept=".mp3,.wav,.flac" />
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                  Choose File
                </button>
              </div>
            </div>

            {/* Album Artwork Upload */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Image className="w-5 h-5" />
                Album Artwork
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <button className="bg-slate-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors">
                    Upload Image
                  </button>
                  <p className="text-slate-400 text-sm mt-1">3000x3000px recommended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Track Details
            </h3>

            <div className="space-y-4">
              {/* Song Title */}
              <div>
                <label className="block text-white font-medium mb-2">Song Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter song title"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-white font-medium mb-2">Artist</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Artist name"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-white font-medium mb-2">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                >
                  <option value="">Select genre</option>
                  <option value="pop">Pop</option>
                  <option value="rock">Rock</option>
                  <option value="hip-hop">Hip-Hop</option>
                  <option value="electronic">Electronic</option>
                  <option value="jazz">Jazz</option>
                  <option value="classical">Classical</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Tell us about your track..."
                />
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-white font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Release Date
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                />
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-white font-medium mb-3">Privacy</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={formData.privacy === 'public'}
                      onChange={(e) => handleInputChange('privacy', e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-white">Public</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === 'private'}
                      onChange={(e) => handleInputChange('privacy', e.target.value)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-white">Private</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Upload Track
              </button>
              <button className="bg-slate-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-600 transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {uploadProgress === 100 && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <Check className="w-5 h-5" />
            Upload successful!
          </div>
        )}
      </div>
    </div>
  );
}

function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
