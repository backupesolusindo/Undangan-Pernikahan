import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '../api';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date_label: '',
    time_label: '',
    location: '',
    address: '',
    maps_url: '',
    target_gender: 'ALL',
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/admin/events');
      if (Array.isArray(res)) {
        setEvents(res);
      } else if (res?.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date_label: 'Minggu, 30 September 2026',
      time_label: '08:00 WIB - Selesai',
      location: '',
      address: '',
      maps_url: 'https://maps.google.com/?q=Surakarta',
      target_gender: 'ALL',
      sort_order: events.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      date_label: item.date_label || item.date || '',
      time_label: item.time_label || item.time || '',
      location: item.location || '',
      address: item.address || '',
      maps_url: item.maps_url || item.mapsUrl || '',
      target_gender: item.target_gender || 'ALL',
      sort_order: item.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) {
        await apiPost(`/api/admin/events/${editingItem.id}`, formData);
      } else {
        await apiPost('/api/admin/events', formData);
      }
      closeModal();
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan acara.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus acara "${title}"?`)) {
      try {
        await apiDelete(`/api/admin/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert(err.message || 'Gagal menghapus acara.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Rangkaian Acara Pernikahan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola sesi acara (Akad Nikah, Resepsi, dll), lokasi, jam, dan peta Google Maps
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Segarkan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Acara Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    Urutan #{ev.sort_order || 1}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{ev.title}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(ev)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id, ev.title)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{ev.date_label || ev.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{ev.time_label || ev.time}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <span className="font-semibold text-white">{ev.location}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ev.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {(ev.maps_url || ev.mapsUrl) && (
              <div className="pt-3 border-t border-slate-900">
                <a
                  href={ev.maps_url || ev.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Buka Peta Google Maps</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{editingItem ? 'Edit Acara' : 'Tambah Acara Baru'}</span>
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nama Sesi Acara</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akad Nikah / Resepsi"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Label Tanggal</label>
                  <input
                    type="text"
                    required
                    placeholder="Minggu, 30 September 2026"
                    value={formData.date_label}
                    onChange={(e) => setFormData({ ...formData, date_label: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Label Waktu</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 WIB - Selesai"
                    value={formData.time_label}
                    onChange={(e) => setFormData({ ...formData, time_label: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nama Gedung / Tempat</label>
                <input
                  type="text"
                  required
                  placeholder="Pendopo Kedhaton Jawa"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  placeholder="Jl. Joglo Karanganyar No. 88, Surakarta, Jawa Tengah"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">URL Google Maps</label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/?q=..."
                    value={formData.maps_url}
                    onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Urutan Tampil</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Acara'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

