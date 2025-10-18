'use client';

import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const acceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const rejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl dark:bg-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              🍪 We value your privacy
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
              By clicking "Accept All", you consent to our use of cookies.{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                Read our Privacy Policy
              </a>
            </p>

            {/* Preferences */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="mr-2 rounded"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Necessary</strong> (Always Active) - Required for basic site functionality
                </span>
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Analytics</strong> - Help us improve by tracking usage patterns
                </span>
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="mr-2 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Marketing</strong> - Personalized content and recommendations
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={rejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reject All
            </button>
            <button
              onClick={acceptSelected}
              className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800"
            >
              Save Preferences
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-lg"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
