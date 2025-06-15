import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter'; 

function PublicLayout() {
  return (
    <div>
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <LandingFooter /> 
    </div>
  );
}

export default PublicLayout;