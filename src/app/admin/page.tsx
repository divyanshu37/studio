
import TrafficClient from './traffic-client';
import { Suspense } from 'react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Application Traffic</h1>
        <Suspense fallback={<p>Loading traffic data...</p>}>
          <TrafficClient />
        </Suspense>
      </div>
    </div>
  );
}
