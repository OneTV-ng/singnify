// src/types/singnify-api.types.ts
// Type definitions for Singnify API Client

/**
 * Base API Response structure
 */
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

/**
 * Member/User entity - represents a registered user in the system
 */
export interface Member {
  /** Unique user identifier */
  ID: string;
  /** Username for login and display */
  Username: string;
  /** User's email address */
  EmailAddress: string;
  /** Hashed password (sensitive) */
  Password: string;
  /** Account active status */
  Active: string;
  /** Registration timestamp */
  TimeNumber: string;
  /** OAuth provider name (e.g., 'google', 'facebook') */
  OAuthProvider: string;
  /** OAuth unique identifier */
  OAuthUID: string;
  /** User's first name */
  FirstName: string;
  /** User's last name */
  LastName: string;
  /** Profile picture URL or placeholder */
  Picture: string;
  /** User's gender */
  Gender: string;
  /** User's locale/language preference */
  Locale: string | null;
  /** Account creation date */
  Created: string | null;
  /** Last modification date */
  Modified: string | null;
  /** Profile link/URL */
  Link: string | null;
  /** Contact phone number */
  Phone: string;
  /** User's country */
  Country: string;
  /** Facebook profile URL */
  Facebook: string | null;
  /** Twitter handle */
  Twitter: string | null;
  /** Instagram handle */
  Instagram: string | null;
  /** YouTube channel URL */
  YouTube: string | null;
  /** Artist stage name */
  StageName: string;
  /** Account suspension status */
  Suspension: string | null;
  /** Referrer user ID */
  Referrer: string;
  /** Referral earnings amount */
  ReferralAmount: string | null;
  /** Membership tier */
  Membership: string | null;
  /** Membership expiration date */
  MembershipDeadline: string | null;
  /** Active membership flag */
  ActiveMembership: string | null;
  /** Service charge flag */
  IsServiceCharge: string | null;
  /** Service charge amount */
  ServiceChargeAmount: string | null;
  /** Monthly charge flag */
  IsMonthCharge: string | null;
  /** Monthly charge amount */
  MonthChargeAmount: string | null;
  /** Last monthly charge payment time */
  MonthChargePayTime: string | null;
  /** Monthly charge expiration time */
  MonthChargeExpireTime: string | null;
  /** Contract agreement status */
  Contract: string;
  /** Email/phone verification status */
  IsVerified: string | null;
  /** Digital signature */
  Signature: string | null;
  /** Signed contract document URL */
  SignedContract: string | null;
  /** Latest notification ID */
  LatestNoteID: string | null;
  /** Associated record label */
  RecordLabel: string;
  /** Total points withdrawn */
  WithdrawnPoints: string | null;
  /** Total points earned */
  TotalPointsEarned: string | null;
  /** Account paused status */
  IsPaused: string;
  /** Point-to-royalty conversion rate */
  PointRoyalty: string | null;
  /** Stripe customer ID for payments */
  StripeCustomerID: string | null;
  /** User biography/about text */
  About: string;
  /** Firebase Cloud Messaging token for push notifications */
  FCMToken: string | null;
  /** Artist account flag */
  IsArtist: string;
  /** One-time password for verification */
  OTP: string | null;
  /** Authentication token */
  Token: string;
}

/**
 * Registration credentials for new user signup
 */
export interface RegisterCredentials {
  /** Email address (must be unique) */
  EmailAddress: string;
  /** Password (minimum 8 characters recommended) */
  Password: string;
  /** User's first name */
  FirstName: string;
  /** User's last name */
  LastName: string;
  /** Desired username (must be unique) */
  Username: string;
  /** Optional phone number */
  Phone?: string;
  /** Optional country code */
  Country?: string;
  /** Optional gender */
  Gender?: string;
  /** Optional artist stage name */
  StageName?: string;
  /** Optional referrer user ID */
  Referrer?: string;
  /** Flag to indicate artist account ('1' or '0') */
  IsArtist?: string;
  /** Optional record label name */
  RecordLabel?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Optional OAuth provider name */
  provider?: string;
}

/**
 * Login response with extended auth data
 */
export interface LoginResponse extends ApiResponse {
  /** Profile link */
  link?: string;
  /** User ID */
  user_id?: string;
  /** Authentication passkey */
  passkey?: string;
  /** User's email */
  email?: string;
  /** Username */
  uname?: string;
  /** OAuth provider */
  provider?: string;
  /** OAuth UID */
  uid?: string;
  /** Complete member data */
  member_data?: Member;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  /** Email address to send reset instructions */
  email: string;
}

/**
 * OTP verification request
 */
export interface VerifyOTPRequest {
  /** Email address */
  email: string;
  /** One-time password received via email */
  otp: string;
}

/**
 * Password reset request
 */
export interface ResetPasswordRequest {
  /** Email address */
  email: string;
  /** Verified OTP */
  otp: string;
  /** New password */
  password: string;
}

/**
 * Profile update request - all fields optional
 */
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

/**
 * Password update request
 */
export interface UpdatePasswordRequest {
  /** Current password for verification */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** Confirm new password (must match) */
  confirmPassword: string;
}

/**
 * Image upload response
 */
export interface UploadImageResponse extends ApiResponse {
  /** Uploaded image filename */
  imageName?: string;
}

/**
 * Cover art upload response
 */
export interface UploadCoverArtResponse extends ApiResponse {
  /** Uploaded cover art filename */
  imageName?: string;
}

/**
 * Audio track save request
 */
export interface SaveAudioRequest {
  /** Track title */
  title: string;
  /** Artist name (optional) */
  artist?: string;
  /** Music genre */
  genre?: string;
  /** Audio file URL */
  fileUrl: string;
  /** Cover art URL or filename */
  coverArt?: string;
  /** Track duration in seconds */
  duration?: number;
  /** Explicit content flag */
  isExplicit?: boolean;
  /** Song lyrics */
  lyrics?: string;
  /** Allow additional properties */
  [key: string]: any;
}

/**
 * Video save request
 */
export interface SaveVideoRequest {
  /** Video title */
  title: string;
  /** Artist name (optional) */
  artist?: string;
  /** Video file URL */
  videoUrl: string;
  /** Video thumbnail URL */
  thumbnailUrl?: string;
  /** Video duration in seconds */
  duration?: number;
  /** Video description */
  description?: string;
  /** Allow additional properties */
  [key: string]: any;
}

/**
 * Discover content parameters
 */
export interface DiscoverParams {
  /** Page number for pagination */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Filter by genre */
  genre?: string;
  /** Sort field */
  sortBy?: string;
  /** Allow additional parameters */
  [key: string]: any;
}

/**
 * Discover content response
 */
export interface DiscoverResponse extends ApiResponse {
  /** Introduction/featured items */
  introductions?: any[];
  /** Discovered content */
  result?: {
    /** Music tracks */
    music?: any[];
    /** Videos */
    videos?: any[];
    /** Artists */
    artists?: any[];
    /** Allow additional result types */
    [key: string]: any;
  };
}

/**
 * Music track entity
 */
export interface Track {
  /** Track ID */
  id: string;
  /** Track title */
  title: string;
  /** Artist name */
  artist: string;
  /** Track duration in seconds */
  duration: number;
  /** Genre */
  genre?: string;
  /** Cover art URL */
  coverArt?: string;
  /** Audio file URL */
  fileUrl: string;
  /** Play count */
  playCount?: number;
  /** Like count */
  likeCount?: number;
  /** Explicit content flag */
  isExplicit?: boolean;
  /** Release date */
  releaseDate?: string;
  /** Album name */
  album?: string;
  /** Track number in album */
  trackNumber?: number;
  /** ISRC code */
  isrc?: string;
  /** Lyrics */
  lyrics?: string;
}

/**
 * Video entity
 */
export interface Video {
  /** Video ID */
  id: string;
  /** Video title */
  title: string;
  /** Artist name */
  artist: string;
  /** Video duration in seconds */
  duration: number;
  /** Video URL */
  videoUrl: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Description */
  description?: string;
  /** View count */
  viewCount?: number;
  /** Like count */
  likeCount?: number;
  /** Upload date */
  uploadDate?: string;
  /** Video type */
  type?: 'music_video' | 'face_video' | 'dance_video';
}

/**
 * Artist entity
 */
export interface Artist {
  /** Artist ID */
  id: string;
  /** Artist stage name */
  stageName: string;
  /** Real name */
  realName?: string;
  /** Biography */
  bio?: string;
  /** Profile picture */
  picture?: string;
  /** Primary genre */
  genre?: string;
  /** Country */
  country?: string;
  /** Record label */
  recordLabel?: string;
  /** Follower count */
  followerCount?: number;
  /** Verified artist flag */
  isVerified?: boolean;
  /** Social media links */
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

/**
 * Playlist entity
 */
export interface Playlist {
  /** Playlist ID */
  id: string;
  /** Playlist name */
  name: string;
  /** Description */
  description?: string;
  /** Owner/creator ID */
  userId: string;
  /** Cover image URL */
  coverImage?: string;
  /** Track IDs in playlist */
  trackIds?: string[];
  /** Tracks (populated) */
  tracks?: Track[];
  /** Public/private flag */
  isPublic?: boolean;
  /** Follower count */
  followerCount?: number;
  /** Creation date */
  createdAt?: string;
  /** Last updated date */
  updatedAt?: string;
}

/**
 * Genre entity
 */
export interface Genre {
  /** Genre ID */
  id: string;
  /** Genre name */
  name: string;
  /** Genre description */
  description?: string;
  /** Genre icon/image */
  icon?: string;
  /** Track count in this genre */
  trackCount?: number;
}

/**
 * Chart entry
 */
export interface ChartEntry {
  /** Chart position */
  position: number;
  /** Previous position */
  previousPosition?: number;
  /** Track or video data */
  item: Track | Video;
  /** Points/score */
  score?: number;
  /** Change from previous week */
  change?: 'up' | 'down' | 'new' | 'same';
}

/**
 * Charts response
 */
export interface ChartsResponse extends ApiResponse {
  /** Chart type */
  chartType?: 'weekly' | 'monthly' | 'all_time';
  /** Genre filter */
  genre?: string;
  /** Chart period */
  period?: string;
  /** Chart entries */
  entries?: ChartEntry[];
}

/**
 * Listing entity
 */
export interface Listing {
  /** Listing ID */
  id: string;
  /** Listing title */
  title: string;
  /** Listing type */
  type: 'track' | 'video' | 'artist' | 'playlist';
  /** Item data */
  item: Track | Video | Artist | Playlist;
  /** Featured flag */
  isFeatured?: boolean;
  /** Display order */
  order?: number;
}

/**
 * Notification entity
 */
export interface Notification {
  /** Notification ID */
  id: string;
  /** User ID */
  userId: string;
  /** Notification type */
  type: 'like' | 'comment' | 'follow' | 'upload' | 'system';
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Read status */
  isRead: boolean;
  /** Related data */
  data?: any;
  /** Creation timestamp */
  createdAt: string;
  /** Link/action URL */
  link?: string;
}

/**
 * Analytics data
 */
export interface Analytics {
  /** Total plays */
  totalPlays?: number;
  /** Total likes */
  totalLikes?: number;
  /** Total followers */
  totalFollowers?: number;
  /** Total uploads */
  totalUploads?: number;
  /** Play history by date */
  playHistory?: Array<{
    date: string;
    count: number;
  }>;
  /** Top tracks */
  topTracks?: Track[];
  /** Geographic distribution */
  geography?: Array<{
    country: string;
    count: number;
  }>;
}

/**
 * Earnings data
 */
export interface Earnings {
  /** Total points earned */
  totalPoints?: number;
  /** Withdrawn points */
  withdrawnPoints?: number;
  /** Available points */
  availablePoints?: number;
  /** Point-to-currency conversion rate */
  conversionRate?: number;
  /** Earnings history */
  history?: Array<{
    date: string;
    amount: number;
    type: 'play' | 'like' | 'referral' | 'bonus';
  }>;
}

/**
 * Upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * API client event types
 */
export type SingnifyApiEvent =
  | 'auth:login'
  | 'auth:logout'
  | 'auth:expired'
  | 'profile:updated'
  | 'content:uploaded'
  | 'error';

/**
 * API client configuration
 */
export interface SingnifyApiConfig {
  /** Base API URL */
  baseURL?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable debug logging */
  debug?: boolean;
  /** Custom headers */
  headers?: Record<string, string>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page */
  page: number;
  /** Items per page */
  limit: number;
  /** Total items */
  total: number;
  /** Total pages */
  totalPages: number;
  /** Has next page */
  hasNextPage: boolean;
  /** Has previous page */
  hasPrevPage: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse {
  /** Pagination metadata */
  meta?: PaginationMeta;
  /** Data items */
  data?: T[];
}

/**
 * Search parameters
 */
export interface SearchParams {
  /** Search query */
  query: string;
  /** Search type filter */
  type?: 'track' | 'video' | 'artist' | 'playlist' | 'all';
  /** Genre filter */
  genre?: string;
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search results
 */
export interface SearchResults {
  /** Track results */
  tracks?: Track[];
  /** Video results */
  videos?: Video[];
  /** Artist results */
  artists?: Artist[];
  /** Playlist results */
  playlists?: Playlist[];
  /** Total result count */
  total?: number;
  /** Query that was searched */
  query?: string;
}

/**
 * File upload metadata
 */
export interface UploadMetadata {
  /** Original filename */
  filename: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Upload timestamp */
  uploadedAt: string;
  /** Uploaded by user ID */
  uploadedBy: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse extends ApiResponse {
  /** Error code */
  code?: string;
  /** Additional error details */
  details?: any;
  /** Stack trace (only in development) */
  stack?: string;
}
