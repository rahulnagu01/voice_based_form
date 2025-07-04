// src/components/admin/OfficerList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfficerList = () => {
  const [officers, setOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        'http://localhost:5000/api/admin/officers',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setOfficers(response.data);
    } catch (err) {
      setError('Failed to fetch officers');
    }
  };

  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.officerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="officer-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by officer name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="officer-table">
        <thead>
          <tr>
            <th>Officer ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Area</th>
            <th>Pincode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOfficers.map(officer => (
            <tr key={officer._id}>
              <td>{officer.officerId}</td>
              <td>{officer.name}</td>
              <td>{officer.email}</td>
              <td>{officer.area}</td>
              <td>{officer.pincode}</td>
              <td>{officer.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfficerList;