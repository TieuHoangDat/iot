// src/pages/Dashboard.js
import React from 'react';
import LeftSection from '../components/LeftSection'; 
import RightSection from '../components/RightSection'; 

const Dashboard = () => {
  return (
    <div className="row">
      <div className="col-md-7"> 
        <LeftSection />
      </div>

      <div className="col-md-5">
        <div className="bg-white p-4 rounded shadow">
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
