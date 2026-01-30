// types.ts
// @/app/lib/types.ts
import React from 'react';

export type ThemeColor = 'white' | 'black' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone';
export type ThemeAccent = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'indigo';

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent: ThemeAccent;
  baseColor: ThemeColor;
  dark: boolean;
  componentShadow?: string;
}


export type NTrack ={
  f_id?: string;
  function?: string;
  type:string;
  f_table?: string;
  active?: string;
  col?: string;
  f_order?: string;
  f_chart?: string;
  name?:string;
  track_name?: string;
  label?: string;
  genre?: string;
  language?: string;
  image: string;
  audio?: string;
  time_number?: string;
  duration?: string;
  country: string;
  choice?: string;
  base?: string;
  chart?: string;
  user_id?: string;
  id?: string;
  music_id?: string;
  no_plays?: string;
  no_downloads?: string;
  is_ran?: string;
  f_time_number?: string;
  date_created?: string;
  data_id?: string;
  actor?: string;
};


export type MusicTrack = {
  f_id: string;
  function: string;
  f_table: string;
  active: string;
  col: string;
  f_order: string;
  f_chart: string;
  track_name: string;
  label: string;
  genre: string;
  language: string;
  image: string;
  audio: string;
  time_number: string;
  duration: string;
  country: string;
  choice: string;
  base: string;
  chart: string;
  user_id: string;
  id: string;
  music_id: string;
  no_plays: string;
  no_downloads: string;
  is_ran: string;
  f_time_number: string;
  date_created: string;
  data_id: string;
  actor: string;
};


export interface ThemeContextType {
  theme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
}

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
  onTogglePassword?: any;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}
// Password, Active, TimeNumber, Referrer, and 4 more.

export interface UserType {
  ID: string;
  Username: string;
  EmailAddress: string;
  Password?: string;
  Active?: string;
  TimeNumber?: string;
  FirstName?: string;
  LastName?: string;
  Picture?: string;
  Gender: string;
  Phone?: string;
  Country?: string;
  StageName?: string;
  Referrer?: string;
  Contract?: string;
  LatestNoteID?: string;
  RecordLabel?: string;
  IsPaused?: string;
  About?: string;
  IsArtist?: string;
  OTP: string;
  Token: string;

  // Optional fields (can be empty or null)
  OAuthProvider?: string;
  OAuthUID?: string;
  Locale?: string | null;
  Created?: string | null;
  Modified?: string | null;
  Link?: string | null;
  Facebook?: string | null;
  Twitter?: string | null;
  Instagram?: string | null;
  YouTube?: string | null;
  Suspension?: string | null;
  ReferralAmount?: string | null;
  Membership?: string | null;
  MembershipDeadline?: string | null;
  ActiveMembership?: string | null;
  IsServiceCharge?: string | null;
  ServiceChargeAmount?: string | null;
  IsMonthCharge?: string | null;
  MonthChargeAmount?: string | null;
  MonthChargePayTime?: string | null;
  MonthChargeExpireTime?: string | null;
  IsVerified?: string | null;
  Signature?: string | null;
  SignedContract?: string | null;
  WithdrawnPoints?: string | null;
  TotalPointsEarned?: string | null;
  PointRoyalty?: string | null;
  StripeCustomerID?: string | null;
  FCMToken?: string | null;
}



export type UserOldType ={
  id?: string|number|null;
  Uname?: string;
  first_name?: string;
  last_name?: string;
  uname?: string;
  fname?: string;
  lname?: string;
  username?:string;
  FirstName?: string;
  LastName?: string;
  Phone?: string;
info?: string;
picture?:string;
EmailAddress?: string;
 role?: string|'user'; // Default role, should be fetched from your backend
avatar?: string;
 preferences?:object;
 hideOnMobile?: boolean;
}

export type xAuthContextType = {
  user: UserType | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}


export type Artist = {
  //name?: string | undefined; // Fixed syntax error here
  name:string;
  picture?: string;
  info?: string;
  id: number|string | null;
  image?: string;
  gender?: string;
  followers?: number;
  monthlyListeners?: number;
  topSong?: string;
  genre?: string| string[];
}




// Main Track interface based on usage in the code
export type Track = {
  id: number;
  track_name: string;
  genre: string;
  duration: string;
  label: string;
  image: string;
  actor?:string;
  artist?:Artist|undefined;
  plays: number;
 url?: string;
  //releaseDate?: date;
  releaseDate?: string;
  isLiked?: boolean;
  audio?: string;
  no_plays?:number;
  description?: string;
  info?: string;
}



// Define the player state type

export type PlayerStateType= {

  currentTrack: Track | null;
  isPlaying: boolean;
  isMuted?: boolean;
  isShuffle: boolean;
  repeatMode?: 'off' | 'one' | 'all';
  playbackSpeed: number;
  volume: number;
  queue: Track[];
  history: Track[];
  isFullScreen:boolean;
  currentIndex: number;
  currentTime: number;
  loading: boolean;
  error: string | null;
  playlist:Track[];
   currentTrackIndex: number;
  loopMode?: 'off' | 'one' | 'all';
}



export type PlayerActionType =
  | { type: 'SET_TRACK'; payload: Track }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'PLAY' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_REPEAT_MODE'; payload: 'off' | 'one' | 'all' }
  | { type: 'SET_PLAYBACK_SPEED'; payload: 1 | 1.5 | 2 }
  | { type: 'ADD_TO_QUEUE'; payload: Track }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SEEK_TO'; payload: number }
  | { type: 'LOAD_PLAYLIST'; payload: Track[] }
  | { type: 'TOGGLE_FULLSCREEN', payload?: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TIME'; payload: number };



// Re-export all types
//export type { Artist, Track, PlayerAction, PlayerState };
export type UserRole = 'admin' | 'user' | 'artist' | 'manager' | 'guest' | 'supervisor';



export type  HeroSlide = {

  id: string;
  title: string;
  artist: string;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
   queue: Track[];
  currentIndex: number;
  image: string;
  type: 'song' | 'album' | 'artist';
  plays?: number;
  duration: string;
  releaseDate?: string;
  track:Track;
  
}

// News Item Type Definition
export type NewsItem = {
  id: string;
  title: string;
  image: string;
  type?: 'event' | 'release' | 'news' | 'interview';
  date: string;
  link: string;
}

export interface NNewsItem {
  id: string;
  title: string;
  image: string;
  type: 'news' | 'event' | 'release'|'interview';
  date: string;
  link: string;
}




export type  navigationType  = {
  
  name: string;
  href: string;
  icon: any;
  hideOnMobile?: boolean;
  //action?: boolean|null;
  childOf?:string|null;
  parent?:string|null;
  };
  

  export interface AuthState {
    user: MemberData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface AuthContextType extends AuthState {
    login: (id: string, password: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    updateUser: (user:FormData) => void;
  }
  

  export interface MemberData {
    ID: string;
    Username: string;
    EmailAddress: string;
    FirstName: string;
    LastName: string;
    Picture: string;
    Gender: string;
    Phone: string;
    Country: string;
    About: string;
    RecordLabel: string;
    StageName: string;
    IsArtist: string;
    Token: string;
  }
  
  export interface AuthResponse {
    status: string;
    message: string;
    user_id: string;
    email: string;
    uname: string;
    member_data: MemberData;
  }
  
  export interface AuthState {
    user: MemberData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  


export type ShowMessageType = 'info' | 'success' | 'warning' | 'error'| string;

export interface ShowMessageContextType {
  showMessage: (message: string, type?: ShowMessageType) => void;
  confirmMessage: (
    message: string, 
    type?: ShowMessageType|string, 
    callback?: (confirmed: boolean) => void
  ) => Promise<boolean>;
}
// app/lib/types.ts
export interface SongBasicType {
  id?: number ;
  songId?:number;
  username?: string;
  title?: string;
  artist_name?: string;
  cover_url?:string;
}
