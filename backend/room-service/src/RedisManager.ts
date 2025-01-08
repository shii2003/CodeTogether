import { createClient, RedisClientOptions, RedisClientType } from "redis";
import { REDIS_CONNECTION_URL } from "./constants/env";

export class RedisManager {

    private static instance: RedisManager;

    private queueClient: RedisClientType;
    private pubsubClient: RedisClientType;

    private constructor() {

        const clientOptions: RedisClientOptions = {
            url: REDIS_CONNECTION_URL,
            pingInterval: 1 * 60 * 1000,
            socket: {
                keepAlive: 60000, //60 seconds
                reconnectStrategy: (retries) => {
                    console.log(`Reconnecting attempt #${retries}...`);
                    return Math.min(retries * 100, 3000);
                },
            },
        };

        this.queueClient = createClient(clientOptions) as RedisClientType;
        this.pubsubClient = createClient(clientOptions) as RedisClientType;

        this.setupEventHandlers(this.queueClient, 'queueClient');
        this.setupEventHandlers(this.pubsubClient, 'pubsubClient');

        this.connectClient(this.queueClient);
        this.connectClient(this.pubsubClient);

    }

    private setupEventHandlers(client: RedisClientType, clientName: string) {
        client.on('error', (err) => {
            console.log(`Redis Client Error in ${clientName}`, err);
        });
        client.on('connect', () => {
            console.log(`Redis client ${clientName} connected.`);
        });
        client.on('reconnecting', () => {
            console.log(`Redis client ${clientName} reconnecting...`);
        });
        client.on('end', () => {
            console.log(`Redis client ${client} connection closed.`);
        });
    }

    private async connectClient(client: RedisClientType) {
        try {
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
        }
    }

    public static getInstance(): RedisManager {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public getQueueClient(): RedisClientType {
        return this.queueClient;
    }

    public getPubSubClient(): RedisClientType {
        return this.pubsubClient;
    }

    public async sendToAuthServices(clientId: string, messageToAuthServices: string): Promise<void> {
        this.pubsubClient.publish(clientId, JSON.stringify(messageToAuthServices));
    }
}