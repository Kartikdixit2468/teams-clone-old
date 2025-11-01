import { MessageSquare, Calendar, Phone, FileText, MoreHorizontal } from 'lucide-react';

function Sidebar() {
  return (
    <div className="bg-teams-gray border-r border-gray-300 flex flex-col items-center py-4 space-y-6">
      <button className="w-12 h-12 bg-teams-purple text-white rounded-lg flex items-center justify-center hover:bg-teams-darkpurple transition-colors" title="Chat">
        <MessageSquare size={24} />
      </button>
      
      <button className="w-12 h-12 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Calendar">
        <Calendar size={24} />
      </button>
      
      <button className="w-12 h-12 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Calls">
        <Phone size={24} />
      </button>
      
      <button className="w-12 h-12 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="Files">
        <FileText size={24} />
      </button>
      
      <div className="flex-1"></div>
      
      <button className="w-12 h-12 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors" title="More">
        <MoreHorizontal size={24} />
      </button>
    </div>
  );
}

export default Sidebar;
