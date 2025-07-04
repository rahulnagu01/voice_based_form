import React, { useState } from 'react';
import axios from 'axios';

const AddOfficer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    area: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        'http://localhost:5000/api/admin/create-officer',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Officer added successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        area: '',
        pincode: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add officer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-officer-container">
      <h3>Add New Officer</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="add-officer-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter officer name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group">
          <label>Area</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Enter area"
            required
          />
        </div>

        <div className="form-group">
          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            required
            pattern="[0-9]{6}"
            title="Please enter a valid 6-digit pincode"
          />
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding Officer...
            </>
          ) : (
            'Add Officer'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddOfficer;
