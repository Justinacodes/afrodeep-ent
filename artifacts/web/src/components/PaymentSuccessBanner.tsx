"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

export function PaymentSuccessBanner() {
  const [show, setShow] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");

    if (success === "true" && sessionId) {
      setShow(true);

      // Verify the payment and mark ticket as paid
      fetch(`/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "paid") {
            setVerified(true);
          }
        })
        .catch(console.error);

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", url.pathname);
    }

    if (params.get("canceled") === "true") {
      // Clean up canceled URL too
      const url = new URL(window.location.href);
      url.searchParams.delete("canceled");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-center"
      >
        <div className="bg-green-500/15 border border-green-500/30 backdrop-blur-md px-6 py-4 max-w-lg w-full flex items-start gap-3 shadow-2xl">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-green-400 font-bold uppercase tracking-wider text-sm">
              Payment Successful!
            </p>
            <p className="text-green-400/70 text-xs mt-1">
              {verified
                ? "Your ticket has been confirmed. Check your email for your QR code entry ticket!"
                : "Processing your ticket... Check your email shortly for your QR code."}
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-green-400/50 hover:text-green-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
