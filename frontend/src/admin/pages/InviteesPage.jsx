import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Copy,
  Check,
  Share2,
  Trash2,
  Edit2,
  ExternalLink,
  MessageCircle,
  Phone,
  RefreshCw,
  X
} from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '../api';

export default function InviteesPage() {
  const [invitees, setInvitees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [coupleNames, setCoupleNames] = useState('Mempelai');
  const [copiedId, setCopiedId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Invitees
  const fetchInvitees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiGet('/api/admin/invitees');
      if (res?.data) {
        setInvitees(res.data);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat daftar tamu undangan');
    } finally {
      setLoading(false);
    }
  };

  // Fetch wedding settings for couple names
  const fetchSettings = async () => {
    try {
      const res = await apiGet('/api/admin/settings');
      if (res?.data) {
        const { groom_nickname, bride_nickname } = res.data;
        if (groom_nickname || bride_nickname) {
          setCoupleNames(`${bride_nickname || ''} & ${groom_nickname || ''}`.trim());
        }
      }
    } catch {
      // silently ignore; fallback to default
    }
  };

  useEffect(() => {
    fetchInvitees();
    fetchSettings();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', phone: '', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      phone: item.phone || '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama tamu wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await apiPost(`/api/admin/invitees/${editingItem.id}`, formData);
      } else {
        await apiPost('/api/admin/invitees', formData);
      }
      closeModal();
      fetchInvitees();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan tamu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus undangan untuk "${name}"?`)) {
      try {
        await apiDelete(`/api/admin/invitees/${id}`);
        fetchInvitees();
      } catch (err) {
        alert(err.message || 'Gagal menghapus');
      }
    }
  };

  // Base URL for the public invitation
  const siteUrl = window.location.origin;

  const getInvitationUrl = (slug, name) => {
    const param = slug || encodeURIComponent(name);
    return `${siteUrl}/?to=${param}`;
  };

  const copyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) {
      p = '62' + p.slice(1);
    } else if (!p.startsWith('62')) {
      p = '62' + p;
    }
    return p;
  };

  const shareViaWhatsApp = (item) => {
    const link = getInvitationUrl(item.slug, item.name);
    const phone = formatPhoneNumber(item.phone);

    const message = `Kepada Yth.
Bapak/Ibu/Saudara/i: *${item.name}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${coupleNames}*

Untuk informasi lengkap mengenai acara dan konfirmasi kehadiran, silakan buka tautan undangan digital berikut:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
_${coupleNames}_`;

    const encoded = encodeURIComponent(message);
    const url = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  // Filtered List
  const filteredInvitees = invitees.filter((it) => {
    const q = searchTerm.toLowerCase();
    return (
      (it.name && it.name.toLowerCase().includes(q)) ||
      (it.phone && it.phone.includes(q)) ||
      (it.notes && it.notes.toLowerCase().includes(q)) ||
      (it.slug && it.slug.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Daftar Tamu Undangan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Buat nama tamu fleksibel & hasilkan tautan undangan personal otomatis untuk setiap tamu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvitees}
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
            <span>Tambah Tamu Undangan</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama tamu, nomor telepon, atau catatan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          Total: <span className="font-bold text-white">{filteredInvitees.length}</span> Tamu
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Nama Tamu</th>
                <th className="py-3.5 px-4">Kontak / WhatsApp</th>
                <th className="py-3.5 px-4">Catatan / Kategori</th>
                <th className="py-3.5 px-4">Link Undangan Personal</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && invitees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    Memuat data tamu...
                  </td>
                </tr>
              ) : filteredInvitees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                    <p className="font-medium text-slate-400">Belum ada tamu undangan</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Klik "Tambah Tamu Undangan" untuk membuat link personal pertama Anda.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInvitees.map((item, index) => {
                  const url = getInvitationUrl(item.slug, item.name);
                  const isCopied = copiedId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{item.name}</div>
                        <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
                          slug: {item.slug}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.phone ? (
                          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{item.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.notes ? (
                          <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                            {item.notes}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={url}
                            className="w-48 sm:w-64 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono truncate focus:outline-none select-all"
                          />
                          <button
                            onClick={() => copyLink(item.id, url)}
                            title="Salin Tautan"
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isCopied
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Undangan"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => shareViaWhatsApp(item)}
                            title="Kirim via WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Hapus"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Invitee */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{editingItem ? 'Edit Tamu Undangan' : 'Tambah Tamu Undangan'}</span>
              </h3>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Nama Tamu <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Joko Widodo & Rekan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500">
                  Nama ini yang akan langsung tampil di kartu pembuka undangan.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Nomor WhatsApp / HP (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-500">
                  Digunakan untuk fitur kirim langsung via tombol WhatsApp.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Catatan / Kategori (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Keluarga, Teman Kantor, VIP"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
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
                  {submitting ? 'Menyimpan...' : 'Simpan Tamu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

