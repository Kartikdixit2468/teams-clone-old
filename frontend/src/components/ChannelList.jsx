import { Hash, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

function ChannelList({ teams, currentChannel, onChannelSwitch }) {
  const [expandedTeams, setExpandedTeams] = useState(
    teams.reduce((acc, team) => ({ ...acc, [team.id]: true }), {})
  );

  const toggleTeam = (teamId) => {
    setExpandedTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  return (
    <div className="bg-teams-gray border-r border-gray-300 flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <h2 className="font-semibold text-lg">Teams</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {teams.map((team) => (
          <div key={team.id} className="mb-2">
            <button
              onClick={() => toggleTeam(team.id)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center space-x-2">
                {expandedTeams[team.id] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span className="font-medium">{team.name}</span>
              </div>
              <button
                className="hover:bg-gray-300 p-1 rounded"
                title="Add channel"
              >
                <Plus size={16} />
              </button>
            </button>

            {expandedTeams[team.id] && (
              <div className="ml-4">
                {team.channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onChannelSwitch(channel)}
                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-200 transition-colors ${
                      currentChannel?.id === channel.id
                        ? "bg-white border-l-4 border-teams-purple"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Hash size={16} className="text-gray-600" />
                      <span
                        className={
                          currentChannel?.id === channel.id
                            ? "font-semibold"
                            : ""
                        }
                      >
                        {channel.name}
                      </span>
                    </div>
                    {channel.unread > 0 && (
                      <span className="bg-teams-purple text-white text-xs px-2 py-0.5 rounded-full">
                        {channel.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChannelList;
