
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTraffic, type TrafficData } from '@/ai/flows/log-traffic-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow, isThisMonth, parseISO, subMonths, isSameMonth } from 'date-fns';

type SortKey = keyof TrafficData;

interface MonthlyStats {
  completions: number;
  visitsThisMonth: number;
  visitsLastMonth: number;
}

const stepDescriptions: { [key: number]: string } = {
  1: 'Started Application',
  2: 'Answered Health Questions',
  3: 'Entered Beneficiary Info',
  4: 'Entered Payment Info',
  5: 'Reached Thank You Page',
  6: 'Started Self-Enroll',
  7: 'SMS Verification Sent',
  8: 'Self-Enroll Complete',
  9: 'Agent Handoff Complete',
};

const TOTAL_STEPS = 9;

export default function TrafficClient({ onDataLoad }: { onDataLoad: (stats: MonthlyStats) => void }) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending'});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTraffic();
        setTrafficData(data);
        
        const now = new Date();
        const lastMonth = subMonths(now, 1);

        const completedThisMonth = data.filter(item => 
          item.step >= 8 && isThisMonth(parseISO(item.timestamp))
        ).length;

        const visitsThisMonth = data.filter(item => isThisMonth(parseISO(item.timestamp))).length;
        const visitsLastMonth = data.filter(item => isSameMonth(parseISO(item.timestamp), lastMonth)).length;

        onDataLoad({
          completions: completedThisMonth,
          visitsThisMonth: visitsThisMonth,
          visitsLastMonth: visitsLastMonth,
        });

      } catch (error) {
        console.error("Failed to fetch traffic data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [onDataLoad]);

  const sortedData = useMemo(() => {
    let sortableItems = [...trafficData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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

  if (isLoading) {
    return <p>Loading traffic data...</p>;
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
                    <Progress value={(item.step / TOTAL_STEPS) * 100} className="h-2 mt-1" indicatorClassName="data-[value='100']:bg-green-500" />
                  </div>
                  {item.step >= 8 && (
                    <Badge variant="success" className="ml-auto">
                      COMPLETE
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-2 text-xs">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
