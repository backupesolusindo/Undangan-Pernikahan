import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import GununganIcon from './GununganIcon';
import { resolveImage } from '../data/api';

export default function Gallery({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-24 px-4 relative" style={{background: 'linear-gradient(180deg, #2d1208 0%, #3d1a09 50%, #2d1208 100%)'}}>
      <div className="max-w-5xl mx-auto space-y-12">
        
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
          <p className="text-xs uppercase tracking-[0.35em] text-jawa-gold font-cinzel font-semibold">PREWEDDING GALLERY</p>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-jawa-goldlight font-bold">Galeri Foto</h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-jawa-gold to-transparent mx-auto mt-2" />
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {gallery.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedImage(item)}
              className="relative aspect-square rounded-2xl overflow-hidden jawa-card border border-jawa-gold/30 group cursor-pointer shadow-xl"
            >
              <img
                src={resolveImage(item.url || item.image)}
                alt={item.caption || `Gallery photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-jawa-dark/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-3 rounded-full bg-jawa-wood/80 border border-jawa-gold text-jawa-goldlight backdrop-blur-md">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-jawa-dark/95 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden jawa-card-gold shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close Lightbox"
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-jawa-dark/80 text-neutral-300 hover:text-jawa-gold border border-jawa-gold/40 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={resolveImage(selectedImage.url || selectedImage.image)}
                alt={selectedImage.caption}
                className="max-w-full max-h-[75vh] object-contain mx-auto"
              />

              {selectedImage.caption && (
                <div className="p-4 text-center bg-jawa-wood border-t border-jawa-gold/30 text-jawa-goldlight text-sm font-cinzel">
                  {selectedImage.caption}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
