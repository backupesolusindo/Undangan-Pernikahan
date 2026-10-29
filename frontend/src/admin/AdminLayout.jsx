import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  Heart,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  MessageSquare,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck
} from 'lucide-react';
import { getUser, logoutAdmin } from './api';

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  // /admin/* dan halaman undangan berbagi satu index.html,
  // jadi title tab harus di-set sendiri di sini.
  useEffect(() => {
    document.title = 'Panel Admin | Undangan Pernikahan Digital';
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      await logoutAdmin();
      navigate('/admin/login');
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Tamu Undangan',
      path: '/admin/invitees',
      icon: Users,
      badge: 'Fleksibel',
    },
    {
      name: 'Pengaturan Undangan',
      path: '/admin/settings',
      icon: Settings,
    },
    {
      name: 'Data Mempelai',
      path: '/admin/couple',
      icon: Heart,
    },
    {
      name: 'Acara Pernikahan',
      path: '/admin/events',
      icon: Calendar,
    },
    {
      name: 'Galeri Foto',
      path: '/admin/gallery',
      icon: ImageIcon,
    },
    {
      name: 'Kisah Cinta',
      path: '/admin/stories',
      icon: BookOpen,
    },
    {
      name: 'RSVP & Ucapan',
      path: '/admin/rsvp',
      icon: MessageSquare,
    },
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-950 border-r border-slate-800 shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/80">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">Admin Undangan</h1>
            <p className="text-[11px] text-slate-400">Panel Manajemen</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${active
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${active ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Undangan</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Live</span>
          </a>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400">@{user?.username || 'admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] bg-slate-950 flex flex-col z-10 border-r border-slate-800">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm text-white">Admin Undangan</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${active ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800/40"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lihat Undangan</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Live</span>
              </a>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/70 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-400">Pernikahan Dimas & Devi</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="text-xs text-emerald-400 font-medium">Sistem Aktif</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Undangan</span>
            </a>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

