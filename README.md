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
- **Join Room**: **JSON**
```text
{
    "action": "join",
    "room": "general"
}
```

- **Send Message**: **JSON**
```text
{
  "action": "message",
  "room": "general",
  "payload": "Hello everyone!"
}
```

- **Stream Chunk**: **JSON**
```text
{
  "action": "stream_chunk",
  "room": "general",
  "payload": "base64_encoded_chunk_data"
}
```

---

## License

[MIT](LICENSE)