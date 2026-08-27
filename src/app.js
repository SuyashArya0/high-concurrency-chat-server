const fastify = require('fastify');
const fastifyEnv = require('@fastify/env');
const envConfig = require('./config/env');
const websocketPlugin = require('./plugins/websocket');
const healthRoutes = require('./routes/health');
const websocketRoutes = require('./routes/websocket');

async function buildApp(opts = {})
{
    const app = fastify(opts);

    await app.register(fastifyEnv, envConfig);
    await app.register(websocketPlugin);

    // Custom global error boundary
    app.setErrorHandler((error, request, reply) => {
        app.log.error(error);
        reply.status(error.statusCode || 500).send({
            success: false,
            error: error.message || 'Internal Server Error',
            timestamp: request.startTime || Date.now()
        });
    });

    await app.register(healthRoutes);
    await app.register(websocketRoutes);

    return app;
}

module.exports = buildApp;