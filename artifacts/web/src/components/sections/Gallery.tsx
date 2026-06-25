"use client";
import { motion } from "framer-motion";
import boatNight from "@assets/image_1782304719226.png";
import boatDay from "@assets/image_1782305454312.png";
import boatThames from "@assets/image_1782305559162.png";

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 py-24 md:py-32 relative bg-secondary/10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">
            The Vessel
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            Your Floating{" "}
            <span className="text-primary font-serif italic normal-case">Venue</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:row-span-2 overflow-hidden group relative"
          >
            <img
              src={boatNight.src}
              alt="Boat party at night on the Thames"
              className="w-full h-full min-h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
            <p className="absolute bottom-6 left-6 text-white font-serif text-2xl">
              After Dark
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden group relative"
          >
            <img
              src={boatDay.src}
              alt="The vessel by day"
              className="w-full h-full min-h-[220px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden group relative"
          >
            <img
              src={boatThames.src}
              alt="Cruising the Thames"
              className="w-full h-full min-h-[220px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
