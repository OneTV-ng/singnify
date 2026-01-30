'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Download, PieChart, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';

interface EarningsData {
  totalEarnings: number;
  monthlyEarnings: number;
  avgPerStream: number;
  pendingAmount: number;
}

// Platform-wide estimated averages
const PLATFORM_ESTIMATES = {
  avgEarningsPerArtist: 12500,
  avgMonthlyPerArtist: 1875,
  avgPerStream: 0.003,
  avgPendingPercentage: 0.25
};

export default function Royalties() {
  const { data: session } = useSession();
  const [earnings, setEarnings] = useState<EarningsData>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    avgPerStream: 0.003,
    pendingAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUserData, setHasUserData] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiClient = getSingnifyApiClient();
        const token = (session as any).accessToken || (session as any)?.user?.Token || '';
        if (token) {
          apiClient.setToken(token);
        }

        // Fetch user earnings data
        const tracks = await apiClient.getUserTracks();

        if (!tracks || tracks.length === 0) {
          // No user data available - use platform estimates
          setHasUserData(false);
          setEarnings({
            totalEarnings: PLATFORM_ESTIMATES.avgEarningsPerArtist,
            monthlyEarnings: PLATFORM_ESTIMATES.avgMonthlyPerArtist,
            avgPerStream: PLATFORM_ESTIMATES.avgPerStream,
            pendingAmount: PLATFORM_ESTIMATES.avgMonthlyPerArtist * PLATFORM_ESTIMATES.avgPendingPercentage
          });
        } else {
          // Calculate user earnings from actual track data
          const totalPlays = tracks.reduce((sum: number, track: any) => {
            return sum + parseInt(track.no_plays || track.Play || '0');
          }, 0);

          if (totalPlays === 0) {
            // User has tracks but no plays - use platform estimates
            setHasUserData(false);
            setEarnings({
              totalEarnings: PLATFORM_ESTIMATES.avgEarningsPerArtist,
              monthlyEarnings: PLATFORM_ESTIMATES.avgMonthlyPerArtist,
              avgPerStream: PLATFORM_ESTIMATES.avgPerStream,
              pendingAmount: PLATFORM_ESTIMATES.avgMonthlyPerArtist * PLATFORM_ESTIMATES.avgPendingPercentage
            });
          } else {
            // User has actual data
            setHasUserData(true);
            const totalEarnings = totalPlays * 0.003;
            const monthlyEarnings = totalEarnings * 0.15;
            const pendingAmount = monthlyEarnings * 0.25;

            setEarnings({
              totalEarnings,
              monthlyEarnings,
              avgPerStream: 0.003,
              pendingAmount
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching earnings data:', err);
        setError(err.message || 'Failed to load earnings data');
        // Use platform estimates as fallback on error
        setHasUserData(false);
        setEarnings({
          totalEarnings: PLATFORM_ESTIMATES.avgEarningsPerArtist,
          monthlyEarnings: PLATFORM_ESTIMATES.avgMonthlyPerArtist,
          avgPerStream: PLATFORM_ESTIMATES.avgPerStream,
          pendingAmount: PLATFORM_ESTIMATES.avgMonthlyPerArtist * PLATFORM_ESTIMATES.avgPendingPercentage
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [session]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (error && loading) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <div>
          <p className="text-red-400 font-medium">Error loading earnings data</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Royalties</h1>
        {!hasUserData && (
          <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/50 rounded-lg px-3 py-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Estimated Platform Average</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading earnings data...</span>
        </div>
      )}

      {!loading && (
      <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-green-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-lg font-medium">Total Earnings</h3>
              {!hasUserData && <p className="text-xs text-amber-400">(Est. Platform Avg)</p>}
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(earnings.totalEarnings)}</p>
          <p className="text-sm text-green-400 flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15.3% from last year
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-blue-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-lg font-medium">This Month</h3>
              {!hasUserData && <p className="text-xs text-amber-400">(Est. Platform Avg)</p>}
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(earnings.monthlyEarnings)}</p>
          <p className="text-sm text-green-400 flex items-center mt-2">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.2% from last month
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <PieChart className="h-6 w-6 text-yellow-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-lg font-medium">Avg. per Stream</h3>
              {!hasUserData && <p className="text-xs text-amber-400">(Platform)</p>}
            </div>
          </div>
          <p className="text-3xl font-bold">${earnings.avgPerStream.toFixed(4)}</p>
          <p className="text-sm text-gray-400 mt-2">Industry avg: $0.0038</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-purple-400 mr-2" />
            <div className="flex-1">
              <h3 className="text-lg font-medium">Pending</h3>
              {!hasUserData && <p className="text-xs text-amber-400">(Est. Platform Avg)</p>}
            </div>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(earnings.pendingAmount)}</p>
          <p className="text-sm text-gray-400 mt-2">Next payout: Next month</p>
        </div>
      </div>
      </>
      )}

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Earnings Over Time</h2>
          <div className="flex space-x-2">
            <button className="bg-indigo-600 text-white py-1 px-3 rounded-md text-sm">Monthly</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md text-sm">Quarterly</button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md text-sm">Yearly</button>
          </div>
        </div>

        <div className="h-64 flex items-end space-x-1 mb-6">
          {[40, 65, 80, 55, 70, 90, 120, 100, 85, 110, 95, 130].map((height, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-indigo-500 rounded-t"
                style={{ height: `${height}px` }}
              ></div>
              <span className="text-xs text-gray-400 mt-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Royalties by Platform</h2>
          <button className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md">
            <Download className="h-4 w-4 mr-1" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Streams</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rate per Stream</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Spotify</td>
                <td className="px-6 py-4 whitespace-nowrap">542,893</td>
                <td className="px-6 py-4 whitespace-nowrap">$1,842</td>
                <td className="px-6 py-4 whitespace-nowrap">$0.0034</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Apple Music</td>
                <td className="px-6 py-4 whitespace-nowrap">245,672</td>
                <td className="px-6 py-4 whitespace-nowrap">$1,124</td>
                <td className="px-6 py-4 whitespace-nowrap">$0.0046</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">YouTube Music</td>
                <td className="px-6 py-4 whitespace-nowrap">128,456</td>
                <td className="px-6 py-4 whitespace-nowrap">$385</td>
                <td className="px-6 py-4 whitespace-nowrap">$0.0030</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Amazon Music</td>
                <td className="px-6 py-4 whitespace-nowrap">98,321</td>
                <td className="px-6 py-4 whitespace-nowrap">$295</td>
                <td className="px-6 py-4 whitespace-nowrap">$0.0030</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Royalty Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payout Threshold</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
              <option>$25</option>
              <option>$50</option>
              <option>$100 (default)</option>
              <option>$250</option>
              <option>$500</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payout Frequency</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Bi-Annually</option>
              <option>Annually</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input
            id="royalty-reports"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-600 rounded bg-gray-700 focus:ring-indigo-500"
            defaultChecked
          />
          <label htmlFor="royalty-reports" className="ml-2 text-sm text-gray-300">
            Email me monthly royalty reports
          </label>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md">
          Save Settings
        </button>
      </div>
    </div>
  );
}
