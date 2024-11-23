import { useState } from 'react';
import Dropdown from './Dropdown';
import { WebSocketMonitor } from './WebsocketMonitor';
import { MonitorIcon } from 'lucide-react';

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-[var(--topbar-h)]">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold text-white">NewsAct</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMonitorOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-full"
        >
          <MonitorIcon size={20} />
        </button>
        
        <Dropdown 
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onClose={() => setIsDropdownOpen(false)}
        />
      </div>

      {isMonitorOpen && <WebSocketMonitor onClose={() => setIsMonitorOpen(false)} />}
    </div>
  );
};

export default TopBar;
