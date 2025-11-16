import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ padding: '10px', background: '#33df2dff', color: 'white' }}>
      <h2>My Website</h2>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '15px' }}>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;
