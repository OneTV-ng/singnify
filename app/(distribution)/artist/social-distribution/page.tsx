'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { LinkIcon, Facebook, Instagram, Twitter, Youtube, Share2, Music, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

// Custom TikTok icon component since it's not available in lucide-react
const TiktokIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.527V7.79a4.831 4.831 0 0 1-3.77-1.104z"/>
  </svg>
);

const platformIcons: { [key: string]: any } = {
  facebook: { icon: Facebook, color: 'text-blue-500' },
  instagram: { icon: Instagram, color: 'text-pink-500' },
  twitter: { icon: Twitter, color: 'text-blue-400' },
  'x.com': { icon: Twitter, color: 'text-blue-400' },
  youtube: { icon: Youtube, color: 'text-red-500' },
  tiktok: { icon: Music, color: 'text-black', custom: true },
};

export default function SocialDistribution() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customMessage, setCustomMessage] = useState('Check out my latest music on all streaming platforms! 🎵');

  useEffect(() => {
    if (session?.accessToken) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const [accountsData, settingsData] = await Promise.all([
        apiClient.getSocialAccounts().catch(() => []),
        apiClient.getSharingSettings().catch(() => ({})),
      ]);

      setAccounts(accountsData);
      setSettings(settingsData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load social distribution data');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.connectSocialAccount({ platform });
      setSuccess(`${platform} connected successfully`);
      await fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || `Failed to connect ${platform}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.disconnectSocialAccount(platform);
      setSuccess(`${platform} disconnected successfully`);
      await fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || `Failed to disconnect ${platform}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSettingChange = async (settingKey: string, value: boolean) => {
    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const updateData: any = {};
      updateData[settingKey] = value;

      await apiClient.updateSharingSettings(updateData);
      setSettings({ ...settings, [settingKey]: value });
      setSuccess('Settings updated successfully');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async (shareType: string) => {
    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const connectedPlatforms = accounts
        .filter((acc) => acc.connected)
        .map((acc) => acc.platform.toLowerCase());

      if (connectedPlatforms.length === 0) {
        setError('Please connect at least one social media account');
        return;
      }

      await apiClient.shareToSocial({
        platforms: connectedPlatforms,
        message: customMessage,
        type: shareType,
      });

      setSuccess('Shared to all platforms successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to share content');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading social distribution...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Share2 className="w-8 h-8 text-indigo-500" />
        Social Distribution
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400">{success}</p>
        </div>
      )}

      {/* Connected Accounts */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              <Music className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p>No social accounts configured yet</p>
            </div>
          ) : (
            accounts.map((account) => {
              const platformKey = account.platform?.toLowerCase() || '';
              const platformConfig = platformIcons[platformKey] || { icon: Music, color: 'text-gray-400' };
              const Icon = platformConfig.icon;

              return (
                <div key={account.id || account.platform} className="border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center">
                    {platformConfig.custom ? (
                      <TiktokIcon className={`h-6 w-6 ${platformConfig.color} mr-3`} />
                    ) : (
                      <Icon className={`h-6 w-6 ${platformConfig.color} mr-3`} />
                    )}
                    <div>
                      <h3 className="font-medium">{account.platform}</h3>
                      <p className="text-sm text-gray-400">
                        {account.connected ? (
                          <>
                            <span className="text-green-400">Connected</span>
                            {account.username && <span> • @{account.username}</span>}
                          </>
                        ) : (
                          'Not Connected'
                        )}
                      </p>
                    </div>
                  </div>
                  {account.connected ? (
                    <button
                      onClick={() => handleDisconnect(account.platform)}
                      disabled={submitting}
                      className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(account.platform)}
                      disabled={submitting}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-1 px-3 rounded-md text-sm font-medium transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Auto-Sharing Settings */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-bold mb-6">Auto-Sharing Settings</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Share New Releases Automatically</h3>
              <p className="text-sm text-gray-400">Share new music to all connected platforms</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings?.share_releases || false}
                onChange={(e) => handleSettingChange('share_releases', e.target.checked)}
                disabled={submitting}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Share Monthly Stats</h3>
              <p className="text-sm text-gray-400">Share monthly streaming statistics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings?.share_stats || false}
                onChange={(e) => handleSettingChange('share_stats', e.target.checked)}
                disabled={submitting}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Share Milestones</h3>
              <p className="text-sm text-gray-400">Share when you reach streaming milestones</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings?.share_milestones || false}
                onChange={(e) => handleSettingChange('share_milestones', e.target.checked)}
                disabled={submitting}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quick Share */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Quick Share</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleShare('profile')}
            disabled={submitting}
            className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-indigo-500/50 disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 className="h-8 w-8 text-indigo-400 mb-2 animate-spin" /> : <Share2 className="h-8 w-8 text-indigo-400 mb-2" />}
            <span className="text-sm font-medium">Share Profile</span>
          </button>

          <button
            onClick={() => handleShare('release')}
            disabled={submitting}
            className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-indigo-500/50 disabled:opacity-50 transition-colors"
          >
            {submitting ? <Loader2 className="h-8 w-8 text-green-400 mb-2 animate-spin" /> : <LinkIcon className="h-8 w-8 text-green-400 mb-2" />}
            <span className="text-sm font-medium">Share Latest Release</span>
          </button>

          <button
            onClick={() => handleShare('milestone')}
            disabled={submitting}
            className="flex flex-col items-center justify-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-indigo-500/50 disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 className="h-8 w-8 text-yellow-400 mb-2 animate-spin" />
            ) : (
              <div className="h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center mb-2">
                <span className="text-xs font-bold text-gray-900">🎉</span>
              </div>
            )}
            <span className="text-sm font-medium">Share Milestone</span>
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-3">Custom Message</h3>
          <textarea
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
            rows={3}
            placeholder="Add a custom message for your shares..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            disabled={submitting}
          />

          <button
            onClick={() => handleShare('custom')}
            disabled={submitting || !customMessage}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Share to All Platforms
          </button>
        </div>
      </div>
    </div>
  );
}