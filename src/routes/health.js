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
    }, async () => {
        return {
            status: 'ok',
            timestamp: Date.now()
        };
    });
}

module.exports = healthRoutes;