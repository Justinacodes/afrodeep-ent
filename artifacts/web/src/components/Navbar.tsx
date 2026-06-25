"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const TEL = "tel:+447762132495";

const links = [
  { label: "Details", href: "#details" },
  { label: "Gallery", href: "#gallery" },
  { label: "Tickets", href: "#tickets" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-20">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-left"
        >
          <span className="text-xl font-bold uppercase tracking-[0.2em] text-white font-serif">
            AfroDeep <span className="text-primary">Ent</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => handleNav(l.href)}
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
          <a
            href={TEL}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors font-semibold"
          >
            <Phone className="w-3.5 h-3.5" />
            Reserve
          </a>
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 border-t border-primary/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-5">
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className="text-left text-base uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={TEL}
                className="inline-flex items-center justify-center gap-2 text-sm uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-3 hover:bg-primary/90 transition-colors font-semibold"
              >
                <Phone className="w-4 h-4" />
                Reserve
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
