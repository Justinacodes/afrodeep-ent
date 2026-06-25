"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

const tiers = [
  {
    name: "Standard Entry",
    price: "£35",
    unit: "/ person",
    blurb: "General admission to the most exclusive boat party of the year.",
    features: ["Entry to the boat", "Access to all decks & bars", "Immersive music experience"],
    cta: "Reserve",
    featured: false,
  },
  {
    name: "VIP Table for 2",
    price: "£250",
    unit: "/ table",
    blurb: "Intimate VIP experience for two with a bottle included.",
    features: ["VIP Express Entry for 2", "Reserved Seating Area", "1 Bottle of Premium Spirits", "Priority Boarding"],
    cta: "Book Table for 2",
    featured: true,
    badge: "Table for 2",
  },
  {
    name: "VIP Table for 4",
    price: "£500",
    unit: "/ table",
    blurb: "The ultimate luxury experience for you and three guests.",
    features: ["VIP Express Entry for 4", "Reserved Seating Area", "2 Bottles of Premium Spirits", "Exclusive Food Platter", "Dedicated Hostess Service"],
    cta: "Book Table for 4",
    featured: false,
    badge: "Best Value",
  },
];

export function Tickets() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: typeof tiers[0]) => {
    try {
      setLoadingTier(tier.name);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tier.name,
          price: tier.price,
          description: tier.blurb,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Checkout Failed", {
        description: error.message || "Please try again later.",
      });
      setLoadingTier(null);
    }
  };

  return (
    <section id="tickets" className="scroll-mt-20 py-24 md:py-32 relative bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">
            Limited Availability
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Secure Your{" "}
            <span className="text-primary font-serif italic normal-case">Spot</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your package below to book online via Stripe. All major cards accepted.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-8 flex flex-col backdrop-blur-sm border ${
                tier.featured
                  ? "bg-primary/8 border-primary/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                  : "bg-secondary/30 border-primary/20"
              }`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest py-1 px-3 ${
                      tier.featured
                        ? "bg-background border border-primary/50 text-primary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-3">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-serif text-primary">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">{tier.unit}</span>
                </div>
                <p className="text-muted-foreground text-sm">{tier.blurb}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3 text-white/85 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier)}
                disabled={loadingTier !== null}
                className={`w-full inline-flex items-center justify-center gap-2 py-4 uppercase font-bold tracking-[0.15em] text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    : "bg-white text-background hover:bg-white/90"
                }`}
              >
                {loadingTier === tier.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                {loadingTier === tier.name ? "Redirecting..." : tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-xs uppercase tracking-widest mt-10"
        >
          Tickets are non-refundable &bull; All sales final &bull; ID required on entry
        </motion.p>
      </div>
    </section>
  );
}
