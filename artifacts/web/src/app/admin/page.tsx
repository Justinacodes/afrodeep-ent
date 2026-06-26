import { db, ticketsTable, promotersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { logoutAction } from "./actions";
import { CreatePromoterDialog } from "./CreatePromoterDialog";
import { CopyLinkButton } from "./CopyLinkButton";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // 1. Fetch all paid tickets
  const paidTickets = await db
    .select()
    .from(ticketsTable)
    .where(eq(ticketsTable.status, "paid"))
    .orderBy(desc(ticketsTable.createdAt));

  // 2. Fetch all promoters
  const promoters = await db.select().from(promotersTable);

  // Calculate Overview Metrics
  let totalCapacity = 0;
  let totalRevenue = 0;

  paidTickets.forEach(ticket => {
    totalCapacity += ticket.capacityTaken;

    // Calculate revenue based on tier
    if (ticket.tier === "Standard Entry") totalRevenue += 35;
    else if (ticket.tier === "VIP Table for 2") totalRevenue += 250;
    else if (ticket.tier === "VIP Table for 4") totalRevenue += 500;
  });

  const MAX_CAPACITY = 360;
  const capacityPercentage = Math.min((totalCapacity / MAX_CAPACITY) * 100, 100);

  // Calculate Promoter Leaderboard
  const promoterStats = promoters.map(promoter => {
    const promoterTickets = paidTickets.filter(t => t.promoterId === promoter.id);
    const capacitySold = promoterTickets.reduce((sum, t) => sum + t.capacityTaken, 0);
    const revenueGenerated = promoterTickets.reduce((sum, t) => {
      if (t.tier === "Standard Entry") return sum + 35;
      if (t.tier === "VIP Table for 2") return sum + 250;
      if (t.tier === "VIP Table for 4") return sum + 500;
      return sum;
    }, 0);

    return {
      ...promoter,
      ticketsCount: promoterTickets.length,
      capacitySold,
      revenueGenerated,
    };
  }).sort((a, b) => b.capacitySold - a.capacitySold);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">Event Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time metrics and ticket sales</p>
          </div>
          <div className="flex items-center gap-4">
            <CreatePromoterDialog />
            <form action={logoutAction as any}>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">Log Out</Button>
            </form>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-secondary/30 border-primary/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Capacity Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{totalCapacity} <span className="text-lg text-muted-foreground font-normal">/ {MAX_CAPACITY}</span></div>
              <div className="w-full bg-background/50 h-2 mt-4 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000" 
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-primary/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-primary">£{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">From {paidTickets.length} successful transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/30 border-primary/20 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Active Promoters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-white">{promoters.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Registered in the database</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout for Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Promoter Leaderboard */}
          <Card className="bg-secondary/30 border-primary/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="uppercase tracking-widest text-white">Promoter Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {promoterStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">No promoters found in database.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-primary font-bold">Promoter</TableHead>
                      <TableHead className="text-primary font-bold">Code</TableHead>
                      <TableHead className="text-right text-primary font-bold">Capacity</TableHead>
                      <TableHead className="text-right text-primary font-bold">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {promoterStats.map((p) => (
                      <TableRow key={p.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{p.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-muted-foreground font-mono text-xs">{p.referralCode}</span>
                            <CopyLinkButton referralCode={p.referralCode} />
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-white font-bold">{p.capacitySold}</TableCell>
                        <TableCell className="text-right text-white">£{p.revenueGenerated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-secondary/30 border-primary/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="uppercase tracking-widest text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {paidTickets.length === 0 ? (
                <p className="text-muted-foreground text-sm">No paid tickets yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-primary font-bold">Tier</TableHead>
                      <TableHead className="text-primary font-bold">Time</TableHead>
                      <TableHead className="text-primary font-bold">Referral</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidTickets.slice(0, 10).map((t) => {
                      const promoter = promoters.find(p => p.id === t.promoterId);
                      return (
                        <TableRow key={t.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-medium text-white text-xs">{t.tier}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </TableCell>
                          <TableCell className="text-xs">
                            {promoter ? (
                              <span className="text-primary">{promoter.name}</span>
                            ) : (
                              <span className="text-muted-foreground/50">Direct</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
