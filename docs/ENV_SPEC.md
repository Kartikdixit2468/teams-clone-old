# Environment Specification

Complete specification of the TeamsClone-RL environment for reinforcement learning.

## Table of Contents
- [Observation Space](#observation-space)
- [Action Space](#action-space)
- [Reward Function](#reward-function)
- [Episode Termination](#episode-termination)
- [State Representation](#state-representation)

## Observation Space

The environment provides a rich observation containing information about the current state, messages, teams, and users.

### State Dictionary Structure

```python
{
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
      "content": "Hello team!",
      "timestamp": 1698765432000,
      "reactions": []
    }
  ],
  "teams": [
    {
      "id": "team-1",
      "name": "General Team",
      "channels": [...]
    }
  ],
  "users": [
    {
      "id": "user-1",
      "name": "Alice",
      "status": "available",  # available, busy, away, offline
      "avatar": "👩"
    }
  ],
  "episodeStats": {
    "stepCount": 10,
    "totalReward": 2.5,
    "messagesSent": 3,
    "channelsSwitched": 2,
    "startTime": 1698765432000
  },
  "timestamp": 1698765432100
}
```

### Key Observation Components

#### 1. Agent State
- **currentTeamId**: Current team the agent is in
- **currentChannelId**: Current active channel
- **userId**: Agent's user ID

#### 2. Current Channel
- **id**: Channel identifier
- **name**: Human-readable channel name
- **unread**: Number of unread messages

#### 3. Recent Messages
Array of recent messages (last 10) in the current channel:
- **id**: Unique message identifier
- **userId**: Sender's user ID
- **content**: Message text
- **timestamp**: Unix timestamp (ms)
- **reactions**: Array of emoji reactions

#### 4. Teams & Channels
Complete team hierarchy with all available channels and unread counts.

#### 5. Users
List of all users with their presence status and metadata.

#### 6. Episode Statistics
- **stepCount**: Number of steps taken in episode
- **totalReward**: Cumulative reward
- **messagesSent**: Total messages sent by agent
- **channelsSwitched**: Number of channel switches

## Action Space

Actions are dictionaries with `type` and `payload` fields.

### Action Types

#### 1. Send Message
Send a text message to a channel.

```python
{
  "type": "send_message",
  "payload": {
    "content": "Hello team!",  # Required: message text
    "channelId": "channel-1"   # Optional: defaults to current channel
  }
}
```

**Constraints:**
- Content must be non-empty string
- Max length: 1000 characters (not enforced yet)
- ChannelId must be valid

**Typical Reward:** +0.1 to +0.6 depending on context

#### 2. Switch Channel
Navigate to a different channel.

```python
{
  "type": "switch_channel",
  "payload": {
    "channelId": "channel-2"  # Required: target channel ID
  }
}
```

**Constraints:**
- ChannelId must exist
- Can switch to any channel in any team

**Typical Reward:** +0.05 (exploration bonus)

#### 3. React to Message
Add an emoji reaction to a message.

```python
{
  "type": "react_to_message",
  "payload": {
    "messageId": "msg-uuid",  # Required: message to react to
    "reaction": "👍"          # Required: emoji reaction
  }
}
```

**Typical Reward:** +0.05 (engagement)

#### 4. Join Call
Join a voice/video call (simulated).

```python
{
  "type": "join_call",
  "payload": {
    "channelId": "channel-1"  # Optional: defaults to current channel
  }
}
```

**Typical Reward:** +0.3 (high-value action)

### Invalid Actions

Invalid actions receive negative rewards:
- Empty message: -0.2
- Invalid channel: -0.3
- Malformed action: -0.1

## Reward Function

The reward function encourages meaningful collaboration and communication.

### Base Rewards

| Action | Base Reward | Description |
|--------|-------------|-------------|
| Send message | +0.1 | Basic communication reward |
| Respond to mention | +0.5 | High priority: responding when tagged |
| Switch channel | +0.05 | Exploration bonus |
| React to message | +0.05 | Engagement reward |
| Join call | +0.3 | Participation in meetings |

### Penalties

| Action | Penalty | Description |
|--------|---------|-------------|
| Empty message | -0.2 | Invalid/spam message |
| Invalid channel | -0.3 | Non-existent channel |
| Invalid action | -0.1 | Malformed request |
| Spam behavior | -0.5 | Excessive actions (future) |

### Contextual Bonuses

Additional rewards based on context:
- **Timely response**: +0.2 if responding within X steps of mention
- **Channel engagement**: +0.1 for first message in low-activity channel
- **Presence**: +0.05 per step for maintaining active status

### Reward Design Philosophy

1. **Encourage communication** - Positive rewards for all valid messages
2. **Prioritize responsiveness** - Higher rewards for responding to mentions
3. **Promote exploration** - Small bonuses for switching channels
4. **Penalize invalid actions** - Negative rewards for errors
5. **Balance activity** - Prevent spam without discouraging engagement

## Episode Termination

Episodes end when any of the following conditions are met:

### Termination Conditions

1. **Max steps reached** - Default: 100 steps
   - Configurable per experiment
   - Ensures bounded episode length

2. **Task completion** (future) - Specific goal achieved
   - Example: Respond to all mentions
   - Example: Attend scheduled meeting

3. **Manual reset** - Agent calls `/env/reset`

### Episode Statistics

At termination, the following statistics are available:
- Total steps taken
- Cumulative reward
- Messages sent
- Channels visited
- Average response time (future)

## State Representation

### For Neural Networks

Agents need to encode the raw state dictionary into fixed-size vectors for neural network input.

#### Suggested Encoding

```python
def encode_state(state):
    features = []
    
    # 1. Channel encoding (one-hot or embedding)
    channel_id = state['agentState']['currentChannelId']
    # ... encode channel
    
    # 2. Message history (embeddings or BoW)
    messages = state['recentMessages']
    # ... encode recent messages
    
    # 3. Unread counts (normalized)
    unread_vector = [ch['unread'] / 10.0 for team in state['teams'] 
                     for ch in team['channels']]
    
    # 4. Presence information
    available_users = sum(1 for u in state['users'] 
                         if u['status'] == 'available')
    
    # 5. Episode progress
    progress = state['episodeStats']['stepCount'] / 100.0
    
    return np.concatenate([channel_enc, message_enc, 
                          unread_vector, [available_users, progress]])
```

### Dimensionality

Recommended state vector size: **128 to 512 dimensions**
- Channel info: 32-64 dims
- Message embeddings: 64-256 dims (BERT/GPT embeddings)
- Metadata: 16-32 dims

## Example RL Integration

### Gym-like Interface

```python
from rl_client import TeamsEnvClient

env = TeamsEnvClient()

# Reset
state = env.reset()

# Episode loop
done = False
while not done:
    # Agent selects action
    action = agent.select_action(state)
    
    # Execute action
    result = env.step(action)
    
    next_state = result['state']
    reward = result['reward']
    done = result['done']
    info = result['info']
    
    # Learn from experience
    agent.update(state, action, reward, next_state, done)
    
    state = next_state
```

### Batch Processing

For algorithms that require batch data (PPO, A3C):

```python
# Collect trajectories
trajectories = []
for _ in range(num_parallel_envs):
    trajectory = collect_trajectory(env, policy)
    trajectories.append(trajectory)

# Update policy
policy.update(trajectories)
```

## Environment Variants

Future variants for different research tasks:

### 1. Single-Task Variant
- **Objective**: Respond to all @mentions within episode
- **Reward**: +1.0 per mention responded to
- **Termination**: All mentions addressed

### 2. Multi-Task Variant
- **Objective**: Balance multiple goals (mentions, meetings, exploration)
- **Reward**: Weighted combination of sub-rewards
- **Termination**: Fixed horizon (100 steps)

### 3. Multi-Agent Variant
- **Objective**: Multiple RL agents collaborating
- **Reward**: Shared or individual rewards
- **Termination**: Cooperative task completion

## Benchmarks

Baseline performance metrics:

| Agent Type | Avg Reward | Messages/Episode | Response Rate |
|------------|-----------|------------------|---------------|
| Random | -2.5 ± 1.0 | 8 ± 3 | 10% |
| Rule-based | 3.2 ± 0.8 | 12 ± 2 | 75% |
| DQN (target) | 5.0+ | 15+ | 90%+ |

## Notes for Researchers

1. **State encoding is critical** - Use pre-trained language models for message embeddings
2. **Action space is discrete** - Consider hierarchical RL for large action spaces
3. **Sparse rewards** - Consider reward shaping or intrinsic motivation
4. **Temporal dependencies** - LSTMs/Transformers recommended for policy network
5. **Exploration** - Important to visit different channels and message types

## API Response Format

All API responses follow this format:

```python
{
  "success": true,
  "state": { ... },      # Present in reset, state, step
  "reward": 0.1,         # Present in step
  "done": false,         # Present in step
  "info": { ... },       # Present in step
  "message": "...",      # Optional status message
  "error": "..."         # Present if success=false
}
```

---

For evaluation metrics and protocols, see [EVALUATION.md](./EVALUATION.md).
