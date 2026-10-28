import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Flower2 } from 'lucide-react';
import { resolveImage } from '../data/api';

function PersonCard({ photo, nickname, fullname, parentsLabel, father, mother, instagram, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="text-center space-y-4"
    >
      {/* Arch photo ala referensi */}
      <div className="relative w-52 h-72 mx-auto">
        <div className="w-full h-full rounded-t-full rounded-b-[28px] overflow-hidden border-2 border-[#4A3226] shadow-lg">
          <img
            src={resolveImage(photo)}
            alt={fullname}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Hiasan bunga sudut kanan bawah */}
        <div className="absolute -bottom-3 -right-5 flex items-end gap-1 pointer-events-none">
          <Flower2 className="w-8 h-8 text-[#c29f93]" fill="#E8D5CB" />
          <Flower2 className="w-5 h-5 text-[#8D6B46] -ml-3 mb-3" fill="#EFDBC4" />
        </div>
        <div className="absolute -bottom-3 -left-5 pointer-events-none">
          <Flower2 className="w-6 h-6 text-[#c29f93]" fill="#E8D5CB" />
        </div>
      </div>

      {/* Nama panggilan script besar */}
      <h3 className="font-script text-5xl text-[#4A3226] leading-none pt-2">
        {nickname}
      </h3>

      {/* Nama lengkap + orang tua */}
      <div className="space-y-1">
        <p className="font-cormorant text-lg text-[#4A3226] font-bold tracking-wide">
          {fullname}
        </p>
        <p className="text-[11px] text-[#7A5F4C] font-lora leading-relaxed">
          {parentsLabel} {father} <br /> & {mother}
        </p>
      </div>

      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-[#4A3226] text-white font-cinzel text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#c29f93] transition-all shadow-md"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>Instagram</span>
        </a>
      )}
    </motion.div>
  );
}

export default function Couple({ config }) {
  return (
    <section className="py-10 px-4 bg-[#c29f93] relative overflow-hidden">
      <div className="max-w-md mx-auto relative z-10">
        {/* Kartu — background diubah dari putih (#FFFEFB) ke coklat kayu hangat */}
        <div className="rounded-[28px] border-2 border-[#4A3226]/60 px-6 py-10 text-center space-y-8 shadow-[0_10px_30px_rgba(74,50,38,0.35)]" style={{background: '#F8ECE6'}}>

          {/* Header script */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="font-script text-4xl sm:text-5xl text-[#4A3226] leading-tight">
              We Are<br />Getting Married!
            </h2>
            <p className="text-[11px] sm:text-xs text-[#6B4A3A] font-lora leading-relaxed max-w-xs mx-auto">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu. Atas kehadiran dan doa restunya kami ucapkan terima kasih.
            </p>
          </motion.div>

          {/* Mempelai Wanita */}
          <PersonCard
            photo={config.bride.photo}
            nickname={config.bride.nickname}
            fullname={config.bride.name}
            parentsLabel="Putri dari"
            father={config.bride.father}
            mother={config.bride.mother}
            instagram={config.bride.instagram}
          />

          {/* Pemisah */}
          <div className="font-script text-4xl text-[#c29f93]">&</div>

          {/* Mempelai Pria */}
          <PersonCard
            photo={config.groom.photo}
            nickname={config.groom.nickname}
            fullname={config.groom.name}
            parentsLabel="Putra dari"
            father={config.groom.father}
            mother={config.groom.mother}
            instagram={config.groom.instagram}
            delay={0.15}
          />

        </div>
      </div>
    </section>
  );
}

