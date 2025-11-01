# Quick Start Guide - TeamsClone-RL

## For Your Team Members

### 🚀 Getting Started (5 minutes)

1. **Clone the repository**

```bash
git clone https://github.com/Muneer320/teams-clone.git
cd teams-clone
```

2. **Install root dependencies**

```bash
npm install
```

3. **Choose your path:**

---

## 🔧 Backend Developer

**Setup:**

```bash
cd backend
npm install
```

**Run development server:**

```bash
npm run dev
```

Server runs on: `http://localhost:3001`

**Test it works:**

```bash
curl http://localhost:3001/health
```

**Your tasks:**

- [ ] Extend environment actions in `src/models/environment.js`
- [ ] Add more reward logic
- [ ] Implement message persistence (database)
- [ ] Add authentication
- [ ] Create more Socket.IO events

**Key files:**

- `src/server.js` - Main server
- `src/routes/env.js` - RL API endpoints
- `src/models/environment.js` - Environment logic
- `src/socket/handlers.js` - Real-time events

---

## 🎨 Frontend Developer

**Setup:**

```bash
cd frontend
npm install
```

**Run development server:**

```bash
npm run dev
```

App runs on: `http://localhost:5173`

**Your tasks:**

- [ ] Improve UI/UX to match Teams more closely
- [ ] Add more components (calendar, files, etc.)
- [ ] Implement message reactions UI
- [ ] Add typing indicators
- [ ] Create call modal UI
- [ ] Add dark mode

**Key files:**

- `src/App.jsx` - Main app logic
- `src/components/` - All UI components
- `tailwind.config.js` - Styling configuration

---

## 🤖 ML/RL Developer

**Setup:**

```bash
cd python_agent
pip install -r requirements.txt
```

**Test random agent:**

```bash
python agents/random_agent.py
```

**Test rule-based agent:**

```bash
python agents/rule_based_agent.py
```

**Your tasks:**

- [ ] Implement DQN agent in `agents/rl_agent.py`
- [ ] Add state encoding (use BERT for messages)
- [ ] Implement training loop
- [ ] Add replay buffer
- [ ] Create evaluation script
- [ ] Tune hyperparameters
- [ ] Try PPO, A3C, or other algorithms

**Key files:**

- `rl_client.py` - Environment client
- `agents/rl_agent.py` - Your RL implementation
- `agents/random_agent.py` - Random baseline
- `agents/rule_based_agent.py` - Rule-based baseline

**Suggested libraries:**

- PyTorch / TensorFlow
- Stable-Baselines3
- RLlib
- Transformers (for message embeddings)

---

## 📚 Research/Documentation Team

**Your tasks:**

- [ ] Improve reward function design
- [ ] Create evaluation metrics
- [ ] Write experiment protocols
- [ ] Document findings
- [ ] Create visualizations
- [ ] Prepare presentation

**Key files:**

- `docs/ENV_SPEC.md` - Environment details
- `docs/EVALUATION.md` - Evaluation guide
- `docs/API.md` - API reference

---

## 🏃 Running Everything Together

**Option 1: Use root scripts (recommended)**

```bash
# From project root
npm run dev
```

This runs both frontend and backend simultaneously.

**Option 2: Separate terminals**

Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Terminal 3 - Python Agent:

```bash
cd python_agent
python agents/random_agent.py
```

---

## 📋 Development Workflow

1. **Pull latest changes**

```bash
git pull origin main
```

2. **Create feature branch**

```bash
git checkout -b feature/your-feature
```

3. **Make changes and test**

4. **Commit**

```bash
git add .
git commit -m "feat: describe your change"
```

5. **Push**

```bash
git push origin feature/your-feature
```

6. **Create Pull Request on GitHub**

---

## 🧪 Testing Your Work

### Backend

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test reset
curl -X POST http://localhost:3001/env/reset

# Test state
curl http://localhost:3001/env/state

# Test step
curl -X POST http://localhost:3001/env/step \
  -H "Content-Type: application/json" \
  -d '{"action":{"type":"send_message","payload":{"content":"Hello!"}}}'
```

### Frontend

- Open `http://localhost:5173`
- Try sending messages
- Switch channels
- Check console for errors

### Python Agent

```bash
cd python_agent
python agents/random_agent.py
```

---

## 🐛 Common Issues

### Backend won't start

- Check if port 3001 is available
- Run `npm install` in backend folder
- Check Node.js version (need 16+)

### Frontend won't start

- Check if port 5173 is available
- Run `npm install` in frontend folder
- Delete `node_modules` and reinstall if needed

### Python agent can't connect

- Make sure backend is running first
- Check URL in `rl_client.py` (default: `http://localhost:3001`)
- Verify backend is accessible: `curl http://localhost:3001/health`

### CORS errors

- Backend has CORS enabled for `http://localhost:5173`
- If using different port, update `backend/src/config/config.js`

---

## 📁 Project Structure

```
teams-clone/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── server.js    # Main server
│   │   ├── routes/      # API endpoints
│   │   ├── models/      # Environment logic
│   │   ├── socket/      # Socket.IO handlers
│   │   └── config/      # Configuration
│   └── package.json
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.jsx     # Main component
│   │   └── components/ # UI components
│   └── package.json
│
├── python_agent/        # Python RL agents
│   ├── rl_client.py    # Environment client
│   ├── agents/         # Agent implementations
│   └── requirements.txt
│
├── docs/               # Documentation
│   ├── ENV_SPEC.md    # Environment spec
│   ├── EVALUATION.md  # Evaluation guide
│   └── API.md         # API reference
│
└── package.json        # Root scripts
```

---

## 🎯 Hackathon Tips

1. **Communication**: Use team chat frequently
2. **Small commits**: Commit often with clear messages
3. **Pull regularly**: Pull latest changes before starting work
4. **Ask questions**: Don't hesitate to ask teammates
5. **Document**: Add comments for complex code
6. **Test**: Test your changes before pushing

---

## 📞 Need Help?

- Check the main README.md
- Read docs in `docs/` folder
- Ask in team chat
- Create an issue on GitHub

---

## ✅ Quick Checklist

Before pushing:

- [ ] Code runs without errors
- [ ] Tested changes locally
- [ ] Added comments for complex logic
- [ ] Followed code style guidelines
- [ ] Updated documentation if needed

---

**Good luck with the hackathon! 🚀**
