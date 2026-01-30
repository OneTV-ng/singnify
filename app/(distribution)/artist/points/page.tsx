'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Star, Gift, History, TrendingUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function PointsPage() {
  const { data: session } = useSession();
  const [points, setPoints] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetchPoints();
    }
  }, [session]);

  const fetchPoints = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const [pointsData, historyData] = await Promise.all([
        apiClient.getUserPoints(),
        apiClient.getPointsHistory(),
      ]);

      setPoints(pointsData);
      setHistory(historyData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching points:', err);
      setError(err.message || 'Failed to load points');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(redeemAmount);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (points && points.available_points < amount) {
      setError('Insufficient points to redeem');
      return;
    }

    try {
      setRedeeming(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.redeemPoints(amount);
      setSuccess('Points redeemed successfully!');
      setRedeemAmount('');
      await fetchPoints();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to redeem points');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading points...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Star className="w-8 h-8 text-yellow-500" />
        Points & Rewards
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

      {/* Points Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border border-yellow-500/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <p className="text-gray-400 text-sm">Total Points Earned</p>
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            {points?.total_points || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-6 h-6 text-green-400" />
            <p className="text-gray-400 text-sm">Available Points</p>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {points?.available_points || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-blue-400" />
            <p className="text-gray-400 text-sm">Redeemed Points</p>
          </div>
          <p className="text-3xl font-bold text-blue-400">
            {points?.withdrawn_points || 0}
          </p>
        </div>
      </div>

      {/* Redeem Points */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-bold mb-4">Redeem Points</h2>
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount to Redeem (Available: {points?.available_points || 0} points)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={redeemAmount}
                onChange={(e) => setRedeemAmount(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Enter amount"
                min="1"
              />
              <button
                type="submit"
                disabled={redeeming || !redeemAmount}
                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {redeeming && <Loader2 className="w-4 h-4 animate-spin" />}
                Redeem
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Points History */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center gap-2">
          <History className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold">Points History</h2>
        </div>

        <div className="overflow-x-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No points history yet
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-700/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Points</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.map((entry: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-3 text-sm">
                      {entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-3 text-sm">{entry.description || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm font-semibold">
                      <span className={entry.type === 'earning' ? 'text-green-400' : 'text-red-400'}>
                        {entry.type === 'earning' ? '+' : '-'}{entry.points || 0}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'earning'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {entry.type || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
