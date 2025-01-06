import { RedisClientOptions, RedisClientType, createClient } from "redis";
import { REDIS_CONNECTION_URL } from "./constants/env";
import { ROOM_SERVICE_REQUEST_QUEUE } from "./types/redisTypes";

export class RedisManager {

    private roomRequestQueue: RedisClientType;
    private roomResponsePubSub: RedisClientType;

    private static instance: RedisManager;

    private constructor() {

        const clientOptions: RedisClientOptions = {
            url: REDIS_CONNECTION_URL,
            pingInterval: 4 * 60 * 1000, //ping every 4 minutes
            socket: {
                keepAlive: 60000,
                reconnectStrategy: (retries) => {
                    console.log(`Reconnecting attempt #${retries}...`);
                    return Math.min(retries * 100, 3000);
                },
            },
        };

        this.roomRequestQueue = createClient(clientOptions) as RedisClientType;
        this.roomResponsePubSub = createClient(clientOptions) as RedisClientType;

        this.setupEventHandlers(this.roomRequestQueue, 'roomRequestQueue');
        this.setupEventHandlers(this.roomResponsePubSub, 'roomResponsePubSub');

        this.connectClient(this.roomResponsePubSub);
        this.connectClient(this.roomRequestQueue);
    }

    private setupEventHandlers(client: RedisClientType, clientName: string) {
        client.on('error', (err) => {
            console.log(`Redis Client Error in ${clientName}`, err);
        });

        client.on('connect', () => {
            console.log(`Redis Client ${clientName} connected.`);
        });

        client.on('reconnecting', () => {
            console.log(`Redis client ${clientName} reconnecting...`);
        });

        client.on('end', () => {
            console.log(`Redis client ${clientName} connection closed.`)
        });
    }

    private async connectClient(client: RedisClientType) {
        try {
            await client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
        }
    }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    //TODO: add types to messages
    public sendAndAwait(message: any) {
        //code for testing purposes
        const id = Math.random().toString();

        return new Promise<any>((resolve, reject) => {
            this.roomResponsePubSub.subscribe(id, (message) => {
                this.roomResponsePubSub.unsubscribe(id);
                resolve(JSON.parse(message));
            }).catch((error) => {
                console.error('Subscription error:', error);
                reject(error);
            });

            this.roomRequestQueue.lPush("roomServiceRequestQueue", JSON.stringify({ clientId: id, message }))
                .then(() => {
                    console.log(`Service for id: ${id} pushed to Room Service Request Queue`);
                })
                .catch((error) => {
                    console.error('Failed to push message to queue:', error);
                    reject(error);
                });

        });
    }
}
