"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Plus, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPromoterAction } from "./actions";
import { toast } from "sonner";

type CreatePromoterState = {
  error?: string;
  success?: boolean;
  referralCode?: string;
} | null;

export function CreatePromoterDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<CreatePromoterState, FormData>(createPromoterAction, null);
  const [copiedLink, setCopiedLink] = useState(false);

  // If successfully created, copy to clipboard automatically or show success UI
  useEffect(() => {
    if (state?.success && state?.referralCode) {
      toast.success("Promoter Created!");
      setOpen(false);
    }
  }, [state]);

  const copyToClipboard = (code: string) => {
    const link = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="uppercase font-bold tracking-widest gap-2">
          <Plus className="w-4 h-4" /> Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-secondary border-primary/20">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-primary">New Promoter</DialogTitle>
          <DialogDescription>
            Create a custom referral code. We'll generate a shareable link.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Promoter Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. John Doe"
              className="bg-background/50 border-white/10 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-white">Referral Code</Label>
            <Input
              id="referralCode"
              name="referralCode"
              placeholder="e.g. JOHN10"
              className="bg-background/50 border-white/10 uppercase text-white"
              required
            />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Must be unique. No spaces.
            </p>
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm font-medium">{state.error}</p>
          )}

          <Button type="submit" disabled={isPending} className="w-full uppercase font-bold tracking-widest">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Link"
            )}
          </Button>
        </form>

        {state?.success && state?.referralCode && (
          <div className="mt-4 p-4 border border-primary/30 bg-primary/5 rounded-md flex flex-col items-center gap-3">
            <p className="text-sm text-center text-muted-foreground">Generated Link:</p>
            <code className="text-primary font-mono text-xs bg-background px-2 py-1 rounded">
              /?ref={state.referralCode}
            </code>
            <Button 
              variant="outline" 
              className="w-full border-primary/30 hover:bg-primary/10 gap-2"
              onClick={() => copyToClipboard(state.referralCode!)}
            >
              {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? "Copied!" : "Copy Full Link"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
