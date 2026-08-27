const crypto = require('crypto');

class RoomManager
{
    constructor()
    {
        // Map<roomName, Set<WebSocket>>
        this.rooms = new Map();
    }

    createRoom(title)
    {
        let roomId;
        do
        {
            roomId = crypto.randomBytes(4).toString('hex'); // e.g. "a1b2c3d4"
        } while(this.rooms.has(roomId));

        this.rooms.set(roomId, {
            title: title || 'Untitled Room',
            clients: new Set()
        });

        return { roomId, title: this.rooms.get(roomId).title };
    }

    join(roomId, socket)
    {
        if(!this.rooms.has(roomId))
            return false;

        this.rooms.get(roomId).clients.add(socket);
        socket.currentRoom = roomId;

        return true;
    }

    leave(socket)
    {
        const roomId = socket.currentRoom;
        if(roomId && this.rooms.has(roomId))
        {
            const room = this.room.get(roomId);

            croom.clients.delete(socket);

            if(room.clients.size === 0)
                this.rooms.delete(roomId);
        }

        socket.currentRoom = null;
    }

    broadcast(roomId, senderSocket, payload)
    {
        if(!this.rooms.has(roomId))
            return;

        const message = JSON.stringify(payload);
        for(const client of this.rooms.get(roomId).clients)
            if(client !== senderSocket && client.readyState === 1) // 1 = OPEN
                client.send(message);
    }

    getRoomStats(roomId)
    {
        if(!this.rooms.has(roomId))
            return null;

        const room = this.rooms.get(roomId);
        return {
            title: room.title,
            activeClients: room.clients.size
        };
    }
}

module.exports = new RoomManager();