"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload, Music, Image, Calendar, Settings, Check, FileAudio
} from 'lucide-react';
import { useShowMessage } from '@/app/context/ShowMessageContext';
import { UserType } from '@/app/lib/types';

export default function UploadPage() {
  const { showMessage } = useShowMessage();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    releaseDate: '',
    privacy: 'public'
  });

  useEffect(() => {
    const user = session?.user as UserType;

    if (session && !user?.IsVerified) {
      showMessage("Please verify your account to upload songs.");
      setTimeout(() => router.push('/member/verify'), 3000);
      return;
    }

    if (session && !user?.IsArtist) {
      showMessage("Please set your account to Artist to upload songs.");
      setTimeout(() => router.push('/member/profile'), 3000);
      return;
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading Upload Page...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to upload songs.</p>
          <Link href="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
      simulateUpload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Upload Your Music</h1>
        <p className="text-slate-300 mb-8">Share your latest tracks with the world</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-6">
            <div
              className={`bg-slate-800/50 p-8 border-2 border-dashed rounded-2xl transition-all ${
                dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {uploadedFile ? uploadedFile.name : 'Drop your music file here'}
                </h3>
                <p className="text-slate-400 mb-4">or select manually</p>

                <div className="flex justify-center gap-2 mb-6">
                  {['MP3', 'WAV', 'FLAC'].map(type => (
                    <span key={type} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-sm">{type}</span>
                  ))}
                </div>

                {uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="bg-slate-700 rounded-full h-2 mb-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-slate-300 text-sm">{uploadProgress}% uploaded</p>
                  </div>
                )}

                <input
                  id="fileInput"
                  type="file"
                  accept=".mp3,.wav,.flac"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="fileInput">
                  <button type="button" className="bg-purple-700 px-6 py-3 rounded-xl font-medium hover:scale-105 transition">
                    Choose File
                  </button>
                </label>
              </div>
            </div>

            {/* Album Artwork */}
            <div className="bg-slate-800/50 p-6 border border-slate-700 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Image className="w-5 h-5" /> Album Artwork
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <button className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600">Upload Image</button>
                  <p className="text-slate-400 text-sm mt-1">3000x3000px recommended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="bg-slate-800/50 p-6 border border-slate-700 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Track Details
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Song Title', field: 'title', placeholder: 'Enter song title' },
                { label: 'Artist', field: 'artist', placeholder: 'Artist name' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block font-medium mb-2">{label}</label>
                  <input
                    type="text"
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                  />
                </div>
              ))}

              {/* Genre */}
              <div>
                <label className="block font-medium mb-2">Genre</label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                >
                  <option value="">Select genre</option>
                  {['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical'].map(g => (
                    <option key={g} value={g.toLowerCase()}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  placeholder="Tell us about your track..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                />
              </div>

              {/* Release Date */}
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Release Date
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-purple-500"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="block font-medium mb-3">Privacy</label>
                <div className="space-y-2">
                  {['public', 'private'].map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        value={option}
                        checked={formData.privacy === option}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-purple-700 px-6 py-3 rounded-xl hover:scale-105 transition flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Upload Track
              </button>
              <button className="bg-slate-700 px-6 py-3 rounded-xl hover:bg-slate-600">
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
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
