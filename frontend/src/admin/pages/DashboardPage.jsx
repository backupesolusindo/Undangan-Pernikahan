import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Heart,
  ImageIcon,
  Calendar,
  Settings,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { apiGet } from '../api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiGet('/api/admin/dashboard');
      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-900 border border-amber-500/30 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Selamat Datang di Panel Undangan!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Kelola data mempelai, tanggal acara, serta daftar nama tamu yang diundang secara dinamis dan fleksibel tanpa perlu mengubah kode sumber.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <Link
              to="/admin/invitees"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Kelola Tamu Undangan</span>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tamu Undangan */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tamu Terdaftar</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {loading ? '...' : (stats?.total_invitees ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            Daftar nama undangan yang dibuat
          </p>
        </div>

        {/* Hadir */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Konfirmasi Hadir</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
            {loading ? '...' : (stats?.hadir ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            Total {stats?.total_pax ?? 0} orang / pax
          </p>
        </div>

        {/* Tidak Hadir */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tidak Hadir</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400">
            {loading ? '...' : (stats?.tidak_hadir ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            Menyampaikan permohonan maaf
          </p>
        </div>

        {/* Total RSVP */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Ucapan RSVP</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">
            {loading ? '...' : (stats?.total_rsvp ?? 0)}
          </div>
          <p className="text-[11px] text-slate-500">
            Ucapan doa & konfirmasi masuk
          </p>
        </div>
      </div>

      {/* Content Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/gallery"
          className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Galeri Foto</p>
              <h4 className="text-lg font-bold text-white">{stats?.total_gallery ?? 0} Foto</h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/stories"
          className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Kisah Cinta</p>
              <h4 className="text-lg font-bold text-white">{stats?.total_stories ?? 0} Momen</h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/events"
          className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Rangkaian Acara</p>
              <h4 className="text-lg font-bold text-white">{stats?.total_events ?? 0} Sesi</h4>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Quick Action Guides */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Panduan Penggunaan Cepat</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-amber-400">1. Nama Undangan Fleksibel</div>
            <p className="text-slate-400 leading-relaxed">
              Buka menu <b>Tamu Undangan</b>, tambahkan nama tamu (misal: "Bapak Joko Widodo"). Sistem akan otomatis membuatkan link khusus dan tombol 1-klik untuk salin tautan atau kirim via WhatsApp.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="font-semibold text-amber-400">2. Ubah Info Tanpa Hardcode</div>
            <p className="text-slate-400 leading-relaxed">
              Buka menu <b>Pengaturan Undangan</b> atau <b>Data Mempelai</b> untuk memperbarui tanggal, nomor rekening tanda kasih, kutipan ayat, audio, dan foto sampul langsung dari panel ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

