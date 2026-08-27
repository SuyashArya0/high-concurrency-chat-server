# High-Concurrency Real-Time Chat & Streaming Server

A high-performance, event-driven WebSocket and HTTP server built with Node.js, Fastify, and Ajv schema validation. Designed for ultra-low latency, low-overhead broadcasting, automatic zombie connection reaping, and room-based channel management.

## Features

- **Blazing Fast Routing & I/O:** Powered by Fastify and native WebSockets (`ws`).
- **Heartbeat Connection Monitoring:** Automatic RFC 6455 `ping`/`pong` health sweeps to detect and terminate dead TCP connections.
- **Ajv Schema Validation:** In-memory synchronous schema compilation to validate incoming frame formats before execution.
- **Room Subscriptions & Broadcasting:** Isolated channel management (`RoomManager`) with zero-copy message fan-out.
- **Strict Configuration Schema:** Centralized environment variable management via `@fastify/env`.
- **Health Check Boundary:** Includes dedicated HTTP probes for load balancer readiness checks.

---

## Directory Architecture

```text
high-concurrency-chat-server/
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── server.js
└── src/
    ├── app.js
    ├── config/
    │   └── env.js
    ├── plugins/
    │   └── websocket.js
    ├── schemas/
    │   └── chat.schema.js
    ├── services/
    │   └── roomManager.js
    └── routes/
        ├── health.js
        └── websocket.js
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Installation
1. **Clone the repository**:
```text
git clone [https://github.com/your-username/high-concurrency-chat-server.git](https://github.com/your-username/high-concurrency-chat-server.git)
cd high-concurrency-chat-server
```

2. **Install dependencies**:
```text
npm install
```

3. **Configure Environment Variables**:
Create a .env file in the project root:
```text
cp .env.example .env
```

---

## Running the Server

- **Development Mode**(with file watching):
```text
npm run dev
```

- **Production Mode**:
```text
npm start
```

The server listens on http://0.0.0.0:3000 by default.

---

## API & WebSocket Specification

### 1. HTTP Health Check
- **Endpoint**: ```GET /health```

- **Response**:
**JSON**
```text
{
    "status": "ok",
    "timestamp": 1787834552303
}
```

### 2. WebSocket Protocol(/ws)
Connect via WebSocket to ```ws://localhost:3000/ws```

---

### Actions & Payloads
#### Create Room
Creates a new room with a random 8-character hexadecimal ID and automatically joins the creator to it.

- **Client Request: JSON**
```text
{
  "action": "create",
  "payload": "General Lounge"
}
```

- **Server Response: JSON**
```text
{
  "event": "created",
  "roomId": "a1b2c3d4",
  "title": "General Lounge",
  "stats": {
    "title": "General Lounge",
    "activeClients": 1
  }
}
```
---
#### Join Room
Joins an existing room using its generated roomId. Attempting to join a non-existent room returns an error frame.

- **Client Request: JSON**
```text
{
  "action": "join",
  "room": "a1b2c3d4"
}
```

- **Server Response (Success): JSON**
```text
{
  "event": "joined",
  "room": "a1b2c3d4",
  "title": "General Lounge",
  "stats": {
    "title": "General Lounge",
    "activeClients": 2
  }
}
```

- **Server Response (Error): JSON**
```text
{
  "error": "Room does not exist. Check your Room ID"
}
```
---
#### Send Message
Broadcasts a text payload to all active clients currently connected to the same room (excluding the sender). You must join the target room before sending messages.

- **Client Request: JSON**
```text
{
  "action": "message",
  "room": "a1b2c3d4",
  "payload": "Hello everyone!"
}
```

- **Broadcast Output (Received by clients in room): JSON**
```text
{
  "event": "message",
  "room": "a1b2c3d4",
  "payload": "Hello everyone!",
  "timestamp": 1787834552303
}
```
---
#### Stream Chunk
Broadcasts high-frequency data chunks (such as audio/video fragments or real-time event logs) to room members.

- **Client Request: JSON**
```text
{
  "action": "stream_chunk",
  "room": "a1b2c3d4",
  "payload": "base64_encoded_chunk_data"
}
```

- **Broadcast Output (Received by clients in room): JSON**
```text
{
  "event": "stream_chunk",
  "room": "a1b2c3d4",
  "payload": "base64_encoded_chunk_data",
  "timestamp": 1787834552303
}
```

---

## License

[MIT](LICENSE)