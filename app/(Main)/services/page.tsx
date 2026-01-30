'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fetchListingsAction } from '@/services/singnifyApi.actions';
import {
  Music, Globe, Zap, Sparkles, DollarSign, Radio, Share2,
  Loader2, AlertCircle, CheckCircle, TrendingUp, Users, Headphones
} from 'lucide-react';

interface Promotion {
  ID: string;
  Title: string;
  Tag: string;
  Amount: string;
  Description: string;
}

export default function ServicesPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'genres' | 'promotions' | 'platforms' | 'features'>('promotions');

  useEffect(() => {
    if (session?.accessToken) {
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = (session as any)?.accessToken || (session as any)?.user?.Token || '';
      console.log('📋 Fetching listings data...');
      const data = await fetchListingsAction(token);
      console.log('✅ Listings data fetched:', data);
      setListings(data);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching listings:', err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0f] dark:via-[#111118] dark:to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Please log in to view services</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0f] dark:via-[#111118] dark:to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-indigo-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0f] dark:via-[#111118] dark:to-[#0a0a0f] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10" />
            Singnify Services & Features
          </h1>
          <p className="text-indigo-100">Discover all the tools to distribute and promote your music</p>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'promotions', label: 'Promotions', icon: TrendingUp },
            { id: 'platforms', label: 'Distribution', icon: Globe },
            { id: 'genres', label: 'Genres', icon: Music },
            { id: 'features', label: 'Premium', icon: Zap },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Promotions Tab */}
        {selectedTab === 'promotions' && listings?.promotions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {listings.promotions.data.map((promo: Promotion) => (
              <div
                key={promo.ID}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
                  <h3 className="text-xl font-bold mb-2">{promo.Title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${promo.Amount}</span>
                    <span className="text-indigo-100">one-time</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {promo.Description.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                  <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Distribution Platforms Tab */}
        {selectedTab === 'platforms' && listings?.listDiscover && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-600" />
              Distribution Platforms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.listDiscover.map((platform: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center border border-indigo-200 dark:border-gray-600"
                >
                  <Radio className="w-5 h-5 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">{platform}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
              ✨ Distribute your music to all major platforms worldwide with just one click
            </p>
          </div>
        )}

        {/* Genres Tab */}
        {selectedTab === 'genres' && listings?.genres && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Music className="w-6 h-6 text-indigo-600" />
              Available Genres
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {listings.genres.map((genre: string, idx: number) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 text-center border border-green-200 dark:border-gray-600"
                >
                  <p className="font-semibold text-sm text-gray-800 dark:text-white">{genre}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Features Tab */}
        {selectedTab === 'features' && listings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Express Delivery */}
            {listings.express_data && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border-2 border-orange-200 dark:border-orange-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{listings.express_data.Title}</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-2">${listings.express_data.Amount}</p>
                <p className="text-gray-700 dark:text-gray-300">Get your music live on all platforms in just 48 hours</p>
              </div>
            )}

            {/* Premium Services */}
            {listings.premium_express_data && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{listings.premium_express_data.Title}</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Premium distribution to 10+ top platforms including:</p>
                <ul className="space-y-2 text-sm">
                  {['TikTok', 'YouTube Content ID', 'Spotify', 'Apple Music', 'Amazon Music'].map((platform, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">{platform}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment Methods */}
            {(listings.paystack_data || listings.flutterwave_data) && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Methods</h3>
                </div>
                <div className="space-y-2">
                  {listings.paystack_data && <p className="text-gray-700 dark:text-gray-300">✓ PayStack (Live)</p>}
                  {listings.flutterwave_data && <p className="text-gray-700 dark:text-gray-300">✓ Flutterwave (Live)</p>}
                  <p className="text-gray-700 dark:text-gray-300">✓ PayPal</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Safe, secure, and fast payments</p>
              </div>
            )}

            {/* Service Charges */}
            {listings.service_data && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg border-2 border-amber-200 dark:border-amber-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="w-6 h-6 text-amber-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Service Charges</h3>
                </div>
                <p className="text-2xl font-bold text-amber-600 mb-2">{listings.service_data.Amount}%</p>
                <p className="text-gray-700 dark:text-gray-300">Competitive service fee on all transactions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
