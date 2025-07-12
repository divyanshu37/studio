
import { Suspense } from 'react';
import TrafficClient from './traffic-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Users, PhoneForwarded } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTraffic, type TrafficData } from '@/ai/flows/log-traffic-flow';
import { isThisMonth, parseISO, subMonths, isSameMonth } from 'date-fns';

interface MonthlyStats {
  selfEnrollCompletions: number;
  agentHandoffs: number;
  visitsThisMonth: number;
  visitsLastMonth: number;
}

async function getStats(trafficData: TrafficData[]): Promise<MonthlyStats> {
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    const uniqueUuidsThisMonth = new Set<string>();
    const uniqueUuidsLastMonth = new Set<string>();
    const selfEnrolledThisMonthUuids = new Set<string>();
    const agentHandoffThisMonthUuids = new Set<string>();

    trafficData.forEach(item => {
        const timestamp = parseISO(item.timestamp);
        if (isThisMonth(timestamp)) {
            uniqueUuidsThisMonth.add(item.uuid);
            if (item.step === 8) {
                selfEnrolledThisMonthUuids.add(item.uuid);
            }
            if (item.step === 9) {
                agentHandoffThisMonthUuids.add(item.uuid);
            }
        }
        if (isSameMonth(timestamp, lastMonth)) {
            uniqueUuidsLastMonth.add(item.uuid);
        }
    });

    return {
      selfEnrollCompletions: selfEnrolledThisMonthUuids.size,
      agentHandoffs: agentHandoffThisMonthUuids.size,
      visitsThisMonth: uniqueUuidsThisMonth.size,
      visitsLastMonth: uniqueUuidsLastMonth.size,
    };
}


export default async function AdminPage() {
  const initialTrafficData = await getTraffic();
  const stats = await getStats(initialTrafficData);
  
  const lastMonthChange = stats.visitsThisMonth - stats.visitsLastMonth;
  const lastMonthChangePercentage = stats.visitsLastMonth > 0
    ? ((lastMonthChange / stats.visitsLastMonth) * 100).toFixed(1)
    : stats.visitsThisMonth > 0 ? '100.0' : '0.0';


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Application Traffic</h1>
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to App
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits This Month</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.visitsThisMonth}</div>
                     <p className="text-xs text-muted-foreground">
                        {lastMonthChange >= 0 ? '+' : ''}{lastMonthChangePercentage}% from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Self-Enrolled This Month</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.selfEnrollCompletions}</div>
                    <p className="text-xs text-muted-foreground">
                        Fully automated completions
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agent Handoffs This Month</CardTitle>
                    <PhoneForwarded className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.agentHandoffs}</div>
                    <p className="text-xs text-muted-foreground">
                        Applications needing agent follow-up
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visits Last Month</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.visitsLastMonth}</div>
                     <p className="text-xs text-muted-foreground">
                        Total unique visitors last month
                    </p>
                </CardContent>
            </Card>
        </div>

        <Suspense fallback={<p>Loading traffic data...</p>}>
          <TrafficClient initialData={initialTrafficData} />
        </Suspense>
      </div>
    </div>
  );
}
