
'use server';
/**
 * @fileOverview A flow to log user traffic and progress.
 *
 * - logTraffic - Logs a user's progress.
 * @fileOverview A flow to log user traffic and progress.
 *
 * - logTraffic - Logs a user's progress.
 * - getTraffic - Retrieves all logged traffic.
 * - TrafficData - The schema for traffic data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.resolve(process.cwd(), '.data');
const logFilePath = path.join(dataDir, 'traffic-log.json');

const TrafficDataSchema = z.object({
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


// Helper function to ensure directory exists and read the log file
async function readLogFile(): Promise<TrafficData[]> {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        const fileContent = await fs.readFile(logFilePath, 'utf-8');
        return JSON.parse(fileContent) as TrafficData[];
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, so return an empty array
            return [];
        }
        console.error("Error reading traffic log:", error);
        throw error; // Rethrow other errors
    }
}

// Helper function to write to the log file
async function writeLogFile(data: TrafficData[]): Promise<void> {
    try {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(logFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing traffic log:", error);
        throw error;
    }
}

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
    const trafficLog = await readLogFile();
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
    
    await writeLogFile(trafficLog);
    
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
        return await readLogFile();
    }
);
