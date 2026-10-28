import React, { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, VideoOff, Globe, Sparkles } from 'lucide-react';
import { resolveAdminImage } from '../api';

const ACCEPT = 'video/mp4,video/webm';
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
export const DEFAULT_GIT_VIDEO = 'https://cdn.jsdelivr.net/gh/backupesolusindo/Undangan-Pernikahan@main/frontend/public/assets/opening_video2.mp4';

export function humanSize(bytes) {
    return bytes >= 1048576
        ? `${(bytes / 1048576).toFixed(1)}MB`
        : `${Math.round(bytes / 1024)}KB`;
}

/**
 * Field video fleksibel: mendukung URL langsung (CDN/Git/Cloud) & upload berkas lokal.
 */
export default function VideoField({
    label,
    hint,
    value,
    file,
    onFileChange,
    onUrlChange,
    onClear,
}) {
    const inputRef = useRef(null);
    const [objectUrl, setObjectUrl] = useState(null);
    const [fileError, setFileError] = useState('');

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
            setFileError(`Ukuran ${humanSize(picked.size)} melebihi batas 50MB.`);
            return;
        }

        onFileChange(picked);
    };

    const handleRemove = () => {
        setFileError('');
        onFileChange(null);
        onClear();
    };

    const handleUseGitCdn = () => {
        setFileError('');
        onFileChange(null);
        if (onUrlChange) {
            onUrlChange(DEFAULT_GIT_VIDEO);
        }
    };

    const src = objectUrl || (value ? resolveAdminImage(value) : '');

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">{label}</label>
                <button
                    type="button"
                    onClick={handleUseGitCdn}
                    title="Gunakan video bawaan via CDN GitHub jsDelivr (bebas limit server)"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-medium transition-colors cursor-pointer"
                >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pakai CDN Git (Cepat)</span>
                </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="h-40 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {src ? (
                        <video
                            key={src}
                            src={src}
                            controls
                            playsInline
                            preload="metadata"
                            className={`h-full w-full object-contain ${objectUrl ? 'opacity-80' : ''}`}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-1.5 text-slate-600">
                            <VideoOff className="w-5 h-5" />
                            <span className="text-[10px]">Belum ada video</span>
                        </div>
                    )}
                </div>

                {/* Input URL Direct Link */}
                <div className="p-3 space-y-2.5 bg-slate-900/90 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={file ? `[Berkas lokal: ${file.name}]` : (value || '')}
                                disabled={Boolean(file)}
                                onChange={(e) => onUrlChange && onUrlChange(e.target.value)}
                                placeholder="https://cdn.jsdelivr.net/... atau uploads/..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 text-xs focus:outline-none transition-colors disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer shrink-0"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{file ? 'Ganti' : 'Pilih Berkas'}</span>
                        </button>

                        {(file || value) && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                title="Hapus video"
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition-colors cursor-pointer shrink-0"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
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
                ) : (
                    <span>
                        {hint} Disarankan menggunakan link <strong>CDN Git / Cloud</strong> agar loading tamu cepat dan bebas limit cPanel.
                    </span>
                )}
            </p>

            {fileError && <p className="text-[10px] text-rose-400">{fileError}</p>}
        </div>
    );
}
