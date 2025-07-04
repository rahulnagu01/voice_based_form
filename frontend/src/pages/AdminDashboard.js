// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import AddOfficer from '../components/admin/AddOfficer';
import OfficerList from '../components/admin/OfficerList';
import CensusData from '../components/admin/CensusData';
import RemoveOfficer from '../components/admin/RemoveOfficer';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('addOfficer');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'addOfficer' ? 'active' : ''} 
            onClick={() => setActiveTab('addOfficer')}
          >
            Add Officer
          </button>
          <button 
            className={activeTab === 'officerList' ? 'active' : ''} 
            onClick={() => setActiveTab('officerList')}
          >
            Officer List
          </button>
          <button 
            className={activeTab === 'censusData' ? 'active' : ''} 
            onClick={() => setActiveTab('censusData')}
          >
            Census Data
          </button>
          <button 
            className={activeTab === 'removeOfficer' ? 'active' : ''} 
            onClick={() => setActiveTab('removeOfficer')}
          >
            Remove Officer
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'addOfficer' && <AddOfficer />}
        {activeTab === 'officerList' && <OfficerList />}
        {activeTab === 'censusData' && <CensusData />}
        {activeTab === 'removeOfficer' && <RemoveOfficer />}
      </div>
    </div>
  );
};

export default AdminDashboard;