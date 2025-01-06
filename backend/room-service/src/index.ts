import dotenv from "dotenv";
dotenv.config();
import { RedisManager } from "./RedisManager";

async function main() {
    const redisManager = RedisManager.getInstance();
    const queueClient = redisManager.getQueueClient();
    const pubsubClient = redisManager.getPubSubClient();
    const queueName = 'roomServiceRequestQueue';

    console.log("Room Service started. Waiting for requests...");

    async function processQueue() {
        while (true) {
            try {
                const result = await queueClient.brPop(queueName, 0);

                if (result) {
                    //result = [queueName, message]
                    const { key, element } = result;
                    console.log(`Received request from queue: ${key}, message: ${element}`);

                    const { clientId, message } = JSON.parse(element);

                    const responseMessage = `Welcome, user with ID: ${message.userId}`;
                    console.log(`Processing request for  client ID: ${clientId}, message: ${message}`);
                    console.log(`Sending response: ${responseMessage} -----`);

                    await redisManager.sendToAuthServices(clientId, responseMessage);
                }
            } catch (error) {
                console.error("Error processing request from queue:", error);
            }
        }
    }

    processQueue().catch((error) => {
        console.error("Error in Room Service:", error);
    });
}

main().catch((error) => {
    console.error("Error initializing Room Service:", error);
});