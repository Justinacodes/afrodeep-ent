"use client";
import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import boatNight from "@assets/image_1782304719226.png";

const TEL = "tel:+447762132495";

export function Hero() {
  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={boatNight.src}
          alt="AfroDeep All White Boat Party on the Thames"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block border border-primary/40 text-primary uppercase tracking-[0.35em] text-[10px] md:text-xs font-semibold px-4 py-2 mb-8"
        >
          AfroDeep Entertainment Presents
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-white font-bold leading-[0.95] text-5xl sm:text-6xl md:text-8xl tracking-tight"
        >
          ALL WHITE
          <span className="block text-primary italic font-normal text-4xl sm:text-5xl md:text-7xl mt-2">
            Boat Party
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <p className="text-white/90 text-lg md:text-2xl tracking-wide">
            Saturday 15th August 2026 &nbsp;&bull;&nbsp; Westminster Pier
          </p>
          <p className="text-muted-foreground text-sm md:text-base uppercase tracking-[0.25em]">
            Boarding 7PM &middot; Sets Sail 8PM &middot; Strictly All White
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollTo("#tickets")}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 uppercase font-bold tracking-[0.2em] text-sm hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          >
            Get Tickets
          </button>
          <a
            href={TEL}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 uppercase font-bold tracking-[0.2em] text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            07762 132 495
          </a>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo("#details")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-primary transition-colors"
        aria-label="Scroll to details"
      >
        <ChevronDown className="w-7 h-7 animate-bounce" />
      </motion.button>
    </section>
  );
}
