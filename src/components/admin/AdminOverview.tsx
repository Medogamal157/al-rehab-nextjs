'use client';

import { motion } from 'framer-motion';
import { Package, FolderTree, Award, Mail, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AdminOverview() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCertificates: 0,
    totalRequests: 0,
    recentRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch stats from API - only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        
        if (isMounted) {
          // Calculate stats from analytics data
          setStats({
            totalProducts: data.stats?.totalProducts || 0,
            totalCategories: data.stats?.totalCategories || 0,
            totalCertificates: data.stats?.totalCertificates || 0,
            totalRequests: data.stats?.totalRequests || 0,
            recentRequests: data.stats?.recentRequests || 0,
          });
        }
      } catch (err) {
        if (isMounted) {
          toast({
            title: 'Error',
            description: 'Failed to load dashboard stats',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();
    
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'from-green-500 to-emerald-600',
      href: '/admin/categories',
    },
    {
      title: 'Certificates',
      value: stats.totalCertificates,
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      href: '/admin/certificates',
    },
    {
      title: 'Export Requests',
      value: stats.totalRequests,
      icon: Mail,
      color: 'from-purple-500 to-pink-600',
      href: '/admin/requests',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2d7a3e] to-[#1d5a2e] rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-white/80">
          Manage your Al-Rehab Group for Export website content and view export requests
        </p>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d7a3e]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(stat.href)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl text-gray-900">{stat.value}</p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-gray-900">Recent Activity</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-900">{stats.recentRequests} new export requests</p>
              <p className="text-xs text-gray-500">In the last 7 days</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-900">{stats.totalProducts} products in catalog</p>
              <p className="text-xs text-gray-500">Across {stats.totalCategories} categories</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h2 className="text-xl text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/admin/products')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2d7a3e] hover:bg-[#2d7a3e]/5 transition-all text-left"
          >
            <Package className="w-8 h-8 text-[#2d7a3e] mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">Add Product</h3>
            <p className="text-xs text-gray-500">Add new products to catalog</p>
          </button>
          <button
            onClick={() => router.push('/admin/certificates')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2d7a3e] hover:bg-[#2d7a3e]/5 transition-all text-left"
          >
            <Award className="w-8 h-8 text-[#2d7a3e] mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">Manage Certificates</h3>
            <p className="text-xs text-gray-500">Upload and manage certificates</p>
          </button>
          <button
            onClick={() => router.push('/admin/requests')}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-[#2d7a3e] hover:bg-[#2d7a3e]/5 transition-all text-left"
          >
            <Mail className="w-8 h-8 text-[#2d7a3e] mb-2" />
            <h3 className="text-sm text-gray-900 mb-1">View Requests</h3>
            <p className="text-xs text-gray-500">Check export requests</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
