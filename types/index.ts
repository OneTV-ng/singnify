// types/index.ts

import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  disabled?: boolean;
}

export interface Referral {
  artist: string;
  date: string;
  status: 'Completed' | 'Pending';
  earnings: string;
}

export interface SongCode {
  song: string;
  code: string;
  type: string;
  created: string;
  uses: string;
}

export interface Payout {
  date: string;
  description: string;
  amount: string;
  status: string;
}

export interface BankAccount {
  bankName: string;
  accountType: string;
  lastFour: string;
  routingLastFour: string;
  status: string;
}

export interface AnalyticsData {
  totalStreams: string;
  listeners: string;
  avgTime: string;
  completionRate: string;
}

export interface SocialAccount {
  platform: string;
  connected: boolean;
  icon: LucideIcon;
  color: string;
}

export interface TakedownRequest {
  date: string;
  url: string;
  status: string;
}

export interface RoyaltyPlatform {
  platform: string;
  streams: string;
  earnings: string;
  rate: string;
  share: number;
}

export interface NavigationItem {
  icon:  LucideIcon;
  label: string;
  href: string;
  disabled?: boolean;
}

export interface Referral {
  artist: string;
  date: string;
  status: 'Completed' | 'Pending';
  earnings: string;
}

export interface SongCode {
  song: string;
  code: string;
  type: string;
  created: string;
  uses: string;
}

export interface Payout {
  date: string;
  description: string;
  amount: string;
  status: string;
}

export interface BankAccount {
  bankName: string;
  accountType: string;
  lastFour: string;
  routingLastFour: string;
  status: string;
}

export interface AnalyticsData {
  totalStreams: string;
  listeners: string;
  avgTime: string;
  completionRate: string;
}

export interface SocialAccount {
  platform: string;
  connected: boolean;
  icon: LucideIcon;
  color: string;
}