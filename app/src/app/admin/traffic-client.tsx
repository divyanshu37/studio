
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTraffic, type TrafficData } from '@/ai/flows/log-traffic-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown, MapPin } from 'lucide-react';
import { formatDistanceToNow, differenceInSeconds, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { STEP_IDS, stepDescriptions, getTotalSteps, ALL_STEPS, getStepNumber } from '@/lib/steps';

type SortKey = keyof TrafficData;

const TOTAL_STEPS = getTotalSteps();
const SELF_ENROLL_STEP = getStepNumber(STEP_IDS.SELF_ENROLL_COMPLETE);
const AGENT_HANDOFF_STEP = getStepNumber(STEP_IDS.AGENT_HANDOFF);
const PAYMENT_STEP = getStepNumber(STEP_IDS.PAYMENT);
const START_ENROLL_STEP = getStepNumber(STEP_IDS.SELF_ENROLL_LOADING);

export default function TrafficClient({ initialData }: { initialData: TrafficData[] }) {
  const [trafficData, setTrafficData] = useState<TrafficData[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending'});

  const stepIdMap = useMemo(() => {
    const map: { [key: number]: string } = {};
    ALL_STEPS.forEach((id, index) => {
        map[index + 1] = stepDescriptions[id] || `Unknown Step ${index + 1}`;
    });
    return map;
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsLoading(true);
      try {
        const newData = await getTraffic();
        setTrafficData(newData);
      } catch (error) {
        console.error("Failed to fetch traffic data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
    if (step >= SELF_ENROLL_STEP) return 'bg-green-500';
    if (step >= START_ENROLL_STEP) return 'bg-lime-500';
    if (step >= PAYMENT_STEP) return 'bg-amber-500';
    return 'bg-red-500';
  };


  if (isLoading && trafficData.length === 0) {
    return <p>Loading traffic data...</p>;
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => requestSort('uuid')}>
                User
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
          {sortedData.map((item) => {
            const isRecent = differenceInSeconds(new Date(), parseISO(item.timestamp)) < 10;
            return (
            <TableRow key={item.uuid} className={cn(isRecent && "bg-green-500/10")}>
              <TableCell className="font-mono text-xs p-2">
                 <div className="flex items-center gap-3">
                    {isRecent && (
                        <Badge variant="success" className="bg-green-600 text-white animate-pulse">Now</Badge>
                    )}
                    <span className="truncate">{item.uuid}</span>
                </div>
              </TableCell>
              <TableCell className="p-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col w-64">
                    <div className="font-medium truncate text-sm">{stepIdMap[item.step] || `Unknown Step ${item.step}`}</div>
                     <div className="text-muted-foreground text-xs">Step {item.step} of {TOTAL_STEPS}</div>
                    <Progress 
                        value={(item.step / TOTAL_STEPS) * 100} 
                        className="h-2 mt-1" 
                        indicatorClassName={getProgressColor(item.step)} 
                    />
                  </div>
                  <div className="ml-auto">
                    {item.step === SELF_ENROLL_STEP && (
                      <Badge variant="success">
                        SELF-ENROLLED
                      </Badge>
                    )}
                    {item.step === AGENT_HANDOFF_STEP && (
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
                        <span>{item.city}{item.city && item.country && ", "}{item.country}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">Unknown</span>
                )}
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}
