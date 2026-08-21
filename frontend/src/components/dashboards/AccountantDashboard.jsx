import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  LogOut,
  Clock,
  Sun,
  Moon,
  LayoutDashboard,
  FileText,
  DollarSign,
  Settings,
  HeartPulse,
  Sparkles,
  Phone,
  Key,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  X,
  TrendingUp,
  Receipt,
  Search
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  completed: 'Completed Bills & Revenue',
  settings: 'Account Settings'
};

export default function AccountantDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Search State for Dashboard
  const [searchQuery, setSearchQuery] = useState('');

  // Patient directory state for bulletproof lookup
  const [allPatients, setAllPatients] = useState([]);

  // Accountant Settings State
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

  // Payment State (Not Complete Full Payments)
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [completingPaymentId, setCompletingPaymentId] = useState(null);

  // Completed Payments State
  const [completedPaymentsList, setCompletedPaymentsList] = useState([]);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [completedError, setCompletedError] = useState('');
  const [completedSearchQuery, setCompletedSearchQuery] = useState('');

  const fetchAllPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient/get-all-patients');
      const data = await response.json();
      if (response.ok && data.allPatients) {
        setAllPatients(data.allPatients);
      }
    } catch (err) {
      console.error('Error fetching all patients:', err);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const getPatientRegID = (pay) => {
    if (pay?.PatientDetails?.PatientRegID) return pay.PatientDetails.PatientRegID;
    if (pay?.PatientRegID && typeof pay.PatientRegID === 'string' && pay.PatientRegID.startsWith('PAT-')) {
      return pay.PatientRegID;
    }
    const found = allPatients.find(p => p._id === pay?.PatientID || p.PatientRegID === pay?.PatientID);
    if (found?.PatientRegID) return found.PatientRegID;
    return 'N/A';
  };

  const getPatientName = (pay) => {
    if (pay?.PatientDetails?.FullName) return pay.PatientDetails.FullName;
    if (pay?.FullName) return pay.FullName;
    const found = allPatients.find(p => p._id === pay?.PatientID || p.PatientRegID === pay?.PatientID);
    if (found?.FullName) return found.FullName;
    return 'Patient Record';
  };

  // Phone Modal State
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePass, setShowDeletePass] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotCompletePayments = async () => {
    setIsLoadingPayments(true);
    setPaymentsError('');
    try {
      const response = await fetch('http://localhost:5000/api/payment/get-not-complete-full-payments');
      const data = await response.json();
      if (response.ok) {
        let list = [];
        if (Array.isArray(data.data)) {
          list = data.data;
        } else if (data.data && Array.isArray(data.data.isPaymentExist)) {
          list = data.data.isPaymentExist;
        }
        setPaymentsList(list);
      } else {
        setPaymentsError(data.message || data.error || 'Failed to load pending payments.');
      }
    } catch (err) {
      console.error('Error fetching not complete payments:', err);
      setPaymentsError('Could not connect to backend server.');
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchCompletedPayments = async () => {
    setIsLoadingCompleted(true);
    setCompletedError('');
    try {
      const response = await fetch('http://localhost:5000/api/payment/get-complete-full-payments');
      const data = await response.json();
      if (response.ok) {
        let list = [];
        if (Array.isArray(data.data)) {
          list = data.data;
        } else if (data.data && Array.isArray(data.data.isPaymentExist)) {
          list = data.data.isPaymentExist;
        }
        setCompletedPaymentsList(list);
      } else {
        setCompletedError(data.message || data.error || 'Failed to load completed payments.');
      }
    } catch (err) {
      console.error('Error fetching completed payments:', err);
      setCompletedError('Could not connect to backend server.');
    } finally {
      setIsLoadingCompleted(false);
    }
  };

  useEffect(() => {
    fetchNotCompletePayments();
  }, []);

  useEffect(() => {
    if (activeTab === 'completed') {
      fetchCompletedPayments();
    }
  }, [activeTab]);

  const handleUpdateCompleteStatus = async (paymentItem) => {
    const paymentId = paymentItem._id;
    const patientId = paymentItem.PatientID;
    if (!paymentId && !patientId) return;

    setCompletingPaymentId(paymentId);
    try {
      const response = await fetch(`http://localhost:5000/api/payment/update-complete-status/${patientId || paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        fetchNotCompletePayments();
        fetchCompletedPayments();
      } else {
        alert(data.message || data.error || 'Failed to update payment complete status.');
      }
    } catch (err) {
      console.error('Error updating complete status:', err);
      alert('Could not connect to backend server.');
    } finally {
      setCompletingPaymentId(null);
    }
  };

  const getPaymentItems = (pay) => {
    const items = [];
    if (Array.isArray(pay.Appoinment_Fee)) {
      pay.Appoinment_Fee.forEach(item => {
        items.push({
          name: item.BillName || 'Appointment Fee',
          amount: item.Appoinment_Fee || 0,
          done: item.Done === true
        });
      });
    }
    if (Array.isArray(pay.Blood_test_Fee)) {
      pay.Blood_test_Fee.forEach(item => {
        items.push({
          name: item.BillName || 'Blood Test Fee',
          amount: item.BloodTestFee || 0,
          done: item.Done === true
        });
      });
    }
    if (Array.isArray(pay.Urine_test_Fee)) {
      pay.Urine_test_Fee.forEach(item => {
        items.push({
          name: item.BillName || 'Urine Test Fee',
          amount: item.UrineTestFee || 0,
          done: item.Done === true
        });
      });
    }
    if (Array.isArray(pay.Medicine_Fee)) {
      pay.Medicine_Fee.forEach(item => {
        items.push({
          name: item.BillName || 'Medicine Fee',
          amount: item.MedicinePrice || 0,
          done: item.Done === true
        });
      });
    }
    return items;
  };

  const isAllItemsDone = (pay) => {
    const items = getPaymentItems(pay);
    if (items.length === 0) return false;
    return items.every(item => item.done === true);
  };

  const accountantId = user?._id || user?.id || user?.existingAccountant?._id || myDetails?._id;

  const fetchMyDetails = async () => {
    if (!accountantId) return;
    setIsLoadingMyDetails(true);
    setMyDetailsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/accountant/details/${accountantId}`);
      const data = await response.json();
      if (response.ok) {
        const details = data.accountant || data.existingAccountant || data.accountantDetails;
        setMyDetails(details);
        setNewPhone(details?.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load accountant details.');
      }
    } catch (err) {
      console.error('Error fetching accountant details:', err);
      setMyDetailsError('Could not connect to backend server.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchMyDetails();
    }
  }, [activeTab]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'AC';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleUpdatePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');

    if (!accountantId) {
      setPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newPhone.trim())) {
      setPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await fetch(`http://localhost:5000/api/accountant/update-contact-number/${accountantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PhoneNumber: newPhone.trim() })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingPhone(false);
        setPhoneSuccess('Contact number updated successfully!');
        setTimeout(() => {
          setShowPhoneModal(false);
          setPhoneSuccess('');
        }, 1200);
        fetchMyDetails();
      } else {
        setIsUpdatingPhone(false);
        setPhoneError(resData.message || 'Failed to update contact number.');
      }
    } catch (err) {
      console.error('Error updating contact number:', err);
      setIsUpdatingPhone(false);
      setPhoneError('Could not connect to backend server.');
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!accountantId) {
      setPasswordError('User session ID not found.');
      return;
    }

    if (!oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await fetch(`http://localhost:5000/api/accountant/update-password/${accountantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OldPassword: oldPassword,
          NewPassword: newPassword
        })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingPassword(false);
        setPasswordSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 1200);
      } else {
        setIsUpdatingPassword(false);
        setPasswordError(resData.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setIsUpdatingPassword(false);
      setPasswordError('Could not connect to backend server.');
    }
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!accountantId) {
      setDeleteError('User session ID not found.');
      return;
    }

    const pass = (deletePassword || '').trim();
    if (!pass) {
      setDeleteError('Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/accountant/delete/${accountantId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountantId: accountantId,
          Password: pass
        })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        onLogout();
      } else {
        setIsDeleting(false);
        setDeleteError(resData.message || 'Failed to delete account. Incorrect password.');
      }
    } catch (err) {
      console.error('Error deleting accountant account:', err);
      setIsDeleting(false);
      setDeleteError('Could not connect to backend server.');
    }
  };

  return (
    <div className="dash-layout-container">
      {/* Left Sidebar */}
      <aside className="dash-sidebar">
        <div>
          {/* Brand Header */}
          <div className="dash-sidebar-brand">
            <div className="dash-sidebar-logo">HMS</div>
            <div className="dash-sidebar-brand-text">
              <h3>Apex Health</h3>
              <span>Enterprise Portal</span>
            </div>
          </div>

          {/* Access Role Badge */}
          <div className="dash-sidebar-role-badge">
            <span className="dot"></span>
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Accountant</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
              <Receipt size={18} />
              Completed Bills
            </button>
            <button className={`dash-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={18} />
              Settings
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-profile-summary">
            <div className="dash-user-avatar">
              {getInitials(myDetails?.FullName || user?.FullName || 'Accountant')}
            </div>
            <div className="dash-user-details">
              <h5>{myDetails?.FullName || user?.FullName || 'Accountant'}</h5>
              <p>{myDetails?.Email || user?.Email || 'accountant@apexhealth.org'}</p>
            </div>
          </div>

          <button className="dash-logout-btn" onClick={handleLogoutClick}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <main className="dash-main-content">
        {/* Top Navbar Header */}
        <header className="dash-top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="dash-header-title-box" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="logo-icon-wrapper" style={{ width: '46px', height: '46px', borderRadius: '14px' }}>
              <HeartPulse size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                ApexCare Hospital System
              </h2>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--teal-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Financial Management & Accounting
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Accountant Management Dashboard
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                <Sparkles size={15} />
                {getGreeting()}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                <Clock size={14} />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className="icon-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </header>

        {/* Hero Welcome Banner Card */}
        <div className="dash-hero-banner">
          <div className="dash-hero-banner-content">
            <span style={{
              background: 'rgba(45, 212, 191, 0.2)',
              border: '1px solid rgba(45, 212, 191, 0.4)',
              color: '#2dd4bf',
              padding: '4px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ACCOUNTANT DASHBOARD | Session Active
            </span>
            <h2>Welcome back, {myDetails?.FullName || user?.FullName || 'Accountant'}</h2>
            {activeTab === 'dashboard' && (
              <p>
                Apex Health financial operations portal. Manage OPD/IPD patient invoices, payment transactions, doctor consultation fee disbursements, and audit logs.
              </p>
            )}
          </div>

          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            {/* Top Search Bar & Refresh Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search patient by Patient Reg ID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    paddingLeft: '44px',
                    paddingRight: searchQuery ? '40px' : '16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <button
                onClick={fetchNotCompletePayments}
                disabled={isLoadingPayments}
                className="dash-search-btn"
                style={{ padding: '0 20px', height: '46px', fontSize: '0.88rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                title="Refresh Payments List"
              >
                <RefreshCw size={15} className={isLoadingPayments ? 'spin-icon' : ''} />
                {isLoadingPayments ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>

            {paymentsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {paymentsError}
              </div>
            )}

            {isLoadingPayments ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Loading pending payments data...
              </div>
            ) : (() => {
              const filteredPayments = paymentsList.filter((pay) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase().trim();
                const regId = getPatientRegID(pay).toLowerCase();
                const name = getPatientName(pay).toLowerCase();
                return regId.includes(q) || name.includes(q);
              });

              if (filteredPayments.length === 0) {
                return (
                  <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={42} style={{ color: '#10b981', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {searchQuery ? 'No Matching Patient Payments Found' : 'No Pending Payments Found'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem' }}>
                      {searchQuery ? `No results found for "${searchQuery}".` : 'All patient transactions have been completed.'}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredPayments.map((pay) => {
                    const items = getPaymentItems(pay);
                    const canComplete = isAllItemsDone(pay);
                    const isCompleting = completingPaymentId === pay._id;
                    const patientName = getPatientName(pay);
                    const patientRegID = getPatientRegID(pay);

                    return (
                      <div
                        key={pay._id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '20px',
                          padding: '20px 24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          boxShadow: 'var(--shadow-card)'
                        }}
                      >
                        {/* Top Header: Patient & Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                              {getInitials(patientName)}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                {patientName}
                              </h4>
                              <span style={{ fontSize: '0.82rem', color: 'var(--teal-400)', fontWeight: '700' }}>
                                Reg ID: {patientRegID}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Amount</span>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#10b981' }}>
                              Rs. {(pay.Full_Payment || 0).toLocaleString()}
                            </h3>
                          </div>
                        </div>

                        {/* Items & Fees breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Fee Breakdown & Done Status
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {items.length === 0 ? (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No bill items added yet.</span>
                            ) : (
                              items.map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    background: item.done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    border: `1px solid ${item.done ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                    borderRadius: '12px',
                                    padding: '8px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                  }}
                                >
                                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                    {item.name}: <strong>Rs. {item.amount}</strong>
                                  </span>
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    color: item.done ? '#10b981' : '#ef4444',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: item.done ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                                  }}>
                                    {item.done ? 'Done ✅' : 'Done: False ⏳'}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            onClick={() => handleUpdateCompleteStatus(pay)}
                            disabled={!canComplete || isCompleting}
                            style={{
                              padding: '10px 24px',
                              borderRadius: '12px',
                              fontWeight: '800',
                              fontSize: '0.9rem',
                              border: 'none',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: canComplete && !isCompleting ? 'pointer' : 'not-allowed',
                              background: canComplete
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : '#4b5563',
                              color: canComplete ? '#ffffff' : '#9ca3af',
                              opacity: canComplete ? 1 : 0.6,
                              boxShadow: canComplete ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
                            }}
                          >
                            <CheckCircle2 size={18} />
                            {isCompleting ? 'Completing...' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: COMPLETED BILLS */}
        {activeTab === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            {/* Top Revenue Summary Banner */}
            {(() => {
              const totalRevenue = completedPaymentsList.reduce((acc, pay) => acc + (pay.Full_Payment || 0), 0);
              return (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(13, 148, 136, 0.12) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '22px',
                  padding: '24px 30px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Total Completed Revenue
                    </span>
                    <h2 style={{ margin: '6px 0 0 0', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                      Rs. {totalRevenue.toLocaleString()}
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Total Settlement Bills
                    </span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                      {completedPaymentsList.length} Payments Completed
                    </h3>
                  </div>
                </div>
              );
            })()}

            {/* Top Search Bar & Refresh Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search completed bill by Patient Reg ID or Name..."
                  value={completedSearchQuery}
                  onChange={(e) => setCompletedSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '46px',
                    paddingLeft: '44px',
                    paddingRight: completedSearchQuery ? '40px' : '16px',
                    borderRadius: '14px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                {completedSearchQuery && (
                  <button
                    onClick={() => setCompletedSearchQuery('')}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <button
                onClick={fetchCompletedPayments}
                disabled={isLoadingCompleted}
                className="dash-search-btn"
                style={{ padding: '0 20px', height: '46px', fontSize: '0.88rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
                title="Refresh Completed Payments"
              >
                <RefreshCw size={15} className={isLoadingCompleted ? 'spin-icon' : ''} />
                {isLoadingCompleted ? 'Refreshing...' : 'Refresh List'}
              </button>
            </div>

            {completedError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {completedError}
              </div>
            )}

            {isLoadingCompleted ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Loading completed payments data...
              </div>
            ) : (() => {
              const filteredCompleted = completedPaymentsList.filter((pay) => {
                if (!completedSearchQuery.trim()) return true;
                const q = completedSearchQuery.toLowerCase().trim();
                const regId = getPatientRegID(pay).toLowerCase();
                const name = getPatientName(pay).toLowerCase();
                return regId.includes(q) || name.includes(q);
              });

              if (filteredCompleted.length === 0) {
                return (
                  <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={42} style={{ color: '#10b981', marginBottom: '12px' }} />
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {completedSearchQuery ? 'No Matching Completed Bills Found' : 'No Completed Bills Found'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem' }}>
                      {completedSearchQuery ? `No results found for "${completedSearchQuery}".` : 'No completed patient payment records exist.'}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredCompleted.map((pay) => {
                    const items = getPaymentItems(pay);
                    const patientName = getPatientName(pay);
                    const patientRegID = getPatientRegID(pay);

                    return (
                      <div
                        key={pay._id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '20px',
                          padding: '20px 24px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          boxShadow: 'var(--shadow-card)'
                        }}
                      >
                        {/* Top Header: Patient & Total */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                              {getInitials(patientName)}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                {patientName}
                              </h4>
                              <span style={{ fontSize: '0.82rem', color: 'var(--teal-400)', fontWeight: '700' }}>
                                Reg ID: {patientRegID}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Settled</span>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900', color: '#10b981' }}>
                              Rs. {(pay.Full_Payment || 0).toLocaleString()}
                            </h3>
                          </div>
                        </div>

                        {/* Fee Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Settled Fee Items
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {items.length === 0 ? (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No bill items recorded.</span>
                            ) : (
                              items.map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    borderRadius: '12px',
                                    padding: '8px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                  }}
                                >
                                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                    {item.name}: <strong>Rs. {item.amount}</strong>
                                  </span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)' }}>
                                    Done ✅
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Footer Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            padding: '6px 16px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <CheckCircle2 size={16} /> Payment Completed & Settled
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="dash-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} style={{ color: 'var(--teal-400)' }} />
                Account Settings & Profile Details
              </h3>

              <button
                onClick={fetchMyDetails}
                disabled={isLoadingMyDetails}
                className="dash-search-btn"
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                title="Refresh Profile Details"
              >
                <RefreshCw size={15} className={isLoadingMyDetails ? 'spin-icon' : ''} />
                {isLoadingMyDetails ? 'Refreshing...' : 'Refresh Details'}
              </button>
            </div>

            {myDetailsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {myDetailsError}
              </div>
            )}

            {/* Profile Overview Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '22px',
              padding: '28px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {/* Profile Top Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                  color: '#ffffff',
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)'
                }}>
                  {getInitials(myDetails?.FullName || user?.FullName || 'Accountant')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.FullName || user?.FullName || 'Accountant'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'accountant@apexhealth.org'}
                    </span>
                    <span style={{
                      background: 'rgba(45, 212, 191, 0.15)',
                      color: '#2dd4bf',
                      border: '1px solid rgba(45, 212, 191, 0.35)',
                      padding: '3px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}>
                      Role: Accountant
                    </span>
                    <span style={{
                      background: myDetails?.Approve ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: myDetails?.Approve ? '#10b981' : '#f59e0b',
                      border: myDetails?.Approve ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                      padding: '3px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}>
                      Status: {myDetails?.Approve ? 'Approved ✅' : 'Pending Approval ⏳'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.FullName || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Email || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--teal-400)' }}>
                    {myDetails?.PhoneNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NIC Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.NICNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee ID</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.EmployeeID || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Position</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.JobPosition || 'Senior Accountant'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Gender || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Department || 'Finance & Accounts'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualifications</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {Array.isArray(myDetails?.Qualifications) ? myDetails.Qualifications.join(', ') : (myDetails?.Qualifications || 'B.Com / CIMA')}
                  </h4>
                </div>
              </div>

              {/* 3 Buttons Down */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-color)',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setNewPhone(myDetails?.PhoneNumber || '');
                    setPhoneError('');
                    setPhoneSuccess('');
                    setShowPhoneModal(true);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Phone size={18} />
                  Update Phone Number
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setShowOldPass(false);
                    setShowNewPass(false);
                    setShowConfirmPass(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setShowPasswordModal(true);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Key size={18} />
                  Update Password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeletePassword('');
                    setDeleteError('');
                    setShowDeleteModal(true);
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    marginLeft: 'auto',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 01. Update Phone Number Modal */}
      {showPhoneModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={20} style={{ color: 'var(--teal-400)' }} />
                Update Phone Number
              </h3>
              <button className="icon-btn" onClick={() => setShowPhoneModal(false)}>
                <X size={20} />
              </button>
            </div>

            {phoneError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {phoneError}
              </div>
            )}

            {phoneSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {phoneSuccess}
              </div>
            )}

            <form onSubmit={handleUpdatePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  New Phone Number (10 Digits)
                </label>
                <div className="dash-search-input-wrapper" style={{ height: '46px' }}>
                  <Phone size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. 0771234567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                    className="dash-search-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowPhoneModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingPhone}>
                  {isUpdatingPhone ? 'Updating...' : 'Save Phone Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 02. Update Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} style={{ color: 'var(--teal-400)' }} />
                Update Password
              </h3>
              <button className="icon-btn" onClick={() => setShowPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>

            {passwordError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleUpdatePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Old Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px 44px 12px 16px',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      width: '100%'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showOldPass ? 'Hide Password' : 'Show Password'}
                  >
                    {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  New Password (Min 6 Characters)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px 44px 12px 16px',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      width: '100%'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showNewPass ? 'Hide Password' : 'Show Password'}
                  >
                    {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px 44px 12px 16px',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      width: '100%'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showConfirmPass ? 'Hide Password' : 'Show Password'}
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 03. Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={20} />
                Delete Account Confirmation
              </h3>
              <button className="icon-btn" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', fontSize: '0.88rem' }}>
              <strong>Warning:</strong> Deleting your account will permanently remove your accountant credentials from the system.
            </div>

            {deleteError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {deleteError}
              </div>
            )}

            <form onSubmit={handleDeleteAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Enter Password to Confirm Deletion
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showDeletePass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '12px 44px 12px 16px',
                      color: 'var(--text-main)',
                      fontSize: '0.92rem',
                      width: '100%'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePass(!showDeletePass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                    title={showDeletePass ? 'Hide Password' : 'Show Password'}
                  >
                    {showDeletePass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting Account...' : 'Confirm Account Deletion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
