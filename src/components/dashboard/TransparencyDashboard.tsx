/**
 * Transparency Dashboard Component
 * Displays user verification status, reputation, and activity
 */

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface RepData {
  reputation: {
    score: number;
    level: string;
    totalRatings: number;
    positiveRatings: number;
    badges: Array<{
      name: string;
      description: string;
      imageUrl: string;
      earnedAt: string;
    }>;
  };
  breakdown: {
    total: number;
    average: number;
    byRating: Record<number, number>;
    byCategory: Record<string, { count: number; average: number }>;
  };
}

interface VerificationStatus {
  email: boolean;
  phone: boolean;
  id: 'pending' | 'approved' | 'rejected' | 'not_started';
}

export default function TransparencyDashboard({ userId }: { userId?: string }) {
  const { data: session } = useSession();
  const [reputation, setReputation] = useState<RepData | null>(null);
  const [verification, setVerification] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || session?.user?.id;

  useEffect(() => {
    if (!targetUserId) return;

    async function fetchData() {
      try {
        const [repRes, phoneRes, idRes] = await Promise.all([
          fetch(`/api/reputation/${targetUserId}`),
          fetch(`/api/phone/status`),
          fetch(`/api/id-verification/status`),
        ]);

        const repData = await repRes.json();
        const phoneData = await phoneRes.json();
        const idData = await idRes.json();

        setReputation(repData);
        setVerification({
          email: !!session?.user?.email,
          phone: phoneData.verified || false,
          id: idData.status || 'not_started',
        });
      } catch (error) {
        console.error('Error fetching transparency data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [targetUserId, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Verification Status */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Verification Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerificationBadge
            type="Email"
            status={verification?.email ? 'verified' : 'pending'}
            icon="✉️"
          />
          <VerificationBadge
            type="Phone"
            status={verification?.phone ? 'verified' : 'pending'}
            icon="📱"
          />
          <VerificationBadge
            type="ID"
            status={verification?.id || 'not_started'}
            icon="🪪"
          />
        </div>
      </section>

      {/* Reputation Score */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reputation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-4">
              <div className="text-6xl font-bold text-blue-600">
                {reputation?.reputation.score || 0}
              </div>
              <div>
                <div className="text-xl font-semibold capitalize">
                  {reputation?.reputation.level || 'Newcomer'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {reputation?.reputation.totalRatings || 0} ratings
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Positive</span>
                <span className="font-semibold">
                  {reputation?.reputation.positiveRatings || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Average Rating</span>
                <span className="font-semibold">
                  {reputation?.breakdown.average.toFixed(1) || 'N/A'} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="font-semibold mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reputation?.breakdown.byRating[rating] || 0;
                const total = reputation?.breakdown.total || 1;
                const percentage = (count / total) * 100;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="w-8 text-sm">{rating}★</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      {reputation?.reputation.badges && reputation.reputation.badges.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Badges Earned</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reputation.reputation.badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-semibold">{badge.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Ratings */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Performance by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(reputation?.breakdown.byCategory || {}).map(
            ([category, data]) => (
              <div
                key={category}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="capitalize font-semibold mb-2">{category}</div>
                <div className="text-3xl font-bold text-blue-600">
                  {data.average.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {data.count} ratings
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function VerificationBadge({
  type,
  status,
  icon,
}: {
  type: string;
  status: string;
  icon: string;
}) {
  const statusColors = {
    verified: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    approved: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
    not_started: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100',
  };

  const statusText = {
    verified: 'Verified',
    approved: 'Approved',
    pending: 'Pending',
    rejected: 'Rejected',
    not_started: 'Not Started',
  };

  return (
    <div className={`p-4 rounded-lg ${statusColors[status as keyof typeof statusColors]}`}>
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="font-semibold">{type}</div>
          <div className="text-sm">{statusText[status as keyof typeof statusText]}</div>
        </div>
      </div>
    </div>
  );
}
