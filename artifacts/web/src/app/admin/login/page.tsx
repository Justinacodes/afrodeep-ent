"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface LoginState {
  error?: string;
}

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState<LoginState | null, FormData>(loginAction as any, null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-secondary/20 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black uppercase tracking-widest text-primary">Admin Access</CardTitle>
          <CardDescription>Enter the master password to view dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="bg-background/50 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-background/50 border-white/10"
              />
            </div>
            
            {state?.error && (
              <p className="text-red-500 text-sm font-medium">{state.error}</p>
            )}

            <Button type="submit" disabled={isPending} className="w-full uppercase font-bold tracking-widest">
              {isPending ? "Verifying..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
