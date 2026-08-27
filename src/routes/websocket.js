const Ajv = require('ajv');

const roomManager = require('../services/roomManager');
const { messageSchema } = require('../schemas/chat.schema.js');

const ajv = new Ajv();
const validateMessage = ajv.compile(messageSchema);

async function websocketRoutes(fastify)
{
    //Fastify onRequest Hook for time-stamping incoming requests
    fastify.addHook('onRequest', async (request) => {
        request.startTime = Date.now();
    });

    fastify.get('/ws', { websocket: true }, (connection, req) => {
        const socket = connection.socket || connection;

        if(!socket)
        {
            fastify.log.error('WebSocket connection object is undefined');
            return;
        }
        
        socket.isAlive = true;

        socket.on('pong', () => {
            socket.isAlive = true;
        });

        socket.on('message', (rawMessage) => {
            let data;
            try
            {
                data = JSON.parse(rawMessage.toString());
            }
            catch(err)
            {
                socket.send(JSON.stringify({ error: 'Invalid JSON payload' }));
                return;
            }

            // Manual schema validation check against defined rules
            if(!validateMessage(data))
            {
                socket.send(JSON.stringify({
                    error: 'Schema validation failed',
                    details: validateMessage.errors
                }));

                return;
            }

            switch(data.action)
            {
                case 'join':
                    roomManager.leave(socket);
                    roomManager.join(data.room, socket);
                    socket.send(JSON.stringify({
                        event: 'joined',
                        room: data.room,
                        stats: roomManager.getRoomStats(data.room)
                    }));
                    break;

                case 'message': case 'stream_chunk':
                    if(!socket.currentRoom || socket.currentRoom !== data.room)
                    {
                        socket.send(JSON.stringify({ error: 'You must join the room before sending messages' }));
                        return;
                    }
                    roomManager.broadcast(data.room, socket, {
                        event: data.action,
                        room: data.room,
                        payload: data.payload,
                        timestamp: Date.now()
                    });
                    break;

                default:
                    socket.send(JSON.stringify({ error: 'Unknown action' }));
            }
        });

        socket.on('close', () => {
            roomManager.leave(socket);
        });

        socket.on('error', (err) => {
            fastify.log.error(err);
            roomManager.leave(socket);
        });
    });
}

module.exports = websocketRoutes;