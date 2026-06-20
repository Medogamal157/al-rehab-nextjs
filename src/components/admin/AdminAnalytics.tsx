'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Globe, Package, Calendar, Monitor, Chrome, Eye, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

// Analytics data interface
interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  totalCertificates: number;
  totalRequests: number;
  recentRequests: number;
  totalPageViews: number;
  pageViews: { name: string; value: number }[];
  productViews: { name: string; views: number }[];
  countryStats: { country: string; requests: number }[];
  monthlyRequests: { month: string; requests: number }[];
  deviceStats: { device: string; count: number }[];
  browserStats: { browser: string; count: number }[];
}

interface AdminAnalyticsProps {
  initialData: AnalyticsData;
}

type RangePreset = '7' | '30' | '90' | 'custom';

const PRESET_LABELS: Record<Exclude<RangePreset, 'custom'>, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '90': 'Last 90 days',
};

// Map the /api/analytics response (which nests entity counts under `stats`)
// to the flat AnalyticsData shape this component renders.
function mapAnalyticsResponse(json: Record<string, unknown>): AnalyticsData {
  const stats = (json.stats || {}) as Record<string, number>;
  return {
    totalProducts: stats.totalProducts ?? 0,
    totalCategories: stats.totalCategories ?? 0,
    totalCertificates: stats.totalCertificates ?? 0,
    totalRequests: stats.totalRequests ?? 0,
    recentRequests: stats.recentRequests ?? 0,
    totalPageViews: stats.totalPageViews ?? 0,
    pageViews: (json.pageViews as AnalyticsData['pageViews']) ?? [],
    productViews: (json.productViews as AnalyticsData['productViews']) ?? [],
    countryStats: (json.countryStats as AnalyticsData['countryStats']) ?? [],
    monthlyRequests: (json.monthlyRequests as AnalyticsData['monthlyRequests']) ?? [],
    deviceStats: (json.deviceStats as AnalyticsData['deviceStats']) ?? [],
    browserStats: (json.browserStats as AnalyticsData['browserStats']) ?? [],
  };
}

export function AdminAnalytics({ initialData: serverData }: AdminAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData>(serverData);
  const [preset, setPreset] = useState<RangePreset>('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  // Alias so the existing JSX (which references `initialData`) renders live data.
  const initialData = data;

  const rangeLabel =
    preset === 'custom'
      ? customFrom && customTo
        ? `${customFrom} → ${customTo}`
        : 'Custom range'
      : PRESET_LABELS[preset];

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (preset === 'custom') {
        if (!customFrom || !customTo) {
          setIsLoading(false);
          return;
        }
        params.set('from', customFrom);
        params.set('to', customTo);
      } else {
        params.set('period', preset);
      }

      const res = await fetch(`/api/analytics?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load analytics');
      const json = await res.json();
      setData(mapAnalyticsResponse(json));
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [preset, customFrom, customTo]);

  // Re-fetch when the range changes (skip the first render — server provided it).
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Calculate totals from initialData
  const totalPageViews = initialData.totalPageViews || initialData.pageViews.reduce((sum, item) => sum + item.value, 0);
  const totalProductViews = initialData.productViews.reduce((sum, item) => sum + item.views, 0);
  const totalCountryViews = initialData.countryStats.reduce((sum, item) => sum + item.requests, 0);
  const totalMonthlyViews = initialData.monthlyRequests.reduce((sum, item) => sum + item.requests, 0);

  // Find max values for bar chart scaling
  const maxPageViews = Math.max(...initialData.pageViews.map(d => d.value), 1);
  const maxProductViews = Math.max(...initialData.productViews.map(d => d.views), 1);
  const maxCountryRequests = Math.max(...initialData.countryStats.map(d => d.requests), 1);
  const maxMonthlyRequests = Math.max(...initialData.monthlyRequests.map(d => d.requests), 1);
  const maxDeviceCount = Math.max(...(initialData.deviceStats?.map(d => d.count) || []), 1);
  const maxBrowserCount = Math.max(...(initialData.browserStats?.map(b => b.count) || []), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">Real-time website performance and insights</p>
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex flex-wrap items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          <div className="flex items-center rounded-lg border bg-white p-1">
            {(['7', '30', '90'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  preset === p
                    ? 'bg-[#2d7a3e] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}d
              </button>
            ))}
            <button
              onClick={() => setPreset('custom')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                preset === 'custom'
                  ? 'bg-[#2d7a3e] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Custom
            </button>
          </div>

          {preset === 'custom' && (
            <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={customFrom}
                max={customTo || undefined}
                onChange={(e) => setCustomFrom(e.target.value)}
                aria-label="From date"
                className="text-sm text-gray-700 focus:outline-none"
              />
              <span className="text-gray-400">–</span>
              <input
                type="date"
                value={customTo}
                min={customFrom || undefined}
                onChange={(e) => setCustomTo(e.target.value)}
                aria-label="To date"
                className="text-sm text-gray-700 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Page Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xs text-gray-500">{rangeLabel}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalPageViews.toLocaleString()}</h3>
          <p className="text-sm text-gray-500">Page Views</p>
        </motion.div>

        {/* Total Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{initialData.totalProducts}</h3>
          <p className="text-sm text-gray-500">Products</p>
        </motion.div>

        {/* Total Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{initialData.totalCategories}</h3>
          <p className="text-sm text-gray-500">Categories</p>
        </motion.div>

        {/* Total Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{initialData.totalCertificates}</h3>
          <p className="text-sm text-gray-500">Certificates</p>
        </motion.div>

        {/* Recent Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{initialData.recentRequests}</h3>
          <p className="text-sm text-gray-500">Recent Requests</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Page Views</h2>
            <span className="ml-auto text-sm text-gray-500">{totalPageViews.toLocaleString()} total</span>
          </div>
          {initialData.pageViews.length > 0 ? (
            <div className="space-y-4">
              {initialData.pageViews.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / maxPageViews) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="bg-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No page view data yet</p>
              <p className="text-sm">Views will appear as visitors browse your site</p>
            </div>
          )}
        </motion.div>

        {/* Product Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
            <span className="ml-auto text-sm text-gray-500">{totalProductViews.toLocaleString()} views</span>
          </div>
          {initialData.productViews.length > 0 ? (
            <div className="space-y-4">
              {initialData.productViews.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.views.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.views / maxProductViews) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No product views yet</p>
              <p className="text-sm">Product views will appear as visitors view product details</p>
            </div>
          )}
        </motion.div>

        {/* Country Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Top Countries</h2>
            <span className="ml-auto text-sm text-gray-500">{totalCountryViews.toLocaleString()} visits</span>
          </div>
          {initialData.countryStats.length > 0 ? (
            <div className="space-y-4">
              {initialData.countryStats.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.country}</span>
                    <span className="font-medium text-gray-900">{item.requests.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.requests / maxCountryRequests) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                      className="bg-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No country data yet</p>
              <p className="text-sm">Country data will appear as visitors from different regions browse</p>
            </div>
          )}
        </motion.div>

        {/* Monthly Page Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Monthly Page Views</h2>
            <span className="ml-auto text-sm text-gray-500">{totalMonthlyViews.toLocaleString()} total</span>
          </div>
          {initialData.monthlyRequests.some(m => m.requests > 0) ? (
            <div className="space-y-4">
              {initialData.monthlyRequests.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.month}</span>
                    <span className="font-medium text-gray-900">{item.requests.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${maxMonthlyRequests > 0 ? (item.requests / maxMonthlyRequests) * 100 : 0}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="bg-orange-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No monthly data yet</p>
              <p className="text-sm">Monthly trends will appear over time</p>
            </div>
          )}
        </motion.div>

        {/* Device Stats */}
        {initialData.deviceStats && initialData.deviceStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Devices</h2>
            </div>
            <div className="space-y-4">
              {initialData.deviceStats.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 capitalize">{item.device}</span>
                    <span className="font-medium text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxDeviceCount) * 100}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className="bg-cyan-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Browser Stats */}
        {initialData.browserStats && initialData.browserStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Chrome className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Browsers</h2>
            </div>
            <div className="space-y-4">
              {initialData.browserStats.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.browser}</span>
                    <span className="font-medium text-gray-900">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxBrowserCount) * 100}%` }}
                      transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                      className="bg-pink-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
