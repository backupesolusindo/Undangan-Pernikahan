import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function parseEventDate(iso) {
  const d = new Date(iso);
  return {
    day: d.getDate(),
    month: MONTHS_ID[d.getMonth()],
    year: d.getFullYear(),
  };
}

function OvalEventCard({ title, time, location, address, mapsUrl, date, dateLabel, heroImage, heroFullscreenImage, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <div className="relative rounded-[170px] p-[14px] border border-white/20 overflow-hidden">
        <img
          src={heroFullscreenImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="relative z-10 rounded-[160px] overflow-hidden border-2 border-[#c29f93]">
          <img
            src={heroImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          <div className="relative z-10 px-6 py-10 pt-12 pb-12 text-center text-white space-y-3">
            <h3 className="font-script text-4xl leading-none drop-shadow-lg">{title}</h3>

            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="h-px w-16 bg-white/70" />
              <Heart className="w-4 h-4 text-[#E8CF9A]" fill="#E8CF9A" />
              <div className="h-px w-16 bg-white/70" />
            </div>

            {dateLabel ? (
              <p className="font-cinzel text-sm font-semibold tracking-widest pt-1">{dateLabel}</p>
            ) : (
              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="font-cinzel text-3xl font-bold leading-none">{date.day}</span>
                <span className="w-9 h-9 rounded-full bg-[#E8CF9A] flex items-center justify-center shadow-lg shrink-0">
                  <MapPin className="w-5 h-5 text-[#4A3226]" fill="#4A3226" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block font-cinzel text-sm font-semibold tracking-widest">{date.month}</span>
                  <span className="block font-cinzel text-sm tracking-widest">{date.year}</span>
                </span>
              </div>
            )}

            <div className="space-y-1.5 pt-2">
              <p className="text-xs font-lora font-semibold">Pukul : {time}</p>
              <p className="text-xs font-lora">{location}</p>
              <p className="text-[11px] font-lora text-white/85 leading-relaxed max-w-[220px] mx-auto">{address}</p>
            </div>

            <div className="pt-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/60 border border-white/40 backdrop-blur-md text-white font-cinzel text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black/80 transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Map</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function EventDetail({ config, events }) {
  const date = parseEventDate(config.eventDate || new Date().toISOString());
  const dynamic = Array.isArray(events) && events.length > 0;
  const cards = dynamic
    ? events
    : [
      {
        title: config.akad.title,
        time: config.akad.time,
        location: config.akad.location,
        address: config.akad.address,
        mapsUrl: config.akad.mapsUrl,
        date: config.akad.date,
      },
      {
        title: config.resepsi.title,
        time: config.resepsi.time,
        location: config.resepsi.location,
        address: config.resepsi.address,
        mapsUrl: config.resepsi.mapsUrl,
        date: config.resepsi.date,
      },
    ];

  // Ambil foto galeri berbeda untuk setiap kartu event
  const galleryPhotos = useMemo(() => {
    const gallery = Array.isArray(config.gallery) && config.gallery.length > 0
      ? config.gallery
      : [];

    if (gallery.length === 0) return cards.map(() => config.heroImage);

    // Shuffle gallery agar acak setiap render
    const shuffled = [...gallery].sort(() => Math.random() - 0.5);

    return cards.map((_, i) => {
      const item = shuffled[i % shuffled.length];
      return item?.url || item?.image || config.heroImage;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.gallery, cards.length, config.heroImage]);

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={config.heroFullscreenImage}
          alt="Wedding event background"
          className="w-full h-full object-cover object-top brightness-[0.9]"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 max-w-md mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3"
        >
          <h2 className="leading-none">
            <span className="block font-script text-5xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">Wedding</span>
            <span className="block font-script text-4xl text-[#E8CF9A] -mt-2 ml-16 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">Event</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-white/95 font-lora italic leading-relaxed max-w-sm mx-auto drop-shadow">
            Dengan mengucap syukur kepada Allah SWT, kami bermaksud mengundang Anda untuk dapat menghadiri acara pernikahan kami yang akan dilaksanakan pada :
          </p>
        </motion.div>

        <div className="space-y-8">
          {cards.map((ev, i) => (
            <OvalEventCard
              key={i}
              title={ev.title}
              time={ev.time}
              location={ev.location}
              address={ev.address}
              mapsUrl={ev.mapsUrl}
              date={date}
              dateLabel={ev.date}
              heroImage={galleryPhotos[i]}
              heroFullscreenImage={config.heroFullscreenImage}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
