import React, { useState, useEffect, useRef } from 'react';
import { weddingConfig } from './data/weddingConfig';
import {
  fetchSettings,
  fetchGallery,
  fetchStories,
  fetchCouple,
  fetchEvents,
  resolveImage
} from './data/api';
import Opening from './components/Opening';
import AudioPlayer from './components/AudioPlayer';
import Hero from './components/Hero';
import Couple from './components/Couple';
import Countdown from './components/Countdown';
import EventDetail from './components/EventDetail';
import Story from './components/Story';
import Gallery from './components/Gallery';
import Gift from './components/Gift';
import RSVP from './components/RSVP';
import Footer from './components/Footer';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoActive, setVideoActive] = useState(false);

  // Try load from localStorage cache first (instant, zero flash)
  const getCachedSettings = () => {
    try {
      const cached = localStorage.getItem('invitation_settings_cache');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  // Dynamic state initialized with cache or static fallback
  const [settings, setSettings] = useState(getCachedSettings());
  const [gallery, setGallery] = useState(weddingConfig.gallery);
  const [stories, setStories] = useState(weddingConfig.stories);
  const [couple, setCouple] = useState({ bride: weddingConfig.bride, groom: weddingConfig.groom });
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [st, g, s, c, e] = await Promise.all([
        fetchSettings(null),
        fetchGallery(weddingConfig.gallery),
        fetchStories(weddingConfig.stories),
        fetchCouple(null),
        fetchEvents(null),
      ]);
      if (cancelled) return;

      if (st && typeof st === 'object' && Object.keys(st).length > 0) {
        setSettings(st);
        // Cache settings untuk load berikutnya (zero flash)
        try {
          localStorage.setItem('invitation_settings_cache', JSON.stringify(st));
        } catch {
          // ignore storage errors
        }
      }

      if (Array.isArray(g) && g.length > 0) {
        setGallery(g.map((it) => ({ url: resolveImage(it.url || it.image), caption: it.caption || '' })));
      }

      if (Array.isArray(s) && s.length > 0) {
        setStories(s.map((it) => ({
          year: it.year || '',
          title: it.title || '',
          description: it.description || '',
          image: resolveImage(it.image || it.url),
        })));
      }

      if (c && (c.bride || c.groom)) {
        setCouple({
          bride: c.bride
            ? {
              ...weddingConfig.bride,
              name: c.bride.name || weddingConfig.bride.name,
              nickname: c.bride.nickname || weddingConfig.bride.nickname,
              father: c.bride.father || weddingConfig.bride.father,
              mother: c.bride.mother || weddingConfig.bride.mother,
              instagram: c.bride.instagram || weddingConfig.bride.instagram,
              photo: resolveImage(c.bride.photo || c.bride.image) || weddingConfig.bride.photo,
            }
            : weddingConfig.bride,
          groom: c.groom
            ? {
              ...weddingConfig.groom,
              name: c.groom.name || weddingConfig.groom.name,
              nickname: c.groom.nickname || weddingConfig.groom.nickname,
              father: c.groom.father || weddingConfig.groom.father,
              mother: c.groom.mother || weddingConfig.groom.mother,
              instagram: c.groom.instagram || weddingConfig.groom.instagram,
              photo: resolveImage(c.groom.photo || c.groom.image) || weddingConfig.groom.photo,
            }
            : weddingConfig.groom,
        });
      }

      if (Array.isArray(e) && e.length > 0) {
        setEvents(e.map((it) => ({
          title: it.title || '',
          date: it.date || it.date_label || '',
          time: it.time || it.time_label || '',
          location: it.location || '',
          address: it.address || '',
          mapsUrl: it.mapsUrl || it.maps_url || 'https://maps.google.com',
        })));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Lock scroll hanya saat cover screen (sebelum klik "Buka Undangan")
  // Setelah klik, scroll langsung dibebaskan — video tetap tampil sebagai overlay
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
  };

  // Ref ke frame container — dipakai Opening untuk sinkronisasi posisi video fixed
  const frameRef = useRef(null);

  // Merge wedding settings from DB over default weddingConfig
  const liveConfig = {
    ...weddingConfig,
    ...(settings?.event_date ? { eventDate: settings.event_date } : {}),
    ...(settings?.event_date_formatted ? { eventDateFormatted: settings.event_date_formatted } : {}),
    ...(settings?.audio_url ? { audioUrl: resolveImage(settings.audio_url) } : {}),
    ...(settings?.video_url ? { videoUrl: resolveImage(settings.video_url) } : {}),
    ...(settings?.hero_image ? { heroImage: resolveImage(settings.hero_image) } : {}),
    ...(settings?.hero_fullscreen_image ? { heroFullscreenImage: resolveImage(settings.hero_fullscreen_image) } : {}),
    quote: {
      text: settings?.quote_text || weddingConfig.quote.text,
      source: settings?.quote_source || weddingConfig.quote.source,
    },
    bride: {
      ...couple.bride,
      ...(settings?.bride_name ? { name: settings.bride_name } : {}),
      ...(settings?.bride_nickname ? { nickname: settings.bride_nickname } : {}),
      ...(settings?.bride_father ? { father: settings.bride_father } : {}),
      ...(settings?.bride_mother ? { mother: settings.bride_mother } : {}),
      ...(settings?.bride_instagram ? { instagram: settings.bride_instagram } : {}),
      ...(settings?.bride_photo ? { photo: resolveImage(settings.bride_photo) } : {}),
    },
    groom: {
      ...couple.groom,
      ...(settings?.groom_name ? { name: settings.groom_name } : {}),
      ...(settings?.groom_nickname ? { nickname: settings.groom_nickname } : {}),
      ...(settings?.groom_father ? { father: settings.groom_father } : {}),
      ...(settings?.groom_mother ? { mother: settings.groom_mother } : {}),
      ...(settings?.groom_instagram ? { instagram: settings.groom_instagram } : {}),
      ...(settings?.groom_photo ? { photo: resolveImage(settings.groom_photo) } : {}),
    },
    banks: [
      settings?.bank1_name
        ? {
          bankName: settings.bank1_name,
          accountNumber: settings.bank1_account || '',
          accountName: settings.bank1_holder || '',
          icon: settings.bank1_icon || '/assets/bca_logo.svg',
        }
        : weddingConfig.banks[0],
      settings?.bank2_name
        ? {
          bankName: settings.bank2_name,
          accountNumber: settings.bank2_account || '',
          accountName: settings.bank2_holder || '',
          icon: settings.bank2_icon || '/assets/mandiri_logo.svg',
        }
        : weddingConfig.banks[1],
    ].filter(Boolean),
    gift: {
      name: settings?.gift_name || weddingConfig.gift.name,
      address: settings?.gift_address || weddingConfig.gift.address,
    },
    gallery,
    stories,
  };

  // Title tab mengikuti nama pasangan dari database (bukan hardcode di index.html)
  useEffect(() => {
    if (!settings) return;

    const bride = settings.bride_nickname || settings.bride_name || '';
    const groom = settings.groom_nickname || settings.groom_name || '';

    if (bride || groom) {
      document.title = `The Wedding of ${bride} & ${groom} | Undangan Pernikahan Adat Jawa`;
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-white text-neutral-100 font-sans selection:bg-jawa-gold selection:text-jawa-dark relative">

      {/* Main Centered Mobile Portrait Frame */}
      <div
        ref={frameRef}
        className={`w-full max-w-[420px] min-h-screen mx-auto bg-jawa-dark shadow-[0_0_40px_rgba(0,0,0,0.3)] relative z-10 ${!isOpen ? 'h-screen overflow-hidden' : ''}`}
      >

        {/* Cover / Opening Card */}
        <Opening
          config={liveConfig}
          isOpen={isOpen}
          onOpen={handleOpenInvitation}
          frameRef={frameRef}
          onVideoActive={setVideoActive}
        />

        {/* Floating Audio Player */}
        <AudioPlayer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioUrl={liveConfig.audioUrl}
        />

        {/* Main Invitation Content */}
        <main className={`transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Hero config={liveConfig} videoActive={videoActive} />
          <Couple config={liveConfig} />
          <Countdown targetDate={liveConfig.eventDate} config={liveConfig} />
          <EventDetail config={liveConfig} events={events} />
          <Story stories={stories} />
          <Gallery gallery={gallery} />
          <Gift banks={liveConfig.banks} gift={liveConfig.gift} config={liveConfig} />
          <RSVP />
          <Footer config={liveConfig} />
        </main>
      </div>

    </div>
  );
}
