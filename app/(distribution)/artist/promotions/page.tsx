'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Megaphone, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

export default function PromotionsPage() {
  const { data: session } = useSession();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    start_date: '',
    end_date: '',
    type: 'campaign',
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchPromotions();
    }
  }, [session]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const data = await apiClient.getPromotions();
      setPromotions(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching promotions:', err);
      setError(err.message || 'Failed to load promotions');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      if (editingId) {
        await apiClient.updatePromotion(editingId, formData);
        setSuccess('Promotion updated successfully');
      } else {
        await apiClient.createPromotion(formData);
        setSuccess('Promotion created successfully');
      }

      setFormData({
        title: '',
        description: '',
        image: '',
        start_date: '',
        end_date: '',
        type: 'campaign',
      });
      setShowForm(false);
      setEditingId(null);
      await fetchPromotions();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save promotion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.deletePromotion(promotionId);
      setSuccess('Promotion deleted successfully');
      await fetchPromotions();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete promotion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (promo: any) => {
    setFormData({
      title: promo.title || '',
      description: promo.description || '',
      image: promo.image || '',
      start_date: promo.start_date || '',
      end_date: promo.end_date || '',
      type: promo.type || 'campaign',
    });
    setEditingId(promo.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading promotions...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Megaphone className="w-8 h-8 text-indigo-500" />
          Promotions
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                image: '',
                start_date: '',
                end_date: '',
                type: 'campaign',
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Promotion
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

      {/* Promotions List */}
      <div className="space-y-4 mb-8">
        {promotions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Megaphone className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No promotions yet</p>
          </div>
        ) : (
          promotions.map((promo) => (
            <div key={promo.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{promo.title}</h3>
                  {promo.description && <p className="text-gray-400 text-sm mt-2">{promo.description}</p>}
                  {(promo.start_date || promo.end_date) && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {promo.start_date && new Date(promo.start_date).toLocaleDateString()}
                        {promo.end_date && ` - ${new Date(promo.end_date).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}
                  {promo.type && (
                    <span className="inline-block mt-3 bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full">
                      {promo.type}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400"
                    disabled={submitting}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                    disabled={submitting}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Promotion' : 'Create New Promotion'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Promotion Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Describe your promotion"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Promotion Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="campaign">Campaign</option>
                <option value="special">Special Offer</option>
                <option value="featured">Featured</option>
                <option value="limited">Limited Time</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Promotion' : 'Create Promotion'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
