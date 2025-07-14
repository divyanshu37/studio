
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTraffic, type TrafficData } from '@/ai/flows/log-traffic-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

type SortKey = keyof TrafficData;

const stepDescriptions: { [key: number]: string } = {
  1: 'Started Application',
  2: 'Answered Health Questions',
  3: 'Entered Beneficiary Info',
  4: 'Entered Payment Info',
  5: 'Reached Thank You Page',
  6: 'Started Self-Enroll',
  7: 'SMS Verification Sent',
  8: 'Self-Enroll Complete',
  9: 'Agent Handoff Chosen',
};

const TOTAL_STEPS = 9;

export default function TrafficClient({ initialData }: { initialData: TrafficData[] }) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending'});

  const sortedData = useMemo(() => {
    let sortableItems = [...trafficData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [trafficData, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };
  
  const getProgressColor = (step: number): string => {
    if (step >= 8) return 'bg-green-500'; // Completion (Self-Enroll or Agent)
    if (step >= 5) return 'bg-lime-500';  // Past Payment
    if (step >= 4) return 'bg-amber-500'; // Past Beneficiary/Policy
    return 'bg-red-500';                   // Early steps
  };


  if (isLoading) {
    return <p>Refreshing traffic data...</p>;
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('uuid')}>
                UUID
                {getSortIcon('uuid')}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('step')}>
                Progress
                {getSortIcon('step')}
              </Button>
            </TableHead>
            <TableHead>
               <Button variant="ghost" onClick={() => requestSort('timestamp')}>
                Last Activity
                {getSortIcon('timestamp')}
              </Button>
            </TableHead>
            <TableHead>
                Location
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.uuid}>
              <TableCell className="font-mono text-xs p-2">{item.uuid}</TableCell>
              <TableCell className="p-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col w-64">
                    <div className="font-medium truncate text-sm">{stepDescriptions[item.step] || `Unknown Step ${item.step}`}</div>
                     <div className="text-muted-foreground text-xs">Step {item.step} of {TOTAL_STEPS}</div>
                    <Progress 
                        value={(item.step / TOTAL_STEPS) * 100} 
                        className="h-2 mt-1" 
                        indicatorClassName={getProgressColor(item.step)} 
                    />
                  </div>
                  <div className="ml-auto">
                    {item.step === 8 && (
                      <Badge variant="success">
                        SELF-ENROLLED
                      </Badge>
                    )}
                    {item.step === 9 && (
                      <Badge variant="secondary">
                        AGENT HANDOFF
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2 text-xs">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</TableCell>
              <TableCell className="p-2 text-xs">
                {item.city || item.country ? (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{item.city}, {item.country}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">Unknown</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
