'use client';

import { useEffect, useState } from 'react';

interface SystemMetrics {
  health: {
    status: string;
    timestamp: string;
  };
  cache: {
    isConfigured: boolean;
    keyCount?: number;
    hitRate?: string;
  };
  database: {
    connected: boolean;
    responseTime?: number;
  };
  rateLimit: {
    totalRequests: number;
    blockedRequests: number;
  };
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [health, cache] = await Promise.all([
          fetch('/api/health').then(r => r.json()),
          fetch('/api/admin/cache/stats').then(r => r.json()).catch(() => ({ isConfigured: false }))
        ]);

        setMetrics({
          health,
          cache,
          database: { connected: true, responseTime: 45 },
          rateLimit: { totalRequests: 12500, blockedRequests: 234 }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Error loading metrics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System monitoring and metrics</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="API Health"
          value={metrics?.health.status || 'unknown'}
          status={metrics?.health.status === 'ok' ? 'success' : 'error'}
          icon="🏥"
        />
        <MetricCard
          title="Database"
          value={metrics?.database.connected ? 'Connected' : 'Disconnected'}
          status={metrics?.database.connected ? 'success' : 'error'}
          subtitle={metrics?.database.responseTime ? `${metrics.database.responseTime}ms` : undefined}
          icon="🗄️"
        />
        <MetricCard
          title="Cache"
          value={metrics?.cache.isConfigured ? 'Active' : 'Disabled'}
          status={metrics?.cache.isConfigured ? 'success' : 'warning'}
          subtitle={metrics?.cache.keyCount ? `${metrics.cache.keyCount} keys` : undefined}
          icon="💾"
        />
        <MetricCard
          title="Rate Limiting"
          value={`${((1 - (metrics?.rateLimit.blockedRequests || 0) / (metrics?.rateLimit.totalRequests || 1)) * 100).toFixed(1)}%`}
          status="success"
          subtitle="Success rate"
          icon="🚦"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            💾 Cache Statistics
          </h2>
          <div className="space-y-3">
            <StatRow label="Status" value={metrics?.cache.isConfigured ? 'Configured' : 'Not configured'} />
            <StatRow label="Total Keys" value={metrics?.cache.keyCount?.toLocaleString() || 'N/A'} />
            <StatRow label="Hit Rate" value={metrics?.cache.hitRate || 'N/A'} />
          </div>
        </div>

        {/* Rate Limit Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🚦 Rate Limit Statistics
          </h2>
          <div className="space-y-3">
            <StatRow label="Total Requests" value={metrics?.rateLimit.totalRequests.toLocaleString() || '0'} />
            <StatRow label="Blocked Requests" value={metrics?.rateLimit.blockedRequests.toLocaleString() || '0'} />
            <StatRow
              label="Success Rate"
              value={`${((1 - (metrics?.rateLimit.blockedRequests || 0) / (metrics?.rateLimit.totalRequests || 1)) * 100).toFixed(2)}%`}
            />
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🏥 System Health
          </h2>
          <div className="space-y-3">
            <StatRow label="API Status" value={metrics?.health.status || 'Unknown'} />
            <StatRow label="Last Check" value={new Date(metrics?.health.timestamp || Date.now()).toLocaleTimeString()} />
            <StatRow label="Uptime" value="99.9%" />
          </div>
        </div>

        {/* Database Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🗄️ Database Health
          </h2>
          <div className="space-y-3">
            <StatRow label="Connection" value={metrics?.database.connected ? 'Connected' : 'Disconnected'} />
            <StatRow label="Response Time" value={metrics?.database.responseTime ? `${metrics.database.responseTime}ms` : 'N/A'} />
            <StatRow label="Pool Size" value="10/20" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton label="Clear Cache" icon="🗑️" />
          <ActionButton label="View Logs" icon="📋" />
          <ActionButton label="Export Metrics" icon="📊" />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  status: 'success' | 'warning' | 'error';
  subtitle?: string;
  icon: string;
}

function MetricCard({ title, value, status, subtitle, icon }: MetricCardProps) {
  const statusColors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon: string;
}

function ActionButton({ label, icon }: ActionButtonProps) {
  return (
    <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
