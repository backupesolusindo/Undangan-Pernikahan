import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, Gift as GiftIcon, MapPin } from 'lucide-react';
import GununganIcon from './GununganIcon';

function DividerHeart() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-20 bg-[#8c6b12]/60" />
      <Heart className="w-3.5 h-3.5 text-[#8c6b12]" fill="#8c6b12" />
      <div className="h-px w-20 bg-[#8c6b12]/60" />
    </div>
  );
}

export default function Gift({ banks, gift, config }) {
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Hanya tampilkan SATU nomor bank (yang pertama), sesuai permintaan
  const bank = banks && banks.length > 0 ? banks[0] : null;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (type === 'account') {
      setCopiedAccount(text);
      setTimeout(() => setCopiedAccount(null), 3000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 3000);
    }
  };

  if (!bank) return null;

  const giftName = gift?.name || bank.accountName;
  const giftAddress = gift?.address || '';

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Background foto bernuansa merah khas Jawa */}
      <div className="absolute inset-0 z-0">
        <img
          src={config?.heroImage}
          alt="Wedding gift background"
          className="w-full h-full object-cover object-top brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-[#7a1f1d]/45" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="relative z-10 max-w-[340px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Bingkai oval full - atas & bawah sama-sama oval penuh */}
          <div className="rounded-[175px] bg-[#fdf8ec] p-[10px] border-2 border-[#c9a24b] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Bingkai lengkung dalam */}
            <div className="relative rounded-[165px] border border-[#c9a24b]/80 overflow-hidden bg-[#fdf8ec]">
              {/* Isi kartu */}
              <div className="relative z-10 px-6 pt-10 pb-28 text-center">
                {/* Ornamen gunungan */}
                <div className="flex justify-center">
                  <GununganIcon className="w-14 h-[72px] text-[#a8842c]" />
                </div>

                {/* Judul */}
                <h2 className="leading-none mt-1">
                  <span className="block font-script text-[42px] text-[#4A3226]">Wedding</span>
                  <span className="block font-cinzel text-[38px] font-bold text-[#4A3226] -mt-3 ml-10">Gift</span>
                </h2>

                {/* Deskripsi */}
                <p className="text-[11px] font-lora italic text-[#4A3226]/90 leading-relaxed mt-3 max-w-[240px] mx-auto">
                  Tanpa mengurangi rasa hormat, bagi rekan-rekan dan sahabat yang hendak memberikan
                  tanda kasih untuk kami, dapat melalui nomor rekening di bawah ini.
                </p>

                {/* Satu nomor bank */}
                <div className="mt-5 space-y-1.5">
                  <p className="font-cinzel text-sm font-semibold text-[#4A3226]">{bank.bankName}</p>
                  <p className="text-xs font-lora text-[#4A3226]/85">
                    No. Rekening <span className="font-semibold tracking-wide">{bank.accountNumber}</span>
                  </p>
                  <p className="text-xs font-lora text-[#4A3226]/85">
                    a.n <span className="font-semibold">{bank.accountName}</span>
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, 'account')}
                      className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#4A3226] text-[#f7ecd4] font-cinzel text-[10px] font-bold tracking-wider hover:bg-[#5d4232] active:scale-95 transition-all shadow"
                    >
                      {copiedAccount === bank.accountNumber ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <span>Copy Rekening</span>
                          <Copy className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="py-5">
                  <DividerHeart />
                </div>

                {/* Kirim Kado */}
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <span className="w-11 h-11 rounded-full bg-[#4A3226]/10 border border-[#4A3226]/20 flex items-center justify-center">
                      <GiftIcon className="w-5 h-5 text-[#4A3226]" />
                    </span>
                  </div>
                  <p className="font-cinzel text-sm font-semibold text-[#4A3226]">Kirim Kado</p>
                  <p className="text-xs font-lora font-semibold text-[#4A3226]">{giftName}</p>
                  {giftAddress ? (
                    <p className="text-[11px] font-lora text-[#4A3226]/80 leading-relaxed max-w-[230px] mx-auto">
                      {giftAddress}
                    </p>
                  ) : null}
                  <div className="pt-1.5">
                    <button
                      onClick={() => giftAddress && copyToClipboard(giftAddress, 'address')}
                      className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#4A3226] text-[#f7ecd4] font-cinzel text-[10px] font-bold tracking-wider hover:bg-[#5d4232] active:scale-95 transition-all shadow"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Copy Alamat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Siluet gunung + gapura di dasar kartu */}
              <div className="absolute bottom-0 inset-x-0 z-0 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 340 110" className="w-full h-[104px] block" preserveAspectRatio="xMidYMax slice">
                  <path d="M0 78 L60 38 L110 72 L170 30 L230 70 L285 42 L340 76 L340 110 L0 110 Z" fill="#4A3226" opacity="0.14" />
                  <path d="M0 90 L70 55 L130 84 L200 52 L265 82 L340 60 L340 110 L0 110 Z" fill="#4A3226" opacity="0.18" />
                  {/* Motif pagar candi */}
                  <rect x="0" y="96" width="340" height="14" fill="#4A3226" opacity="0.55" />
                  {Array.from({ length: 17 }).map((_, i) => (
                    <rect key={i} x={8 + i * 20} y={88} width={6} height={12} rx={2} fill="#4A3226" opacity="0.55" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
