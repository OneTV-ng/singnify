"use client";
import React from 'react';
import { Music, User, Mail, Phone, MapPin, Globe, Calendar, Shield, Award, Edit, Instagram, Facebook, Twitter, Youtube, Star, CheckCircle, XCircle } from 'lucide-react';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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

// Profile Info Card Component
const ProfileInfoCard = ({ icon, title, value, link }: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  link?: string; 
}) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-yellow-500/10 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-400">{title}</p>
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-yellow-400 transition-colors font-medium break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-white font-medium">{value}</p>
        )}
      </div>
    </div>
  </div>
);

// Social Media Links Component
const SocialMediaLinks = ({ user }: { user: ExtendedUserType }) => {
  const socialLinks = [
    { platform: 'Facebook', url: user.Facebook, icon: Facebook, color: 'text-blue-500' },
    { platform: 'Twitter', url: user.Twitter, icon: Twitter, color: 'text-sky-400' },
    { platform: 'Instagram', url: user.Instagram, icon: Instagram, color: 'text-pink-500' },
    { platform: 'YouTube', url: user.YouTube, icon: Youtube, color: 'text-red-500' },
  ];

  const activeSocials = socialLinks.filter(social => social.url);

  if (activeSocials.length === 0) return null;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Globe className="w-5 h-5 mr-2 text-yellow-400" />
        Social Media
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activeSocials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all group"
          >
            <social.icon className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`} />
            <span className="text-white text-sm font-medium">{social.platform}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// Verification Status Component
const VerificationStatus = ({ isVerified }: { isVerified: string }) => {
  const getStatusInfo = () => {
    switch (isVerified) {
      case '1':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          text: 'Verified Artist',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-400'
        };
      case '0':
        return {
          icon: <XCircle className="w-5 h-5 text-yellow-400" />,
          text: 'Pending Verification',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-400'
        };
      default:
        return {
          icon: <Shield className="w-5 h-5 text-gray-400" />,
          text: 'Not Verified',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-400'
        };
    }
  };

  const status = getStatusInfo();

  return (
    <div className={`${status.bgColor} ${status.borderColor} border rounded-xl p-4`}>
      <div className="flex items-center space-x-3">
        {status.icon}
        <div>
          <p className={`font-medium ${status.textColor}`}>{status.text}</p>
          <p className="text-sm text-gray-400">
            {isVerified === '1' ? 'Your account is verified' : 
             isVerified === '0' ? 'Verification in progress' : '<Link href="/member/verify">Click Here to Complete verification to unlock all features </Link>'}
          </p>
        </div>
      </div>
    </div>
  );
};

// Utility function to format full name
const formatFullName = (firstName: string, lastName: string): string => {
  const formattedFirstName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase() || '';
  const formattedLastName = lastName?.charAt(0).toUpperCase() + lastName?.slice(1).toLowerCase() || '';
  return `${formattedFirstName} ${formattedLastName}`.trim();
};

// Utility function to format join date
const formatJoinDate = (timeNumber: string): string => {
  if (!timeNumber) return 'Unknown';
  const date = new Date(parseInt(timeNumber) * 1000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

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
          <p className="text-xl mb-4">Please log in to view your profile</p>
          <Link href="/signin" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const user = session?.user as ExtendedUserType;
  const fullName = formatFullName(user.FirstName || '', user.LastName || '');
  const joinDate = formatJoinDate(user.TimeNumber || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-gray-400">Manage your artist profile</p>
            </div>
          </div>
          <Link 
            href="/member/setting/edit_profile"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <Image
                src={user.Picture || "/assets/images/ProfilePictures/default-avatar.png"}
                alt={fullName || "User Avatar"}
                width={120}
                height={120}
                className="rounded-full border-4 border-yellow-400 shadow-lg"
              />
              {user.IsVerified === '1' && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">{fullName}</h2>
              <p className="text-yellow-400 text-lg font-medium mb-2">@{user.StageName || user.Username}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user.Gender}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{user.Country}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
              <VerificationStatus isVerified={user.IsVerified || '-1'} />
            </div>
          </div>

          {/* About Section */}
          {user.About && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed">{user.About}</p>
            </div>
          )}
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ProfileInfoCard
            icon={<Mail className="w-5 h-5 text-yellow-400" />}
            title="Email Address"
            value={user.EmailAddress || 'Not provided'}
          />
          <ProfileInfoCard
            icon={<Phone className="w-5 h-5 text-yellow-400" />}
            title="Phone Number"
            value={user.Phone || 'Not provided'}
          />
          <ProfileInfoCard
            icon={<User className="w-5 h-5 text-yellow-400" />}
            title="Username"
            value={user.Username || 'Not provided'}
          />
          <ProfileInfoCard
            icon={<Music className="w-5 h-5 text-yellow-400" />}
            title="Stage Name"
            value={user.StageName || 'Not provided'}
          />
          <ProfileInfoCard
            icon={<Award className="w-5 h-5 text-yellow-400" />}
            title="Record Label"
            value={user.RecordLabel || 'Independent Artist'}
          />
          <ProfileInfoCard
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            title="Artist Status"
            value={user.IsArtist === '1' ? 'Verified Artist' : 'Regular User'}
          />
        </div>

        {/* Social Media Section */}
        <SocialMediaLinks user={user} />

        {/* Documents Section (if available) */}
        {(user.Contract || user.Signature) && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-yellow-400" />
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.Contract && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Contract</p>
                  <a 
                    href={user.Contract} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                  >
                    View Contract
                  </a>
                </div>
              )}
              {user.Signature && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-2">Signature</p>
                  <a 
                    href={user.Signature} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                  >
                    View Signature
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}