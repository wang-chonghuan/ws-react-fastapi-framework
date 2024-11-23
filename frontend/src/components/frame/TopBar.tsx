import React, { useState } from 'react';
import Dropdown from './Dropdown';

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 h-[var(--topbar-h)]">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold text-white">NewsAct</span>
      </div>

      {/* Dropdown Menu */}
      <Dropdown 
        isOpen={isDropdownOpen}
        onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        onClose={() => setIsDropdownOpen(false)}
      />
    </div>
  );
};

export default TopBar;
