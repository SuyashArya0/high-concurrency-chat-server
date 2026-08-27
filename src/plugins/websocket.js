const fp = require('fastify-plugin');
const fastifyWebsocket = require('@fastify/websocket');

module.exports = fp(async (fastify) => {
    await fastify.register(fastifyWebsocket);

    // Heartbeat interval check to reap dead TCP connections
    const interval = setInterval(() => {
        const wss = fastify.websocketServer;
        
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
    });
});