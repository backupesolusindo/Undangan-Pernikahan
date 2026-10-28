import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ config, videoActive }) {
  const fullscreenImage = config.heroFullscreenImage;
  const brideName = config.bride?.nickname || config.bride?.name || '';
  const groomName = config.groom?.nickname || config.groom?.name || '';

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-[padding] duration-500"
      style={{ paddingTop: videoActive ? '100dvh' : '0' }}
    >
      {/* Fullscreen background photo */}
      {fullscreenImage && (
        <img
          src={fullscreenImage}
          alt={`${brideName} & ${groomName}`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Gradient overlay agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

      {/* Teks "The Wedding of" */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 select-none"
      >
        <p className="font-cinzel text-xs sm:text-sm tracking-[0.35em] uppercase text-white/70 mb-3">
          The Wedding of
        </p>
        <h1 className="font-cinzel text-4xl sm:text-5xl text-white font-bold tracking-widest uppercase drop-shadow-2xl leading-tight">
          {brideName}
          <span className="block text-2xl sm:text-3xl text-[#E8CF9A] font-normal tracking-[0.2em] my-1">&</span>
          {groomName}
        </h1>
        <div className="mt-4 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#E8CF9A] to-transparent mx-auto" />
        {config.eventDateFormatted && (
          <p className="mt-3 font-cinzel text-[11px] tracking-[0.25em] text-white/60 uppercase">
            {config.eventDateFormatted}
          </p>
        )}
      </motion.div>
    </section>
  );
}
