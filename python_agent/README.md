# TeamsClone-RL Python Agent

Example Python client for interacting with the TeamsClone-RL environment.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

### Run Random Agent

```bash
python agents/random_agent.py
```

### Run Simple Rule-Based Agent

```bash
python agents/rule_based_agent.py
```

## Creating Your Own Agent

```python
from rl_client import TeamsEnvClient

client = TeamsEnvClient(base_url='http://localhost:3001')

# Reset environment
state = client.reset()

# Get available actions
actions = client.get_actions()

# Execute action
action = {
    'type': 'send_message',
    'payload': {'content': 'Hello, world!'}
}
result = client.step(action)

print(f"Reward: {result['reward']}")
print(f"Done: {result['done']}")
```

## Files

- `rl_client.py` - Client library for environment interaction
- `agents/random_agent.py` - Random action agent
- `agents/rule_based_agent.py` - Simple rule-based agent
- `agents/rl_agent.py` - Template for RL agent (DQN, PPO, etc.)
