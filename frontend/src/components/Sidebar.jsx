import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Teaching', path: '/teaching' },
    { name: 'Archived Classes', path: '/archived' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r">
      <div className="p-4 text-2xl font-bold text-blue-600">EchoClass</div>
      <nav className="space-y-2 p-4">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
