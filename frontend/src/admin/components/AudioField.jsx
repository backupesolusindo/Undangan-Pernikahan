import React, { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Music } from 'lucide-react';
import { resolveAdminImage } from '../api';

const ACCEPT = 'audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,audio/mp4,audio/x-m4a';
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

function humanSize(bytes) {
    return bytes >= 1048576
        ? `${(bytes / 1048576).toFixed(1)}MB`
        : `${Math.round(bytes / 1024)}KB`;
}

/**
 * Field upload audio untuk halaman pengaturan.
 * Preview langsung dengan pemutar audio HTML sebelum diunggah.
 */
export default function AudioField({ label, hint, value, file, onFileChange, onClear }) {
    const inputRef = useRef(null);
    const [objectUrl, setObjectUrl] = useState(null);
    const [fileError, setFileError] = useState('');

    // Buat object URL untuk preview sebelum upload
    useEffect(() => {
        if (!file) { setObjectUrl(null); return; }
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
            setFileError(`Ukuran ${humanSize(picked.size)} melebihi batas 20MB.`);
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
                {/* Preview area */}
                <div className="h-20 bg-slate-950 flex items-center justify-center px-4">
                    {src ? (
                        <audio
                            src={src}
                            controls
                            preload="metadata"
                            className="w-full h-10"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-1.5 text-slate-600">
                            <Music className="w-5 h-5" />
                            <span className="text-[10px]">Belum ada audio</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="p-2.5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{file ? 'Ganti audio' : 'Pilih audio'}</span>
                    </button>

                    {(file || value) && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            title="Hapus audio"
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
