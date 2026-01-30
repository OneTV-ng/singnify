# SingnifyApiClient JavaScript SDK

A customizable, multiplatform JavaScript API client for Singnify. Supports web, Android, iOS, and Node.js (with fetch polyfill).

---

## Features
- Unified, simple interface for all Singnify API endpoints
- Standardized output: `{ status, success, message, feedback }`
- `feedback` is always JSON: object for single, array for multiple, or null
- Platform and client info auto-included in every request
- API key required for all requests
- Optionally extendable for new endpoints

---

## Installation

```js
// Browser
<script src="apiClient.js"></script>
// Node.js
const SingnifyApiClient = require('./apiClient');
```

---

## Usage

```js
const client = new SingnifyApiClient({
  apiKey: 'YOUR_API_KEY',
  platform: 'singnify', // default
  client: 'web',        // or 'android', 'ios', etc.
  baseUrl: 'https://app.singnify.com/api/v2/php/' // optional
});

// Register
client.register({ uname: 'user', ... }).then(console.log);

// Login
client.login({ id: 'email', password: '...' }).then(console.log);

// Show Listings
client.showListings().then(console.log);

// All responses:
// {
//   status: true/false,
//   success: true/false,
//   message: '...'
//   feedback: object | array | null
// }
```

---

## Output Format

- `status` and `success`: true if API call succeeded, false otherwise
- `message`: API response message
- `feedback`:
  - Single object (e.g., member, song, album)
  - Array (e.g., songs, listings, charts)
  - null if no feedback
- All other data (if any) is available in the raw response if you extend the client

---

## Extending

You can add new methods for new endpoints by following the pattern in the class. All requests auto-include `platform`, `client`, and `api_key`.

---

## Platform Compliance
- All requests include `platform` and `client` fields
- API key is required for every request
- Output is always JSON and standardized
- Ready for submission to app stores and web platforms

---

## Example

```js
const client = new SingnifyApiClient({ apiKey: 'abc', client: 'android' });
client.login({ id: 'me@example.com', password: 'pw' })
  .then(res => {
    if (res.success) {
      // Use res.feedback (member object)
    } else {
      alert(res.message);
    }
  });
```

---

## License
MIT
