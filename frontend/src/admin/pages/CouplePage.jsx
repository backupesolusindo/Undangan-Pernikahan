import React, { useEffect, useState } from 'react';
import { Heart, Save, CheckCircle2, Upload, Instagram, RefreshCw } from 'lucide-react';
import { apiGet, resolveAdminImage, getToken } from '../api';

function CoupleCard({ role, title, data, onSave }) {
  const [formData, setFormData] = useState({
    nickname: '',
    name: '',
    father: '',
    mother: '',
    instagram: '',
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        nickname: data.nickname || '',
        name: data.name || '',
        father: data.father || '',
        mother: data.mother || '',
        instagram: data.instagram || '',
      });
      setPhotoPreview(data.photo || data.image_path ? resolveAdminImage(data.photo || data.image_path) : '');
    }
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const fd = new FormData();
    fd.append('role', role);
    fd.append('nickname', formData.nickname);
    fd.append('name', formData.name);
    fd.append('father', formData.father);
    fd.append('mother', formData.mother);
    fd.append('instagram', formData.instagram);
    if (selectedFile) {
      // Validasi ukuran file di frontend sebelum upload
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran foto maksimal 5MB.');
        setSaving(false);
        return;
      }
      fd.append('image', selectedFile);
    }

    try {
      const token = getToken();
      if (!token) {
        alert('Sesi telah berakhir. Silakan login ulang.');
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch(`/api/admin/couple/${role}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || `Server error: ${response.status}`);
      }

      setSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setSuccess(false), 3500);
      onSave?.();
    } catch (err) {
      console.error('Save couple error:', err);
      alert('Error: ' + (err.message || 'Gagal menyimpan data mempelai.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Heart className={`w-4 h-4 ${role === 'bride' ? 'text-pink-400' : 'text-amber-400'}`} />
          <span>{title}</span>
        </h3>
        {success && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tersimpan!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload & Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 relative group">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                No Photo
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 text-center sm:text-left">
            <label className="text-xs font-medium text-slate-300 block">
              Foto Mempelai
            </label>
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors border border-slate-700">
              <Upload className="w-3.5 h-3.5" />
              <span>Ganti Foto Baru</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-[10px] text-slate-500">
              Format: JPG, PNG, WEBP (maks. 5MB)
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Nama Panggilan</label>
          <input
            type="text"
            required
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Nama Lengkap & Gelar</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Nama Ayah</label>
            <input
              type="text"
              value={formData.father}
              onChange={(e) => setFormData({ ...formData, father: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Nama Ibu</label>
            <input
              type="text"
              value={formData.mother}
              onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Username Instagram</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Instagram className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@username"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Menyimpan...' : `Simpan ${title}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CouplePage() {
  const [coupleData, setCoupleData] = useState({ bride: null, groom: null });
  const [loading, setLoading] = useState(true);

  const fetchCouple = async () => {
    setLoading(true);
    try {
      const res = await apiGet('/api/admin/couple');
      if (res?.data) {
        setCoupleData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouple();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-400" />
            <span>Data Kedua Mempelai</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah nama, silsilah orang tua, akun media sosial, dan foto resmi kedua mempelai
          </p>
        </div>

        <button
          onClick={fetchCouple}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          title="Segarkan"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoupleCard
          role="groom"
          title="Mempelai Pria"
          data={coupleData.groom}
          onSave={fetchCouple}
        />
        <CoupleCard
          role="bride"
          title="Mempelai Wanita"
          data={coupleData.bride}
          onSave={fetchCouple}
        />
      </div>
    </div>
  );
}

