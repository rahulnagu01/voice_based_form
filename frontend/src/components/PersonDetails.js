import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PersonDetails.css';
// Optional: Format DOB
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Reusable section rendering
const renderDetailSection = (title, data, fields) => (
  <div className="section">
    <h4>{title}</h4>
    <div className="grid">
      {fields.map(({ key, label, format }) => (
        <div key={key} className="grid-row">
          <strong>{label}:</strong>
          <span>{format ? format(data[key]) : data[key]}</span>
        </div>
      ))}
    </div>
  </div>
);

const PersonDetails = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [censusData, setCensusData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async () => {
    setError('');
    setSuccessMessage('');
    setCensusData(null);

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      setError('Invalid Aadhaar number. It must be 12 digits.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/public/send-otp', {
        aadhaarNumber,
        email,
      });

      if (response.data.success) {
        setOtpSent(true);
        setSuccessMessage('OTP sent to registered email.');
      } else {
        setError(response.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setSuccessMessage('');

    try {
      const verifyResponse = await axios.post('http://localhost:5000/api/public/verify-otp', {
        aadhaarNumber,
        otp,
      });

      if (verifyResponse.data.success) {
        setSuccessMessage('OTP verified. Fetching census data...');

        const censusResponse = await axios.get(`http://localhost:5000/api/public/census/${aadhaarNumber}`);

        if (censusResponse.data.success) {
          setCensusData(censusResponse.data.data);
          setSuccessMessage('OTP verified. Data loaded.');
        } else {
          setError(censusResponse.data.message || 'Failed to fetch census data.');
        }
      } else {
        setError(verifyResponse.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP or fetching data');
    }
  };

  return (
    <div className="container">
      <h2>🔍 View Census Details</h2>

      <div className="form-group">
        <label>Aadhaar Number</label>
        <input
          type="text"
          value={aadhaarNumber}
          onChange={(e) => setAadhaarNumber(e.target.value)}
          placeholder="Enter 12-digit Aadhaar"
          maxLength={12}
        />
      </div>

      <div className="form-group">
        <label>Email (linked to Aadhaar)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </div>

      {!otpSent ? (
        <button onClick={handleSendOtp}>Send OTP</button>
      ) : (
        <>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
            />
          </div>
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {censusData && (
        <div className="census-details">
          <h3>📋 Census Information</h3>

          {/* Personal Details */}
          {censusData.personalDetails &&
            renderDetailSection('Personal Details', censusData.personalDetails, [
              { key: 'fullName', label: 'Name' },
              { key: 'gender', label: 'Gender' },
              { key: 'dateOfBirth', label: 'Date of Birth', format: formatDate },
              { key: 'maritalStatus', label: 'Marital Status' },
              { key: 'nationality', label: 'Nationality' },
            ])}

          {/* Contact Information */}
          {censusData.contactInformation &&
            renderDetailSection('Contact Information', censusData.contactInformation, [
              { key: 'phoneNumber', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'permanentAddress', label: 'Permanent Address' },
              { key: 'temporaryAddress', label: 'Temporary Address' },
            ])}

          {/* Employment & Education */}
          {censusData.employmentEducation &&
            renderDetailSection('Employment & Education', censusData.employmentEducation, [
              { key: 'employmentStatus', label: 'Employment Status' },
              { key: 'occupation', label: 'Occupation' },
              { key: 'highestQualification', label: 'Highest Qualification' },
            ])}

          {/* Demographic Details */}
          {censusData.demographicDetails &&
            renderDetailSection('Demographic Details', censusData.demographicDetails, [
              { key: 'state', label: 'State' },
              { key: 'districtCity', label: 'District/City' },
              { key: 'pincode', label: 'Pincode' },
            ])}

          {/* Family Details */}
          {censusData.familyDetails &&
            renderDetailSection('Family Details', censusData.familyDetails, [
              { key: 'headOfFamily', label: 'Head of Family' },
              { key: 'familyMembers', label: 'Family Members' },
              { key: 'dependentMembers', label: 'Dependent Members' },
            ])}

          {/* Additional Info */}
          {censusData.additionalInfo &&
            renderDetailSection('Additional Information', censusData.additionalInfo, [
              { key: 'disabilities', label: 'Disabilities' },
              { key: 'annualIncome', label: 'Annual Income', format: (val) => `₹${val}` },
            ])}
        </div>
      )}
    </div>
  );
};

export default PersonDetails;




// // src/components/PersonDetails.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/PersonDetails.css';

// const PersonDetails = () => {
//   const [aadhaarNumber, setAadhaarNumber] = useState('');
//   const [censusData, setCensusData] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (e) => {
//     e.preventDefault();
    
//     if (!/^\d{12}$/.test(aadhaarNumber)) {
//       setError('Please enter a valid 12-digit Aadhaar number');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setCensusData(null);

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/public/census/${aadhaarNumber}`
//       );

//       console.log('API Response:', response.data); // Debug log

//       if (response.data.success && response.data.data) {
//         setCensusData(response.data.data);
//       } else {
//         setError('No data found');
//       }
//     } catch (err) {
//       console.error('Search error:', err);
//       setError(err.response?.data?.message || 'Error fetching census data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not available';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const renderDetailSection = (title, data, fields) => {
//     if (!data) return null;

//     return (
//       <div className="detail-section">
//         <h4>{title}</h4>
//         {fields.map(({ key, label }) => (
//           <p key={key}>
//             <strong>{label}:</strong> {data[key] || 'Not available'}
//           </p>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="person-details-container">
//       <h2>Search Census Details</h2>
//       <div className="search-section">
//         <form onSubmit={handleSearch}>
//           <input
//             type="text"
//             placeholder="Enter 12-digit Aadhaar Number"
//             value={aadhaarNumber}
//             onChange={(e) => setAadhaarNumber(e.target.value)}
//             maxLength={12}
//             pattern="\d{12}"
//             required
//           />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Searching...' : 'Get Details'}
//           </button>
//         </form>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Searching...</div>}

//       {censusData && (
//         <div className="census-details">
//           <h3>Census Information</h3>
          
//           <div className="details-grid">
//             {/* Personal Details */}
//             {censusData.personalDetails && renderDetailSection('Personal Details', censusData.personalDetails, [
//               { key: 'fullName', label: 'Name' },
//               { key: 'gender', label: 'Gender' },
//               { key: 'dateOfBirth', label: 'Date of Birth', format: formatDate },
//               { key: 'maritalStatus', label: 'Marital Status' },
//               { key: 'nationality', label: 'Nationality' }
//             ])}

//             {/* Contact Information */}
//             {censusData.contactInformation && renderDetailSection('Contact Information', censusData.contactInformation, [
//               { key: 'phoneNumber', label: 'Phone' },
//               { key: 'email', label: 'Email' },
//               { key: 'permanentAddress', label: 'Permanent Address' },
//               { key: 'temporaryAddress', label: 'Temporary Address' }
//             ])}

//             {/* Employment & Education */}
//             {censusData.employmentEducation && renderDetailSection('Employment & Education', censusData.employmentEducation, [
//               { key: 'employmentStatus', label: 'Employment Status' },
//               { key: 'occupation', label: 'Occupation' },
//               { key: 'highestQualification', label: 'Highest Qualification' }
//             ])}

//             {/* Demographic Details */}
//             {censusData.demographicDetails && renderDetailSection('Demographic Details', censusData.demographicDetails, [
//               { key: 'state', label: 'State' },
//               { key: 'districtCity', label: 'District/City' },
//               { key: 'pincode', label: 'Pincode' }
//             ])}

//             {/* Family Details */}
//             {censusData.familyDetails && renderDetailSection('Family Details', censusData.familyDetails, [
//               { key: 'headOfFamily', label: 'Head of Family' },
//               { key: 'familyMembers', label: 'Family Members' },
//               { key: 'dependentMembers', label: 'Dependent Members' }
//             ])}

//             {/* Additional Information */}
//             {censusData.additionalInfo && renderDetailSection('Additional Information', censusData.additionalInfo, [
//               { key: 'disabilities', label: 'Disabilities' },
//               { key: 'annualIncome', label: 'Annual Income', format: (val) => `₹${val}` }
//             ])}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonDetails;



