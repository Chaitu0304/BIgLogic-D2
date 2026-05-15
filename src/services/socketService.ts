
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Mock Socket Service since we don't have a real backend socket server yet.
// This service simulates incoming events.

type EventCallback = (data: any) => void;

class MockSocketService {
    private listeners: Map<string, EventCallback[]> = new Map();
    private intervalId: NodeJS.Timeout | null = null;

    connect() {
        console.log("Mock Socket Connected");
        this.startSimulation();
    }

    disconnect() {
        console.log("Mock Socket Disconnected");
        this.stopSimulation();
    }

    on(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    off(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event)?.filter(cb => cb !== callback);
        this.listeners.set(event, callbacks || []);
    }

    private emit(event: string, data: any) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(data));
        }
    }

    private startSimulation() {
        // Simulate new workflow every 15 seconds
        this.intervalId = setInterval(() => {
            const newWorkflowId = uuidv4();
            const botNames = ["DataExtractor", "InvoiceParser", "EmailCampaign", "SchedulerBot"];
            const users = ["admin@biglogic.ai", "user1@example.com", "sales@company.com"];
            const bot = botNames[Math.floor(Math.random() * botNames.length)];
            const user = users[Math.floor(Math.random() * users.length)];

            // 1. New Workflow Started
            const startData = {
                id: newWorkflowId,
                startTime: new Date().toISOString(),
                userEmail: user,
                botName: bot,
                status: 'running',
                inputSummary: `input_file_${Math.floor(Math.random() * 1000)}.pdf`,
                outputSummary: 'Processing started...'
            };
            this.emit('workflow_start', startData);

            // 2. Simulate Progress/Completion after delay
            setTimeout(() => {
                const success = Math.random() > 0.2; // 80% success rate
                const completeData = {
                    ...startData,
                    endTime: new Date().toISOString(),
                    status: success ? 'success' : 'failed',
                    outputSummary: success ? 'Extracted 12 records successfully' : 'Error: Timeout waiting for selector',
                };
                this.emit(success ? 'workflow_complete' : 'workflow_error', completeData);
            }, 5000 + Math.random() * 5000); // 5-10s duration

        }, 8000);
    }

    private stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const socketService = new MockSocketService();
