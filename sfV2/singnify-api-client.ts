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
      'https://api.singnify.com'
  ) {
    super();
    this.baseURL = baseURL;

    if (trace) {
      console.log(`SingnifyApiClient initialized with baseURL: ${this.baseURL}`);
    }

    // Initialize axios instance
    this.client = axios.create({
      baseURL,
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
        // Add auth token if available
        if (this._token) {
          config.headers.Authorization = `Bearer ${this._token}`;
        }

        // Add passkey as parameter if available
        if (this._passkey && config.method?.toLowerCase() === 'post') {
          config.data = {
            ...config.data,
            passkey: this._passkey,
          };
        }

        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();

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
