'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/components/providers/AdminAuthProvider';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Award, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/requests', label: 'Export Requests', icon: Mail },
  { href: '/admin/contact', label: 'Contact Info', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-[#2d7a3e] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-[#2d7a3e] to-[#1d5a2e] text-white transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold">Al-Rehab Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/20">
            <Link href="/" className="block mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
              >
                View Website
              </Button>
            </Link>
            
            {user && (
              <div className="mb-4 px-2">
                <p className="text-white/50 text-xs">Logged in as</p>
                <p className="text-white text-sm truncate">{user.email}</p>
              </div>
            )}
            
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
      </aside>
    </>
  );
}
