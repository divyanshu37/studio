
'use client';
import TrafficClient from './traffic-client';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyStats {
  completions: number;
  visitsThisMonth: number;
  visitsLastMonth: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<MonthlyStats>({
    completions: 0,
    visitsThisMonth: 0,
    visitsLastMonth: 0,
  });

  const handleDataLoad = (loadedStats: MonthlyStats) => {
    setStats(loadedStats);
  };
  
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.completions}</div>
                    <p className="text-xs text-muted-foreground">
                        Total applications completed this month
                    </p>
                </CardContent>
            </Card>
        </div>

        <Suspense fallback={<p>Loading traffic data...</p>}>
          <TrafficClient onDataLoad={handleDataLoad} />
        </Suspense>
      </div>
    </div>
  );
}
