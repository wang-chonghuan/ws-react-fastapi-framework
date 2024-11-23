import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

interface DropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, onToggle, onClose }) => {
  // 添加点击外部关闭菜单的处理函数
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('dropdown-menu');
      const button = document.getElementById('dropdown-button');
      
      if (dropdown && button && 
          !dropdown.contains(event.target as Node) && 
          !button.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative">
      <button 
        id="dropdown-button"
        onClick={onToggle}
        className="p-2 hover:opacity-75 transition-opacity rounded-full"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {isOpen && (
        <div id="dropdown-menu" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a href="#" className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">Settings</a>
          <a href="#" className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100">User</a>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
