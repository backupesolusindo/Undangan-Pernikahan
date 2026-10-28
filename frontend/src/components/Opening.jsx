import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, ChevronDown } from 'lucide-react';
import { checkInviteeGuest } from '../data/api';

/**
 * Strategi video:
 * - Video di-render sebagai `fixed` overlay, tapi posisi & ukurannya
 *   disinkronkan persis dengan frame (max-w-[420px]) via ResizeObserver + scroll.
 * - Dengan begitu video benar-benar mengisi frame secara full tanpa letterbox.
 * - Scroll handler memantau posisi scroll:
 *     scrollY == 0  → video tampil & play
 *     scrollY > 0   → video sembunyi (opacity 0, pause) → konten Hero terlihat
 *     scroll balik ke 0 → video tampil lagi & resume dari detik terakhir
 * - Video hilang permanen hanya setelah ended natural.
 */
export default function Opening({ config, isOpen, onOpen, frameRef, onVideoActive }) {
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [atTop, setAtTop] = useState(true);

  // Posisi video fixed mengikuti frame
  const [frameRect, setFrameRect] = useState({ left: 0, width: '100%' });

  const videoRef = useRef(null);

  const brideName = config.bride?.nickname || config.bride?.name || '';
  const groomName = config.groom?.nickname || config.groom?.name || '';

  /* ── Nama tamu dari URL ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      checkInviteeGuest(to)
        .then((res) => setGuestName(res?.name || to.replace(/[+_]/g, ' ')))
        .catch(() => setGuestName(to.replace(/[+_]/g, ' ')));
    }
  }, []);

  /* ── Sinkronisasi posisi & lebar frame ── */
  useEffect(() => {
    const frame = frameRef?.current;
    if (!frame) return;

    const sync = () => {
      const r = frame.getBoundingClientRect();
      setFrameRect({ left: r.left, width: r.width });
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(frame);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [frameRef]);

  /* ── Scroll: tampilkan/sembunyikan video & play/pause ── */
  useEffect(() => {
    if (!videoStarted || videoEnded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY ?? document.documentElement.scrollTop;
      const isTop = scrollY < 10;
      setAtTop(isTop);

      const v = videoRef.current;
      if (!v) return;
      if (isTop) {
        v.play().catch(() => { });
      } else {
        v.pause();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Inisialisasi kondisi awal
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [videoStarted, videoEnded]);

  /* ── Klik "Buka Undangan" ── */
  const handleStartVideo = () => {
    onOpen();
    if (!config.videoUrl) {
      setVideoEnded(true);
      return;
    }
    setVideoStarted(true);
    onVideoActive?.(true);
    setTimeout(() => {
      videoRef.current?.play().catch(() => { });
    }, 80);
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    onVideoActive?.(false);
  };

  const showVideo = isOpen && videoStarted && !videoEnded && config.videoUrl;

  return (
    <>
      {/* ── COVER SCREEN ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-black flex flex-col justify-between items-center overflow-hidden text-white select-none"
          >
            <div className="relative w-full h-full flex flex-col justify-between items-center text-center">
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src={config.heroImage}
                  alt={`Sampul ${brideName} & ${groomName}`}
                  className="w-full h-full object-cover object-center brightness-90 contrast-105"
                />
                <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10 pt-12 sm:pt-14 text-center px-4"
              >
                <h1 className="font-cinzel text-2xl sm:text-3xl text-white font-bold tracking-widest uppercase drop-shadow-lg">
                  {brideName} & {groomName}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10 pb-32 sm:pb-36 text-center px-6 w-full space-y-2.5"
              >
                <p className="font-serif text-xs sm:text-sm text-white/90 drop-shadow">
                  Kepada Bapak/Ibu/Saudara/i
                </p>
                <h2 className="font-serif text-xl sm:text-2xl text-white font-bold capitalize drop-shadow-md tracking-wide">
                  {guestName}
                </h2>
                <p className="font-serif text-xs sm:text-sm text-white/80 drop-shadow pb-1">
                  Di Tempat
                </p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleStartVideo}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-white/80 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-serif text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xl mx-auto cursor-pointer"
                >
                  <MailOpen className="w-4 h-4 text-white" />
                  <span>Buka Undangan</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VIDEO OVERLAY ──
          fixed, posisi & lebar mengikuti frame.
          Opacity 1 saat di atas (atTop), 0 saat discroll.
          pointer-events-none agar scroll tetap bekerja.
      ── */}
      {showVideo && (
        <div
          className="fixed top-0 z-40 bg-black pointer-events-none transition-opacity duration-300"
          style={{
            left: frameRect.left,
            width: frameRect.width,
            height: '100dvh',
            opacity: atTop ? 1 : 0,
          }}
        >
          <video
            ref={videoRef}
            src={config.videoUrl}
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Progress bar */}
          <VideoProgressBar videoRef={videoRef} />

          {/* Label gulir */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 select-none"
          >
            <span className="text-[9px] tracking-[0.3em] font-cinzel uppercase text-white/60">
              Gulir ke bawah
            </span>
            <ChevronDown className="w-4 h-4 text-white/50 animate-bounce" />
          </motion.div>
        </div>
      )}

      {/* Tidak ada spacer — Hero langsung tampil di bawah slot video */}
      {/*
        Saat video aktif: video fixed z-40 menutupi Hero di bawahnya.
        Scroll sedikit → video opacity 0 → Hero langsung kelihatan.
        Tidak butuh spacer karena Hero sudah ada di DOM dari posisi 0.
      */}
    </>
  );
}

/* ── Progress bar RAF-based ── */
function VideoProgressBar({ videoRef }) {
  const barRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const v = videoRef.current;
      const bar = barRef.current;
      if (v && bar && v.duration > 0) {
        bar.style.width = `${(v.currentTime / v.duration) * 100}%`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoRef]);

  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 z-10">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#c29f6a] via-[#E8CF9A] to-[#c29f6a]"
        style={{ width: '0%' }}
      />
    </div>
  );
}
