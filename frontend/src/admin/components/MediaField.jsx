import React, { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, ImageOff } from 'lucide-react';
import { resolveAdminImage } from '../api';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_SIZE = 5 * 1024 * 1024;

export function humanSize(bytes) {
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;
}

/**
 * Field upload foto untuk halaman pengaturan.
 * Nilai disimpan sebagai path relatif (mis. uploads/xxx.png) di key settings.
 */
export default function MediaField({
  label,
  hint,
  value,
  file,
  onFileChange,
  onClear,
}) {
  const inputRef = useRef(null);
  const [objectUrl, setObjectUrl] = useState(null);
  const [fileError, setFileError] = useState('');

  // Preview file yang baru dipilih sebelum diunggah.
  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    setFileError('');
    e.target.value = '';

    if (!picked) return;

    if (picked.size > MAX_SIZE) {
      setFileError(`Ukuran ${humanSize(picked.size)} melebihi batas 5MB.`);
      return;
    }

    onFileChange(picked);
  };

  const handleRemove = () => {
    setFileError('');
    onFileChange(null);
    onClear();
  };

  const src = objectUrl || (value ? resolveAdminImage(value) : '');

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-300">{label}</label>

      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="h-28 bg-slate-950 flex items-center justify-center overflow-hidden">
          {src ? (
            <img
              src={src}
              alt={label}
              className={`h-full w-full object-cover ${objectUrl ? 'opacity-60' : ''}`}
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-600">
              <ImageOff className="w-5 h-5" />
              <span className="text-[10px]">Belum ada foto</span>
            </div>
          )}
        </div>

        <div className="p-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{file ? 'Ganti foto' : 'Pilih foto'}</span>
          </button>

          {(file || value) && (
            <button
              type="button"
              onClick={handleRemove}
              title="Hapus foto"
              className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handlePick}
        className="hidden"
      />

      <p className="text-[10px] text-slate-500 leading-relaxed">
        {file ? (
          <span className="text-amber-400">
            {file.name} ({humanSize(file.size)}) — belum tersimpan, tekan Simpan.
          </span>
        ) : hint}
      </p>

      {fileError && <p className="text-[10px] text-rose-400">{fileError}</p>}
    </div>
  );
}