// // src/components/Table.js
// import React from 'react';
// import '../styles/Table.css';

// const Table = ({ headers, data, actions }) => {
//   return (
//     <div className="table-container">
//       <table>
//         <thead>
//           <tr>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//             {actions && <th>Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {Object.values(row).map((cell, cellIndex) => (
//                 <td key={cellIndex}>{cell}</td>
//               ))}
//               {actions && (
//                 <td className="action-buttons">
//                   {actions(row)}
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;