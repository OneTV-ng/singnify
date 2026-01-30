'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Video, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle, Play } from 'lucide-react';

export default function VideosPage() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [videoType, setVideoType] = useState<'face' | 'dance' | 'all'>('all');

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchVideos();
    }
  }, [session]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const data = videoType === 'face'
        ? await apiClient.getFaceVideos()
        : await apiClient.getVideos(videoType === 'all' ? undefined : videoType);
      setVideos(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Failed to load videos');
      setVideos([]);
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

      const videoData = {
        title: formData.title,
        artist: (session as any)?.user?.StageName || 'Unknown',
        videoUrl: formData.videoUrl,
        thumbnailUrl: formData.thumbnailUrl,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        description: formData.description,
      };

      if (editingId) {
        await apiClient.updateVideo(editingId, videoData);
        setSuccess('Video updated successfully');
      } else {
        // Save as face video by default, can be changed later
        await apiClient.saveFaceVideo(videoData);
        setSuccess('Video uploaded successfully');
      }

      setFormData({
        title: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: '',
        description: '',
      });
      setShowForm(false);
      setEditingId(null);
      await fetchVideos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.deleteVideo(videoId);
      setSuccess('Video deleted successfully');
      await fetchVideos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (video: any) => {
    setFormData({
      title: video.title || '',
      videoUrl: video.videoUrl || video.video_url || '',
      thumbnailUrl: video.thumbnailUrl || video.thumbnail_url || '',
      duration: video.duration ? video.duration.toString() : '',
      description: video.description || '',
    });
    setEditingId(video.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading videos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Video className="w-8 h-8 text-indigo-500" />
          My Videos
        </h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                videoUrl: '',
                thumbnailUrl: '',
                duration: '',
                description: '',
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Video
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

      {/* Filter Tabs */}
      {!showForm && (
        <div className="flex gap-2 mb-6">
          {(['all', 'face', 'dance'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setVideoType(type);
                setLoading(true);
              }}
              className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                videoType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {videos.length === 0 ? (
          <div className="col-span-full bg-gray-800 rounded-lg p-8 text-center">
            <Video className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No videos yet</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-colors group">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
                {video.thumbnailUrl || video.thumbnail_url ? (
                  <img
                    src={video.thumbnailUrl || video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <Video className="w-12 h-12 text-gray-600" />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{video.title}</h3>
                {video.description && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{video.description}</p>
                )}
                {video.duration && (
                  <p className="text-gray-500 text-xs mt-2">
                    Duration: {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="flex-1 p-2 hover:bg-gray-700 rounded transition-colors text-blue-400 flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="flex-1 p-2 hover:bg-gray-700 rounded transition-colors text-red-400 flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Video' : 'Upload New Video'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Video Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="My awesome video"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video URL *</label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="180"
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
                placeholder="Describe your video"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Video' : 'Upload Video'}
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
