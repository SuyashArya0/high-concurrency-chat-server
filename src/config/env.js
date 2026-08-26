const envSchema = {
    type: 'object',
    required: ['PORT', 'HOST', 'HEARTBEAT_INTERVAL'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        HOST: { type: 'string', default: '0.0.0.0' },
        HEARTBEAT_INTERVAL: { type: 'number', default: 30000 }
    }
};

module.exports = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true
};