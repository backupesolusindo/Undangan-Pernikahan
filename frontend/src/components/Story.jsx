import React from 'react';
import { motion } from 'framer-motion';
import GununganIcon from './GununganIcon';
import { resolveImage } from '../data/api';

export default function Story({ stories }) {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-24 px-4 relative overflow-hidden" style={{ background: '#d9beb4' }}>
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-3"
        >
          <div className="flex justify-center">
            <GununganIcon className="w-12 h-16 text-[#2A170D]" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#3B2417] font-cinzel font-semibold">LOVE JOURNEY</p>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#2A170D] font-bold">Kisah Cinta Kami</h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#3B2417] to-transparent mx-auto mt-2" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#2A170D]/40 ml-4 md:ml-1/2 space-y-12 md:space-y-16">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              className={`relative pl-8 md:pl-0 flex flex-col md:flex-row items-start ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
            >
              {/* Timeline Bullet Dot */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-[#2A170D] border-2 border-[#F8ECE6]/90 flex items-center justify-center shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F8ECE6]" />
              </div>

              {/* Story Content Card */}
              <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <div className="p-6 rounded-3xl bg-[#FDF6EF] border border-[#2A170D]/25 shadow-[0_12px_30px_rgba(42,23,13,0.25)] space-y-4 hover:border-[#B59185] transition-all">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-[#2A170D]/20">
                    <img
                      src={resolveImage(story.image || story.url)}
                      alt={story.title}
                      className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-jawa-dark/90 backdrop-blur-md text-jawa-gold font-cinzel text-xs font-bold border border-jawa-gold/40">
                      {story.year}
                    </div>
                  </div>

                  <h3 className="font-cinzel text-xl text-[#2A170D] font-bold">{story.title}</h3>
                  <p className="text-[#4A3226] text-xs sm:text-sm font-lora leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
