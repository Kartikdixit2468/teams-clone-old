# TeamsClone-RL 🤖

**A High-Fidelity Microsoft Teams Environment for Reinforcement Learning**

TeamsClone-RL is a realistic web clone of Microsoft Teams designed to serve as an interactive environment for training and evaluating reinforcement learning agents on communication and collaboration tasks.

## 🎯 Overview

This project provides:

- ✅ **Realistic Teams UI/UX** - Fully functional web interface with real-time chat
- ✅ **RL Environment API** - Gym-like interface for agent interaction
- ✅ **Multi-user Support** - Real-time collaboration via Socket.IO
- ✅ **Reward System** - Task-based rewards for agent learning
- ✅ **Python Client** - Easy-to-use client library with example agents

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend                       │
│         (React + Vite + TailwindCSS)           │
│  - Teams UI - Channels - Chat - Presence       │
└─────────────┬───────────────────────────────────┘
              │
              │ Socket.IO + REST
              │
┌─────────────▼───────────────────────────────────┐
│                  Backend                        │
│         (Node.js + Express + Socket.IO)        │
│  - Real-time Chat - RL API - State Management  │
└─────────────┬───────────────────────────────────┘
              │
              │ REST API
              │
┌─────────────▼───────────────────────────────────┐
│              Python RL Agent                    │
│  - State Observation - Action Selection        │
│  - Reward Processing - Learning Algorithm      │
└─────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Python 3.8+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Python Agent Setup

```bash
cd python_agent
pip install -r requirements.txt

# Run random agent
python agents/random_agent.py

# Run rule-based agent
python agents/rule_based_agent.py
```

## 📚 Documentation

- **[Environment Specification](./docs/ENV_SPEC.md)** - Observation/action spaces, state representation
- **[Evaluation Guide](./docs/EVALUATION.md)** - Reward design, metrics, evaluation protocol
- **[API Reference](./docs/API.md)** - Complete API documentation

## 🎮 RL Environment API

### Endpoints

| Endpoint       | Method | Description                        |
| -------------- | ------ | ---------------------------------- |
| `/env/reset`   | POST   | Reset environment to initial state |
| `/env/state`   | GET    | Get current observation            |
| `/env/step`    | POST   | Execute action, return reward      |
| `/env/actions` | GET    | List available actions             |
| `/env/stats`   | GET    | Get episode statistics             |

### Example Usage

```python
from rl_client import TeamsEnvClient

client = TeamsEnvClient('http://localhost:3001')

# Reset environment
state = client.reset()

# Execute action
action = {
    'type': 'send_message',
    'payload': {'content': 'Hello!'}
}
result = client.step(action)

print(f"Reward: {result['reward']}")
print(f"Done: {result['done']}")
```

## 🎯 Available Actions

1. **send_message** - Send message to channel
2. **switch_channel** - Navigate to different channel
3. **react_to_message** - React with emoji
4. **join_call** - Join voice/video call (simulated)

## 🏆 Reward Structure

- **Base message**: +0.1
- **Respond to mention**: +0.5
- **Join call**: +0.3
- **Channel exploration**: +0.05
- **Invalid action**: -0.1 to -0.5

See [EVALUATION.md](./docs/EVALUATION.md) for detailed reward design.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **RL Client**: Python, requests
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## 📁 Project Structure

```
teams-clone/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── server.js    # Main server
│   │   ├── routes/      # API routes
│   │   ├── models/      # Environment logic
│   │   ├── socket/      # Socket.IO handlers
│   │   └── config/      # Configuration
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.jsx      # Main component
│   │   └── components/  # UI components
│   └── package.json
│
├── python_agent/        # Python RL agents
│   ├── rl_client.py     # Environment client
│   ├── agents/          # Agent implementations
│   └── requirements.txt
│
└── docs/                # Documentation
    ├── ENV_SPEC.md
    ├── EVALUATION.md
    └── API.md
```

## 🤝 Contributing

This is a hackathon project. Team members should:

1. **Backend Team**: Extend RL environment logic, add more actions
2. **Frontend Team**: Improve UI/UX, add more Teams features
3. **ML Team**: Implement RL algorithms (DQN, PPO, etc.)
4. **Research Team**: Design better reward functions and evaluation metrics

## 📝 License

MIT

## 🎓 Citation

If you use TeamsClone-RL in your research, please cite:

```bibtex
@misc{teamsclone-rl,
  title={TeamsClone-RL: A High-Fidelity Microsoft Teams Environment for Reinforcement Learning},
  author={Your Team},
  year={2025}
}
```

## 🐛 Known Issues

- Message persistence not implemented (in-memory only)
- Limited to single-server deployment (no horizontal scaling)
- Call simulation is UI-only (no WebRTC)

## 🚧 Future Work

- [ ] Add file sharing simulation
- [ ] Implement calendar/meeting scheduling
- [ ] Multi-agent environments
- [ ] More sophisticated reward shaping
- [ ] Integration with popular RL frameworks (Stable-Baselines3, RLlib)

---

**Built with ❤️ for the hackathon**
