'use client';

import React, { useState, useEffect } from 'react';
import { Music, Copy, Check, Loader2, AlertCircle, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';

interface TrackCode {
  id: string;
  music_id: string;
  track_name: string;
  base_name: string;
  artist_name: string;
  image: string;
  display_upc: string | null;
  display_isrc: string | null;
  genre: string;
  duration: string;
}

export default function SongCodesPage() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<TrackCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiClient = getSingnifyApiClient();
        const token = (session as any).accessToken || (session as any)?.user?.Token || '';
        if (token) {
          apiClient.setToken(token);
        }

        const userTracks = await apiClient.getUserTracks();

        // Filter tracks that have UPC or ISRC codes
        const tracksWithCodes = (userTracks || []).filter(
          (track: any) => track.display_upc || track.display_isrc
        );

        setTracks(tracksWithCodes);
      } catch (err: any) {
        console.error('Error fetching track codes:', err);
        setError(err.message || 'Failed to fetch track codes');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [session]);

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${type}-${code}`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (error && loading) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-red-400 font-medium">Error loading distribution codes</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Distribution Codes</h1>
          <p className="text-gray-400">UPC and ISRC codes for your music</p>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-indigo-200 mb-1">About Distribution Codes</h3>
            <p className="text-sm text-indigo-300/80">
              UPC (Universal Product Code) and ISRC (International Standard Recording Code) are unique identifiers
              for your music used by streaming platforms and distributors. Use these codes to track your music
              across different platforms and ensure proper royalty tracking.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading distribution codes...</span>
        </div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No distribution codes found</h2>
          <p className="text-gray-400 mb-6">
            Your uploaded tracks don't have distribution codes yet. These codes are assigned when you
            distribute through a music distributor or digital aggregator.
          </p>
        </div>
      )}

      {!loading && tracks.length > 0 && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">UPC Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ISRC Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={track.image || '/placeholder.png'}
                          alt={track.track_name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium text-white">{track.track_name}</div>
                          <div className="text-sm text-gray-400">{track.artist_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-900 px-3 py-1 rounded font-mono text-gray-200">
                        {track.display_upc || '-'}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-900 px-3 py-1 rounded font-mono text-gray-200">
                        {track.display_isrc || '-'}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {track.display_upc && (
                          <button
                            onClick={() => copyToClipboard(track.display_upc!, `upc-${track.id}`)}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-600"
                            title="Copy UPC"
                          >
                            {copiedCode === `upc-${track.id}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {track.display_isrc && (
                          <button
                            onClick={() => copyToClipboard(track.display_isrc!, `isrc-${track.id}`)}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-600"
                            title="Copy ISRC"
                          >
                            {copiedCode === `isrc-${track.id}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-gray-900 px-6 py-3 flex items-center justify-between text-sm text-gray-400">
            <span>Total tracks with codes: <span className="text-white font-semibold">{tracks.length}</span></span>
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Export to CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
