# Singnify API Client

A comprehensive TypeScript/JavaScript client for the Singnify backend API v2. This client provides a clean, type-safe interface for all Singnify API endpoints with built-in authentication, error handling, and event management.

## Features

✨ **Full TypeScript Support** - Complete type definitions for all API requests and responses  
🔐 **Automatic Authentication** - Handles token/passkey management and persistence  
📡 **Event-Driven** - Listen to authentication, upload, and error events  
🚀 **Promise-Based** - Modern async/await API  
🛡️ **Error Handling** - Comprehensive error types and handling  
💾 **State Persistence** - Automatic localStorage integration  
📦 **Singleton Pattern** - Shared instance across your application  
🔄 **Request Interceptors** - Automatic token injection and error handling  

## Installation

```bash
# Install dependencies
npm install axios
# or
yarn add axios
# or
pnpm add axios
```

Copy the `singnify-api-client.ts` file into your project:

```
src/
  services/
    singnify-api-client.ts
```

## Quick Start

### Basic Setup

```typescript
import singnifyApi from '@/services/singnify-api-client';

// The client is ready to use!
```

### Register & Login

```typescript
// Register new user
const member = await singnifyApi.register({
  EmailAddress: 'user@example.com',
  Password: 'SecurePassword123!',
  FirstName: 'John',
  LastName: 'Doe',
  Username: 'johndoe'
});

// Login
const response = await singnifyApi.login({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});

// Check authentication
if (singnifyApi.isAuthenticated) {
  console.log('Logged in as:', singnifyApi.currentUser?.Username);
}
```

### Upload Content

```typescript
// Upload cover art
const imageName = await singnifyApi.uploadCoverArt(
  file,
  true,
  (progress) => console.log(`${progress}%`)
);

// Save audio track
await singnifyApi.saveAudio({
  title: 'My New Song',
  fileUrl: 'https://example.com/song.mp3',
  coverArt: imageName,
  genre: 'Pop'
});
```

### Discover Content

```typescript
const results = await singnifyApi.discover({
  page: 1,
  limit: 20,
  genre: 'Pop'
});

console.log('Music:', results.result?.music);
console.log('Videos:', results.result?.videos);
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
# Next.js
NEXT_PUBLIC_SINGNIFY_API_URL=https://api.singnify.com

# Create React App
REACT_APP_SINGNIFY_API_URL=https://api.singnify.com

# Other
SINGNIFY_API_URL=https://api.singnify.com
```

### Custom Instance

```typescript
import { SingnifyApiClient } from '@/services/singnify-api-client';

const api = new SingnifyApiClient('https://custom-api-url.com');
```

## API Reference

### Authentication

| Method | Description |
|--------|-------------|
| `register(credentials)` | Register new user |
| `login(credentials)` | Login with email/password |
| `logout()` | Logout current user |
| `forgotPassword(email)` | Request password reset |
| `verifyOTP(request)` | Verify OTP for password reset |
| `resetPassword(request)` | Reset password with OTP |

### Profile Management

| Method | Description |
|--------|-------------|
| `updateProfile(updates)` | Update user profile |
| `updatePassword(request)` | Change user password |

### File Upload

| Method | Description |
|--------|-------------|
| `uploadImage(base64)` | Upload image as base64 |
| `uploadCoverArt(file, isCover, onProgress?)` | Upload cover art with progress |
| `fileToBase64(file)` | Convert File to base64 |

### Content Management

| Method | Description |
|--------|-------------|
| `saveAudio(data)` | Save audio track |
| `saveVideo(data)` | Save video |
| `saveFaceVideo(data)` | Save face video |
| `saveDanceVideo(data)` | Save dance video |

### Discovery

| Method | Description |
|--------|-------------|
| `discover(params?)` | Discover content |
| `showListings()` | Get listings |
| `displayCharts(params?)` | Get top charts |
| `displayGenres(params?)` | Get genres |

### Utility

| Method | Description |
|--------|-------------|
| `setToken(token, user?)` | Manually set auth token |
| `setPasskey(passkey, userId?)` | Manually set passkey |
| `clear()` | Clear all auth data |
| `get(url, config?)` | Generic GET request |
| `post(url, data?, config?)` | Generic POST request |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `boolean` | Check if user is logged in |
| `currentUser` | `Member \| null` | Current user data |
| `token` | `string \| null` | Current auth token |
| `passkey` | `string \| null` | Current passkey |
| `userId` | `string \| null` | Current user ID |

## Events

Listen to events using the EventEmitter pattern:

```typescript
// Authentication events
singnifyApi.on('auth:login', (user) => {
  console.log('User logged in:', user);
});

singnifyApi.on('auth:logout', () => {
  console.log('User logged out');
});

singnifyApi.on('auth:expired', () => {
  console.log('Session expired');
});

// Profile events
singnifyApi.on('profile:updated', (member) => {
  console.log('Profile updated:', member);
});

// Content events
singnifyApi.on('content:uploaded', (data) => {
  console.log('Content uploaded:', data);
});

// Error events
singnifyApi.on('error', (error) => {
  console.error('API error:', error);
});
```

### Cleanup

```typescript
// Remove listeners when component unmounts
const handler = (user) => console.log(user);
singnifyApi.on('auth:login', handler);

// Later...
singnifyApi.off('auth:login', handler);
```

## Error Handling

All API methods throw `SingnifyApiError` on failure:

```typescript
import { SingnifyApiError } from '@/services/singnify-api-client';

try {
  await singnifyApi.login(credentials);
} catch (error) {
  if (error instanceof SingnifyApiError) {
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
  }
}
```

### Error Properties

- `message` - Human-readable error message
- `statusCode` - HTTP status code (if available)
- `code` - Error code from API
- `details` - Additional error details

## TypeScript Support

### Types & Interfaces

All types are fully documented:

```typescript
import {
  Member,
  RegisterCredentials,
  LoginCredentials,
  UpdateProfileRequest,
  SaveAudioRequest,
  DiscoverResponse,
  // ... and many more
} from '@/services/singnify-api-client';
```

### Type-Safe Responses

```typescript
// TypeScript knows the response type
const member: Member = await singnifyApi.register(credentials);
const username: string = member.Username; // Type-safe!
```

## React Integration

### Custom Hook

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

  return { user, isAuthenticated };
}
```

### Usage in Component

```typescript
function MyComponent() {
  const { user, isAuthenticated } = useSingnifyAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard user={user} />;
}
```

## Advanced Usage

### Request Interceptors

The client automatically:
- Adds authorization headers
- Injects passkey into POST requests
- Adds request IDs for tracing
- Handles token expiration

### State Persistence

Auth state is automatically saved to `localStorage`:
- `singnify_token` - Auth token
- `singnify_passkey` - Passkey
- `singnify_user` - User data
- `singnify_user_id` - User ID

### Debug Mode

Enable trace logging:

```typescript
// Edit singnify-api-client.ts
const trace = true; // Set to true for debug logs
```

### Custom Requests

Use generic methods for custom endpoints:

```typescript
// GET request
const data = await singnifyApi.get('/api/v2/php/custom-endpoint.php');

// POST request
const result = await singnifyApi.post(
  '/api/v2/php/custom-endpoint.php',
  { customData: 'value' }
);
```

## Examples

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for comprehensive examples including:
- Complete authentication flows
- Profile management
- File uploads with progress
- Content discovery
- Error handling patterns
- React integration examples

## API Documentation

Based on the Singnify API Blueprint v2. See [BLUEPRINT.md](./BLUEPRINT.md) for detailed API documentation.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Uses `localStorage` for persistence
- Uses `EventEmitter` for events

## Security

### Best Practices

1. **Never expose tokens** - Tokens are stored in `localStorage`, handle with care
2. **Use HTTPS** - Always use HTTPS in production
3. **Validate input** - Validate all user input before sending to API
4. **Handle errors** - Always use try-catch blocks
5. **Clear sensitive data** - Use `logout()` to clear auth state

### CORS

Ensure your API server has proper CORS configuration:

```javascript
// Backend CORS example
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## Troubleshooting

### Common Issues

**"Network error: No response received"**
- Check API URL configuration
- Verify network connection
- Check if API server is running

**"401 Unauthorized"**
- Token may have expired
- Call `login()` again
- Check if user is authenticated

**File upload fails**
- Check file size limits
- Verify file format
- Ensure proper permissions

**CORS errors**
- Configure CORS on backend
- Check API URL in environment variables

## Migration Guide

### From Direct Axios Calls

```typescript
// Before
const response = await axios.post('https://api.singnify.com/api/v2/php/login.php', {
  email: 'user@example.com',
  password: 'password'
});

// After
const response = await singnifyApi.login({
  email: 'user@example.com',
  password: 'password'
});
```

### From Other API Clients

1. Replace all API calls with `singnifyApi` methods
2. Update error handling to use `SingnifyApiError`
3. Use provided types instead of custom interfaces
4. Replace manual auth management with built-in methods

## Contributing

Contributions are welcome! Please:

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update documentation
4. Test thoroughly

## License

[Your License Here]

## Support

For issues or questions:
- Check the [Usage Guide](./USAGE_GUIDE.md)
- Review the [API Blueprint](./BLUEPRINT.md)
- Open an issue in the repository

## Changelog

### v1.0.0 (2026-01-28)
- Initial release
- Complete API v2 support
- TypeScript types
- Event system
- Auto-persistence

---

**Built with ❤️ for the Singnify community**

*Last updated: January 28, 2026*
