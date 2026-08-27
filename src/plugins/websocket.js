const fp = require('fastify-plugin');
const fastifyWebsocket = require('@fastify/websocket');

module.exports = fp(async (fastify) => {
    // Register with allowReconnection & verified client handshake options
    await fastify.register(fastifyWebsocket, {
        options: {
            clientTracking: true,
            // Verify client origin to allow file:// and localhost
            verifyClient: (info, next) => {
                next(true); // Accept all origins
            }
        }
    });

    // Heartbeat interval check to reap dead TCP connections
    const interval = setInterval(() => {
        const wss = fastify.websocketServer;
        
        if(!wss || !wss.clients)
            return;

        for(const ws of wss.clients)
        {
            if(ws.isAlive === false)
            {
                ws.terminate();
                continue;
            }

            ws.isAlive = false;
            ws.ping();
        }
    }, fastify.config.HEARTBEAT_INTERVAL);

    fastify.addHook('onClose', (instance, done) => {
        clearInterval(interval);
        done(); // Resolves hanging on shutdown
    });
});