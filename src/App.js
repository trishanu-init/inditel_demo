import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landingpage';
import Registration from './components/Register';
import DocumentUpload from './components/documentUpload';
import ServiceSelection from './components/serviceselection';
//import CustomerDashboard from './components/customerdashboard';
import AdminDashboard from './components/admindashboard';
import AdminLogin from './components/adminlogin';
import Thankyou from './components/thankyou';
import CustomerLogin from './components/customerlogin';
import CustomerDashboard from './components/customerdashboard';
import AdminRegister from './components/adminregister';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import AdminForgotPassword from './components/AdminForgotPass';
import AdminResetPassword from './components/AdminResetPass';
import ReportDownload from './components/pdfservice';
import AdminReport from './components/adminreport';
import AddPlan from './components/AddPlan';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
        <Route path="/select-service" element={<ServiceSelection />} />
       
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/confirm" element={<Thankyou />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-login" element={<CustomerLogin/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard/>}/>
        <Route path="/admin-register" element={<AdminRegister/>}/>
        <Route path="/thank-you" element={<Thankyou/>}/>
        <Route path="/admin-forgot" element={<AdminForgotPassword/>}/>
        <Route path="/admin-reset" element={<AdminResetPassword/>}/>
        <Route path="/pdf-service" element={<ReportDownload/>}/>
        <Route path='/admin-report' element={<AdminReport/>}/>
        <Route path="/add-plan" element={<AddPlan/>}/>
      </Routes>
    </Router>
  );
};

export default App;
