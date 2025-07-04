// components/common/PrintableReport.js
import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import './PrintableReport.css';

const PrintableReport = ({ title, data, columns, excludeKeys = [], logoPath = '/logo.png' }) => {
  const printRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    await new Promise((res) => setTimeout(res, 0));

    const element = printRef.current;

    const hiddenCells = element.querySelectorAll('[data-hide="true"]');
    hiddenCells.forEach((cell) => (cell.style.display = 'none'));

    const opt = {
      margin: 0.5,
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    await html2pdf().set(opt).from(element).save();
    hiddenCells.forEach((cell) => (cell.style.display = ''));
    setIsExporting(false);
  };

  const handlePrint = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 0);
  };

  const handleDownloadCSV = () => {
    const visibleColumns = columns.filter(col => !excludeKeys.includes(col.key));
    const csvRows = [];

    csvRows.push(visibleColumns.map(col => `"${col.label}"`).join(','));

    data.forEach(row => {
      const values = visibleColumns.map(col => {
        const value = col.render ? col.render(row) : row[col.key];
        return `"${(value || '').toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="report-controls">
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={handleDownloadPDF}>📄 PDF</button>
        <button onClick={handleDownloadCSV}>📊 CSV</button>
      </div>

      {isExporting && (
        <div ref={printRef} className="pdf-export-content">
          <div className="pdf-header">
            {logoPath && <img src={logoPath} alt="Logo" />}
            <h1>{title}</h1>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} data-hide={excludeKeys.includes(col.key)}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key} data-hide={excludeKeys.includes(col.key)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrintableReport;
