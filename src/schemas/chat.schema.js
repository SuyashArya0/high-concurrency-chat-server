const messageSchema = {
    type: 'object',
    required: ['action'],
    properties: {
        action: {
            type: 'string',
            enum: ['create', 'join', 'message', 'stream_chunk']
        },
        room: {
            type: 'string',
            minLength: 1
        },
        payload: { type: 'string' }
    },
    allOf: [
        {
            if: {
                properties: {
                    action: {
                        enum: ['join', 'message', 'stream_chunk']
                    }
                }
            },
            then: { required: ['room'] }
        },
        {
            if: {
                properties: {
                    action: {
                        enum: ['message', 'stream_chunk']
                    }
                }
            },
            then: { required: ['payload'] }
        }
    ]
};

module.exports = { messageSchema };