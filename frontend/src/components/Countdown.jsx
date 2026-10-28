import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';

export default function Countdown({ targetDate, config }) {
  const brideName = config?.bride?.nickname || 'Juwita';
  const groomName = config?.groom?.nickname || 'Seno';

  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const toGoogleFormat = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  const startDate = new Date(targetDate);
  const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+${encodeURIComponent(brideName)}+%26+${encodeURIComponent(groomName)}&dates=${toGoogleFormat(startDate)}/${toGoogleFormat(endDate)}&details=Acara+Pernikahan+${encodeURIComponent(brideName)}+%26+${encodeURIComponent(groomName)}&location=Surakarta`;

  const timeBlocks = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Det', value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden text-white">
      {/* Latar foto sampul utama dari pengaturan */}
      <div className="absolute inset-0 z-0">
        <img
          src={config.heroImage}
          alt="Countdown background"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay coklat gelap hangat seperti referensi */}
        <div className="absolute inset-0 bg-[#2A1206]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1206]/60 via-transparent to-[#160903]/85" />
      </div>

      <div className="relative z-10 max-w-md mx-auto text-center space-y-7">
        {/* Judul script seperti referensi */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-script text-5xl sm:text-6xl leading-none drop-shadow-lg"
        >
          Count Down
        </motion.h2>

        {/* Angka countdown horizontal dengan pemisah : */}
        <div className="flex items-start justify-center gap-3 sm:gap-5">
          {timeBlocks.map((block, idx) => (
            <React.Fragment key={block.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center min-w-[56px]"
              >
                <span className="font-cormorant text-4xl sm:text-5xl font-semibold leading-none drop-shadow-md">
                  {block.value}
                </span>
                <span className="text-[11px] sm:text-xs font-lora mt-1 text-white/90">
                  {block.label}
                </span>
              </motion.div>
              {idx < timeBlocks.length - 1 && (
                <span className="font-cormorant text-2xl sm:text-3xl text-white/80 pt-1">:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tombol Save The Date */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/70 bg-white/10 backdrop-blur-md text-white font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white/20 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Save The Date</span>
          </a>
        </motion.div>

        {/* Kutipan */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-2 pt-1"
        >
          <p className="text-[11px] sm:text-xs font-lora leading-relaxed text-white/90 max-w-sm mx-auto">
            Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang
          </p>
          <p className="text-[11px] font-lora text-white/80">
            Ar Rum Ayat 21
          </p>
        </motion.div>
      </div>
    </section>
  );
}
