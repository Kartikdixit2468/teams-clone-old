import { Users, Phone, Video, Info } from "lucide-react";

function Header({ currentUser }) {
  return (
    <header className="h-12 bg-teams-purple flex items-center justify-between px-4 text-white">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold">TeamsClone-RL</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="hover:bg-teams-darkpurple p-2 rounded"
          title="People"
        >
          <Users size={20} />
        </button>
        <button
          className="hover:bg-teams-darkpurple p-2 rounded"
          title="Audio Call"
        >
          <Phone size={20} />
        </button>
        <button
          className="hover:bg-teams-darkpurple p-2 rounded"
          title="Video Call"
        >
          <Video size={20} />
        </button>
        <button className="hover:bg-teams-darkpurple p-2 rounded" title="Info">
          <Info size={20} />
        </button>

        <div className="flex items-center space-x-2 ml-4">
          <span className="text-2xl">{currentUser.avatar}</span>
          <span className="text-sm">{currentUser.name}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
