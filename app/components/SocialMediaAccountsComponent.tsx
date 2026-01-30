import React, { useState, useEffect } from 'react';
import { User, AtSign, Globe, Hash, Camera, Music } from 'lucide-react';

interface SocialMediaAccountsProps {
  value?: string; // JSON string input
  onChange?: (jsonString: string) => void; // Returns JSON string
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

interface SocialMediaAccounts {
  twitter: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  website: string;
  other: string;
}

// Social media platforms with icons
const socialPlatforms = [
  { key: 'twitter' as keyof SocialMediaAccounts, label: 'Twitter/X', placeholder: '@username or full URL', icon: <AtSign className="w-5 h-5 text-gray-400" /> },
  { key: 'instagram' as keyof SocialMediaAccounts, label: 'Instagram', placeholder: '@username or full URL', icon: <Camera className="w-5 h-5 text-gray-400" /> },
  { key: 'linkedin' as keyof SocialMediaAccounts, label: 'LinkedIn', placeholder: 'Profile URL or username', icon: <User className="w-5 h-5 text-gray-400" /> },
  { key: 'facebook' as keyof SocialMediaAccounts, label: 'Facebook', placeholder: 'Profile URL or username', icon: <Hash className="w-5 h-5 text-gray-400" /> },
  { key: 'tiktok' as keyof SocialMediaAccounts, label: 'TikTok', placeholder: '@username or full URL', icon: <Music className="w-5 h-5 text-gray-400" /> },
  { key: 'youtube' as keyof SocialMediaAccounts, label: 'YouTube', placeholder: 'Channel URL or @handle', icon: <Globe className="w-5 h-5 text-gray-400" /> },
  { key: 'website' as keyof SocialMediaAccounts, label: 'Website/Blog', placeholder: 'https://yourwebsite.com', icon: <Globe className="w-5 h-5 text-gray-400" /> },
  { key: 'other' as keyof SocialMediaAccounts, label: 'Other Platform', placeholder: 'Any other social media or platform', icon: <AtSign className="w-5 h-5 text-gray-400" /> }
];

// Input Field Component
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
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all backdrop-blur-sm ${
        error
          ? 'border-red-500 focus:border-red-400'
          : 'border-gray-600 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      required={required}
    />
    {error && (
      <p className="mt-1 text-sm text-red-500">{error}</p>
    )}
  </div>
);

const SocialMediaAccountsComponent: React.FC<SocialMediaAccountsProps> = ({
  value = '',
  onChange,
  error,
  disabled = false,
  required = false
}) => {
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccounts>({
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    website: '',
    other: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<SocialMediaAccounts>>({});

  // Parse JSON input when value changes
  useEffect(() => {
    if (value && value.trim() !== '') {
      try {
        const parsed = JSON.parse(value);
        setSocialAccounts({
          twitter: parsed.twitter || '',
          instagram: parsed.instagram || '',
          linkedin: parsed.linkedin || '',
          facebook: parsed.facebook || '',
          tiktok: parsed.tiktok || '',
          youtube: parsed.youtube || '',
          website: parsed.website || '',
          other: parsed.other || ''
        });
      } catch (error) {
        // If parsing fails, reset to empty state
        console.warn('Failed to parse social media accounts JSON:', error);
      }
    }
  }, [value]);

  // Handle field changes
  const handleFieldChange = (field: keyof SocialMediaAccounts, fieldValue: string) => {
    const updatedAccounts = {
      ...socialAccounts,
      [field]: fieldValue
    };

    setSocialAccounts(updatedAccounts);

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Convert to JSON string and call onChange
    const jsonString = JSON.stringify(updatedAccounts, null, 0);
    onChange?.(jsonString);
  };

  // URL validation helper
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Validation
  const validateFields = () => {
    const errors: Partial<SocialMediaAccounts> = {};
    
    // Website URL validation
    if (socialAccounts.website.trim() && !isValidUrl(socialAccounts.website.trim())) {
      errors.website = 'Please enter a valid URL (include https://)';
    }

    // Basic validation for social media handles (should start with @ or be a URL)
    const validateSocialHandle = (value: string, platform: string) => {
      if (value.trim()) {
        const trimmed = value.trim();
        // If it's not a URL and doesn't start with @, it might be invalid
        if (!isValidUrl(trimmed) && !trimmed.startsWith('@') && !trimmed.includes('/')) {
          return `${platform} handle should start with @ or be a full URL`;
        }
      }
      return null;
    };

    const twitterError = validateSocialHandle(socialAccounts.twitter, 'Twitter');
    if (twitterError) errors.twitter = twitterError;

    const instagramError = validateSocialHandle(socialAccounts.instagram, 'Instagram');
    if (instagramError) errors.instagram = instagramError;

    const tiktokError = validateSocialHandle(socialAccounts.tiktok, 'TikTok');
    if (tiktokError) errors.tiktok = tiktokError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auto-validate when fields change
  useEffect(() => {
    const hasContent = Object.values(socialAccounts).some(value => value.trim() !== '');
    if (hasContent) {
      validateFields();
    }
  }, [socialAccounts]);

  // Count filled accounts
  const filledAccountsCount = Object.values(socialAccounts).filter(value => value.trim() !== '').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Social Media Accounts</h3>
          {required && <span className="text-red-400">*</span>}
        </div>
        {filledAccountsCount > 0 && (
          <span className="text-sm text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
            {filledAccountsCount} account{filledAccountsCount !== 1 ? 's' : ''} added
          </span>
        )}
      </div>

      <div className="bg-gray-800/30 rounded-xl p-6 space-y-6 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {platform.label}
                {required && platform.key === 'twitter' && <span className="text-red-400">*</span>}
              </label>
              <InputField
                placeholder={platform.placeholder}
                value={socialAccounts[platform.key]}
                onChange={(e) => handleFieldChange(platform.key, e.target.value)}
                error={fieldErrors[platform.key]}
                icon={platform.icon}
                required={required && platform.key === 'twitter'}
                disabled={disabled}
                type={platform.key === 'website' ? 'url' : 'text'}
              />
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-400 mb-2">Tips for adding social accounts:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• You can enter just the username (e.g., @johndoe) or the full URL</li>
            <li>• For websites, make sure to include https:// at the beginning</li>
            <li>• All fields are optional - only add the platforms you actively use</li>
            <li>• Use the "Other Platform" field for any additional social networks</li>
          </ul>
        </div>
      </div>

      {/* Overall Error Display */}
      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {error}
        </p>
      )}

      {/* JSON Preview (for debugging - remove in production) */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
        <h4 className="text-xs font-medium text-gray-400 mb-2">JSON Output Preview:</h4>
        <pre className="text-xs text-gray-300 font-mono bg-black/30 rounded p-2 overflow-x-auto">
          {JSON.stringify(socialAccounts, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SocialMediaAccountsComponent;