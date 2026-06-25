"use client";
import { motion } from "framer-motion";
import { Phone, MapPin, Calendar } from "lucide-react";

const TEL = "tel:+447762132495";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 relative border-t border-primary/15 bg-background">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
            Don't Miss the{" "}
            <span className="text-primary font-serif italic normal-case">Boat</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Reserve your place or ask us anything — call the team directly.
          </p>
          <a
            href={TEL}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 uppercase font-bold tracking-[0.2em] text-sm hover:bg-primary/90 transition-colors shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          >
            <Phone className="w-4 h-4" />
            07762 132 495
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-primary/10 pt-12 text-center md:text-left">
          <div>
            <span className="text-lg font-bold uppercase tracking-[0.2em] text-white font-serif">
              AfroDeep <span className="text-primary">Ent</span>
            </span>
            <p className="text-muted-foreground text-sm mt-3">
              London's premier events collective. Good vibes, great people,
              unforgettable memories.
            </p>
          </div>

          <div className="space-y-3">
            <p className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              Saturday 15th August 2026
            </p>
            <p className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              Westminster Pier, London
            </p>
            <p className="flex items-center justify-center md:justify-start gap-3 text-white/80 text-sm">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a href={TEL} className="hover:text-primary transition-colors">
                07762 132 495
              </a>
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-primary uppercase tracking-[0.25em] text-xs font-bold mb-2">
              Dress Code
            </p>
            <p className="text-white/80 text-sm">
              Strictly all white. Dressed to impress from head to toe — no
              exceptions on the door.
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground/60 text-xs uppercase tracking-[0.2em] mt-12">
          &copy; {new Date().getFullYear()} AfroDeep Entertainment &bull; All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
