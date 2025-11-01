"""
TeamsClone-RL Environment Client

Python client for interacting with the TeamsClone-RL environment API.
"""

import requests
from typing import Dict, Any, Optional


class TeamsEnvClient:
    """Client for interacting with TeamsClone-RL environment."""

    def __init__(self, base_url: str = 'http://localhost:3001'):
        """
        Initialize the environment client.

        Args:
            base_url: Base URL of the TeamsClone-RL backend
        """
        self.base_url = base_url
        self.env_url = f"{base_url}/env"

    def reset(self) -> Dict[str, Any]:
        """
        Reset the environment to initial state.

        Returns:
            Initial state observation
        """
        response = requests.post(f"{self.env_url}/reset")
        response.raise_for_status()
        data = response.json()
        return data.get('state', {})

    def get_state(self) -> Dict[str, Any]:
        """
        Get current environment state.

        Returns:
            Current state observation
        """
        response = requests.get(f"{self.env_url}/state")
        response.raise_for_status()
        data = response.json()
        return data.get('state', {})

    def step(self, action: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute an action in the environment.

        Args:
            action: Action dictionary with 'type' and 'payload'
                   Example: {'type': 'send_message', 'payload': {'content': 'Hello'}}

        Returns:
            Dictionary with:
                - state: Next state observation
                - reward: Reward received
                - done: Whether episode is finished
                - info: Additional information
        """
        response = requests.post(
            f"{self.env_url}/step",
            json={'action': action}
        )
        response.raise_for_status()
        return response.json()

    def get_actions(self) -> Dict[str, Any]:
        """
        Get available actions in the environment.

        Returns:
            Dictionary containing:
                - actions: List of available action types
                - channels: List of available channels
        """
        response = requests.get(f"{self.env_url}/actions")
        response.raise_for_status()
        return response.json()

    def get_stats(self) -> Dict[str, Any]:
        """
        Get episode statistics.

        Returns:
            Statistics dictionary with stepCount, totalReward, etc.
        """
        response = requests.get(f"{self.env_url}/stats")
        response.raise_for_status()
        data = response.json()
        return data.get('stats', {})


class ObservationWrapper:
    """Helper class to parse and access observation data."""

    def __init__(self, state: Dict[str, Any]):
        self.state = state
        self.agent_state = state.get('agentState', {})
        self.current_channel = state.get('currentChannel', {})
        self.recent_messages = state.get('recentMessages', [])
        self.teams = state.get('teams', [])
        self.users = state.get('users', [])
        self.episode_stats = state.get('episodeStats', {})

    def get_current_channel_id(self) -> str:
        """Get current channel ID."""
        return self.agent_state.get('currentChannelId', '')

    def get_recent_message_contents(self, limit: int = 5) -> list:
        """Get recent message contents."""
        return [msg.get('content', '') for msg in self.recent_messages[-limit:]]

    def has_unread_mentions(self) -> bool:
        """Check if there are unread mentions."""
        agent_id = self.agent_state.get('userId', 'agent')
        for msg in self.recent_messages:
            if f'@{agent_id}' in msg.get('content', ''):
                return True
        return False

    def get_all_channel_ids(self) -> list:
        """Get all available channel IDs."""
        channel_ids = []
        for team in self.teams:
            for channel in team.get('channels', []):
                channel_ids.append(channel.get('id'))
        return channel_ids
