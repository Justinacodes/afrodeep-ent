"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Loader2, User, Mail, ChevronRight } from "lucide-react";

interface TierInfo {
  name: string;
  price: string;
  unit: string;
  capacity: number;
  blurb: string;
}

interface CheckoutFormDialogProps {
  tier: TierInfo | null;
  referralCode: string;
  onClose: () => void;
}

export function CheckoutFormDialog({ tier, referralCode, onClose }: CheckoutFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!tier) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Please enter your full name";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = "Please confirm your email";
    } else if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
      newErrors.confirmEmail = "Emails do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tier.name,
          price: tier.price,
          description: tier.blurb,
          capacityTaken: tier.capacity,
          referralCode: referralCode || null,
          buyerName: name.trim(),
          buyerEmail: email.trim().toLowerCase(),
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
      setErrors({ submit: error.message || "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[hsl(222,47%,10%)] border border-primary/20 shadow-2xl shadow-primary/5 z-10 overflow-hidden"
        >
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 pb-0">
            <p className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold mb-2">
              Complete Your Booking
            </p>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
              {tier.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-serif text-primary">{tier.price}</span>
              <span className="text-muted-foreground text-sm">{tier.unit}</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1.5">
                <User className="w-3 h-3" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                }}
                placeholder="Enter your full name"
                className={`w-full bg-background/50 border text-white placeholder:text-muted-foreground/50 text-sm px-4 py-3 rounded-none focus:outline-none focus:ring-1 transition-all ${
                  errors.name
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
                    : "border-white/10 focus:border-primary/60 focus:ring-primary/30"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                placeholder="your@email.com"
                className={`w-full bg-background/50 border text-white placeholder:text-muted-foreground/50 text-sm px-4 py-3 rounded-none focus:outline-none focus:ring-1 transition-all ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
                    : "border-white/10 focus:border-primary/60 focus:ring-primary/30"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Confirm Email */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Confirm Email
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  if (errors.confirmEmail) setErrors(prev => ({ ...prev, confirmEmail: "" }));
                }}
                placeholder="Confirm your email"
                className={`w-full bg-background/50 border text-white placeholder:text-muted-foreground/50 text-sm px-4 py-3 rounded-none focus:outline-none focus:ring-1 transition-all ${
                  errors.confirmEmail
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
                    : "border-white/10 focus:border-primary/60 focus:ring-primary/30"
                }`}
              />
              {errors.confirmEmail && (
                <p className="text-xs text-red-400">{errors.confirmEmail}</p>
              )}
            </div>

            {/* Referral badge */}
            {referralCode && (
              <div className="flex items-center gap-2 text-xs text-green-400/80 bg-green-500/10 border border-green-500/15 px-3 py-2">
                <span>Referral code:</span>
                <span className="font-mono font-bold">{referralCode}</span>
              </div>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 text-center">
                {errors.submit}
              </div>
            )}

            {/* Info text */}
            <p className="text-[11px] text-muted-foreground/60 text-center">
              Your e-ticket with a QR code will be sent to this email after payment.
            </p>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground hover:bg-primary/90 uppercase font-bold tracking-[0.15em] text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {isSubmitting ? "Redirecting to payment..." : "Proceed to Payment"}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
