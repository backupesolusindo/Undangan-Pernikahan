import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  Search,
  Trash2,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Users
} from 'lucide-react';
import { apiGet, apiDelete } from '../api';

export default function RsvpPage() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/admin/guests');
      if (res?.data) {
        setGuests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus ucapan dan konfirmasi dari "${name}"?`)) {
      try {
        await apiDelete(`/api/admin/guests/${id}`);
        fetchGuests();
      } catch (err) {
        alert(err.message || 'Gagal menghapus ucapan');
      }
    }
  };

  // Stats calculation
  const totalRsvp = guests.length;
  const hadirCount = guests.filter((g) => (g.status || '').toLowerCase() === 'hadir').length;
  const tidakHadirCount = guests.filter((g) => (g.status || '').toLowerCase() === 'tidak hadir').length;
  const totalPax = guests
    .filter((g) => (g.status || '').toLowerCase() === 'hadir')
    .reduce((sum, g) => sum + (parseInt(g.guest_count) || 1), 0);

  // Filtered
  const filtered = guests.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (statusFilter === 'ALL') return true;
    return (item.status || '').toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Konfirmasi Kehadiran & Ucapan (RSVP)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar ucapan selamat, doa restu, dan status kehadiran dari para tamu
          </p>
        </div>

        <button
          onClick={fetchGuests}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          title="Segarkan"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-slate-400">Total Ucapan</p>
          <p className="text-xl font-bold text-white mt-1">{totalRsvp}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-emerald-400">Konfirmasi Hadir</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{hadirCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-rose-400">Tidak Hadir</p>
          <p className="text-xl font-bold text-rose-400 mt-1">{tidakHadirCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <p className="text-[11px] text-amber-400">Estimasi Jumlah Pax Hadir</p>
          <p className="text-xl font-bold text-amber-400 mt-1">{totalPax} Orang</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, pesan, atau nomor HP..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak hadir">Tidak Hadir</option>
            <option value="ragu-ragu">Ragu-ragu</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Tamu</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Kehadiran</th>
                <th className="py-3.5 px-4">Jumlah</th>
                <th className="py-3.5 px-4">Ucapan & Doa</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && guests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    Memuat data ucapan...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                    <p className="font-medium text-slate-400">Belum ada ucapan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const status = (item.status || '').toLowerCase();
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white">
                        {item.name}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {item.phone || '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            status === 'hadir'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : status === 'tidak hadir'
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}
                        >
                          {status === 'hadir' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{item.status || 'Hadir'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 font-mono">
                        {item.guest_count || 1} orang
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 max-w-xs leading-relaxed italic">
                        "{item.message}"
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.created_at || '-'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus Ucapan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

