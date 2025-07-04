// // src/pages/PersonDetails.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/PersonDetails.css';

// const PersonDetails = () => {
//   const [aadhaarNumber, setAadhaarNumber] = useState('');
//   const [censusData, setCensusData] = useState(null);
//   const [error, setError] = useState('');

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/census/aadhar/${aadhaarNumber}`
//       );
//       setCensusData(response.data);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'No data found');
//       setCensusData(null);
//     }
//   };

//   return (
//     <div className="person-details-container">
//       <h2>Search Census Details</h2>
//       <div className="search-section">
//         <input
//           type="text"
//           placeholder="Enter Aadhaar Number"
//           value={aadhaarNumber}
//           onChange={(e) => setAadhaarNumber(e.target.value)}
//         />
//         <button onClick={handleSearch}>Get Details</button>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {censusData && (
//         <div className="census-details">
//           {/* Display census data */}
//           <h3>Census Information</h3>
//           <div className="details-grid">
//             {/* Personal Details */}
//             <div className="detail-section">
//               <h4>Personal Details</h4>
//               <p>Name: {censusData.personalDetails.fullName}</p>
//               <p>Gender: {censusData.personalDetails.gender}</p>
//               {/* Add more personal details */}
//             </div>

//             {/* Contact Information */}
//             <div className="detail-section">
//               <h4>Contact Information</h4>
//               <p>Phone: {censusData.contactInfo.phoneNumber}</p>
//               <p>Email: {censusData.contactInfo.email}</p>
//               {/* Add more contact details */}
//             </div>

//             {/* Other sections */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonDetails;