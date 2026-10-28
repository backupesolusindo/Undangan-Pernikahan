import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Calendar,
  Heart,
  Quote,
  Music,
  CreditCard,
  Gift,
  RefreshCw,
  Info
} from 'lucide-react';
import MediaField from '../components/MediaField';
import VideoField from '../components/VideoField';
import AudioField from '../components/AudioField';
import { apiGet, apiPostForm } from '../api';

// Nama field berkas pada request multipart (lihat AdminApi::updateSettings).
const HERO_IMAGE_FIELD = 'hero_image_file';
const FRAME_IMAGE_FIELD = 'hero_fullscreen_image_file';
const VIDEO_FIELD = 'video_url_file';
const AUDIO_FIELD = 'audio_url_file';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [files, setFiles] = useState({ hero_image: null, hero_fullscreen_image: null, video_url: null, audio_url: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiGet('/api/admin/settings');
      if (res?.data) {
        setSettings(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleMediaClear = (key) => {
    handleChange(key, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const fd = new FormData();

      Object.entries(settings).forEach(([key, value]) => {
        fd.append(key, value === null || value === undefined ? '' : String(value));
      });

      if (files.hero_image) {
        fd.append(HERO_IMAGE_FIELD, files.hero_image);
      }
      if (files.hero_fullscreen_image) {
        fd.append(FRAME_IMAGE_FIELD, files.hero_fullscreen_image);
      }
      if (files.video_url) {
        fd.append(VIDEO_FIELD, files.video_url);
      }
      if (files.audio_url) {
        fd.append(AUDIO_FIELD, files.audio_url);
      }

      const res = await apiPostForm('/api/admin/settings', fd);

      setFiles({ hero_image: null, hero_fullscreen_image: null, video_url: null, audio_url: null });

      if (res?.data) {
        setSettings(res.data);
      }

      setSuccessMsg('Pengaturan undangan berhasil disimpan dan langsung diterapkan!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Pengaturan Undangan Digital</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah seluruh teks, tanggal, rekening, ayat, dan media undangan secara dinamis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Segarkan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Tanggal & Waktu */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Waktu & Tanggal Acara Utama</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Target Tanggal Countdown (ISO Format)
              </label>
              <input
                type="text"
                value={settings.event_date || ''}
                onChange={(e) => handleChange('event_date', e.target.value)}
                placeholder="2026-09-30T08:00:00+07:00"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Format: YYYY-MM-DDTHH:mm:ss+07:00 (digunakan untuk hitung mundur otomatis)
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Label Tanggal Tampil
              </label>
              <input
                type="text"
                value={settings.event_date_formatted || ''}
                onChange={(e) => handleChange('event_date_formatted', e.target.value)}
                placeholder="Minggu, 30 September 2026"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500">
                Teks tanggal yang dibaca oleh tamu undangan
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Mempelai Pria */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Heart className="w-4 h-4 text-amber-400" />
            <span>Profil Mempelai Pria (Groom)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={settings.groom_name || ''}
                onChange={(e) => handleChange('groom_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Panggilan</label>
              <input
                type="text"
                value={settings.groom_nickname || ''}
                onChange={(e) => handleChange('groom_nickname', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Ayah</label>
              <input
                type="text"
                value={settings.groom_father || ''}
                onChange={(e) => handleChange('groom_father', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Ibu</label>
              <input
                type="text"
                value={settings.groom_mother || ''}
                onChange={(e) => handleChange('groom_mother', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Akun Instagram</label>
              <input
                type="text"
                value={settings.groom_instagram || ''}
                onChange={(e) => handleChange('groom_instagram', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Mempelai Wanita */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>Profil Mempelai Wanita (Bride)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={settings.bride_name || ''}
                onChange={(e) => handleChange('bride_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Panggilan</label>
              <input
                type="text"
                value={settings.bride_nickname || ''}
                onChange={(e) => handleChange('bride_nickname', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Ayah</label>
              <input
                type="text"
                value={settings.bride_father || ''}
                onChange={(e) => handleChange('bride_father', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Ibu</label>
              <input
                type="text"
                value={settings.bride_mother || ''}
                onChange={(e) => handleChange('bride_mother', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Akun Instagram</label>
              <input
                type="text"
                value={settings.bride_instagram || ''}
                onChange={(e) => handleChange('bride_instagram', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Kutipan / Ayat */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Quote className="w-4 h-4 text-amber-400" />
            <span>Kutipan / Ayat Suci</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Isi Kutipan / Doa</label>
              <textarea
                rows={3}
                value={settings.quote_text || ''}
                onChange={(e) => handleChange('quote_text', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Sumber Kutipan</label>
              <input
                type="text"
                value={settings.quote_source || ''}
                onChange={(e) => handleChange('quote_source', e.target.value)}
                placeholder="QS. Ar-Rum: 21"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Foto Sampul & Frame Background */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Foto Sampul & Frame Background</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MediaField
              label="Foto Sampul Utama (Hero Image)"
              hint="JPG/PNG/WebP/GIF, maksimal 5MB. Dipakai di cover undangan, hitung mundur, kartu acara, dan halaman kado."
              value={settings.hero_image || ''}
              file={files.hero_image}
              onFileChange={(file) => handleFileChange('hero_image', file)}
              onClear={() => handleMediaClear('hero_image')}
            />

            <MediaField
              label="Foto Frame Background (Fullscreen)"
              hint="JPG/PNG/WebP/GIF, maksimal 5MB. Dipakai di frame fullscreen, latar acara, dan bingkai kartu oval."
              value={settings.hero_fullscreen_image || ''}
              file={files.hero_fullscreen_image}
              onFileChange={(file) => handleFileChange('hero_fullscreen_image', file)}
              onClear={() => handleMediaClear('hero_fullscreen_image')}
            />
          </div>

          <VideoField
            label="Video Pembuka (Opening Video)"
            hint="MP4/WebM, maksimal 50MB. Ditampilkan setelah tamu menekan 'Buka Undangan' sebelum masuk ke konten undangan."
            value={settings.video_url || ''}
            file={files.video_url}
            onFileChange={(file) => handleFileChange('video_url', file)}
            onUrlChange={(url) => handleChange('video_url', url)}
            onClear={() => handleMediaClear('video_url')}
          />

          <AudioField
            label="Musik Latar Undangan (Background Music)"
            hint="MP3/WAV/OGG/M4A, maksimal 20MB. Diputar otomatis saat undangan dibuka oleh tamu."
            value={settings.audio_url || ''}
            file={files.audio_url}
            onFileChange={(file) => handleFileChange('audio_url', file)}
            onUrlChange={(url) => handleChange('audio_url', url)}
            onClear={() => handleMediaClear('audio_url')}
          />

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Berkas foto, video, dan audio diunggah ke server dan disimpan di database, lalu diambil ulang saat
              undangan dibuka. Mengganti berkas akan otomatis menghapus berkas lama dari server.
            </p>
          </div>
        </div>

        {/* Section 6: Rekening & Hadiah */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Tanda Kasih (Nomor Rekening & Alamat Kado)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Nama Bank 1</label>
              <input
                type="text"
                value={settings.bank1_name || ''}
                onChange={(e) => handleChange('bank1_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">No. Rekening Bank 1</label>
              <input
                type="text"
                value={settings.bank1_account || ''}
                onChange={(e) => handleChange('bank1_account', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Atas Nama Bank 1</label>
              <input
                type="text"
                value={settings.bank1_holder || ''}
                onChange={(e) => handleChange('bank1_holder', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Penerima Kado Fisik</label>
              <input
                type="text"
                value={settings.gift_name || ''}
                onChange={(e) => handleChange('gift_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Alamat Kirim Kado</label>
              <input
                type="text"
                value={settings.gift_address || ''}
                onChange={(e) => handleChange('gift_address', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

