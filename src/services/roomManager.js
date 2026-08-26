class RoomManager
{
    constructor()
    {
        // Map<roomName, Set<WebSocket>>
        this.rooms = new Map();
    }

    join(room, socket)
    {
        if(!this.rooms.has(room))
            this.rooms.set(room, new Set());

        this.rooms.get(room).add(socket);
        socket.currentRoom = room;
    }

    leave(socket)
    {
        const room = socket.currentRoom;
        if(room && this.rooms.has(room))
        {
            const clients = this.rooms.get(room);
            clients.delete(socket);

            if(clients.size === 0)
                this.rooms.delete(room);
        }

        socket.currentRoom = null;
    }

    broadcast(room, senderSocket, payload)
    {
        if(!this.rooms.has(room)) return;

        const message = JSON.stringify(payload);
        for(const client of this.rooms.get(room))
            if(client !== senderSocket && client.readyState === 1) // 1 = OPEN
                client.send(message);
    }

    getRoomStats(room)
    {
        return {
            activeClients: this.rooms.has(room) ? this.rooms.get(room).size : 0
        };
    }
}

module.exports = new RoomManager();