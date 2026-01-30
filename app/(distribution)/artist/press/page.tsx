'use client';

import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Download, Share2, Calendar, Eye } from 'lucide-react';

interface PressRelease {
  id: string;
  title: string;
  content: string;
  date: string;
  views: number;
  status: 'draft' | 'published';
}

export default function PressRelease() {
  const [releases, setReleases] = useState<PressRelease[]>([
    {
      id: '1',
      title: 'Exciting New Album Announcement',
      content: 'We are thrilled to announce the release of our latest album featuring 12 brand new tracks...',
      date: '2024-01-28',
      views: 1234,
      status: 'published'
    },
    {
      id: '2',
      title: 'Collaboration with International Artists',
      content: 'Exclusive collaboration with top international artists coming soon. Stay tuned for more details...',
      date: '2024-01-20',
      views: 856,
      status: 'published'
    },
    {
      id: '3',
      title: 'New Tour Dates Announced',
      content: 'We are excited to announce our world tour dates. Get your tickets now...',
      date: '2024-01-15',
      views: 2104,
      status: 'published'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleNew = () => {
    setFormData({ title: '', content: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (release: PressRelease) => {
    setFormData({ title: release.title, content: release.content });
    setEditingId(release.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setReleases(releases.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingId) {
      setReleases(releases.map(r =>
        r.id === editingId
          ? { ...r, title: formData.title, content: formData.content }
          : r
      ));
    } else {
      const newRelease: PressRelease = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split('T')[0],
        views: 0,
        status: 'draft'
      };
      setReleases([newRelease, ...releases]);
    }

    setShowForm(false);
    setFormData({ title: '', content: '' });
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Press Releases</h1>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Release</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Press Release' : 'Create New Press Release'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                placeholder="Enter press release title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="Enter press release content"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update Release' : 'Publish Release'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ title: '', content: '' });
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {releases.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No press releases yet. Create your first one!</p>
          </div>
        ) : (
          releases.map((release) => (
            <div
              key={release.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{release.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(release.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{release.views} views</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        release.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {release.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">{release.content}</p>

              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors text-sm px-3 py-2 rounded hover:bg-gray-700">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors text-sm px-3 py-2 rounded hover:bg-gray-700">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => handleEdit(release)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 transition-colors text-sm px-3 py-2 rounded hover:bg-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(release.id)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
