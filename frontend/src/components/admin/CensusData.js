// src/components/admin/CensusData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CensusActions from '../common/CensusActions';
import PrintableReport from '../common/PrintableReport';

const formatFormId = (mongoId) => {
  const shortId = mongoId.slice(-6).toUpperCase();
  return `FORM-${shortId}`;
};

const columns = [
  { key: 'formId', label: 'Form ID' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'aadhaarNumber', label: 'Aadhaar Number' },
  { key: 'gender', label: 'Gender' },
  { key: 'districtCity', label: 'District/City' },
  { key: 'pincode', label: 'Pincode' },
  { key: 'submittedBy', label: 'Submitted By' },
  { key: 'createdAt', label: 'Submission Date' },
  { key: 'actions', label: 'Actions' }
];

const CensusData = () => {
  const [censusData, setCensusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCensusData();
  }, []);

  const fetchCensusData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/admin/census-data', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setCensusData(response.data.data);
        setError('');
      } else {
        setError('Failed to fetch census data');
      }
    } catch (err) {
      console.error('Error fetching census data:', err);
      setError(err.response?.data?.message || 'Failed to fetch census data');
      setCensusData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = () => {
    fetchCensusData();
  };

  const filteredData = censusData.filter(data =>
    data.aadhaarNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cleanedData = filteredData.map(data => ({
    formId: data.formId || formatFormId(data._id),
    fullName: data.personalDetails.fullName,
    aadhaarNumber: data.aadhaarNumber,
    gender: data.personalDetails.gender,
    districtCity: data.demographicDetails.districtCity,
    pincode: data.demographicDetails.pincode,
    submittedBy: data.submittedBy?.name || data.officerId,
    createdAt: new Date(data.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="census-data-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Aadhar number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <table className="census-table">
        <thead>
          <tr>
            <th>Form ID</th>
            <th>Full Name</th>
            <th>Aadhar Number</th>
            <th>Gender</th>
            <th>District/City</th>
            <th>Pincode</th>
            <th>Submitted By</th>
            <th>Submission Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(data => (
            <tr key={data._id}>
              <td>{data.formId || formatFormId(data._id)}</td>
              <td>{data.personalDetails.fullName}</td>
              <td>{data.aadhaarNumber}</td>
              <td>{data.personalDetails.gender}</td>
              <td>{data.demographicDetails.districtCity}</td>
              <td>{data.demographicDetails.pincode}</td>
              <td>{data.submittedBy?.name || data.officerId}</td>
              <td>{new Date(data.createdAt).toLocaleDateString()}</td>
              <td>
                <CensusActions
                  census={data}
                  onActionComplete={handleActionComplete}
                  userRole="admin"
                  token={localStorage.getItem('adminToken')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          
      <PrintableReport
        title="Admin Census Data"
        data={cleanedData}
        columns={columns}
        excludeKeys={['actions']}
        logoPath="/logo.png"
      />
      {censusData.length > 0 && (
        <div className="table-footer">Total Records: {censusData.length}</div>
      )}
    </div>
  );
};

export default CensusData;
