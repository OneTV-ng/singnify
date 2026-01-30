'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getSingnifyApiClient } from '@/services/singnifyApi.service';
import { Building, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function BankAccountPage() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_type: 'Checking',
    routing_number: '',
    account_number: '',
    is_default: false,
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchBankAccounts();
    }
  }, [session]);

  const fetchBankAccounts = async () => {
    try {
      setLoading(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      const data = await apiClient.getBankAccounts();
      setAccounts(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching bank accounts:', err);
      setError(err.message || 'Failed to load bank accounts');
      setAccounts([]);
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
        await apiClient.updateBankAccount(editingId, formData);
        setSuccess('Bank account updated successfully');
      } else {
        await apiClient.addBankAccount(formData);
        setSuccess('Bank account added successfully');
      }

      setFormData({
        account_holder_name: '',
        account_type: 'Checking',
        routing_number: '',
        account_number: '',
        is_default: false,
      });
      setShowForm(false);
      setEditingId(null);
      await fetchBankAccounts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save bank account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;

    try {
      setSubmitting(true);
      const apiClient = getSingnifyApiClient();
      const token = (session as any).accessToken || (session as any)?.user?.Token || '';
      if (token) {
        apiClient.setToken(token);
      }

      await apiClient.deleteBankAccount(accountId);
      setSuccess('Bank account deleted successfully');
      await fetchBankAccounts();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete bank account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (account: any) => {
    setFormData({
      account_holder_name: account.account_holder_name || '',
      account_type: account.account_type || 'Checking',
      routing_number: account.routing_number || '',
      account_number: account.account_number || '',
      is_default: account.is_default === true || account.is_default === '1',
    });
    setEditingId(account.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span className="text-gray-400">Loading bank accounts...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bank Accounts</h1>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                account_holder_name: '',
                account_type: 'Checking',
                routing_number: '',
                account_number: '',
                is_default: false,
              });
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Bank Account
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

      {/* Bank Accounts List */}
      <div className="space-y-4 mb-8">
        {accounts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <Building className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No bank accounts added yet</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600/20 p-3 rounded-full">
                    <Building className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{account.account_holder_name || 'Bank Account'}</h3>
                    <p className="text-gray-400 text-sm">
                      {account.account_type} • ••••{account.account_number?.slice(-4)}
                    </p>
                    {account.is_default && (
                      <span className="text-green-400 text-xs font-medium mt-1">Default Account</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-blue-400"
                    disabled={submitting}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Edit Bank Account' : 'Add New Bank Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={formData.account_holder_name}
                  onChange={(e) =>
                    setFormData({ ...formData, account_holder_name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Type</label>
                <select
                  value={formData.account_type}
                  onChange={(e) =>
                    setFormData({ ...formData, account_type: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option>Checking</option>
                  <option>Savings</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Routing Number</label>
                <input
                  type="text"
                  required
                  value={formData.routing_number}
                  onChange={(e) =>
                    setFormData({ ...formData, routing_number: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  required
                  value={formData.account_number}
                  onChange={(e) =>
                    setFormData({ ...formData, account_number: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="0000000000"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="default-account"
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="default-account" className="ml-2 text-sm text-gray-300">
                Set as default payout account
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-2 px-6 rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Update Account' : 'Add Account'}
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
