// src/components/admin/RemoveOfficer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RemoveOfficer = () => {
    const [officers, setOfficers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.error('Error fetching officers:', err);
        }
    };

    const handleStatusUpdate = async (officerId) => {
      try {
          setLoading(true);
          setError('');
          setSuccess('');
  
          console.log('Attempting to update officer:', officerId); // Debug log
  
          const token = localStorage.getItem('adminToken');
          const response = await axios.patch(
              `http://localhost:5000/api/admin/officers/${officerId}/status`,
              {}, // empty body
              {
                  headers: { 
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              }
          );
  
          console.log('Response:', response.data); // Debug log
          setSuccess(response.data.message);
          fetchOfficers(); // Refresh the list
      } catch (error) {
          console.error('Error updating officer status:', error);
          setError(error.response?.data?.message || 'Failed to update officer status');
      } finally {
          setLoading(false);
      }
  };

    const filteredOfficers = officers.filter(officer =>
        officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        officer.officerId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="remove-officer-container">
            <h2>Remove Officer</h2>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="officers-table">
                <table>
                    <thead>
                        <tr>
                            <th>Officer ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Area</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOfficers.map((officer) => (
                            <tr key={officer._id}>
                                <td>{officer.officerId}</td>
                                <td>{officer.name}</td>
                                <td>{officer.email}</td>
                                <td>{officer.area}</td>
                                <td>
                                    <span className={`status-badge ${officer.isActive ? 'active' : 'inactive'}`}>
                                        {officer.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`status-button ${officer.isActive ? 'deactivate' : 'activate'}`}
                                        onClick={() => handleStatusUpdate(officer.officerId)} 
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : officer.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RemoveOfficer;

