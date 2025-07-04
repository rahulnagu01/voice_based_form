// import React from 'react';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import { CSVLink } from 'react-csv';
// import { Printer, FileText, FileDown } from 'lucide-react';

// const ReportExportControls = ({ tableId, fileName = "report", csvData }) => {
//   const handlePrint = () => {
//     const printContents = document.getElementById(tableId).outerHTML;
//     const printWindow = window.open('', '', 'width=800,height=600');
//     printWindow.document.write(`
//       <html><head><title>Print</title>
//       <style>
//         table { width: 100%; border-collapse: collapse; }
//         th, td { border: 1px solid #000; padding: 5px; }
//       </style>
//       </head><body>${printContents}</body></html>
//     `);
//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };

//   const handlePDF = () => {
//     const doc = new jsPDF();
//     doc.text(fileName.toUpperCase(), 10, 10);
//     autoTable(doc, { html: `#${tableId}` });
//     doc.save(`${fileName}.pdf`);
//   };

//   return (
//     <div style={{
//       backgroundColor: '#43a047',
//       padding: '10px',
//       display: 'flex',
//       justifyContent: 'center',
//       gap: '20px',
//       borderRadius: '8px',
//       margin: '20px 0'
//     }}>
//       <button onClick={handlePrint} style={buttonStyle}><Printer size={16} /> Print</button>
//       <button onClick={handlePDF} style={buttonStyle}><FileText size={16} /> PDF</button>
//       <CSVLink data={csvData} filename={`${fileName}.csv`} style={buttonStyle}>
//         <FileDown size={16} /> CSV
//       </CSVLink>
//     </div>
//   );
// };

// const buttonStyle = {
//   color: 'white',
//   backgroundColor: '#2e7d32',
//   padding: '8px 14px',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '6px',
//   textDecoration: 'none'
// };

// export default ReportExportControls;
