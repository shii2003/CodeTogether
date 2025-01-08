import WebSocket from "ws";
import { RoomManager } from "./RoomManager";
import { ACTION, CREATE, EXIT, JOIN } from "./types/roomActionTypes";

interface WebSocketMessage {
    action: ACTION;
    userId: string;
    roomId?: number;
}

export class WebSocketServer {

    private static instance: WebSocketServer;
    private wss: WebSocket.Server;
    private roomManager: RoomManager;

    private constructor(port: number) {
        this.wss = new WebSocket.Server({ port });
        this.roomManager = RoomManager.getInstance();
        this.setupEventHandlers();
        console.log(`WebSocket server started on port ${port}`);
    }

    public static getInstance(port: number): WebSocketServer {
        if (!this.instance) {
            this.instance = new WebSocketServer(port);
        }
        return this.instance;
    }

    private setupEventHandlers() {
        this.wss.on('connection', (ws) => {
            console.log("New webSocket connection established.");

            ws.on("message", (data) => {
                try {
                    const message: WebSocketMessage = JSON.parse(data.toString());
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.log("Error processing WebSocket message:", error);
                    ws.send(JSON.stringify({ status: "error", message: "Invalid message format." }))
                }
            });

            ws.on("close", () => {
                console.log("WebSocket connection closed.");
            });

            ws.on("error", (error) => {
                console.log("WebSocket error:", error);
            });
        });
    }

    private handleMessage(ws: WebSocket, message: WebSocketMessage) {

        const { action, userId, roomId } = message;

        if (!userId) {
            ws.send(JSON.stringify({ status: "error", message: "User ID is required." }));
            return;
        }

        switch (action) {
            case CREATE:
                const room = this.roomManager.createRoom(userId);
                ws.send(JSON.stringify({ status: "success", action: "create", roomId: room.id }));
                break;
            case JOIN:
                if (!roomId) {
                    ws.send(JSON.stringify({ status: "error", message: "Room ID is required for joining." }));
                    return;
                }

                const joinSuccess = this.roomManager.joinRoom(roomId, userId);
                if (joinSuccess) {
                    ws.send(JSON.stringify({ status: "success", action: "join", roomId }));
                } else {
                    ws.send(JSON.stringify({ status: "error", message: `Failed to join room ${roomId}` }));
                }
                break;
            case EXIT:
                if (!roomId) {
                    ws.send(JSON.stringify({ status: "error", message: "Room ID is required" }))
                    return;
                }

                const exitSuccess = this.roomManager.exitRoom(roomId, userId);
                if (exitSuccess) {
                    ws.send(JSON.stringify({ status: "success", action: "exit", roomId }));
                } else {
                    ws.send(JSON.stringify({ status: "error", message: `Failed to exit room: ${roomId}.` }));
                }
                break;
            default:
                ws.send(JSON.stringify({ status: "error", message: "Invalid action." }));
        }
    }
}