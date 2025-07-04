// components/officer/CensusDataView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/CensusDataView.css';
import CensusActions from '../common/CensusActions';
import PrintableReport from '../common/PrintableReport';

const columns = [
  { key: 'formId', label: 'Form ID' },
  { key: 'aadhaarNumber', label: 'Aadhaar Number' },
  { key: 'fullName', label: 'Name', render: (row) => row.personalDetails?.fullName },
  { key: 'districtCity', label: 'District/City', render: (row) => row.demographicDetails?.districtCity },
  { key: 'createdAt', label: 'Submission Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
  { key: 'actions', label: 'Actions', render: () => null }, // won't be shown in PDF
];


const CensusDataView = () => {
    const [censusData, setCensusData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCensusData();
    }, []);

    const fetchCensusData = async () => {
        try {
            const token = localStorage.getItem('officerToken');
            if (!token) throw new Error('Token not found. Please log in again.');

            const response = await axios.get(
                'http://localhost:5000/api/census',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('API Response:', response.data);
            setCensusData(response.data.data);
        } catch (error) {
            console.error('Error fetching census data:', error);
            setError('Failed to fetch census data');
        } finally {
            setLoading(false);
        }
    };

    const handleActionComplete = async (action) => {
        try {
            await fetchCensusData(); // Refresh the data after action
            // You could add a success message here
        } catch (error) {
            console.error(`Error after ${action}:`, error);
            setError(`Failed to refresh data after ${action}`);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="census-data-view">
            <h2>Census Forms</h2>
            
           

            
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Form ID</th>
                            <th>Aadhaar Number</th>
                            <th>Name</th>
                            <th>District/City</th>
                            <th>Submission Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {censusData.length > 0 ? (
                            censusData.map((form) => (
                                <tr key={form._id}>
                                    <td>{form.formId}</td>
                                    <td>{form.aadhaarNumber}</td>
                                    <td>{form.personalDetails.fullName}</td>
                                    <td>{form.demographicDetails.districtCity}</td>
                                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <CensusActions 
                                            census={form}
                                            onActionComplete={handleActionComplete}
                                            userRole="officer"
                                            token={localStorage.getItem('officerToken')}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    No census data available
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
                 <PrintableReport
            title="Voice-Assisted Census Management"
            data={censusData}
            columns={columns}
            excludeKeys={['actions']} // hide Actions column in print/PDF
            logoPath="/logo.png"
            />
            </div>
        </div>
    );
};

export default CensusDataView;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../../styles/CensusDataView.css';
// import CensusActions from '../common/CensusActions';
// import html2pdf from 'html2pdf.js';


// const CensusDataView = () => {
//     const [censusData, setCensusData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const printRef = useRef(); // 👈 Reference to printable area
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchCensusData();
//     }, []);

//     const fetchCensusData = async () => {
//         try {
//             const token = localStorage.getItem('officerToken');
//             if (!token) throw new Error('Token not found. Please log in again.');

//             const response = await axios.get(
//                 'http://localhost:5000/api/census',
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );

//             setCensusData(response.data.data);
//         } catch (error) {
//             console.error('Error fetching census data:', error);
//             setError('Failed to fetch census data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleActionComplete = async (action) => {
//         try {
//             await fetchCensusData(); // Refresh the data after action
//         } catch (error) {
//             console.error(`Error after ${action}:`, error);
//             setError(`Failed to refresh data after ${action}`);
//         }
//     };

//     const handlePrint = () => {
//         const printContents = printRef.current.innerHTML;
//         const printWindow = window.open('', '', 'height=600,width=800');
//         printWindow.document.write('<html><head><title>Census Report</title>');
//         printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; }</style>');
//         printWindow.document.write('</head><body>');
//         printWindow.document.write(printContents);
//         printWindow.document.write('</body></html>');
//         printWindow.document.close();
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//     };

// const handleDownloadPDF = () => {
//   const element = printRef.current;

//   // Temporarily hide actions column
//   const actionColumns = element.querySelectorAll('.actions-column');
//   actionColumns.forEach((col) => col.style.display = 'none');

//   const opt = {
//     margin:       0.5,
//     filename:     'Census_Report.pdf',
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };

//   html2pdf().set(opt).from(element).save().then(() => {
//     // Restore actions column after saving PDF
//     actionColumns.forEach((col) => col.style.display = '');
//   });
// };


//     if (loading) return <div className="loading">Loading...</div>;
//     if (error) return <div className="error">{error}</div>;

//     return (
//         <div className="census-data-view">
//             <h2>Census Forms</h2>
//             <button onClick={handlePrint} className="print-button">🖨️ Print Report</button>
//             <button onClick={handleDownloadPDF} className="print-button">📄 Download PDF</button>

//             <div className="table-container" ref={printRef}>
//                 <table>
//   <thead>
//     <tr>
//       <th>Form ID</th>
//       <th>Aadhaar Number</th>
//       <th>Name</th>
//       <th>District/City</th>
//       <th>Submission Date</th>
//       <th className="actions-column">Actions</th>
//     </tr>
//   </thead>
//   <tbody>
//     {censusData.length > 0 ? (
//       censusData.map((form) => (
//         <tr key={form._id}>
//           <td>{form.formId}</td>
//           <td>{form.aadhaarNumber}</td>
//           <td>{form.personalDetails.fullName}</td>
//           <td>{form.demographicDetails.districtCity}</td>
//           <td>{new Date(form.createdAt).toLocaleDateString()}</td>
//           <td className="actions-column">
//             <CensusActions 
//               census={form}
//               onActionComplete={handleActionComplete}
//               userRole="officer"
//               token={localStorage.getItem('officerToken')}
//             />
//           </td>
//         </tr>
//       ))
//     ) : (
//       <tr>
//         <td colSpan="6" className="no-data">
//           No census data available
//         </td>
//       </tr>
//     )}
//   </tbody>
// </table>

//             </div>
//         </div>
//     );
// };
// export default CensusDataView;