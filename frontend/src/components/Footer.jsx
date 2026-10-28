import React from 'react';
import GununganIcon from './GununganIcon';

export default function Footer({ config }) {
  return (
    <footer className="py-16 px-4 bg-jawa-dark border-t border-jawa-gold/30 text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-center">
          <GununganIcon className="w-14 h-18 text-jawa-gold" />
        </div>

        <div className="space-y-2">
          <h3 className="font-cinzel text-2xl text-jawa-goldlight font-bold">Matur Nuwun</h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-lora max-w-md mx-auto leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
          </p>
        </div>

        <div className="pt-8 border-t border-jawa-gold/20 text-[10px] text-neutral-500 font-cinzel">
          &copy; {new Date().getFullYear()} support by : esolusindo
        </div>
      </div>
    </footer>
  );
}
