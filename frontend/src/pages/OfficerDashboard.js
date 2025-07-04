// src/pages/OfficerDashboard.js
import React, { useState } from 'react';
import CensusForm from '../components/officer/CensusForm';
import CensusDataView from '../components/officer/CensusDataView';
import '../styles/Dashboard.css';

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('enterDetails');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'enterDetails' ? 'active' : ''} 
            onClick={() => setActiveTab('enterDetails')}
          >
            Enter Person Details
          </button>
          <button 
            className={activeTab === 'censusData' ? 'active' : ''} 
            onClick={() => setActiveTab('censusData')}
          >
            Census Data
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'enterDetails' && <CensusForm />}
        {activeTab === 'censusData' && <CensusDataView />}
      </div>
    </div>
  );
};

export default OfficerDashboard;