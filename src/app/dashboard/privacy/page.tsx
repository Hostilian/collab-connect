'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/gdpr/export', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Download as JSON file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `collab-connect-data-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Data exported successfully!');
      } else {
        alert('Failed to export data');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/gdpr/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          confirmation: deleteConfirmation,
        }),
      });

      if (response.ok) {
        alert('Account deleted successfully. Redirecting...');
        router.push('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Privacy & Data Settings
        </h1>

        {/* GDPR Rights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Your GDPR Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Under GDPR, you have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
            <li><strong>Right to Access</strong> - View and export all your data</li>
            <li><strong>Right to Rectification</strong> - Correct inaccurate data</li>
            <li><strong>Right to Erasure</strong> - Delete your account and data</li>
            <li><strong>Right to Data Portability</strong> - Download your data in JSON format</li>
            <li><strong>Right to Object</strong> - Opt-out of certain data processing</li>
          </ul>
        </div>

        {/* Export Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📥 Export Your Data
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Download a complete copy of your personal data in JSON format. This includes your profile, 
            collaborations, messages, and all activity history.
          </p>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>

        {/* Cookie Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🍪 Cookie Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage your cookie preferences. You can change these settings at any time.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('cookieConsent');
              window.location.reload();
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Update Cookie Settings
          </button>
        </div>

        {/* Delete Account - Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-300">
            ⚠️ Danger Zone
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-4">
            <strong>Delete Account:</strong> This action is permanent and cannot be undone. 
            All your data, collaborations, and messages will be permanently deleted.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete My Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                Delete Account?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Type "DELETE MY ACCOUNT" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmation !== 'DELETE MY ACCOUNT'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
