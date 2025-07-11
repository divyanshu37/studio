
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTraffic, type TrafficData } from '@/ai/flows/log-traffic-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  9: 'Agent Handoff Complete',
};

export default function TrafficClient() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending'});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTraffic();
        setTrafficData(data);
      } catch (error) {
        console.error("Failed to fetch traffic data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

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
              <TableCell className="font-mono text-xs">{item.uuid}</TableCell>
              <TableCell>
                <div className="font-medium">{stepDescriptions[item.step] || `Unknown Step ${item.step}`}</div>
                <div className="text-muted-foreground text-sm">Step {item.step} of 9</div>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
