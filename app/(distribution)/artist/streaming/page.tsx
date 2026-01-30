'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Wifi, Plus, Trash2, Loader2, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export default function StreamingPage() {
  const { data: session } = useSession();
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    platform_name: 'spotify',
    username: '',
    url: '',
    token: '',
  });

  const availablePlatforms = [
    { value: 'spotify', label: 'Spotify', icon: '🎵' },
    { value: 'apple-music', label: 'Apple Music', icon: '🎶' },
    { value: 'youtube-music', label: 'YouTube Music', icon: '▶️' },
    { value: 'deezer', label: 'Deezer', icon: '🎧' },
    { value: 'tidal', label: 'TIDAL', icon: '⚡' },
    { value: 'soundcloud', label: 'SoundCloud', icon: '☁️' },
    { value: 'bandcamp', label: 'Bandcamp', icon: '🎸' },
    { value: 'audiomack', label: 'Audiomack', icon: '🔊' },
  ];

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

      const [platformsData, statsData] = await Promise.all([
        apiClient.getStreamingPlatforms(),
        apiClient.getStreamingStats().catch(() => ({})),
      ]);

      setPlatforms(platformsData);
      setStats(statsData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching streaming data:', err);
      setError(err.message || 'Failed to load streaming platforms');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.connectStreamingPlatform(formData);
      setSuccess('Platform connected successfully');

      setFormData({
        platform_name: 'spotify',
        username: '',
        url: '',
        token: '',
      });
      setShowForm(false);
      await fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to connect platform');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    if (!confirm('Are you sure you want to disconnect this platform?')) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.disconnectStreamingPlatform(platformId);
      setSuccess('Platform disconnected successfully');
      await fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect platform');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading streaming platforms...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wifi className="w-8 h-8 text-indigo-500" />
          Streaming Platforms
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Connect Platform
          </button>
        )}
      </div>

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

      {/* Streaming Stats */}
      {stats && (Object.keys(stats).length > 0) && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8 flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-gray-400 text-sm">Total Streams</p>
            <p className="text-2xl font-bold">{stats.total_streams || '0'}</p>
          </div>
        </div>
      )}

      {/* Connected Platforms */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Connected Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.length === 0 ? (
            <div className="col-span-full bg-gray-800 rounded-lg p-8 text-center">
              <Wifi className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No platforms connected yet</p>
            </div>
          ) : (
            platforms.map((platform) => (
              <div key={platform.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{platform.platform_name || 'Platform'}</h3>
                    {platform.username && (
                      <p className="text-gray-400 text-sm">@{platform.username}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                    disabled={submitting}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {platform.url && (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm break-all"
                  >
                    View Profile
                  </a>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-green-400 text-xs font-medium">Connected</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connect Platform Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-6">Connect New Platform</h2>

          <form onSubmit={handleConnect} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Platform *</label>
              <select
                value={formData.platform_name}
                onChange={(e) =>
                  setFormData({ ...formData, platform_name: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                {availablePlatforms.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Your username on the platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Profile URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Access Token (if required)</label>
              <input
                type="password"
                value={formData.token}
                onChange={(e) =>
                  setFormData({ ...formData, token: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Platform API token"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Connect Platform
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Platform Recommendations */}
      {platforms.length < availablePlatforms.length && !showForm && (
        <div className="mt-8 bg-indigo-600/10 border border-indigo-500/50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Available Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availablePlatforms
              .filter((p) => !platforms.some((x) => x.platform_name === p.value))
              .map((p) => (
                <div key={p.value} className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <p className="text-sm font-medium">{p.label}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
