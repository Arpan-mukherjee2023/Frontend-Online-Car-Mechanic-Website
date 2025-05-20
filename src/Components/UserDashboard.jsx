import React, { useContext,useState } from "react";
import { useLocation, Link} from "react-router-dom"; 
import SideNavBar from './Dashboard Sections/SideNavBar.jsx';
import UserHomeSection from './Dashboard Sections/UserHomeSection.jsx';
function UserDashboard() {
  const location = useLocation();

  

  return (
    <div className="dashboard-container">
      <SideNavBar />
      <div className="content-area">
        <UserHomeSection />
      </div>
    </div>
  );
}

export default UserDashboard;
