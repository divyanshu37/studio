
'use server';
/**
 * @fileOverview A flow to log user traffic and progress.
 *
 * - logTraffic - Logs a user's progress.
 * - getTraffic - Retrieves all logged traffic.
 * - TrafficData - The schema for traffic data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// This is an in-memory store. In a real application, you would use a database.
const trafficLog: TrafficData[] = [];

export const TrafficDataSchema = z.object({
  uuid: z.string().uuid(),
  step: z.number(),
  timestamp: z.string().datetime(),
});
export type TrafficData = z.infer<typeof TrafficDataSchema>;

const LogTrafficInputSchema = z.object({
    uuid: z.string().uuid(),
    step: z.number(),
});

const LogTrafficOutputSchema = z.object({
    success: z.boolean(),
});

const getTrafficOutputSchema = z.array(TrafficDataSchema);


export async function logTraffic(input: z.infer<typeof LogTrafficInputSchema>): Promise<z.infer<typeof LogTrafficOutputSchema>> {
    return logTrafficFlow(input);
}

export async function getTraffic(): Promise<z.infer<typeof getTrafficOutputSchema>> {
    return getTrafficFlow();
}

const logTrafficFlow = ai.defineFlow(
  {
    name: 'logTrafficFlow',
    inputSchema: LogTrafficInputSchema,
    outputSchema: LogTrafficOutputSchema,
  },
  async ({ uuid, step }) => {
    const existingEntryIndex = trafficLog.findIndex(entry => entry.uuid === uuid);
    const newEntry: TrafficData = {
        uuid,
        step,
        timestamp: new Date().toISOString(),
    };

    if (existingEntryIndex > -1) {
        // Update if the new step is greater than the existing one
        if (trafficLog[existingEntryIndex].step < step) {
            trafficLog[existingEntryIndex] = newEntry;
        }
    } else {
        trafficLog.push(newEntry);
    }
    
    console.log(`Logged traffic for ${uuid}: Step ${step}`);
    return { success: true };
  }
);


const getTrafficFlow = ai.defineFlow(
    {
        name: 'getTrafficFlow',
        inputSchema: z.void(),
        outputSchema: getTrafficOutputSchema,
    },
    async () => {
        return trafficLog;
    }
);
