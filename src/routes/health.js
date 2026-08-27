async function healthRoutes(fastify)
{
    fastify.get('/health', {
        schema: {
            response: {
                200:{
                    type: 'object',
                    properties: {
                        status: { type: 'string' },
                        timestamp: { type: 'number' }
                    }
                }
            }
        }
    }, async (request) => {
        return {
            status: 'ok',
            timestamp: request.startTime
        };
    });
}

module.exports = healthRoutes;