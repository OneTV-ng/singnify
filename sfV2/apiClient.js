// Singnify API Client
// Customizable, multiplatform JavaScript API client for Singnify

class SingnifyApiClient {
  constructor({ apiKey, platform = 'singnify', client = 'web', baseUrl }) {
    if (!apiKey) throw new Error('API key is required');
    this.apiKey = apiKey;
    this.platform = platform;
    this.client = client;
    this.baseUrl = baseUrl || 'https://app.singnify.com/api/v2/php/';
  }

  // Helper to serialize output
  _serialize(response, feedbackKey = null) {
    const { status, message, ...rest } = response;
    const success = status === '200' || status === 200 || status === true || status === 'success';
    let feedback = null;
    if (feedbackKey && rest[feedbackKey]) {
      feedback = rest[feedbackKey];
    } else if (Array.isArray(rest.songs)) {
      feedback = rest.songs;
    } else if (rest.song) {
      feedback = rest.song;
    } else if (rest.album) {
      feedback = rest.album;
    } else if (rest.listings) {
      feedback = rest.listings;
    } else if (rest.charts) {
      feedback = rest.charts;
    } else if (rest.genres) {
      feedback = rest.genres;
    } else if (rest.result) {
      feedback = rest.result;
    } else if (rest.member) {
      feedback = rest.member;
    } else if (rest.member_data) {
      feedback = rest.member_data;
    } else {
      feedback = rest;
    }
    // Optionally, put all else in data:{} if configured
    return {
      status: !!success,
      success: !!success,
      message: message || '',
      feedback,
      // Optionally: data: rest (if needed, not default)
    };
  }

  // Generic POST request
  async _post(endpoint, body, feedbackKey = null) {
    const formData = new FormData();
    for (const key in body) {
      if (body[key] !== undefined && body[key] !== null) {
        formData.append(key, body[key]);
      }
    }
    formData.append('platform', this.platform);
    formData.append('client', this.client);
    formData.append('api_key', this.apiKey);
    const res = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    return this._serialize(json, feedbackKey);
  }

  // Generic GET request
  async _get(endpoint, params = {}, feedbackKey = null) {
    const url = new URL(this.baseUrl + endpoint);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    url.searchParams.append('platform', this.platform);
    url.searchParams.append('client', this.client);
    url.searchParams.append('api_key', this.apiKey);
    const res = await fetch(url, { method: 'GET' });
    const json = await res.json();
    return this._serialize(json, feedbackKey);
  }

  // Example endpoint methods
  async register(data) {
    return this._post('register.php', data, 'member');
  }
  async login(data) {
    return this._post('login.php', data, 'member_data');
  }
  async forgotPassword(data) {
    return this._post('forgot-password.php', data, 'member');
  }
  async verifyOtpForgotPassword(data) {
    return this._post('verify-otp-forgot-password.php', data, 'member');
  }
  async resetPassword(data) {
    return this._post('reset-password.php', data, 'member');
  }
  async uploadImageBase64(data) {
    return this._post('upload-photo.php', data, 'imageName');
  }
  async uploadCoverArt(data) {
    return this._post('upload-cover-art.php', data, 'imageName');
  }
  async updateProfile(data) {
    return this._post('update-profile.php', data, 'member');
  }
  async updatePassword(data) {
    return this._post('update-password.php', data, 'member');
  }
  async discover(data) {
    return this._post('discover.php', data, 'result');
  }
  async saveAudio(data) {
    return this._post('save-audio.php', data);
  }
  async saveVideo(data) {
    return this._post('save-video.php', data);
  }
  async saveFaceVideo(data) {
    return this._post('save-facevideo.php', data);
  }
  async saveDanceVideo(data) {
    return this._post('save-dancevideo.php', data);
  }
  async showListings(params = {}) {
    return this._get('show-listings.php', params, 'listings');
  }
  async displayCharts(data) {
    return this._post('display-charts.php', data, 'charts');
  }
  async displayGenres(data) {
    return this._post('display-genres.php', data, 'genres');
  }
}

// Export for use in browser or Node.js (with fetch polyfill)
if (typeof module !== 'undefined') module.exports = SingnifyApiClient;
if (typeof window !== 'undefined') window.SingnifyApiClient = SingnifyApiClient;
