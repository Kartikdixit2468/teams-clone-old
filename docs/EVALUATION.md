# Evaluation Guide

Comprehensive guide for evaluating RL agents in the TeamsClone-RL environment.

## Table of Contents

- [Evaluation Metrics](#evaluation-metrics)
- [Evaluation Protocol](#evaluation-protocol)
- [Reward Design](#reward-design)
- [Baseline Performance](#baseline-performance)
- [Reproducibility](#reproducibility)

## Evaluation Metrics

### Primary Metrics

#### 1. Cumulative Reward

**Definition**: Total reward accumulated during an episode.

```python
cumulative_reward = sum(rewards_per_step)
```

**Interpretation**:

- Higher is better
- Reflects overall agent performance
- Should be averaged over multiple episodes

**Target**: > 5.0 per episode (50 steps)

#### 2. Response Rate

**Definition**: Percentage of @mentions that receive a response.

```python
response_rate = (mentions_responded / total_mentions) * 100
```

**Interpretation**:

- 100% is perfect
- Measures agent's attentiveness
- Key metric for collaboration tasks

**Target**: > 90%

#### 3. Average Response Time

**Definition**: Average steps between receiving a mention and responding.

```python
avg_response_time = mean([respond_step - mention_step
                          for each mention])
```

**Interpretation**:

- Lower is better
- Measures agent's responsiveness
- Indicates real-time performance

**Target**: < 3 steps

#### 4. Channel Coverage

**Definition**: Percentage of channels visited during episode.

```python
coverage = (unique_channels_visited / total_channels) * 100
```

**Interpretation**:

- Higher indicates better exploration
- Important for discovery tasks
- Balance with task focus

**Target**: > 60%

### Secondary Metrics

#### 5. Message Quality

**Definition**: Contextual relevance of messages (requires LLM evaluation).

```python
# Placeholder - requires NLP evaluation
message_quality = avg(relevance_scores)
```

**Evaluation**: Use GPT-4 to score message relevance (1-5 scale)

#### 6. Action Efficiency

**Definition**: Ratio of valid actions to total actions.

```python
efficiency = valid_actions / total_actions
```

**Target**: > 95%

#### 7. Collaboration Score

**Definition**: Engagement with other users' messages.

```python
collaboration = (reactions + replies) / total_messages
```

**Target**: > 0.3

## Evaluation Protocol

### Standard Evaluation

Run 50 episodes with these settings:

```python
# Evaluation configuration
EVAL_CONFIG = {
    'num_episodes': 50,
    'max_steps_per_episode': 50,
    'seed': 42,
    'epsilon': 0.0,  # No exploration during eval
    'temperature': 0.1  # Low temperature for deterministic policy
}

def evaluate_agent(agent, config):
    results = []

    for episode in range(config['num_episodes']):
        metrics = run_episode(agent, config)
        results.append(metrics)

    return aggregate_results(results)
```

### Episode Structure

Each evaluation episode should:

1. **Reset environment** with fixed seed for reproducibility
2. **Run for max_steps** or until done
3. **Log all actions** and rewards
4. **Compute metrics** at episode end
5. **Save trajectory** for analysis

### Aggregation

Report metrics as **mean ± std** across all episodes:

```python
results = {
    'cumulative_reward': f"{mean} ± {std}",
    'response_rate': f"{mean}%",
    'avg_response_time': f"{mean} steps",
    'channel_coverage': f"{mean}%",
}
```

### Statistical Significance

Use **paired t-tests** or **Wilcoxon signed-rank tests** to compare agents:

```python
from scipy.stats import ttest_rel

baseline_rewards = [...]
agent_rewards = [...]

t_stat, p_value = ttest_rel(baseline_rewards, agent_rewards)

if p_value < 0.05:
    print("Statistically significant improvement!")
```

## Reward Design

### Current Reward Function

```python
def compute_reward(action, state, next_state):
    reward = 0.0

    if action['type'] == 'send_message':
        # Base reward for communication
        reward += 0.1

        # Bonus for responding to mention
        if has_recent_mention(state):
            reward += 0.5

        # Penalty for empty message
        if not action['payload']['content'].strip():
            reward -= 0.2

    elif action['type'] == 'switch_channel':
        # Exploration bonus
        reward += 0.05

        # Bonus if channel has unread messages
        if channel_has_unread(action['payload']['channelId']):
            reward += 0.1

    elif action['type'] == 'react_to_message':
        # Engagement reward
        reward += 0.05

    elif action['type'] == 'join_call':
        # High-value action
        reward += 0.3

    # Invalid action penalty
    if action_invalid(action, state):
        reward -= 0.5

    return reward
```

### Reward Shaping

Consider these additional reward components:

#### 1. Time-based Rewards

```python
# Urgency reward for quick responses
time_since_mention = current_step - mention_step
urgency_bonus = max(0, 0.5 - (time_since_mention * 0.1))
reward += urgency_bonus
```

#### 2. Diversity Rewards

```python
# Encourage visiting different channels
if channel_visited_first_time:
    reward += 0.2
```

#### 3. Goal-oriented Rewards

```python
# Reward for completing specific objectives
if all_mentions_addressed:
    reward += 1.0
```

### Reward Engineering Best Practices

1. **Keep rewards scaled** - Normalize to [-1, 1] range
2. **Balance exploration vs exploitation** - Reward both
3. **Avoid reward hacking** - Test for unintended behaviors
4. **Use sparse + dense** - Combine task completion with sub-goals
5. **Domain knowledge** - Incorporate collaboration best practices

## Baseline Performance

### Random Agent

**Description**: Selects actions uniformly at random.

```python
# Random agent baseline
Random Agent Performance:
  Cumulative Reward: -2.5 ± 1.0
  Response Rate: 10 ± 5%
  Avg Response Time: N/A (rarely responds)
  Channel Coverage: 45 ± 10%
  Action Efficiency: 75 ± 8%
```

### Rule-based Agent

**Description**: Uses simple heuristics (respond to mentions, explore channels).

```python
# Rule-based agent baseline
Rule-based Agent Performance:
  Cumulative Reward: 3.2 ± 0.8
  Response Rate: 75 ± 10%
  Avg Response Time: 2.5 ± 1.0 steps
  Channel Coverage: 70 ± 15%
  Action Efficiency: 98 ± 2%
```

### Target Performance (RL Agent)

**Goal**: Outperform rule-based agent significantly.

```python
# Target for trained RL agent
RL Agent Target:
  Cumulative Reward: > 5.0
  Response Rate: > 90%
  Avg Response Time: < 2.0 steps
  Channel Coverage: > 60%
  Action Efficiency: > 95%
```

## Evaluation Tasks

### Task 1: Mention Response

**Objective**: Respond to all @mentions as quickly as possible.

**Success Criteria**:

- Response rate > 95%
- Avg response time < 3 steps

### Task 2: Channel Monitoring

**Objective**: Visit all channels with unread messages.

**Success Criteria**:

- All unread channels visited
- No channel ignored for > 10 steps

### Task 3: Active Participation

**Objective**: Maintain consistent engagement across channels.

**Success Criteria**:

- At least 1 message per channel
- Reaction rate > 30%

### Task 4: Multi-objective

**Objective**: Balance all above tasks simultaneously.

**Success Criteria**:

- Composite score > 80%
- No single metric below 70%

## Reproducibility

### Fixed Seeds

Always use fixed random seeds for evaluation:

```python
import random
import numpy as np

def set_seeds(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    # If using PyTorch:
    # torch.manual_seed(seed)
```

### Environment Configuration

Document environment state:

```python
env_config = {
    'num_teams': 2,
    'num_channels': 5,
    'num_users': 4,
    'initial_messages': 3,
    'max_episode_steps': 50
}
```

### Logging

Log all evaluation runs:

```python
import json
from datetime import datetime

eval_log = {
    'timestamp': datetime.now().isoformat(),
    'agent_type': 'DQN',
    'config': config,
    'results': results,
    'episodes': episode_logs
}

with open(f'eval_{timestamp}.json', 'w') as f:
    json.dump(eval_log, f, indent=2)
```

## Visualization

### Learning Curves

Plot training progress:

```python
import matplotlib.pyplot as plt

plt.plot(episode_rewards)
plt.xlabel('Episode')
plt.ylabel('Cumulative Reward')
plt.title('Training Progress')
plt.savefig('learning_curve.png')
```

### Action Distribution

Visualize action selection:

```python
action_counts = count_actions(trajectories)

plt.bar(action_counts.keys(), action_counts.values())
plt.xlabel('Action Type')
plt.ylabel('Frequency')
plt.title('Action Distribution')
```

### Response Time Heatmap

Show response patterns:

```python
import seaborn as sns

heatmap_data = response_times_by_channel()
sns.heatmap(heatmap_data, annot=True)
plt.title('Response Times by Channel')
```

## Comparison Table

| Agent           | Reward   | Response | Latency  | Coverage | Efficiency |
| --------------- | -------- | -------- | -------- | -------- | ---------- |
| Random          | -2.5     | 10%      | N/A      | 45%      | 75%        |
| Rule-based      | 3.2      | 75%      | 2.5      | 70%      | 98%        |
| **RL (Target)** | **5.0+** | **90%+** | **<2.0** | **60%+** | **95%+**   |

## Reporting Guidelines

When reporting results, include:

1. **Agent description** - Architecture, hyperparameters
2. **Training details** - Episodes, wall-clock time, compute
3. **Evaluation protocol** - Number of episodes, seeds
4. **All metrics** - Mean ± std for each metric
5. **Statistical tests** - Significance vs baselines
6. **Failure cases** - Examples of poor performance
7. **Ablation studies** - Impact of components

## Example Evaluation Report

```markdown
## DQN Agent Evaluation

### Agent Configuration

- Network: 3-layer MLP [128, 64, 32]
- Replay buffer: 10k transitions
- Training: 1000 episodes
- Epsilon: 1.0 → 0.1 over 500 episodes

### Results (50 episodes)

- Cumulative Reward: 5.2 ± 0.9
- Response Rate: 92 ± 5%
- Avg Response Time: 1.8 ± 0.6 steps
- Channel Coverage: 68 ± 12%
- Action Efficiency: 96 ± 3%

### Statistical Significance

- vs Random: p < 0.001
- vs Rule-based: p = 0.003

### Conclusion

DQN agent significantly outperforms baselines with
excellent response rate and low latency.
```

---

For environment details, see [ENV_SPEC.md](./ENV_SPEC.md).
