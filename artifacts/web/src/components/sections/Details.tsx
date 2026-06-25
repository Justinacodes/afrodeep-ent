"use client";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Anchor, Disc3, Shirt } from "lucide-react";

const facts = [
  { icon: Calendar, label: "Date", value: "Saturday 15th August 2026" },
  { icon: MapPin, label: "Venue", value: "Westminster Pier, London" },
  { icon: Clock, label: "Boarding", value: "7:00 PM" },
  { icon: Anchor, label: "Sets Sail", value: "8:00 PM" },
  { icon: Disc3, label: "On the Decks", value: "DJ Andymoore" },
  { icon: Shirt, label: "Dress Code", value: "Strictly All White" },
];

export function Details() {
  return (
    <section id="details" className="scroll-mt-20 py-24 md:py-32 relative bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">
            The Essentials
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-5">
            One Night on the{" "}
            <span className="text-primary font-serif italic normal-case">Thames</span>
          </h2>
          <p className="text-muted-foreground">
            Step aboard for an unforgettable evening of Afrobeats, deep house and
            soulful sounds as we cruise the heart of London. Dressed head to toe in
            white, surrounded by good people and great vibes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/15 border border-primary/15 max-w-5xl mx-auto">
          {facts.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-background p-8 flex flex-col items-center text-center gap-3 group hover:bg-secondary/20 transition-colors"
            >
              <f.icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
              <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px]">
                {f.label}
              </p>
              <p className="text-white font-medium text-lg">{f.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
