import React from 'react';
import { Outlet } from 'react-router-dom';
import LandingNavbar from './LandingNavbar';
import LandingFooter from './LandingFooter'; 


function PublicLayout() {
  return (
    <>
      <LandingNavbar />
      <main style={{ paddingTop: '0px', paddingBottom: '20px' }}> 
        <Outlet /> 
      </main>
    </>
  );
}

export default PublicLayout;