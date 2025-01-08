interface Room {
    id: number;
    owner: string;
    users: Set<string>;
}

export class RoomManager {

    private static instance: RoomManager;
    private rooms: Map<number, Room>;
    private roomIdCounter: number;

    private constructor() {
        this.rooms = new Map();
        this.roomIdCounter = 0;
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RoomManager();
        }
        return this.instance;
    }

    public createRoom(userId: string): Room {
        const roomId = ++this.roomIdCounter;
        const room: Room = {
            id: roomId,
            owner: userId,
            users: new Set([userId])
        };
        this.rooms.set(roomId, room);
        console.log(`Room created with ID: ${roomId}`);
        return room;
    }

    public joinRoom(roomId: number, userId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.log(`roomId: ${roomId} does not exit, user ${userId} please try again.`);
            return false;
        }
        room.users.add(userId);
        console.log(`User: ${userId} joined room ${roomId}.`);
        return true;
    }

    public exitRoom(roomId: number, userId: string): boolean {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.log(`rooId: ${roomId} does not exist, please try again user: ${userId}`);
            return false;
        }
        room.users.delete(userId);
        console.log(`user: ${userId} successfully exited room: ${roomId}`)
        return true;
    }

    public getRoomDetails(roomId: number): Room | false {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.log(`room: ${roomId} does not exist`);
            return false;
        }
        return room;
    }
}