// ReportDownload.js (React component)
import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ReportDownload = () => {
  const downloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:6005/generate-pdf', {
        responseType: 'blob', // Important to set response type to blob
      });

      // Create a new Blob and save it using file-saver
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(pdfBlob, 'report.pdf'); // FileSaver saves it in the Downloads folder
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div>
      <button onClick={downloadPDF}>Download Report as PDF</button>
    </div>
  );
};

export default ReportDownload;
