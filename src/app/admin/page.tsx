
'use client';
import TrafficClient from './traffic-client';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const [completedThisMonth, setCompletedThisMonth] = useState(0);

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
                    <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedThisMonth}</div>
                    <p className="text-xs text-muted-foreground">
                        Total applications completed this month
                    </p>
                </CardContent>
            </Card>
        </div>

        <Suspense fallback={<p>Loading traffic data...</p>}>
          <TrafficClient onDataLoad={setCompletedThisMonth} />
        </Suspense>
      </div>
    </div>
  );
}
