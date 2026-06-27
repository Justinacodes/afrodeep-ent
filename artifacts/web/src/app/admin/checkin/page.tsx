import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckInButton } from "./CheckInButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function CheckInPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-secondary/20 border-primary/20 text-center">
          <CardContent className="p-8">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-2">No Ticket Token</h2>
            <p className="text-muted-foreground text-sm">
              Scan a ticket QR code or provide a token in the URL to check in a guest.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ticket = await db.query.ticketsTable.findFirst({
    where: eq(ticketsTable.qrToken, token),
  });

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-red-500/10 border-red-500/30 text-center">
          <CardContent className="p-8">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-400 uppercase tracking-wider mb-2">Invalid Ticket</h2>
            <p className="text-muted-foreground text-sm">
              This QR code does not match any ticket in our system. It may be fake or expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (ticket.status !== "paid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-orange-500/10 border-orange-500/30 text-center">
          <CardContent className="p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-orange-400 uppercase tracking-wider mb-2">Unpaid Ticket</h2>
            <p className="text-muted-foreground text-sm">
              This ticket has not been paid for. Status: <span className="font-mono text-orange-400">{ticket.status}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className={`w-full max-w-md border text-center ${
        ticket.checkedIn 
          ? "bg-orange-500/10 border-orange-500/30" 
          : "bg-green-500/10 border-green-500/30"
      }`}>
        <CardHeader>
          <CardTitle className="uppercase tracking-widest text-white text-lg">
            Ticket Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
            ticket.checkedIn
              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
              : "bg-green-500/20 text-green-400 border border-green-500/30"
          }`}>
            {ticket.checkedIn ? "⚠️ Already Checked In" : "✅ Valid Ticket"}
          </div>

          {/* Ticket Details */}
          <div className="space-y-3 text-left bg-background/50 border border-white/10 p-5">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Guest Name</span>
              <span className="text-white font-bold">{ticket.buyerName || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <span className="text-white text-sm">{ticket.buyerEmail || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Ticket Tier</span>
              <span className="text-primary font-bold">{ticket.tier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Capacity</span>
              <span className="text-white">{ticket.capacityTaken} {ticket.capacityTaken === 1 ? "person" : "people"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Purchased</span>
              <span className="text-muted-foreground text-sm">
                {new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Check-In Action */}
          {ticket.checkedIn ? (
            <div className="space-y-2">
              <p className="text-orange-400 text-sm font-medium">
                This guest was already checked in
              </p>
              {ticket.checkedInAt && (
                <p className="text-muted-foreground text-xs">
                  Checked in at: {new Date(ticket.checkedInAt).toLocaleDateString()}{" "}
                  {new Date(ticket.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          ) : (
            <CheckInButton ticketId={ticket.id} token={token} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
