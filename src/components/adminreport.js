import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Chart from 'chart.js/auto';

const AdminReport = () => {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [verifiedCustomers, setVerifiedCustomers] = useState([]);
  const [activatedCustomers, setActivatedCustomers] = useState([]);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const reportContentRef = useRef(null); // Reference to the report content
  const [chartImage, setChartImage] = useState(null); // To hold chart image

  useEffect(() => {
    // Fetch Pending, Verified, and Activated Customers
    fetch('http://localhost:5004/services/get-pending-customers')
      .then((response) => response.json())
      .then((data) => setPendingCustomers(data))
      .catch((error) => console.error('Error fetching pending customers:', error));

    fetch('http://localhost:5004/services/get-verified-customers')
      .then((response) => response.json())
      .then((data) => setVerifiedCustomers(data))
      .catch((error) => console.error('Error fetching verified customers:', error));

    fetch('http://localhost:5004/services/get-activated-customers')
      .then((response) => response.json())
      .then((data) => setActivatedCustomers(data))
      .catch((error) => console.error('Error fetching activated customers:', error));
  }, []);

  // Function to create the chart
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create a new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Verified', 'Activated'],
        datasets: [{
          label: 'Customer Status',
          data: [pendingCustomers.length, verifiedCustomers.length, activatedCustomers.length],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
      }
    });

    // Generate chart image after rendering
    setTimeout(() => {
      const chartBase64Image = chartInstanceRef.current.toBase64Image();
      setChartImage(chartBase64Image); // Set chart image to state
    }, 500); // Wait for chart rendering

    // Cleanup chart instance on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [pendingCustomers, verifiedCustomers, activatedCustomers]);

  const generatePDF = () => {
    const element = reportContentRef.current;
    if (!element) {
      console.error("Report content reference is null");
      return; // Exit if the reference is null
    }

    const options = {
      filename: 'admin_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Create PDF
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => console.log("PDF downloaded"))
      .catch(err => console.error("Error generating PDF:", err));
  };

  // Get current date and time
  const currentDate = new Date().toLocaleString();

  return (
    <div>
      <h1>Admin Report</h1>
      <button onClick={generatePDF}>Download Report</button>

      {/* Visible report content */}
      <div ref={reportContentRef} style={{ padding: '20px', border: '1px solid #ddd', backgroundColor: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Customer Report</h2>
          <p>Generated on: {currentDate}</p>
        </div>

        {/* Pending Customers */}
        <h3>Pending Customers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Document Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Service Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingCustomers.map((customer) => (
              <tr key={customer.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Pending</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.services?.isActive ? 'Activated' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Verified Customers */}
        <h3>Verified Customers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Document Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Service Status</th>
            </tr>
          </thead>
          <tbody>
            {verifiedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Verified</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Pending Activation</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Activated Customers */}
        <h3>Activated Customers</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Document Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Service Status</th>
            </tr>
          </thead>
          <tbody>
            {activatedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{customer.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Verified</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>Activated</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Chart */}
        <div style={{ textAlign: 'center' }}>
          <h3>Customer Status Chart</h3>
          {chartImage && <img src={chartImage} alt="Customer Chart" />} {/* Display chart image */}
        </div>
      </div>

      {/* Canvas element for chart */}
      <canvas ref={chartRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default AdminReport;
