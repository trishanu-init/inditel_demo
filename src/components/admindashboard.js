import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import logo from './Copy of T.png';
import AddPlan from './AddPlan';

const AdminDashboard = () => {
    const [pendingCustomers, setPendingCustomers] = useState([]);
    const [verifiedCustomers, setVerifiedCustomers] = useState([]);
    const [activeCustomers, setActiveCustomers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentSection, setCurrentSection] = useState(null);
    const [plans, setPlans] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPendingCustomers();
        fetchVerifiedCustomers();
        fetchActiveCustomers();
        fetchDocumentVerificationLogs();
        fetchPlans();
    }, []);

    const fetchPendingCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-pending-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingCustomers(response.data);
        } catch (error) {
            console.error('Error fetching pending customers:', error);
        }
    };
    
    const fetchVerifiedCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-verified-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setVerifiedCustomers(response.data);
        } catch (error) {
            console.error('Error fetching verified customers:', error);
        }
    };
    
    const fetchActiveCustomers = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-activated-customers', {
                params: { search: searchTerm }, // Pass the search term
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveCustomers(response.data);
        } catch (error) {
            console.error('Error fetching activated customers:', error);
        }
    };

    const fetchDocumentVerificationLogs = async (searchTerm = '') => {
        try {
            const response = await axios.get('http://localhost:5004/services/get-document-verification-logs', {
                params: { search: searchTerm },
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleSearch = () => {
        fetchDocumentVerificationLogs(search);
    };
    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:5004/services/getplans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(response.data); // Set plans from API response
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    };

    const handleActivateService = async (serviceId) => {
        // Implement service activation logic
        try {
            await axios.post(`http://localhost:5004/services/activate-service`, { serviceId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Service activated successfully!');
            fetchVerifiedCustomers(); // Refresh the verified customers
            fetchActiveCustomers(); // Refresh the active customers
        } catch (error) {
            console.error('Error activating service:', error);
            alert('Failed to activate service.');
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="admin-navbar">
                <div className="navbar-left">
                    <img src={logo} alt="Logo" className="logo" />
                    <span className="admin-name">Welcome, Admin</span>
                </div>
                <div className="navbar-right">
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/landing-page'; }}>Logout</button>
                </div>
            </nav>

            <nav className="submenu-navbar">
                <button onClick={() => setCurrentSection('pending')}>Pending Customers</button>
                <button onClick={() => setCurrentSection('verified')}>Verified Customers</button>
                <button onClick={() => setCurrentSection('activated')}>Activated Customers</button>
                <button onClick={() => setCurrentSection('logs')}>Document Verification Logs</button>
                <button onClick={() => setCurrentSection('viewPlans')}>View Plans</button> {/* Button for View Plans */}
                <button onClick={() => window.location.href = '/admin-register'}>Register New Admin</button>
            </nav>
            {currentSection && (
                <div className="search-bar">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Name"
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            )}

            {/* Conditional rendering based on the currentSection state */}
            {currentSection === 'pending' && <CustomerTable customers={pendingCustomers} status="Pending" />}
            {currentSection === 'verified' && <CustomerTable customers={verifiedCustomers} status="Verified" onActivate={handleActivateService} />}
            {currentSection === 'activated' && <CustomerTable customers={activeCustomers} status="Active" />}
            {currentSection === 'logs' && (
                <div>
                    <div className="search-bar">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by Customer ID, Name, or Status"
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>

                    <div className="logs-section">
                        <h2>Document Verification Logs</h2>
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Name</th>
                                    <th>Verification Status</th>
                                    <th>Verification Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.customer.id}</td>
                                            <td>{`${log.customer.first_name} ${log.customer.last_name}`}</td>
                                            <td>{log.verificationStatus}</td>
                                            <td>{log.verificationDate ? new Date(log.verificationDate).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No logs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {currentSection === 'viewPlans' && (
                <div>
                    <h2>Existing Plans</h2>
                    <button onClick={() => setCurrentSection('addPlan')}>Add Plan</button> {/* Add Plan button */}
                    <table className="plans-table">
                        <thead>
                            <tr>
                                <th>Plan Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plans.length > 0 ? (
                                plans.map(plan => (
                                    <tr key={plan.id}>
                                        <td>{plan.name}</td>
                                        <td>{plan.description}</td>
                                        <td>{plan.price}</td>
                                        <td>{plan.planType}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No plans found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {currentSection === 'addPlan' && <AddPlan />} {/* Render AddPlan component */}
        </div>
    );
};

const CustomerTable = ({ customers, status, onActivate }) => {
    return (
        <div className="dashboard-section">
            <table className="customer-table">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Document Status</th>
                        <th>Requested Service</th>
                        <th>Service Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.documents.map(doc => doc.verificationStatus).join(', ')}</td>
                                <td>{customer.services.map(service => service.name).join(', ')}</td>
                                <td>
                                    {customer.services.map(service => (
                                        <span key={service.id}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    ))}
                                </td>
                                <td>
                                    {customer.services.some(service => !service.isActive) && (
                                        customer.services
                                            .filter(service => !service.isActive)
                                            .map(service => (
                                                <button
                                                    className="activate-btn"
                                                    key={service.id}
                                                    onClick={() => onActivate(service.id)}
                                                >
                                                    Activate Service
                                                </button>
                                            ))
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
