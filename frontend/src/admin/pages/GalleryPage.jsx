import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Upload,
  RefreshCw,
  X
} from 'lucide-react';
import { apiGet, apiPostForm, apiDelete, resolveAdminImage } from '../api';

export default function GalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [caption, setCaption] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/admin/gallery');
      if (res?.data) {
        setGallery(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setCaption('');
    setSortOrder(gallery.length + 1);
    setImageUrl('');
    setSelectedFile(null);
    setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setCaption(item.caption || '');
    setSortOrder(item.sort_order || 0);
    setImageUrl(item.image_path || item.url || '');
    setSelectedFile(null);
    setPreview(resolveAdminImage(item.url || item.image_path));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !selectedFile && !imageUrl.trim()) {
      alert('Silakan pilih berkas foto atau masukkan URL foto.');
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('caption', caption);
    fd.append('sort_order', sortOrder);
    if (selectedFile) {
      fd.append('image', selectedFile);
    } else if (imageUrl.trim()) {
      fd.append('image_url', imageUrl.trim());
    }

    try {
      if (editingItem) {
        await apiPostForm(`/api/admin/gallery/${editingItem.id}`, fd);
      } else {
        await apiPostForm('/api/admin/gallery', fd);
      }
      closeModal();
      fetchGallery();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan foto.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus foto "${title || 'ini'}"?`)) {
      try {
        await apiDelete(`/api/admin/gallery/${id}`);
        fetchGallery();
      } catch (err) {
        alert(err.message || 'Gagal menghapus foto.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>Galeri Foto Prewedding</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Unggah dan atur foto-foto prewedding yang akan tampil di halaman undangan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchGallery}
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
            <span>Tambah Foto Galeri</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => {
          const imgSrc = resolveAdminImage(item.url || item.image_path);
          return (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-slate-900">
                <img
                  src={imgSrc}
                  alt={item.caption || 'Foto'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-amber-400 font-mono">
                  #{item.sort_order || 0}
                </div>
              </div>

              <div className="p-3 flex items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950">
                <p className="text-xs text-slate-300 truncate flex-1">
                  {item.caption || <span className="text-slate-600 italic">Tanpa caption</span>}
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.caption)}
                    className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>{editingItem ? 'Edit Foto' : 'Unggah Foto Baru'}</span>
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Preview & Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">Pilih Berkas Foto</label>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                        No img
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih dari Komputer</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Atau Gunakan URL Foto</label>
                <input
                  type="text"
                  placeholder="/assets/gallery1.jpg atau https://..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!selectedFile) setPreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Caption / Keterangan Foto</label>
                <input
                  type="text"
                  placeholder="Contoh: Busana Adat Jawa Solo Basahan"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Nomor Urutan Tampil</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

