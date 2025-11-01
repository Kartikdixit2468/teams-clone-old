# TeamsClone-RL Backend

Backend server for TeamsClone-RL project, providing:

- Real-time chat via Socket.IO
- RL Environment API for agent interaction
- Teams/Channels management
- Episode logging and reward calculation

## Setup

```bash
npm install
npm run dev
```

## API Endpoints

### RL Environment API

- `POST /env/reset` - Reset environment to initial state
- `GET /env/state` - Get current observation
- `POST /env/step` - Execute action and get reward
- `GET /env/actions` - List available actions
- `GET /env/stats` - Get episode statistics

### Socket.IO Events

**Client → Server:**

- `join_channel` - Join a channel room
- `send_message` - Send a message
- `typing` - Typing indicator
- `update_presence` - Update user status
- `add_reaction` - React to message

**Server → Client:**

- `new_message` - New message broadcast
- `user_typing` - Typing indicator
- `presence_update` - User status change
- `reaction_added` - Reaction added
- `unread_update` - Unread count update

## Environment Variables

See `.env.example` for configuration options.
