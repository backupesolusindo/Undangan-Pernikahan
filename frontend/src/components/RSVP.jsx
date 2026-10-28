import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, UserCheck } from 'lucide-react';
import { fetchWishes, postRSVP } from '../data/api';
import GununganIcon from './GununganIcon';

export default function RSVP() {
  const [wishes, setWishes] = useState([]);

  const [form, setForm] = useState({
    name: '',
    status: 'Hadir',
    guests: '1',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchWishes([])
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setWishes(data);
        }
      })
      .catch((err) => console.error('Error fetching wishes:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    setIsSubmitting(true);

    try {
      const { data: result } = await postRSVP({
        name: form.name.trim(),
        status: form.status,
        guest_count: parseInt(form.guests),
        message: form.message.trim()
      });

      if (result.status === 'success') {
        const newWish = {
          name: form.name.trim(),
          status: form.status,
          message: form.message.trim(),
          time: 'Baru saja'
        };
        setWishes([newWish, ...wishes]);
        setForm({ name: '', status: 'Hadir', guests: '1', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        alert('Gagal mengirim data: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data. Pastikan server PHP berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 relative" style={{ background: 'linear-gradient(180deg, #1a0a05 0%, #2d1208 50%, #1a0a05 100%)' }}>
      <div className="max-w-md mx-auto space-y-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center">
            <GununganIcon className="w-12 h-16 text-jawa-gold" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-jawa-gold font-cinzel font-semibold">RSVP & WISHES</p>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-jawa-goldlight font-bold">Konfirmasi Kehadiran & Ucapan</h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-jawa-gold to-transparent mx-auto mt-2" />
        </motion.div>

        <div className="space-y-8">

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-3xl border border-jawa-gold/40 shadow-2xl space-y-6"
            style={{ background: 'rgba(55, 22, 8, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          >
            <h3 className="font-cinzel text-lg text-jawa-goldlight font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-jawa-gold" />
              <span>Isi Kehadiran</span>
            </h3>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-lora flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Terima kasih! Ucapan & konfirmasi Anda telah tersimpan.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-lora">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 tracking-wide font-cinzel">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama Anda..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-jawa-dark/80 border border-jawa-gold/30 text-neutral-100 text-sm focus:outline-none focus:border-jawa-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-300 tracking-wide font-cinzel">Konfirmasi</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-jawa-dark/80 border border-jawa-gold/30 text-neutral-100 text-xs focus:outline-none focus:border-jawa-gold transition-colors"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                    <option value="Ragu-ragu">Ragu-ragu</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-300 tracking-wide font-cinzel">Jumlah Tamu</label>
                  <select
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl bg-jawa-dark/80 border border-jawa-gold/30 text-neutral-100 text-xs focus:outline-none focus:border-jawa-gold transition-colors"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 tracking-wide font-cinzel">Ucapan & Doa</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan doa & ucapan terbaik Anda..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-jawa-dark/80 border border-jawa-gold/30 text-neutral-100 text-xs focus:outline-none focus:border-jawa-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-jawa-golddark via-jawa-gold to-jawa-golddark text-jawa-dark font-cinzel font-bold text-xs tracking-wider uppercase shadow-lg shadow-jawa-gold/20 hover:shadow-jawa-gold/40 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}</span>
              </button>
            </form>
          </motion.div>

          {/* Wishes List Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-6 rounded-3xl border border-jawa-gold/40 shadow-2xl space-y-6"
            style={{ background: 'rgba(55, 22, 8, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
          >
            <div className="flex items-center justify-between border-b border-jawa-gold/20 pb-4">
              <h3 className="font-cinzel text-lg text-jawa-goldlight font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-jawa-gold" />
                <span>Daftar Ucapan</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-jawa-gold/15 text-jawa-gold text-xs font-mono border border-jawa-gold/30">
                {wishes.length} Ucapan
              </span>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
              {wishes.length === 0 ? (
                <p className="text-center text-xs text-neutral-500 font-lora py-6">
                  Belum ada ucapan. Jadilah yang pertama!
                </p>
              ) : (
                <AnimatePresence>
                  {wishes.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl border border-jawa-gold/25 space-y-2"
                      style={{ background: 'rgba(35, 12, 4, 0.9)' }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-jawa-goldlight text-xs font-cinzel flex items-center gap-2">
                          {item.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${item.status === 'Hadir'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                            {item.status}
                          </span>
                        </h4>
                        <span className="text-[10px] text-neutral-500">{item.time}</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-lora leading-relaxed italic">
                        "{item.message}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
