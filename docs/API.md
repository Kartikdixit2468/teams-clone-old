# API Reference

Complete API documentation for TeamsClone-RL backend.

## Base URL

```
http://localhost:3001
```

## Table of Contents
- [RL Environment API](#rl-environment-api)
- [Socket.IO Events](#socketio-events)
- [Error Handling](#error-handling)

## RL Environment API

All environment endpoints are prefixed with `/env`.

### POST /env/reset

Reset the environment to initial state.

**Request:**
```http
POST /env/reset
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "state": {
    "agentState": { ... },
    "currentChannel": { ... },
    "recentMessages": [ ... ],
    "teams": [ ... ],
    "users": [ ... ],
    "episodeStats": { ... },
    "timestamp": 1698765432000
  },
  "message": "Environment reset successfully"
}
```

**Status Codes:**
- `200 OK` - Successfully reset
- `500 Internal Server Error` - Server error

---

### GET /env/state

Get current environment state (observation).

**Request:**
```http
GET /env/state
```

**Response:**
```json
{
  "success": true,
  "state": {
    "agentState": {
      "currentTeamId": "team-1",
      "currentChannelId": "channel-1",
      "userId": "agent"
    },
    "currentChannel": {
      "id": "channel-1",
      "name": "General",
      "teamId": "team-1",
      "unread": 0
    },
    "recentMessages": [
      {
        "id": "msg-uuid",
        "channelId": "channel-1",
        "userId": "user-1",
        "content": "Hello!",
        "timestamp": 1698765432000,
        "reactions": []
      }
    ],
    "teams": [ ... ],
    "users": [ ... ],
    "episodeStats": {
      "stepCount": 10,
      "totalReward": 2.5,
      "messagesSent": 3,
      "channelsSwitched": 2,
      "startTime": 1698765432000
    },
    "timestamp": 1698765432100
  }
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved
- `500 Internal Server Error` - Server error

---

### POST /env/step

Execute an action and receive next state + reward.

**Request:**
```http
POST /env/step
Content-Type: application/json

{
  "action": {
    "type": "send_message",
    "payload": {
      "content": "Hello team!"
    }
  }
}
```

**Action Types:**

#### send_message
```json
{
  "type": "send_message",
  "payload": {
    "content": "Message text",
    "channelId": "channel-1"  // Optional
  }
}
```

#### switch_channel
```json
{
  "type": "switch_channel",
  "payload": {
    "channelId": "channel-2"
  }
}
```

#### react_to_message
```json
{
  "type": "react_to_message",
  "payload": {
    "messageId": "msg-uuid",
    "reaction": "👍"
  }
}
```

#### join_call
```json
{
  "type": "join_call",
  "payload": {
    "channelId": "channel-1"  // Optional
  }
}
```

**Response:**
```json
{
  "success": true,
  "state": { ... },
  "reward": 0.1,
  "done": false,
  "info": {
    "action": "message_sent"
  }
}
```

**Status Codes:**
- `200 OK` - Action executed
- `400 Bad Request` - Invalid action format
- `500 Internal Server Error` - Server error

**Possible Rewards:**
- `0.1 to 0.6` - Positive actions (messages, exploration)
- `-0.1 to -0.5` - Invalid or penalty actions

---

### GET /env/actions

Get list of available actions and channels.

**Request:**
```http
GET /env/actions
```

**Response:**
```json
{
  "success": true,
  "actions": [
    {
      "type": "send_message",
      "description": "Send a message to a channel",
      "payload": {
        "content": "string (required)",
        "channelId": "string (optional, defaults to current channel)"
      }
    },
    {
      "type": "switch_channel",
      "description": "Switch to a different channel",
      "payload": {
        "channelId": "string (required)"
      }
    },
    {
      "type": "react_to_message",
      "description": "React to a message with an emoji",
      "payload": {
        "messageId": "string (required)",
        "reaction": "string (required)"
      }
    },
    {
      "type": "join_call",
      "description": "Join a call in a channel",
      "payload": {
        "channelId": "string (optional, defaults to current channel)"
      }
    }
  ],
  "channels": [
    {
      "id": "channel-1",
      "name": "General",
      "teamName": "General Team"
    },
    {
      "id": "channel-2",
      "name": "Random",
      "teamName": "General Team"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved
- `500 Internal Server Error` - Server error

---

### GET /env/stats

Get episode statistics.

**Request:**
```http
GET /env/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "stepCount": 10,
    "totalReward": 2.5,
    "messagesSent": 3,
    "channelsSwitched": 2,
    "startTime": 1698765432000
  }
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved
- `500 Internal Server Error` - Server error

---

## Socket.IO Events

Real-time communication via Socket.IO.

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Client → Server Events

#### join_channel

Join a channel room to receive messages.

```javascript
socket.emit('join_channel', channelId);
```

**Parameters:**
- `channelId` (string) - Channel to join

---

#### leave_channel

Leave a channel room.

```javascript
socket.emit('leave_channel', channelId);
```

**Parameters:**
- `channelId` (string) - Channel to leave

---

#### send_message

Send a message via Socket.IO.

```javascript
socket.emit('send_message', {
  channelId: 'channel-1',
  userId: 'user-1',
  content: 'Hello!'
});
```

**Parameters:**
- `channelId` (string) - Target channel
- `userId` (string) - Sender ID
- `content` (string) - Message text

---

#### typing

Indicate user is typing.

```javascript
socket.emit('typing', {
  channelId: 'channel-1',
  userId: 'user-1',
  userName: 'Alice'
});
```

---

#### update_presence

Update user presence status.

```javascript
socket.emit('update_presence', {
  userId: 'user-1',
  status: 'busy'  // available, busy, away, offline
});
```

---

#### add_reaction

Add reaction to a message.

```javascript
socket.emit('add_reaction', {
  messageId: 'msg-uuid',
  channelId: 'channel-1',
  reaction: '👍',
  userId: 'user-1'
});
```

---

### Server → Client Events

#### new_message

Receive a new message in a channel.

```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // message = {
  //   id, channelId, userId, content, timestamp, reactions
  // }
});
```

---

#### user_typing

Someone is typing in the channel.

```javascript
socket.on('user_typing', ({ userId, userName }) => {
  console.log(`${userName} is typing...`);
});
```

---

#### presence_update

User status changed.

```javascript
socket.on('presence_update', ({ userId, status }) => {
  console.log(`${userId} is now ${status}`);
});
```

---

#### reaction_added

Reaction added to a message.

```javascript
socket.on('reaction_added', ({ messageId, reaction, userId }) => {
  console.log(`${userId} reacted with ${reaction}`);
});
```

---

#### unread_update

Unread count updated.

```javascript
socket.on('unread_update', ({ channelId, count }) => {
  console.log(`Channel ${channelId} has ${count} unread`);
});
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Errors

#### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid action format. Expected: { action: { type: string, payload: object } }"
}
```

**Cause**: Malformed request body

---

#### 404 Not Found

```json
{
  "success": false,
  "error": "Channel not found"
}
```

**Cause**: Invalid channel ID

---

#### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Cause**: Server-side error

---

## Rate Limiting

Currently **not implemented**. Future versions may include:
- Max 100 requests/minute per IP
- Max 10 messages/second per user

## Authentication

Currently **not required**. Future versions may include:
- JWT tokens
- API keys
- Session management

## CORS

Configured to allow:
- Origin: `http://localhost:5173` (frontend)
- Methods: `GET, POST`
- Credentials: Allowed

## Health Check

### GET /health

Check server health.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-01T12:00:00.000Z"
}
```

---

## Python Client Example

```python
from rl_client import TeamsEnvClient

# Initialize client
client = TeamsEnvClient('http://localhost:3001')

# Reset environment
state = client.reset()

# Get available actions
actions = client.get_actions()

# Execute action
result = client.step({
    'type': 'send_message',
    'payload': {'content': 'Hello!'}
})

print(f"Reward: {result['reward']}")
print(f"Done: {result['done']}")

# Get statistics
stats = client.get_stats()
print(stats)
```

---

For more examples, see the `python_agent/` directory.
