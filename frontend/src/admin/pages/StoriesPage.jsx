import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Calendar,
  RefreshCw,
  X
} from 'lucide-react';
import { apiGet, apiPostForm, apiDelete, resolveAdminImage } from '../api';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/admin/stories');
      if (res?.data) {
        setStories(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setYear(new Date().getFullYear().toString());
    setTitle('');
    setDescription('');
    setSortOrder(stories.length + 1);
    setImageUrl('');
    setSelectedFile(null);
    setPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setYear(item.year || '');
    setTitle(item.title || '');
    setDescription(item.description || '');
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
    if (!title.trim()) {
      alert('Judul cerita wajib diisi.');
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('year', year);
    fd.append('title', title);
    fd.append('description', description);
    fd.append('sort_order', sortOrder);
    if (selectedFile) {
      fd.append('image', selectedFile);
    } else if (imageUrl.trim()) {
      fd.append('image_url', imageUrl.trim());
    }

    try {
      if (editingItem) {
        await apiPostForm(`/api/admin/stories/${editingItem.id}`, fd);
      } else {
        await apiPostForm('/api/admin/stories', fd);
      }
      closeModal();
      fetchStories();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan cerita.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus kisah "${title}"?`)) {
      try {
        await apiDelete(`/api/admin/stories/${id}`);
        fetchStories();
      } catch (err) {
        alert(err.message || 'Gagal menghapus cerita.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Kisah Cinta (Love Journey)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola linimasa perjalanan cinta kedua mempelai (Pisanan Kepanggih, Lamaran, dll)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStories}
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
            <span>Tambah Momen Cinta</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {stories.map((story) => {
          const imgSrc = resolveAdminImage(story.url || story.image_path);
          return (
            <div
              key={story.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  {imgSrc ? (
                    <img src={imgSrc} alt={story.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[11px] font-bold">
                    <Calendar className="w-3 h-3" />
                    <span>Tahun {story.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate">{story.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 max-w-xl leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => openEditModal(story)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(story.id, story.title)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{editingItem ? 'Edit Kisah Cinta' : 'Tambah Momen Baru'}</span>
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Tahun</label>
                  <input
                    type="text"
                    required
                    placeholder="2021"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Urutan Tampil</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Judul Momen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pisanan Kepanggih (Pertama Bertemu)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Cerita / Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan momen indah Anda..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Photo Preview & Picker */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">Foto Momen</label>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
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
                    <span>Upload Foto</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Atau URL Foto</label>
                <input
                  type="text"
                  placeholder="/assets/story1.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!selectedFile) setPreview(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
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
                  {submitting ? 'Menyimpan...' : 'Simpan Cerita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

