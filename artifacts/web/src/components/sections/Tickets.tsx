"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Loader2, Tag, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

const tiers = [
  {
    name: "Standard Entry",
    price: "£35",
    unit: "/ person",
    capacity: 1,
    blurb: "General admission to the most exclusive boat party of the year.",
    features: ["Entry to the boat", "Access to all decks & bars", "Immersive music experience"],
    cta: "Reserve",
    featured: false,
  },
  {
    name: "VIP Table for 2",
    price: "£250",
    unit: "/ table",
    capacity: 2,
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
    capacity: 4,
    blurb: "The ultimate luxury experience for you and three guests.",
    features: ["VIP Express Entry for 4", "Reserved Seating Area", "2 Bottles of Premium Spirits", "Exclusive Food Platter", "Dedicated Hostess Service"],
    cta: "Book Table for 4",
    featured: false,
    badge: "Best Value",
  },
];

export function Tickets() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  // On mount, check if a referral code came from the URL and pre-fill it
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) {
      setPromoCode(refFromUrl);
      setPromoApplied(true);
      setPromoOpen(true);
    }
  }, []);

  const handleApplyPromo = () => {
    const trimmed = promoCode.trim();
    if (!trimmed) {
      toast.error("Please enter a promo code");
      return;
    }
    setPromoApplied(true);
    toast.success("Promo code applied!", {
      description: `Code "${trimmed}" will be used at checkout.`,
    });
  };

  const handleClearPromo = () => {
    setPromoCode("");
    setPromoApplied(false);
  };

  const handleCheckout = async (tier: typeof tiers[0]) => {
    try {
      setLoadingTier(tier.name);

      // Manual promo code takes priority; fall back to URL ?ref= param
      const trimmedPromo = promoCode.trim();
      const searchParams = new URLSearchParams(window.location.search);
      const referralCode = trimmedPromo || searchParams.get("ref");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tier.name,
          price: tier.price,
          description: tier.blurb,
          capacityTaken: tier.capacity,
          referralCode: referralCode,
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

        {/* Promo Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-12"
        >
          <button
            onClick={() => setPromoOpen(!promoOpen)}
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 group"
          >
            <Tag className="w-4 h-4" />
            <span>{promoApplied ? "Promo code applied" : "Have a promo code?"}</span>
            {promoApplied ? (
              <span className="inline-flex items-center gap-1 text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                <Check className="w-3 h-3" />
                {promoCode}
              </span>
            ) : (
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${promoOpen ? "rotate-180" : ""}`} />
            )}
          </button>

          <AnimatePresence>
            {promoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        if (promoApplied) setPromoApplied(false);
                      }}
                      placeholder="Enter referral or promo code"
                      className="w-full bg-secondary/40 border border-primary/20 text-white placeholder:text-muted-foreground text-sm px-4 py-3 rounded-none focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all uppercase tracking-wider font-mono"
                    />
                    {promoCode && (
                      <button
                        onClick={handleClearPromo}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim() || promoApplied}
                    className={`px-6 py-3 text-xs uppercase font-bold tracking-[0.15em] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      promoApplied
                        ? "bg-green-500/15 text-green-400 border border-green-500/30"
                        : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                    }`}
                  >
                    {promoApplied ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-400/80 mt-2 text-center">
                    This code will be linked to your purchase at checkout.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
