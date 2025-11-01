# TeamsClone-RL Frontend

React + Vite frontend for TeamsClone-RL, providing a high-fidelity Microsoft Teams UI for both human users and RL agents.

## Setup

```bash
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## Features

- Real-time chat with Socket.IO
- Teams and channels navigation
- User presence indicators
- Message history
- Responsive Teams-like UI with TailwindCSS

## Environment Variables

Create a `.env` file:

```
VITE_SOCKET_URL=http://localhost:3001
```

## Component Structure

```
src/
├── App.jsx                 # Main app component
├── components/
│   ├── Header.jsx         # Top navigation bar
│   ├── Sidebar.jsx        # Left icon sidebar
│   ├── ChannelList.jsx    # Teams/channels list
│   ├── ChatArea.jsx       # Main chat area
│   └── Message.jsx        # Individual message component
```

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.
