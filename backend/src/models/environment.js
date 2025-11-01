import { v4 as uuidv4 } from 'uuid';

/**
 * RL Environment State Management
 * Manages teams, channels, messages, and agent state
 */
class Environment {
  constructor() {
    this.reset();
  }

  reset() {
    this.teams = [
      {
        id: 'team-1',
        name: 'General Team',
        channels: [
          { id: 'channel-1', name: 'General', teamId: 'team-1', unread: 0 },
          { id: 'channel-2', name: 'Random', teamId: 'team-1', unread: 0 },
          { id: 'channel-3', name: 'Announcements', teamId: 'team-1', unread: 0 }
        ]
      },
      {
        id: 'team-2',
        name: 'Project Alpha',
        channels: [
          { id: 'channel-4', name: 'Development', teamId: 'team-2', unread: 0 },
          { id: 'channel-5', name: 'Design', teamId: 'team-2', unread: 0 }
        ]
      }
    ];

    this.messages = {}; // channelId -> messages[]
    this.teams.forEach(team => {
      team.channels.forEach(channel => {
        this.messages[channel.id] = [];
      });
    });

    this.users = [
      { id: 'user-1', name: 'Alice', status: 'available', avatar: '👩' },
      { id: 'user-2', name: 'Bob', status: 'busy', avatar: '👨' },
      { id: 'user-3', name: 'Charlie', status: 'away', avatar: '🧑' },
      { id: 'agent', name: 'RL Agent', status: 'available', avatar: '🤖' }
    ];

    this.agentState = {
      currentTeamId: 'team-1',
      currentChannelId: 'channel-1',
      userId: 'agent'
    };

    this.episodeStats = {
      stepCount: 0,
      totalReward: 0,
      messagesSent: 0,
      channelsSwitched: 0,
      startTime: Date.now()
    };

    // Add some initial messages for context
    this.addMessage('channel-1', 'user-1', 'Welcome to the team! 👋');
    this.addMessage('channel-1', 'user-2', 'Hey everyone!');
    this.addMessage('channel-2', 'user-3', 'Anyone up for lunch?');

    return this.getState();
  }

  getState() {
    const currentChannel = this.getCurrentChannel();
    const recentMessages = this.messages[this.agentState.currentChannelId].slice(-10);

    return {
      agentState: { ...this.agentState },
      currentChannel,
      recentMessages,
      teams: this.teams,
      users: this.users,
      episodeStats: { ...this.episodeStats },
      timestamp: Date.now()
    };
  }

  getCurrentChannel() {
    for (const team of this.teams) {
      const channel = team.channels.find(ch => ch.id === this.agentState.currentChannelId);
      if (channel) return channel;
    }
    return null;
  }

  step(action) {
    this.episodeStats.stepCount++;
    let reward = 0;
    let done = false;
    let info = {};

    try {
      switch (action.type) {
        case 'send_message':
          reward = this.actionSendMessage(action.payload);
          info.action = 'message_sent';
          break;

        case 'switch_channel':
          reward = this.actionSwitchChannel(action.payload);
          info.action = 'channel_switched';
          break;

        case 'react_to_message':
          reward = this.actionReactToMessage(action.payload);
          info.action = 'reacted';
          break;

        case 'join_call':
          reward = this.actionJoinCall(action.payload);
          info.action = 'joined_call';
          break;

        default:
          reward = -0.1; // Invalid action penalty
          info.action = 'invalid';
      }
    } catch (error) {
      reward = -0.5;
      info.error = error.message;
    }

    this.episodeStats.totalReward += reward;

    // Episode termination conditions (example)
    if (this.episodeStats.stepCount >= 100) {
      done = true;
      info.reason = 'max_steps_reached';
    }

    const state = this.getState();
    return { state, reward, done, info };
  }

  actionSendMessage(payload) {
    const { content, channelId } = payload;
    const targetChannel = channelId || this.agentState.currentChannelId;

    if (!content || content.trim().length === 0) {
      return -0.2; // Empty message penalty
    }

    this.addMessage(targetChannel, this.agentState.userId, content);
    this.episodeStats.messagesSent++;

    // Reward based on message quality (simple heuristic)
    let reward = 0.1; // Base reward for sending a message

    // Bonus for responding to mentions
    const recentMessages = this.messages[targetChannel].slice(-5);
    const hasMention = recentMessages.some(msg => 
      msg.content.includes('@' + this.agentState.userId) && msg.userId !== this.agentState.userId
    );
    if (hasMention) reward += 0.5;

    return reward;
  }

  actionSwitchChannel(payload) {
    const { channelId } = payload;
    
    // Validate channel exists
    let channelExists = false;
    for (const team of this.teams) {
      if (team.channels.find(ch => ch.id === channelId)) {
        channelExists = true;
        this.agentState.currentTeamId = team.id;
        break;
      }
    }

    if (!channelExists) {
      return -0.3; // Invalid channel penalty
    }

    this.agentState.currentChannelId = channelId;
    this.episodeStats.channelsSwitched++;

    // Small reward for exploring
    return 0.05;
  }

  actionReactToMessage(payload) {
    const { messageId, reaction } = payload;
    // Simple reward for engagement
    return 0.05;
  }

  actionJoinCall(payload) {
    // Reward for participating in calls
    return 0.3;
  }

  addMessage(channelId, userId, content) {
    const message = {
      id: uuidv4(),
      channelId,
      userId,
      content,
      timestamp: Date.now(),
      reactions: []
    };

    if (!this.messages[channelId]) {
      this.messages[channelId] = [];
    }

    this.messages[channelId].push(message);

    // Update unread count for other channels
    for (const team of this.teams) {
      const channel = team.channels.find(ch => ch.id === channelId);
      if (channel && channelId !== this.agentState.currentChannelId) {
        channel.unread++;
      }
    }

    return message;
  }

  getAvailableActions() {
    return {
      actions: [
        {
          type: 'send_message',
          description: 'Send a message to a channel',
          payload: {
            content: 'string (required)',
            channelId: 'string (optional, defaults to current channel)'
          }
        },
        {
          type: 'switch_channel',
          description: 'Switch to a different channel',
          payload: {
            channelId: 'string (required)'
          }
        },
        {
          type: 'react_to_message',
          description: 'React to a message with an emoji',
          payload: {
            messageId: 'string (required)',
            reaction: 'string (required)'
          }
        },
        {
          type: 'join_call',
          description: 'Join a call in a channel',
          payload: {
            channelId: 'string (optional, defaults to current channel)'
          }
        }
      ],
      channels: this.teams.flatMap(team => 
        team.channels.map(ch => ({ id: ch.id, name: ch.name, teamName: team.name }))
      )
    };
  }
}

// Singleton instance
export const environment = new Environment();
