// src/services/singnify-api-client.ts
// Singnify API Client - Comprehensive client for interacting with the Singnify backend
// Based on API Blueprint v2



import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { EventEmitter } from 'events';

const trace = true;

// ============ CORE TYPES ============

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// ============ MEMBER/USER TYPES ============

export interface Member {
  ID: string;
  Username: string;
  EmailAddress: string;
  Password: string;
  Active: string;
  TimeNumber: string;
  OAuthProvider: string;
  OAuthUID: string;
  FirstName: string;
  LastName: string;
  Picture: string;
  Gender: string;
  Locale: string | null;
  Created: string | null;
  Modified: string | null;
  Link: string | null;
  Phone: string;
  Country: string;
  Facebook: string | null;
  Twitter: string | null;
  Instagram: string | null;
  YouTube: string | null;
  StageName: string;
  Suspension: string | null;
  Referrer: string;
  ReferralAmount: string | null;
  Membership: string | null;
  MembershipDeadline: string | null;
  ActiveMembership: string | null;
  IsServiceCharge: string | null;
  ServiceChargeAmount: string | null;
  IsMonthCharge: string | null;
  MonthChargeAmount: string | null;
  MonthChargePayTime: string | null;
  MonthChargeExpireTime: string | null;
  Contract: string;
  IsVerified: string | null;
  Signature: string | null;
  SignedContract: string | null;
  LatestNoteID: string | null;
  RecordLabel: string;
  WithdrawnPoints: string | null;
  TotalPointsEarned: string | null;
  IsPaused: string;
  PointRoyalty: string | null;
  StripeCustomerID: string | null;
  About: string;
  FCMToken: string | null;
  IsArtist: string;
  OTP: string | null;
  Token: string;
}

// ============ AUTH TYPES ============

export interface RegisterCredentials {
  EmailAddress: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Username: string;
  Phone?: string;
  Country?: string;
  Gender?: string;
  StageName?: string;
  Referrer?: string;
  IsArtist?: string;
  RecordLabel?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  provider?: string;
}

export interface LoginResponse extends ApiResponse {
  link?: string;
  user_id?: string;
  passkey?: string;
  email?: string;
  uname?: string;
  provider?: string;
  uid?: string;
  member_data?: Member;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

// ============ PROFILE TYPES ============

export interface UpdateProfileRequest {
  FirstName?: string;
  LastName?: string;
  Username?: string;
  Phone?: string;
  Country?: string;
  Gender?: string;
  StageName?: string;
  Facebook?: string;
  Twitter?: string;
  Instagram?: string;
  YouTube?: string;
  About?: string;
  RecordLabel?: string;
  Picture?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============ UPLOAD TYPES ============

export interface UploadImageResponse extends ApiResponse {
  imageName?: string;
}

export interface UploadCoverArtResponse extends ApiResponse {
  imageName?: string;
}

// ============ CONTENT TYPES ============

export interface SaveAudioRequest {
  title: string;
  artist?: string;
  genre?: string;
  fileUrl: string;
  coverArt?: string;
  duration?: number;
  isExplicit?: boolean;
  lyrics?: string;
  [key: string]: any;
}

export interface SaveVideoRequest {
  title: string;
  artist?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  description?: string;
  [key: string]: any;
}

export interface DiscoverParams {
  page?: number;
  limit?: number;
  genre?: string;
  sortBy?: string;
  [key: string]: any;
}

export interface DiscoverResponse extends ApiResponse {
  introductions?: any[];
  result?: {
    music?: any[];
    videos?: any[];
    artists?: any[];
    [key: string]: any;
  };
}

// ============ ERROR CLASS ============

export class SingnifyApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SingnifyApiError';
  }
}

// ============ EVENT TYPES ============

export type SingnifyApiEvent =
  | 'auth:login'
  | 'auth:logout'
  | 'auth:expired'
  | 'profile:updated'
  | 'content:uploaded'
  | 'error';

/**
 * Singnify API Client
 * A comprehensive client for interacting with the Singnify backend API v2
 */
export class SingnifyApiClient extends EventEmitter {
  private client: AxiosInstance;
  private baseURL: string;
  private readonly API_KEY: string;

  // Storage keys
  private readonly TOKEN_KEY = 'singnify_token';
  private readonly PASSKEY_KEY = 'singnify_passkey';
  private readonly USER_KEY = 'singnify_user';
  private readonly USER_ID_KEY = 'singnify_user_id';

  // Current state
  private _token: string | null = null;
  private _passkey: string | null = null;
  private _user: Member | null = null;
  private _userId: string | null = null;

  constructor(
    baseURL: string =
      (typeof process !== 'undefined' &&
        (process.env.NEXT_PUBLIC_SINGNIFY_API_URL ||
          process.env.REACT_APP_SINGNIFY_API_URL ||
          process.env.SINGNIFY_API_URL)) ||
      'https://singnify.com'
  ) {
    super();
    this.baseURL = baseURL;
    this.API_KEY = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PLATFORM_API_KEY) || '7c6a180b36896a0a8c02787eeafb0e4c';

    if (trace) {
      console.log(`SingnifyApiClient initialized with baseURL: ${this.baseURL}`);
    }

    // Initialize axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Load saved auth state
    this.loadAuthState();

    // Setup interceptors
    this.setupInterceptors();
  }

  // ============ PRIVATE METHODS ============

  /**
   * Setup axios interceptors for request/response handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add API_KEY to all requests as query parameter
        if (config.url) {
          const separator = config.url.includes('?') ? '&' : '?';
          config.url = `${config.url}${separator}API_KEY=${this.API_KEY}`;
        }

        // Convert POST requests to FormData for API compatibility
        if (config.method?.toLowerCase() === 'post') {
          const form = new FormData();

          // Add token to FormData (matching server implementation)
          if (this._token) {
            form.append('token', this._token);
          }

          // Add existing data if present
          if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
            Object.entries(config.data).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                form.append(key, String(value));
              }
            });
          }

          // Add passkey if available
          if (this._passkey) {
            form.append('passkey', this._passkey);
          }

          config.data = form;
          // Remove Content-Type header to let axios set it with boundary
          delete config.headers['Content-Type'];
        } else if (this._token) {
          // For non-POST requests, use Authorization header
          config.headers.Authorization = `Bearer ${this._token}`;
        }

        if (trace) {
          console.log(`[${config.method?.toUpperCase()}] ${config.url}`, config.data);
        }

        return config;
      },
      (error) => {
        this.emit('error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (trace) {
          console.log(`Response:`, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.clearAuth();
          this.emit('auth:expired');
        }

        // Format error
        const apiError = this.formatError(error);
        this.emit('error', apiError);

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Format axios error to SingnifyApiError
   */
  private formatError(error: AxiosError): SingnifyApiError {
    if (error.response) {
      const data = error.response.data as any;
      return new SingnifyApiError(
        data?.message || error.message,
        error.response.status,
        data?.code,
        data
      );
    }

    if (error.request) {
      return new SingnifyApiError('Network error: No response received');
    }

    return new SingnifyApiError(error.message);
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load auth state from storage
   */
  private loadAuthState(): void {
    if (typeof window !== 'undefined') {
      try {
        this._token = localStorage.getItem(this.TOKEN_KEY);
        this._passkey = localStorage.getItem(this.PASSKEY_KEY);
        this._userId = localStorage.getItem(this.USER_ID_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);

        if (userStr) this._user = JSON.parse(userStr);

        if (trace && this._user) {
          console.log('Auth state loaded:', {
            userId: this._userId,
            username: this._user.Username,
          });
        }
      } catch (error) {
        console.warn('Failed to load auth state:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * Save auth state to storage
   */
  private saveAuthState(): void {
    if (typeof window !== 'undefined') {
      try {
        if (this._token) {
          localStorage.setItem(this.TOKEN_KEY, this._token);
        } else {
          localStorage.removeItem(this.TOKEN_KEY);
        }

        if (this._passkey) {
          localStorage.setItem(this.PASSKEY_KEY, this._passkey);
        } else {
          localStorage.removeItem(this.PASSKEY_KEY);
        }

        if (this._userId) {
          localStorage.setItem(this.USER_ID_KEY, this._userId);
        } else {
          localStorage.removeItem(this.USER_ID_KEY);
        }

        if (this._user) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(this._user));
        } else {
          localStorage.removeItem(this.USER_KEY);
        }
      } catch (error) {
        console.warn('Failed to save auth state:', error);
      }
    }
  }

  /**
   * Clear auth state
   */
  private clearAuth(): void {
    this._token = null;
    this._passkey = null;
    this._user = null;
    this._userId = null;
    this.saveAuthState();
  }

  /**
   * Format name helper
   */
  private formatName(first: string, last: string): string {
    const format = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return `${format(first)} ${format(last)}`;
  }

  // ============ PUBLIC GETTERS ============

  /**
   * Get current authentication state
   */
  get isAuthenticated(): boolean {
    return !!(this._token || this._passkey) && !!this._user;
  }

  /**
   * Get current user
   */
  get currentUser(): Member | null {
    return this._user;
  }

  /**
   * Get auth token
   */
  get token(): string | null {
    return this._token;
  }

  /**
   * Get passkey
   */
  get passkey(): string | null {
    return this._passkey;
  }

  /**
   * Get user ID
   */
  get userId(): string | null {
    return this._userId;
  }

  // ============ AUTHENTICATION METHODS ============

  /**
   * Register new user
   * POST /api/v2/php/register.php
   */
  async register(credentials: RegisterCredentials): Promise<Member> {
    if (trace) {
      console.log('Register credentials:', credentials);
    }

    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/register.php',
      credentials
    );

    if (trace) {
      console.log('Register response:', response.data);
    }

    if (response.data.status === 'success' && response.data.data?.member) {
      const member = response.data.data.member;
      this._user = member;
      this._token = member.Token;
      this._userId = member.ID;
      this.saveAuthState();
      this.emit('auth:login', member);
      return member;
    }

    throw new SingnifyApiError(response.data.message || 'Registration failed');
  }

  /**
   * Login with email and password
   * POST /api/v2/php/login.php
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (trace) {
      console.log('Login credentials:', credentials);
    }

    const response = await this.client.post<LoginResponse>(
      '/api/v2/php/login.php',
      credentials
    );

    if (trace) {
      console.log('Login response:', response.data);
    }

    if (response.data.status === 'success') {
      const { member_data, passkey, user_id } = response.data;

      if (member_data) {
        this._user = member_data;
        this._token = member_data.Token;
      }

      if (passkey) {
        this._passkey = passkey;
      }

      if (user_id) {
        this._userId = user_id;
      }

      this.saveAuthState();
      this.emit('auth:login', this._user);

      return response.data;
    }

    throw new SingnifyApiError(response.data.message || 'Login failed');
  }

  /**
   * Request password reset
   * POST /api/v2/php/forgot-password.php
   */
  async forgotPassword(email: string): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/forgot-password.php',
      { email }
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      return response.data.data.member;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to send reset email');
  }

  /**
   * Verify OTP for password reset
   * POST /api/v2/php/verify-otp-forgot-password.php
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/verify-otp-forgot-password.php',
      request
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      return response.data.data.member;
    }

    throw new SingnifyApiError(response.data.message || 'OTP verification failed');
  }

  /**
   * Reset password with OTP
   * POST /api/v2/php/reset-password.php
   */
  async resetPassword(request: ResetPasswordRequest): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/reset-password.php',
      request
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      return response.data.data.member;
    }

    throw new SingnifyApiError(response.data.message || 'Password reset failed');
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    this.clearAuth();
    this.emit('auth:logout');
  }

  // ============ PROFILE METHODS ============

  /**
   * Update user profile
   * POST /api/v2/php/update-profile.php
   */
  async updateProfile(updates: UpdateProfileRequest): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/update-profile.php',
      updates
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      this._user = response.data.data.member;
      this.saveAuthState();
      this.emit('profile:updated', this._user);
      return this._user;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update profile');
  }

  /**
   * Update password
   * POST /api/v2/php/update-password.php
   */
  async updatePassword(request: UpdatePasswordRequest): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/update-password.php',
      request
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      return response.data.data.member;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update password');
  }

  // ============ UPLOAD METHODS ============

  /**
   * Upload image as base64
   * POST /api/v2/php/upload-photo.php
   */
  async uploadImage(imageBase64: string): Promise<string> {
    const response = await this.client.post<UploadImageResponse>(
      '/api/v2/php/upload-photo.php',
      { image: imageBase64 }
    );

    if (response.data.status === 'success' && response.data.imageName) {
      return response.data.imageName;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to upload image');
  }

  /**
   * Upload cover art
   * POST /api/v2/php/upload-cover-art.php
   */
  async uploadCoverArt(
    file: File,
    isCover: boolean = true,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_cover', isCover ? '1' : '0');

    const response = await this.client.post<UploadCoverArtResponse>(
      '/api/v2/php/upload-cover-art.php',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    if (response.data.status === 'success' && response.data.imageName) {
      return response.data.imageName;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to upload cover art');
  }

  /**
   * Convert file to base64
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ============ CONTENT METHODS ============

  /**
   * Save audio track
   * POST /api/v2/php/save-audio.php
   */
  async saveAudio(data: SaveAudioRequest): Promise<void> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/save-audio.php',
      data
    );

    if (response.data.status === 'success') {
      this.emit('content:uploaded', { type: 'audio', data });
      return;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to save audio');
  }

  /**
   * Save video
   * POST /api/v2/php/save-video.php
   */
  async saveVideo(data: SaveVideoRequest): Promise<void> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/save-video.php',
      data
    );

    if (response.data.status === 'success') {
      this.emit('content:uploaded', { type: 'video', data });
      return;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to save video');
  }

  /**
   * Save face video
   * POST /api/v2/php/save-facevideo.php
   */
  async saveFaceVideo(data: SaveVideoRequest): Promise<void> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/save-facevideo.php',
      data
    );

    if (response.data.status === 'success') {
      this.emit('content:uploaded', { type: 'facevideo', data });
      return;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to save face video');
  }

  /**
   * Save dance video
   * POST /api/v2/php/save-dancevideo.php
   */
  async saveDanceVideo(data: SaveVideoRequest): Promise<void> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/save-dancevideo.php',
      data
    );

    if (response.data.status === 'success') {
      this.emit('content:uploaded', { type: 'dancevideo', data });
      return;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to save dance video');
  }

  // ============ DASHBOARD/STATS METHODS ============

  /**
   * Get user tracks
   * POST /api/v2/php/get-user-tracks.php
   */
  async getUserTracks(): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/get-user-tracks.php',
      {}
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch user tracks');
  }

  /**
   * Get user albums
   * POST /api/v2/php/get-user-albums.php
   */
  async getUserAlbums(): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/get-user-albums.php',
      {}
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result || response.data.albums || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch user albums');
  }

  /**
   * Get user likes
   * POST /api/v2/php/get-user-likes.php
   */
  async getUserLikes(): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/get-user-likes.php',
      {}
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch user likes');
  }

  /**
   * Unlike a track
   * POST /api/v2/php/unlike-track.php
   */
  async unlikeTrack(trackId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/unlike-track.php',
      { track_id: trackId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result === true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to unlike track');
  }

  /**
   * Bulk unlike multiple tracks
   * Calls unlikeTrack for each track ID
   */
  async bulkUnlikeTrack(trackIds: string[]): Promise<boolean> {
    if (trackIds.length === 0) return true;

    try {
      const results = await Promise.all(
        trackIds.map(id => this.unlikeTrack(id))
      );
      return results.every(r => r === true);
    } catch (error: any) {
      throw new SingnifyApiError(
        error.message || 'Failed to unlike one or more tracks'
      );
    }
  }

  /**
   * Get user playlists
   * POST /api/v2/php/get-user-playlists.php
   */
  async getUserPlaylists(): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/get-user-playlists.php',
      {}
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch playlists');
  }

  /**
   * Create a new playlist
   * POST /api/v2/php/create-playlist.php
   */
  async createPlaylist(name: string): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/create-playlist.php',
      { playlist_name: name }
    );

    if ((response.data.status === '200' || response.data.status === 'success') && response.data.message === 'success') {
      return response.data.result || response.data.playlist;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to create playlist');
  }

  /**
   * Add tracks to a playlist
   * POST /api/v2/php/append-playlist.php (per-track)
   */
  async addTracksToPlaylist(
    playlistId: string,
    tracks: Array<{ id: string; data_id: string; base: string; base_id: string }>
  ): Promise<boolean> {
    try {
      const results = await Promise.all(
        tracks.map(track =>
          this.client.post<any>(
            '/api/v2/php/append-playlist.php',
            {
              playlist_id: playlistId,
              music_id: track.id,
              data_id: track.data_id,
              base: track.base,
              base_id: track.base_id
            }
          )
        )
      );

      return results.every(r =>
        (r.data.status === '200' || r.data.status === 'success') &&
        r.data.message === 'success'
      );
    } catch (error: any) {
      throw new SingnifyApiError(
        error.message || 'Failed to add tracks to playlist'
      );
    }
  }

  /**
   * Get user statistics
   * POST /api/v2/php/get-user-stats.php
   */
  async getUserStats(): Promise<any> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-user-stats.php',
        {}
      );

      if (response.data.status === '200' || response.data.status === 'success') {
        return response.data.stats || response.data.data || {};
      }

      throw new SingnifyApiError(response.data.message || 'Failed to fetch user stats');
    } catch (error: any) {
      // Return empty stats if endpoint doesn't exist yet
      console.warn('Stats endpoint not available:', error.message);
      return {};
    }
  }

  /**
   * Get user earnings/royalties
   * POST /api/v2/php/get-user-earnings.php
   */
  async getUserEarnings(): Promise<any> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-user-earnings.php',
        {}
      );

      if (response.data.status === '200' || response.data.status === 'success') {
        return response.data.earnings || response.data.data || {};
      }

      throw new SingnifyApiError(response.data.message || 'Failed to fetch user earnings');
    } catch (error: any) {
      // Return empty earnings if endpoint doesn't exist yet
      console.warn('Earnings endpoint not available:', error.message);
      return {};
    }
  }

  /**
   * Calculate dashboard stats from tracks
   */
  async calculateDashboardStats(): Promise<{
    totalStreams: string;
    monthlyListeners: string;
    totalEarnings: string;
    songsUploaded: number;
  }> {
    try {
      const tracks = await this.getUserTracks();

      // Calculate total streams
      const totalPlays = tracks.reduce((sum, track) => {
        const plays = parseInt(track.no_plays || track.Play || '0');
        return sum + plays;
      }, 0);

      // Calculate earnings (example rate: $0.003 per stream)
      const earningsRate = 0.003;
      const totalEarnings = totalPlays * earningsRate;

      // Format numbers
      const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
      };

      return {
        totalStreams: formatNumber(totalPlays),
        monthlyListeners: formatNumber(Math.floor(totalPlays * 0.3)), // Estimate
        totalEarnings: '$' + totalEarnings.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        songsUploaded: tracks.length,
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalStreams: '0',
        monthlyListeners: '0',
        totalEarnings: '$0',
        songsUploaded: 0,
      };
    }
  }

  // ============ DISCOVERY METHODS ============

  /**
   * Discover content
   * POST /api/v2/php/discover.php
   */
  async discover(params?: DiscoverParams): Promise<DiscoverResponse> {
    const response = await this.client.post<DiscoverResponse>(
      '/api/v2/php/discover.php',
      params || {}
    );

    if (response.data.status === 'success') {
      return response.data;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch discover content');
  }

  /**
   * Show listings
   * GET /api/v2/php/show-listings.php
   */
  async showListings(): Promise<any> {
    const response = await this.client.get<ApiResponse>(
      '/api/v2/php/show-listings.php'
    );

    if (response.data.status === 'success') {
      return response.data.data;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch listings');
  }

  /**
   * Display charts (Top Weekly)
   * POST /api/v2/php/display-charts.php
   */
  async displayCharts(params?: any): Promise<any> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/display-charts.php',
      params || {}
    );

    if (response.data.status === 'success') {
      return response.data.data;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch charts');
  }

  /**
   * Display genres
   * POST /api/v2/php/display-genres.php
   */
  async displayGenres(params?: any): Promise<any> {
    const response = await this.client.post<ApiResponse>(
      '/api/v2/php/display-genres.php',
      params || {}
    );

    if (response.data.status === 'success') {
      return response.data.data;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch genres');
  }

  // ============ UTILITY METHODS ============

  /**
   * Set auth token manually
   */
  setToken(token: string, user?: Member): void {
    this._token = token;
    if (user) {
      this._user = user;
      this._userId = user.ID;
    }
    this.saveAuthState();
  }

  /**
   * Clear token (for unauthenticated requests)
   */
  clearToken(): void {
    this._token = '';
  }

  /**
   * Set passkey manually
   */
  setPasskey(passkey: string, userId?: string): void {
    this._passkey = passkey;
    if (userId) {
      this._userId = userId;
    }
    this.saveAuthState();
  }

  /**
   * Clear auth and storage
   */
  clear(): void {
    this.clearAuth();
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);

    if (response.data.status === 'success') {
      return response.data.data as T;
    }

    throw new SingnifyApiError(response.data.message || 'Request failed');
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);

    if (response.data.status === 'success') {
      return response.data.data as T;
    }

    throw new SingnifyApiError(response.data.message || 'Request failed');
  }

  /**
   * Get featured music by platform
   * POST /api/v2/php/discover.php
   */
  async getDiscovery(type: string = 'most recent'): Promise<any> {
    console.log(`🌐 API: Calling getDiscovery with type: "${type}"`);
    // Build request body conditionally:
    // If type is empty/blank, omit it from body to get FULL discover with introductions
    // Otherwise include the type parameter for filtered results
    const body: any = {};
    if (type && type.trim() !== '') {
      body.type = type;
    }

    const response = await this.client.post<any>(
      '/api/v2/php/discover.php',
      body
    );

    console.log(`📨 API Discovery Raw Response:`, response.data);

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      // For full discover (no type), return full response. For type-specific, return result
      const result = !type || type.trim() === '' ? response.data : (response.data.result || {});
      console.log(`✅ API Discovery Parsed Result:`, result);
      return result;
    }

    console.error(`❌ API Discovery Error:`, response.data.message);
    throw new SingnifyApiError(response.data.message || 'Failed to fetch discovery');
  }

  /**
   * Search across music, artists, albums
   * POST /api/v2/php/search.php
   */
  async searchContent(query: string): Promise<any> {
    console.log(`🌐 API: Calling searchContent with query: "${query}"`);
    const response = await this.client.post<any>(
      '/api/v2/php/search.php',
      { q: query }
    );

    console.log(`📨 API Search Raw Response:`, response.data);

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      const result = response.data.result || {};
      console.log(`✅ API Search Parsed Result:`, result);
      return result;
    }

    console.error(`❌ API Search Error:`, response.data.message);
    throw new SingnifyApiError(response.data.message || 'Failed to search');
  }

  /**
   * Get top tracks globally
   * GET /api/v2/php/top-tracks.php
   */
  async getTopTracks(): Promise<any[]> {
    console.log(`🌐 API: Calling getTopTracks`);
    const response = await this.client.get<any>(
      '/api/v2/php/top-tracks.php'
    );

    console.log(`📨 API Top Tracks Raw Response:`, response.data);

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      const result = response.data.result || [];
      console.log(`✅ API Top Tracks Parsed Result:`, result);
      return result;
    }

    console.error(`❌ API Top Tracks Error:`, response.data.message);
    throw new SingnifyApiError(response.data.message || 'Failed to fetch top tracks');
  }

  /**
   * Get charts for period/category
   * POST /api/v2/php/charts.php
   */
  async getCharts(type: string = 'Weekly', name?: string): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/charts.php',
      { type, name }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch charts');
  }

  /**
   * Get music by genre
   * POST /api/v2/php/genres.php
   */
  async getMusicByGenre(genreName: string): Promise<any[]> {
    console.log(`🌐 API: Calling getMusicByGenre with genre: "${genreName}"`);
    const response = await this.client.post<any>(
      '/api/v2/php/genres.php',
      { type: 'All', name: genreName }
    );

    console.log(`📨 API Genre Music Raw Response:`, response.data);

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      const result = response.data.result || [];
      console.log(`✅ API Genre Music Parsed Result:`, result);
      return result;
    }

    console.error(`❌ API Genre Music Error:`, response.data.message);
    throw new SingnifyApiError(response.data.message || 'Failed to fetch genre music');
  }

  /**
   * Get all genres
   * POST /api/v2/php/genres.php
   */
  async getAllGenres(): Promise<string[]> {
    console.log(`🌐 API: Calling getAllGenres`);
    const response = await this.client.post<any>(
      '/api/v2/php/genres.php',
      { type: 'All' }
    );

    console.log(`📨 API Genres Raw Response:`, response.data);

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      const genres = response.data.genres || [];
      console.log(`✅ API Genres Parsed Result:`, genres);
      return genres;
    }

    console.error(`❌ API Genres Error:`, response.data.message);
    throw new SingnifyApiError(response.data.message || 'Failed to fetch genres');
  }

  /**
   * Get all featured artists
   * POST /api/v2/php/artists.php
   */
  async getArtists(): Promise<any[]> {
    console.log(`🌐 API: Calling getArtists`);
    try {
      // Try with empty body first (API might return all artists by default)
      const response = await this.client.post<any>(
        '/api/v2/php/artists.php',
        {}
      );

      console.log(`📨 API Artists Raw Response:`, response.data);

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        const result = response.data.result || [];
        console.log(`✅ API Artists Parsed Result:`, result);
        return result;
      }

      console.error(`❌ API Artists Error:`, response.data.message);
      throw new SingnifyApiError(response.data.message || 'Failed to fetch artists');
    } catch (err: any) {
      console.error(`❌ API Artists Full Error:`, err);
      throw err;
    }
  }

  /**
   * Get available browsable listings
   * GET /api/v2/php/listings.php
   */
  async getListings(): Promise<any> {
    const response = await this.client.get<any>(
      '/api/v2/php/listings.php'
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch listings');
  }

  /**
   * Get hot news/announcements
   * POST /api/v2/php/hotnews.php
   */
  async getHotNews(): Promise<any[]> {
    const response = await this.client.post<any>(
      '/api/v2/php/hotnews.php',
      {}
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || [];
    }

    throw new SingnifyApiError(response.data.message || 'Failed to fetch news');
  }

  // ============ BANK ACCOUNT METHODS ============

  /**
   * Get user bank accounts
   * POST /api/v2/php/get-bank-accounts.php
   */
  async getBankAccounts(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-bank-accounts.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.accounts || [];
      }

      return [];
    } catch (error) {
      console.warn('Bank accounts endpoint not available');
      return [];
    }
  }

  /**
   * Add bank account
   * POST /api/v2/php/add-bank-account.php
   */
  async addBankAccount(data: {
    account_holder_name: string;
    account_type: string;
    routing_number: string;
    account_number: string;
    is_default?: boolean;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/add-bank-account.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.account;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to add bank account');
  }

  /**
   * Update bank account
   * POST /api/v2/php/update-bank-account.php
   */
  async updateBankAccount(accountId: string, data: any): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/update-bank-account.php',
      { account_id: accountId, ...data }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.account;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update bank account');
  }

  /**
   * Delete bank account
   * POST /api/v2/php/delete-bank-account.php
   */
  async deleteBankAccount(accountId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/delete-bank-account.php',
      { account_id: accountId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to delete bank account');
  }

  // ============ PROMOTIONS METHODS ============

  /**
   * Get user promotions/campaigns
   * POST /api/v2/php/get-promotions.php
   */
  async getPromotions(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-promotions.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.promotions || [];
      }

      return [];
    } catch (error) {
      console.warn('Promotions endpoint not available');
      return [];
    }
  }

  /**
   * Create promotion campaign
   * POST /api/v2/php/create-promotion.php
   */
  async createPromotion(data: {
    title: string;
    description?: string;
    image?: string;
    start_date?: string;
    end_date?: string;
    type?: string;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/create-promotion.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.promotion;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to create promotion');
  }

  /**
   * Update promotion
   * POST /api/v2/php/update-promotion.php
   */
  async updatePromotion(promotionId: string, data: any): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/update-promotion.php',
      { promotion_id: promotionId, ...data }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.promotion;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update promotion');
  }

  /**
   * Delete promotion
   * POST /api/v2/php/delete-promotion.php
   */
  async deletePromotion(promotionId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/delete-promotion.php',
      { promotion_id: promotionId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to delete promotion');
  }

  // ============ VIDEO METHODS ============

  /**
   * Get user videos (face videos, dance videos, etc.)
   * POST /api/v2/php/get-videos.php
   */
  async getVideos(type?: string): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-videos.php',
        type ? { type } : {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.videos || [];
      }

      return [];
    } catch (error) {
      console.warn('Videos endpoint not available');
      return [];
    }
  }

  /**
   * Get face videos
   * POST /api/v2/php/get-face-videos.php
   */
  async getFaceVideos(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-face-videos.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.videos || [];
      }

      return [];
    } catch (error) {
      console.warn('Face videos endpoint not available');
      return [];
    }
  }

  /**
   * Update video details
   * POST /api/v2/php/update-video.php
   */
  async updateVideo(videoId: string, data: any): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/update-video.php',
      { video_id: videoId, ...data }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.video;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update video');
  }

  /**
   * Delete video
   * POST /api/v2/php/delete-video.php
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/delete-video.php',
      { video_id: videoId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to delete video');
  }

  // ============ POINTS/EARNINGS METHODS ============

  /**
   * Get user points and earnings
   * POST /api/v2/php/get-user-points.php
   */
  async getUserPoints(): Promise<any> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-user-points.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.points || {};
      }

      return { total_points: 0, withdrawn_points: 0, available_points: 0 };
    } catch (error) {
      console.warn('Points endpoint not available');
      return { total_points: 0, withdrawn_points: 0, available_points: 0 };
    }
  }

  /**
   * Get points history
   * POST /api/v2/php/get-points-history.php
   */
  async getPointsHistory(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-points-history.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.history || [];
      }

      return [];
    } catch (error) {
      console.warn('Points history endpoint not available');
      return [];
    }
  }

  /**
   * Redeem points
   * POST /api/v2/php/redeem-points.php
   */
  async redeemPoints(amount: number): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/redeem-points.php',
      { amount }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.redemption;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to redeem points');
  }

  // ============ NEWS MANAGEMENT METHODS ============

  /**
   * Get user news/announcements
   * POST /api/v2/php/get-artist-news.php
   */
  async getArtistNews(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-artist-news.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.news || [];
      }

      return [];
    } catch (error) {
      console.warn('Artist news endpoint not available');
      return [];
    }
  }

  /**
   * Create news post
   * POST /api/v2/php/create-news.php
   */
  async createNews(data: {
    title: string;
    content: string;
    image?: string;
    type?: string;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/create-news.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.news;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to create news');
  }

  /**
   * Update news post
   * POST /api/v2/php/update-news.php
   */
  async updateNews(newsId: string, data: any): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/update-news.php',
      { news_id: newsId, ...data }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.news;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update news');
  }

  /**
   * Delete news post
   * POST /api/v2/php/delete-news.php
   */
  async deleteNews(newsId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/delete-news.php',
      { news_id: newsId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to delete news');
  }

  // ============ STREAMING PLATFORM METHODS ============

  /**
   * Get streaming platform integrations
   * POST /api/v2/php/get-streaming-platforms.php
   */
  async getStreamingPlatforms(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-streaming-platforms.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.platforms || [];
      }

      return [];
    } catch (error) {
      console.warn('Streaming platforms endpoint not available');
      return [];
    }
  }

  /**
   * Connect streaming platform
   * POST /api/v2/php/connect-streaming-platform.php
   */
  async connectStreamingPlatform(data: {
    platform_name: string;
    username?: string;
    url?: string;
    token?: string;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/connect-streaming-platform.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.platform;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to connect platform');
  }

  /**
   * Disconnect streaming platform
   * POST /api/v2/php/disconnect-streaming-platform.php
   */
  async disconnectStreamingPlatform(platformId: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/disconnect-streaming-platform.php',
      { platform_id: platformId }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to disconnect platform');
  }

  /**
   * Get streaming statistics
   * POST /api/v2/php/get-streaming-stats.php
   */
  async getStreamingStats(platformId?: string): Promise<any> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-streaming-stats.php',
        platformId ? { platform_id: platformId } : {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.stats || {};
      }

      return {};
    } catch (error) {
      console.warn('Streaming stats endpoint not available');
      return {};
    }
  }

  // ============ ARTIST BIO METHODS ============

  /**
   * Update artist bio/about
   * POST /api/v2/php/update-artist-bio.php
   */
  async updateArtistBio(bio: string): Promise<Member> {
    const response = await this.client.post<ApiResponse<{ member: Member }>>(
      '/api/v2/php/update-artist-bio.php',
      { About: bio }
    );

    if (response.data.status === 'success' && response.data.data?.member) {
      this._user = response.data.data.member;
      this.saveAuthState();
      this.emit('profile:updated', this._user);
      return this._user;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update bio');
  }

  // ============ SOCIAL DISTRIBUTION METHODS ============

  /**
   * Get connected social accounts
   * POST /api/v2/php/get-social-accounts.php
   */
  async getSocialAccounts(): Promise<any[]> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-social-accounts.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.accounts || [];
      }

      return [];
    } catch (error) {
      console.warn('Social accounts endpoint not available');
      return [];
    }
  }

  /**
   * Connect social account
   * POST /api/v2/php/connect-social-account.php
   */
  async connectSocialAccount(data: {
    platform: string;
    username?: string;
    url?: string;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/connect-social-account.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.account;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to connect social account');
  }

  /**
   * Disconnect social account
   * POST /api/v2/php/disconnect-social-account.php
   */
  async disconnectSocialAccount(platform: string): Promise<boolean> {
    const response = await this.client.post<any>(
      '/api/v2/php/disconnect-social-account.php',
      { platform }
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return true;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to disconnect social account');
  }

  /**
   * Get auto-sharing settings
   * POST /api/v2/php/get-sharing-settings.php
   */
  async getSharingSettings(): Promise<any> {
    try {
      const response = await this.client.post<any>(
        '/api/v2/php/get-sharing-settings.php',
        {}
      );

      if ((response.data.status === '200' || response.data.status === 'success') &&
          response.data.message === 'success') {
        return response.data.result || response.data.settings || {};
      }

      return {
        share_releases: false,
        share_stats: false,
        share_milestones: false,
      };
    } catch (error) {
      console.warn('Sharing settings endpoint not available');
      return {
        share_releases: false,
        share_stats: false,
        share_milestones: false,
      };
    }
  }

  /**
   * Update auto-sharing settings
   * POST /api/v2/php/update-sharing-settings.php
   */
  async updateSharingSettings(settings: {
    share_releases?: boolean;
    share_stats?: boolean;
    share_milestones?: boolean;
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/update-sharing-settings.php',
      settings
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.settings;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to update sharing settings');
  }

  /**
   * Share to social platforms
   * POST /api/v2/php/share-to-social.php
   */
  async shareToSocial(data: {
    platforms: string[];
    message: string;
    type: string; // 'profile', 'release', 'milestone'
  }): Promise<any> {
    const response = await this.client.post<any>(
      '/api/v2/php/share-to-social.php',
      data
    );

    if ((response.data.status === '200' || response.data.status === 'success') &&
        response.data.message === 'success') {
      return response.data.result || response.data.share;
    }

    throw new SingnifyApiError(response.data.message || 'Failed to share to social platforms');
  }
}

// ============ EXPORT SINGLETON INSTANCE ============

let singnifyClient: SingnifyApiClient | null = null;

/**
 * Get or create singleton instance of SingnifyApiClient
 */
export function getSingnifyApiClient(baseURL?: string): SingnifyApiClient {
  if (!singnifyClient) {
    singnifyClient = new SingnifyApiClient(baseURL);
  }
  return singnifyClient;
}

/**
 * Export default instance
 */
export default getSingnifyApiClient();
