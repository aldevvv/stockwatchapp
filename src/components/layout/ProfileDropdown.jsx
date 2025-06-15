import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProfileDropdown({ user, logout }) {
  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <strong>{user.namaLengkap || 'Pengguna'}</strong>
        <p>{user.email}</p>
      </div>
      <ul className="dropdown-menu">
        <li>
          <Link to="/akun">Pengaturan Akun</Link>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;