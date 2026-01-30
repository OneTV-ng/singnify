'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Newspaper, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function NewsPage() {
  const { data: session } = useSession();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    type: 'update',
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchNews();
    }
  }, [session]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const data = await apiClient.getArtistNews();
      setNews(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to load news');
      setNews([]);
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
        await apiClient.updateNews(editingId, formData);
        setSuccess('News post updated successfully');
      } else {
        await apiClient.createNews(formData);
        setSuccess('News post created successfully');
      }

      setFormData({
        title: '',
        content: '',
        image: '',
        type: 'update',
      });
      setShowForm(false);
      setEditingId(null);
      await fetchNews();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news post?')) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.deleteNews(newsId);
      setSuccess('News post deleted successfully');
      await fetchNews();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete news');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title || '',
      content: article.content || '',
      image: article.image || '',
      type: article.type || 'update',
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading news...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="w-8 h-8 text-indigo-500" />
          News & Updates
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                content: '',
                image: '',
                type: 'update',
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post News
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

      {/* News Articles */}
      <div className="space-y-6 mb-8">
        {news.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Newspaper className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No news posts yet</p>
          </div>
        ) : (
          news.map((article) => (
            <div key={article.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-indigo-500/50 transition-colors">
              <div className="md:flex">
                {/* Image */}
                {article.image && (
                  <div className="md:w-48 h-48 md:h-auto bg-gray-900 flex-shrink-0 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                    {article.content && (
                      <p className="text-gray-400 text-sm line-clamp-3">{article.content}</p>
                    )}
                    {article.type && (
                      <div className="mt-3">
                        <span className="inline-block bg-indigo-600/20 text-indigo-400 text-xs px-3 py-1 rounded-full capitalize">
                          {article.type}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400"
                      disabled={submitting}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400"
                      disabled={submitting}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
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
            {editingId ? 'Edit News Post' : 'Create New News Post'}
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
                placeholder="News title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Write your news content here..."
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="update">Update</option>
                  <option value="announcement">Announcement</option>
                  <option value="release">Release</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Post' : 'Post News'}
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
