# Singnify API Client - Usage Guide

This guide provides comprehensive examples and best practices for using the Singnify API Client.

## Table of Contents

1. [Installation](#installation)
2. [Basic Setup](#basic-setup)
3. [Authentication](#authentication)
4. [Profile Management](#profile-management)
5. [Content Upload](#content-upload)
6. [Discovery & Charts](#discovery--charts)
7. [Error Handling](#error-handling)
8. [Event Listeners](#event-listeners)
9. [TypeScript Examples](#typescript-examples)

---

## Installation

```bash
npm install axios
# or
yarn add axios
```

Copy the `singnify-api-client.ts` file into your project's `src/services/` directory.

---

## Basic Setup

### Importing the Client

```typescript
// Option 1: Use the singleton instance (recommended)
import singnifyApi from '@/services/singnify-api-client';

// Option 2: Create a custom instance
import { SingnifyApiClient } from '@/services/singnify-api-client';
const api = new SingnifyApiClient('https://your-api-url.com');

// Option 3: Get singleton with custom URL
import { getSingnifyApiClient } from '@/services/singnify-api-client';
const api = getSingnifyApiClient('https://your-api-url.com');
```

### Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_SINGNIFY_API_URL=https://api.singnify.com
# or
REACT_APP_SINGNIFY_API_URL=https://api.singnify.com
# or
SINGNIFY_API_URL=https://api.singnify.com
```

---

## Authentication

### Register New User

```typescript
import singnifyApi from '@/services/singnify-api-client';

async function handleRegister() {
  try {
    const member = await singnifyApi.register({
      EmailAddress: 'user@example.com',
      Password: 'SecurePassword123!',
      FirstName: 'John',
      LastName: 'Doe',
      Username: 'johndoe',
      Phone: '+1234567890',
      Country: 'US',
      Gender: 'Male',
      StageName: 'JD Artist',
      IsArtist: '1',
      RecordLabel: 'Independent'
    });

    console.log('Registration successful:', member);
    // User is automatically logged in after registration
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}
```

### Login

```typescript
async function handleLogin() {
  try {
    const response = await singnifyApi.login({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      provider: 'email' // optional
    });

    console.log('Login successful:', response);
    console.log('User ID:', response.user_id);
    console.log('Passkey:', response.passkey);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}
```

### Check Authentication Status

```typescript
// Check if user is authenticated
if (singnifyApi.isAuthenticated) {
  console.log('User is logged in');
  console.log('Current user:', singnifyApi.currentUser);
  console.log('User ID:', singnifyApi.userId);
}
```

### Forgot Password Flow

```typescript
// Step 1: Request password reset
async function requestPasswordReset(email: string) {
  try {
    const member = await singnifyApi.forgotPassword(email);
    console.log('Reset email sent to:', member.EmailAddress);
    // OTP will be sent to user's email
  } catch (error) {
    console.error('Failed to send reset email:', error.message);
  }
}

// Step 2: Verify OTP
async function verifyResetOTP(email: string, otp: string) {
  try {
    const member = await singnifyApi.verifyOTP({ email, otp });
    console.log('OTP verified for:', member.EmailAddress);
    return true;
  } catch (error) {
    console.error('OTP verification failed:', error.message);
    return false;
  }
}

// Step 3: Reset password
async function resetPassword(email: string, otp: string, newPassword: string) {
  try {
    const member = await singnifyApi.resetPassword({
      email,
      otp,
      password: newPassword
    });
    console.log('Password reset successful for:', member.Username);
  } catch (error) {
    console.error('Password reset failed:', error.message);
  }
}
```

### Logout

```typescript
async function handleLogout() {
  await singnifyApi.logout();
  console.log('User logged out');
}
```

---

## Profile Management

### Update Profile

```typescript
async function updateUserProfile() {
  try {
    const updatedMember = await singnifyApi.updateProfile({
      FirstName: 'Jane',
      LastName: 'Smith',
      StageName: 'Jane the Artist',
      About: 'Professional musician and songwriter',
      Country: 'US',
      Phone: '+1987654321',
      // Social media links
      Facebook: 'https://facebook.com/janeartist',
      Instagram: '@janeartist',
      Twitter: '@janeartist',
      YouTube: 'https://youtube.com/@janeartist'
    });

    console.log('Profile updated:', updatedMember);
  } catch (error) {
    console.error('Profile update failed:', error.message);
  }
}
```

### Update Password

```typescript
async function changePassword() {
  try {
    const member = await singnifyApi.updatePassword({
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword456!',
      confirmPassword: 'NewPassword456!'
    });

    console.log('Password updated for:', member.Username);
  } catch (error) {
    console.error('Password update failed:', error.message);
  }
}
```

---

## Content Upload

### Upload Profile Picture (Base64)

```typescript
async function uploadProfilePicture(imageFile: File) {
  try {
    // Convert file to base64
    const base64Image = await singnifyApi.fileToBase64(imageFile);
    
    // Upload image
    const imageName = await singnifyApi.uploadImage(base64Image);
    
    console.log('Image uploaded:', imageName);
    
    // Update profile with new picture
    await singnifyApi.updateProfile({
      Picture: imageName
    });
    
    console.log('Profile picture updated');
  } catch (error) {
    console.error('Failed to upload profile picture:', error.message);
  }
}
```

### Upload Cover Art (File)

```typescript
async function uploadSongCoverArt(file: File) {
  try {
    const imageName = await singnifyApi.uploadCoverArt(
      file,
      true, // is_cover
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
        // Update UI progress bar
      }
    );

    console.log('Cover art uploaded:', imageName);
    return imageName;
  } catch (error) {
    console.error('Failed to upload cover art:', error.message);
  }
}
```

### Save Audio Track

```typescript
async function uploadAudioTrack(audioData: {
  title: string;
  fileUrl: string;
  coverArt?: string;
}) {
  try {
    await singnifyApi.saveAudio({
      title: audioData.title,
      artist: singnifyApi.currentUser?.StageName,
      genre: 'Pop',
      fileUrl: audioData.fileUrl,
      coverArt: audioData.coverArt,
      duration: 180, // 3 minutes in seconds
      isExplicit: false,
      lyrics: 'Song lyrics here...'
    });

    console.log('Audio track saved successfully');
  } catch (error) {
    console.error('Failed to save audio:', error.message);
  }
}
```

### Save Video

```typescript
async function uploadVideo(videoData: {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
}) {
  try {
    await singnifyApi.saveVideo({
      title: videoData.title,
      artist: singnifyApi.currentUser?.StageName,
      videoUrl: videoData.videoUrl,
      thumbnailUrl: videoData.thumbnailUrl,
      duration: 240,
      description: 'Official music video'
    });

    console.log('Video saved successfully');
  } catch (error) {
    console.error('Failed to save video:', error.message);
  }
}
```

### Save Face Video / Dance Video

```typescript
async function uploadFaceVideo(videoData: SaveVideoRequest) {
  try {
    await singnifyApi.saveFaceVideo(videoData);
    console.log('Face video saved');
  } catch (error) {
    console.error('Failed to save face video:', error.message);
  }
}

async function uploadDanceVideo(videoData: SaveVideoRequest) {
  try {
    await singnifyApi.saveDanceVideo(videoData);
    console.log('Dance video saved');
  } catch (error) {
    console.error('Failed to save dance video:', error.message);
  }
}
```

---

## Discovery & Charts

### Discover Content

```typescript
async function discoverContent() {
  try {
    const results = await singnifyApi.discover({
      page: 1,
      limit: 20,
      genre: 'Pop',
      sortBy: 'trending'
    });

    console.log('Introductions:', results.introductions);
    console.log('Music:', results.result?.music);
    console.log('Videos:', results.result?.videos);
    console.log('Artists:', results.result?.artists);
  } catch (error) {
    console.error('Failed to fetch discover content:', error.message);
  }
}
```

### Show Listings

```typescript
async function fetchListings() {
  try {
    const listings = await singnifyApi.showListings();
    console.log('Listings:', listings);
  } catch (error) {
    console.error('Failed to fetch listings:', error.message);
  }
}
```

### Display Charts

```typescript
async function fetchTopCharts() {
  try {
    const charts = await singnifyApi.displayCharts({
      period: 'weekly',
      genre: 'all'
    });

    console.log('Top charts:', charts);
  } catch (error) {
    console.error('Failed to fetch charts:', error.message);
  }
}
```

### Display Genres

```typescript
async function fetchGenres() {
  try {
    const genres = await singnifyApi.displayGenres();
    console.log('Available genres:', genres);
  } catch (error) {
    console.error('Failed to fetch genres:', error.message);
  }
}
```

---

## Error Handling

### Basic Error Handling

```typescript
import { SingnifyApiError } from '@/services/singnify-api-client';

async function handleApiCall() {
  try {
    await singnifyApi.login({ email: 'user@example.com', password: 'pass' });
  } catch (error) {
    if (error instanceof SingnifyApiError) {
      console.error('API Error:', error.message);
      console.error('Status Code:', error.statusCode);
      console.error('Error Code:', error.code);
      console.error('Details:', error.details);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

### User-Friendly Error Messages

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof SingnifyApiError) {
    // Customize messages based on error code or status
    if (error.statusCode === 401) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.statusCode === 404) {
      return 'The requested resource was not found.';
    }
    if (error.code === 'NETWORK_ERROR') {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// Usage
async function loginWithErrorHandling(email: string, password: string) {
  try {
    await singnifyApi.login({ email, password });
  } catch (error) {
    const userMessage = getErrorMessage(error);
    alert(userMessage); // or show in UI
  }
}
```

---

## Event Listeners

### Listen to Authentication Events

```typescript
// Listen for login events
singnifyApi.on('auth:login', (user) => {
  console.log('User logged in:', user);
  // Redirect to dashboard, update UI, etc.
});

// Listen for logout events
singnifyApi.on('auth:logout', () => {
  console.log('User logged out');
  // Redirect to login page, clear state, etc.
});

// Listen for auth expiration
singnifyApi.on('auth:expired', () => {
  console.log('Session expired');
  // Show login modal, redirect to login, etc.
});
```

### Listen to Profile Updates

```typescript
singnifyApi.on('profile:updated', (member) => {
  console.log('Profile updated:', member);
  // Update UI with new profile data
});
```

### Listen to Content Uploads

```typescript
singnifyApi.on('content:uploaded', (data) => {
  console.log('Content uploaded:', data);
  // Show success message, update content list, etc.
});
```

### Listen to Errors

```typescript
singnifyApi.on('error', (error) => {
  console.error('API Error occurred:', error);
  // Log to error tracking service, show notification, etc.
});
```

### Remove Event Listeners

```typescript
// Create named handler function
const handleLogin = (user) => {
  console.log('Login handler:', user);
};

// Add listener
singnifyApi.on('auth:login', handleLogin);

// Remove listener when component unmounts
singnifyApi.off('auth:login', handleLogin);
```

---

## TypeScript Examples

### React Component with Authentication

```typescript
import React, { useState, useEffect } from 'react';
import singnifyApi, { Member, SingnifyApiError } from '@/services/singnify-api-client';

export function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Member | null>(null);

  useEffect(() => {
    // Check if already logged in
    if (singnifyApi.isAuthenticated) {
      setUser(singnifyApi.currentUser);
    }

    // Listen for auth events
    const handleLogin = (loggedInUser: Member) => {
      setUser(loggedInUser);
    };

    const handleLogout = () => {
      setUser(null);
    };

    singnifyApi.on('auth:login', handleLogin);
    singnifyApi.on('auth:logout', handleLogout);

    return () => {
      singnifyApi.off('auth:login', handleLogin);
      singnifyApi.off('auth:logout', handleLogout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await singnifyApi.login({ email, password });
    } catch (err) {
      if (err instanceof SingnifyApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div>
        <h2>Welcome, {user.FirstName}!</h2>
        <p>Username: {user.Username}</p>
        <button onClick={() => singnifyApi.logout()}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### React Hook for API

```typescript
import { useState, useEffect } from 'react';
import singnifyApi, { Member } from '@/services/singnify-api-client';

export function useSingnifyAuth() {
  const [user, setUser] = useState<Member | null>(singnifyApi.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(singnifyApi.isAuthenticated);

  useEffect(() => {
    const handleLogin = (loggedInUser: Member) => {
      setUser(loggedInUser);
      setIsAuthenticated(true);
    };

    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    singnifyApi.on('auth:login', handleLogin);
    singnifyApi.on('auth:logout', handleLogout);

    return () => {
      singnifyApi.off('auth:login', handleLogin);
      singnifyApi.off('auth:logout', handleLogout);
    };
  }, []);

  return {
    user,
    isAuthenticated,
    login: singnifyApi.login.bind(singnifyApi),
    logout: singnifyApi.logout.bind(singnifyApi),
    register: singnifyApi.register.bind(singnifyApi),
    updateProfile: singnifyApi.updateProfile.bind(singnifyApi)
  };
}

// Usage in component
function MyComponent() {
  const { user, isAuthenticated, login, logout } = useSingnifyAuth();

  // ... component logic
}
```

### Upload with Progress

```typescript
import React, { useState } from 'react';
import singnifyApi from '@/services/singnify-api-client';

export function CoverArtUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const imageName = await singnifyApi.uploadCoverArt(
        file,
        true,
        (uploadProgress) => {
          setProgress(uploadProgress);
        }
      );

      console.log('Upload successful:', imageName);
      alert('Cover art uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload cover art');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? `Uploading ${progress}%` : 'Upload'}
      </button>
      {uploading && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
```

---

## Best Practices

### 1. Always Handle Errors

```typescript
// ❌ Bad
await singnifyApi.login(credentials);

// ✅ Good
try {
  await singnifyApi.login(credentials);
} catch (error) {
  handleError(error);
}
```

### 2. Use Type Safety

```typescript
// ✅ Import and use types
import { RegisterCredentials, Member } from '@/services/singnify-api-client';

const credentials: RegisterCredentials = {
  EmailAddress: 'user@example.com',
  // TypeScript will ensure all required fields are present
};
```

### 3. Clean Up Event Listeners

```typescript
useEffect(() => {
  const handler = (user) => console.log(user);
  singnifyApi.on('auth:login', handler);
  
  return () => {
    singnifyApi.off('auth:login', handler);
  };
}, []);
```

### 4. Check Authentication Before API Calls

```typescript
async function fetchUserData() {
  if (!singnifyApi.isAuthenticated) {
    throw new Error('User must be logged in');
  }
  
  // Make authenticated API calls
}
```

### 5. Use Environment Variables

```typescript
// Never hardcode API URLs
const api = new SingnifyApiClient('https://hardcoded-url.com'); // ❌

// Use environment variables
const api = new SingnifyApiClient(process.env.NEXT_PUBLIC_SINGNIFY_API_URL); // ✅
```

---

## Advanced Usage

### Custom Request with Generic Methods

```typescript
// GET request
const data = await singnifyApi.get('/api/v2/php/custom-endpoint.php');

// POST request
const result = await singnifyApi.post('/api/v2/php/custom-endpoint.php', {
  customData: 'value'
});
```

### Manual Token Management

```typescript
// Get current token
const token = singnifyApi.token;

// Set token manually (e.g., after SSO)
singnifyApi.setToken('new-token', userData);

// Set passkey manually
singnifyApi.setPasskey('passkey', 'userId');
```

---

## Troubleshooting

### Issue: "Network error: No response received"
- Check your internet connection
- Verify the API URL is correct
- Check if the API server is running

### Issue: "401 Unauthorized"
- User token may have expired
- Call `login()` again or refresh the page

### Issue: File upload fails
- Check file size limits
- Verify file format is supported
- Ensure proper `Content-Type` header

### Issue: CORS errors in browser
- Configure CORS on the backend server
- Check API URL configuration

---

## Support

For issues or questions:
1. Check this documentation
2. Review the API Blueprint
3. Contact the API maintainer
4. Open an issue in the project repository

---

*Last updated: January 28, 2026*
