"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  ticketId: number;
  token: string;
}

export function CheckInButton({ ticketId, token }: Props) {
  const [isChecking, setIsChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    try {
      setIsChecking(true);
      setError("");

      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Check-in failed");
      }

      setChecked(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsChecking(false);
    }
  };

  if (checked) {
    return (
      <div className="space-y-2">
        <div className="text-5xl">🎉</div>
        <p className="text-green-400 text-lg font-bold uppercase tracking-wider">
          Checked In Successfully!
        </p>
        <p className="text-muted-foreground text-sm">Welcome aboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckIn}
        disabled={isChecking}
        className="w-full py-4 bg-green-500 hover:bg-green-600 text-white uppercase font-bold tracking-[0.15em] text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
      >
        {isChecking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "✓ Check In Guest"
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
