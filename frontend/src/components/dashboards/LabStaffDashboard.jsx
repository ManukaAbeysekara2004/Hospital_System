import React, { useState, useEffect } from 'react';
import {
  Microscope,
  LogOut,
  Clock,
  Sun,
  Moon,
  LayoutDashboard,
  FileSpreadsheet,
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
  FileText,
  Activity,
  Printer
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  completedBloodTests: 'Completed Blood Test',
  completedUrineTests: 'Completed Urine Test',
  settings: 'Account Settings'
};

export default function LabStaffDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Laboratory Staff Settings State
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

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

  // Patients & Doctors Lookups State
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  // Pending Tests State (Dashboard)
  const [pendingBloodTests, setPendingBloodTests] = useState([]);
  const [pendingUrineTests, setPendingUrineTests] = useState([]);
  const [isLoadingPendingBlood, setIsLoadingPendingBlood] = useState(false);
  const [isLoadingPendingUrine, setIsLoadingPendingUrine] = useState(false);

  // Completed Tests State (Tabs 2 & 3)
  const [completedBloodTests, setCompletedBloodTests] = useState([]);
  const [completedUrineTests, setCompletedUrineTests] = useState([]);
  const [isLoadingCompletedBlood, setIsLoadingCompletedBlood] = useState(false);
  const [isLoadingCompletedUrine, setIsLoadingCompletedUrine] = useState(false);

  // Fill Blood Test Modal State
  const [showFillBloodModal, setShowFillBloodModal] = useState(false);
  const [selectedBloodTest, setSelectedBloodTest] = useState(null);
  const [hemoglobin, setHemoglobin] = useState('');
  const [wbc, setWbc] = useState('');
  const [rbc, setRbc] = useState('');
  const [platelets, setPlatelets] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [bloodRemarks, setBloodRemarks] = useState('');
  const [isSubmittingBlood, setIsSubmittingBlood] = useState(false);
  const [fillBloodError, setFillBloodError] = useState('');

  // Fill Urine Test Modal State
  const [showFillUrineModal, setShowFillUrineModal] = useState(false);
  const [selectedUrineTest, setSelectedUrineTest] = useState(null);
  const [color, setColor] = useState('');
  const [appearance, setAppearance] = useState('');
  const [ph, setPh] = useState('');
  const [specificGravity, setSpecificGravity] = useState('');
  const [protein, setProtein] = useState('');
  const [glucose, setGlucose] = useState('');
  const [urineRemarks, setUrineRemarks] = useState('');
  const [isSubmittingUrine, setIsSubmittingUrine] = useState(false);
  const [fillUrineError, setFillUrineError] = useState('');

  // Printable Report / View Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportType, setReportType] = useState('blood'); // 'blood' | 'urine'

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const labStaffId = user?._id || user?.id || user?.existingLaboratoryStaff?._id || myDetails?._id;

  const fetchMyDetails = async () => {
    if (!labStaffId) return;
    setIsLoadingMyDetails(true);
    setMyDetailsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/laboratory_staff/details/${labStaffId}`);
      const data = await response.json();
      if (response.ok) {
        const details = data.existingLaboratoryStaff || data.laboratoryStaffDetails || data.labStaff;
        setMyDetails(details);
        setNewPhone(details?.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load laboratory staff details.');
      }
    } catch (err) {
      console.error('Error fetching laboratory staff details:', err);
      setMyDetailsError('Could not connect to backend server.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  const fetchPatientsAndDoctors = async () => {
    try {
      const [resP, resD] = await Promise.all([
        fetch('http://localhost:5000/api/patient/get-all-patients'),
        fetch('http://localhost:5000/api/doctor/get-all-doctor-details')
      ]);
      const dataP = await resP.json();
      const dataD = await resD.json();

      if (resP.ok) {
        const pList = dataP.patients || dataP.data || (Array.isArray(dataP) ? dataP : []);
        setPatientsList(pList);
      }
      if (resD.ok) {
        const dList = dataD.doctors || dataD.existingDoctor || dataD.data || (Array.isArray(dataD) ? dataD : []);
        setDoctorsList(dList);
      }
    } catch (err) {
      console.error('Error fetching patients or doctors:', err);
    }
  };

  const getPatientRegID = (patientId) => {
    if (!patientId) return 'P-REG-101';
    const match = patientsList.find(p => p._id === patientId || p.id === patientId);
    return match ? (match.PatientRegID || match.PatientID || match.FullName || 'P-REG-101') : (typeof patientId === 'string' && patientId.length < 15 ? patientId : `P-REG-${patientId.slice(-4)}`);
  };

  const getDoctorName = (doctorId) => {
    if (!doctorId) return 'Dr. Medical Consultant';
    const match = doctorsList.find(d => d._id === doctorId || d.id === doctorId);
    return match ? (match.FullName.startsWith('Dr.') ? match.FullName : `Dr. ${match.FullName}`) : (typeof doctorId === 'string' && doctorId.length < 15 ? doctorId : 'Dr. Medical Consultant');
  };

  const formatOnlyDate = (dateVal) => {
    if (!dateVal) return new Date().toISOString().split('T')[0];
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal).split('T')[0];
      return d.toISOString().split('T')[0];
    } catch (e) {
      return String(dateVal).split('T')[0];
    }
  };

  const fetchPendingBloodTests = async () => {
    setIsLoadingPendingBlood(true);
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/get-complete-status-false-blood-test');
      const data = await response.json();
      if (response.ok && data.data) {
        const raw = data.data.PendingBloodTest || data.data;
        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        setPendingBloodTests(list);
      } else {
        setPendingBloodTests([]);
      }
    } catch (err) {
      console.error('Error fetching pending blood tests:', err);
      setPendingBloodTests([]);
    } finally {
      setIsLoadingPendingBlood(false);
    }
  };

  const fetchPendingUrineTests = async () => {
    setIsLoadingPendingUrine(true);
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/get-complete-status-false-urine-test');
      const data = await response.json();
      if (response.ok && data.data) {
        const raw = data.data.PendingUrineTest || data.data;
        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        setPendingUrineTests(list);
      } else {
        setPendingUrineTests([]);
      }
    } catch (err) {
      console.error('Error fetching pending urine tests:', err);
      setPendingUrineTests([]);
    } finally {
      setIsLoadingPendingUrine(false);
    }
  };

  const fetchCompletedBloodTests = async () => {
    setIsLoadingCompletedBlood(true);
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/get-complete-status-true-blood-test');
      const data = await response.json();
      if (response.ok && data.data) {
        const raw = data.data.CompletedBloodTest || data.data;
        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        setCompletedBloodTests(list);
      } else {
        setCompletedBloodTests([]);
      }
    } catch (err) {
      console.error('Error fetching completed blood tests:', err);
      setCompletedBloodTests([]);
    } finally {
      setIsLoadingCompletedBlood(false);
    }
  };

  const fetchCompletedUrineTests = async () => {
    setIsLoadingCompletedUrine(true);
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/get-complete-status-true-urine-test');
      const data = await response.json();
      if (response.ok && data.data) {
        const raw = data.data.CompletedUrineTest || data.data;
        const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
        setCompletedUrineTests(list);
      } else {
        setCompletedUrineTests([]);
      }
    } catch (err) {
      console.error('Error fetching completed urine tests:', err);
      setCompletedUrineTests([]);
    } finally {
      setIsLoadingCompletedUrine(false);
    }
  };

  useEffect(() => {
    fetchPatientsAndDoctors();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchPendingBloodTests();
      fetchPendingUrineTests();
    } else if (activeTab === 'completedBloodTests') {
      fetchCompletedBloodTests();
    } else if (activeTab === 'completedUrineTests') {
      fetchCompletedUrineTests();
    } else if (activeTab === 'settings') {
      fetchMyDetails();
    }
  }, [activeTab]);

  const handleOpenFillBloodModal = (testItem) => {
    setSelectedBloodTest(testItem);
    setHemoglobin(testItem.Hemoglobin || '');
    setWbc(testItem.WBC || '');
    setRbc(testItem.RBC || '');
    setPlatelets(testItem.Platelets || '');
    setBloodSugar(testItem.BloodSugar || '');
    setBloodGroup(testItem.BloodGroup || '');
    setBloodRemarks(testItem.Remarks || '');
    setFillBloodError('');
    setShowFillBloodModal(true);
  };

  const handleFillBloodTestSubmit = async (e) => {
    e.preventDefault();
    setFillBloodError('');

    if (!selectedBloodTest?._id) return;
    setIsSubmittingBlood(true);

    const payload = {
      Hemoglobin: Number(hemoglobin) || 0,
      WBC: Number(wbc) || 0,
      RBC: Number(rbc) || 0,
      Platelets: Number(platelets) || 0,
      BloodSugar: Number(bloodSugar) || 0,
      BloodGroup: bloodGroup,
      Remarks: bloodRemarks,
      BillPricesID: "6a80c93ebfa6d7d230ce2a27"
    };

    try {
      const response = await fetch(`http://localhost:5000/api/lab-test/fill-blood-test-form/${selectedBloodTest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      if (response.ok) {
        setIsSubmittingBlood(false);
        setShowFillBloodModal(false);
        const updatedItem = resData.data || { ...selectedBloodTest, ...payload, CompleteStatus: true };
        
        setReportData(updatedItem);
        setReportType('blood');
        setShowReportModal(true);

        // Call update_BloodTest_PaidStatus_And_Full_Payment on Payment_Controller (Item 10)
        try {
          const patientId = typeof selectedBloodTest.PatientID === 'object'
            ? (selectedBloodTest.PatientID._id || selectedBloodTest.PatientID.PatientID)
            : selectedBloodTest.PatientID;

          await fetch(`http://localhost:5000/api/payment/update-bloodtest-paidstatus-and-full-payment/${selectedBloodTest._id}/${patientId}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Error updating blood test paid status & full payment:', e);
        }

        fetchPendingBloodTests();
      } else {
        setIsSubmittingBlood(false);
        setFillBloodError(resData.message || 'Failed to complete blood test report.');
      }
    } catch (err) {
      console.error('Error filling blood test form:', err);
      setIsSubmittingBlood(false);
      setFillBloodError('Could not connect to backend server.');
    }
  };

  const handleOpenFillUrineModal = (testItem) => {
    setSelectedUrineTest(testItem);
    setColor(testItem.Color || '');
    setAppearance(testItem.Appearance || '');
    setPh(testItem.pH || '');
    setSpecificGravity(testItem.SpecificGravity || '');
    setProtein(testItem.Protein || '');
    setGlucose(testItem.Glucose || '');
    setUrineRemarks(testItem.Remarks || '');
    setFillUrineError('');
    setShowFillUrineModal(true);
  };

  const handleFillUrineTestSubmit = async (e) => {
    e.preventDefault();
    setFillUrineError('');

    if (!selectedUrineTest?._id) return;
    setIsSubmittingUrine(true);

    const payload = {
      Color: color,
      Appearance: appearance,
      pH: Number(ph) || 0,
      SpecificGravity: Number(specificGravity) || 0,
      Protein: protein,
      Glucose: glucose,
      Remarks: urineRemarks,
      BillPricesID: "6a80c93ebfa6d7d230ce2a27"
    };

    try {
      const response = await fetch(`http://localhost:5000/api/lab-test/fill-urine-test-form/${selectedUrineTest._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      if (response.ok) {
        setIsSubmittingUrine(false);
        setShowFillUrineModal(false);
        const updatedItem = resData.data || { ...selectedUrineTest, ...payload, CompleteStatus: true };
        
        setReportData(updatedItem);
        setReportType('urine');
        setShowReportModal(true);

        // Call update_UrineTest_PaidStatus_And_Full_Payment on Payment_Controller (Item 11)
        try {
          const patientId = typeof selectedUrineTest.PatientID === 'object'
            ? (selectedUrineTest.PatientID._id || selectedUrineTest.PatientID.PatientID)
            : selectedUrineTest.PatientID;

          await fetch(`http://localhost:5000/api/payment/update-urinetest-paidstatus-and-full-payment/${selectedUrineTest._id}/${patientId}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Error updating urine test paid status & full payment:', e);
        }

        fetchPendingUrineTests();
      } else {
        setIsSubmittingUrine(false);
        setFillUrineError(resData.message || 'Failed to complete urine test report.');
      }
    } catch (err) {
      console.error('Error filling urine test form:', err);
      setIsSubmittingUrine(false);
      setFillUrineError('Could not connect to backend server.');
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'LS';
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

    if (!labStaffId) {
      setPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newPhone.trim())) {
      setPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await fetch(`http://localhost:5000/api/laboratory_staff/update-phone-number/${labStaffId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PhoneNumber: newPhone.trim() })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingPhone(false);
        setPhoneSuccess('Phone number updated successfully!');
        setTimeout(() => {
          setShowPhoneModal(false);
          setPhoneSuccess('');
        }, 1200);
        fetchMyDetails();
      } else {
        setIsUpdatingPhone(false);
        setPhoneError(resData.message || 'Failed to update phone number.');
      }
    } catch (err) {
      console.error('Error updating phone number:', err);
      setIsUpdatingPhone(false);
      setPhoneError('Could not connect to backend server.');
    }
  };

  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!labStaffId) {
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
      const response = await fetch(`http://localhost:5000/api/laboratory_staff/update-password/${labStaffId}`, {
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

    if (!labStaffId) {
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
      const response = await fetch(`http://localhost:5000/api/laboratory_staff/delete/${labStaffId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laboratoryStaffId: labStaffId,
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
      console.error('Error deleting laboratory staff account:', err);
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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Lab Staff</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'completedBloodTests' ? 'active' : ''}`} onClick={() => setActiveTab('completedBloodTests')}>
              <Microscope size={18} />
              Completed Blood Test
            </button>
            <button className={`dash-nav-item ${activeTab === 'completedUrineTests' ? 'active' : ''}`} onClick={() => setActiveTab('completedUrineTests')}>
              <FileSpreadsheet size={18} />
              Completed Urine Test
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
              {getInitials(myDetails?.FullName || user?.FullName || 'Lab Staff')}
            </div>
            <div className="dash-user-details">
              <h5>{myDetails?.FullName || user?.FullName || 'Lab Staff'}</h5>
              <p>{myDetails?.Email || user?.Email || 'labstaff@apexhealth.org'}</p>
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
                Pathology & Clinical Laboratory Diagnostics
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Laboratory Management Dashboard
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
              LABORATORY DASHBOARD | Session Active
            </span>
            <h2>Welcome back, {myDetails?.FullName || user?.FullName || 'Lab Staff'}</h2>
            {activeTab === 'dashboard' && (
              <p>
                Apex Health clinical diagnostics portal. Perform specimen collection, hematology & urinalysis testing, digital lab report generation, and path lab verification.
              </p>
            )}
          </div>

          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
            {/* 2-Column Grid Layout: Left Side (Blood Tests) & Right Side (Urine Tests) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

              {/* LEFT SIDE: Requested Blood Test (CompleteStatus False) */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Microscope size={22} style={{ color: 'var(--teal-400)' }} />
                    Requested Blood Test ({pendingBloodTests.length})
                  </h3>
                  <button
                    onClick={fetchPendingBloodTests}
                    disabled={isLoadingPendingBlood}
                    className="dash-search-btn"
                    style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={isLoadingPendingBlood ? 'spin-icon' : ''} />
                    Refresh
                  </button>
                </div>

                <div className="dash-table-container" style={{ overflowY: 'auto', maxHeight: '520px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>Patient Reg ID</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>Doctor Name</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>TestDate</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingBloodTests && pendingBloodTests.length > 0 ? (
                        pendingBloodTests.map((item, index) => (
                          <tr key={item._id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px', fontWeight: '800', color: 'var(--teal-400)' }}>
                              {getPatientRegID(item.PatientID)}
                            </td>
                            <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                              {getDoctorName(item.DoctorID)}
                            </td>
                            <td style={{ padding: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                              {formatOnlyDate(item.createdAt || item.createdAt)}
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenFillBloodModal(item)}
                                style={{
                                  padding: '8px 18px',
                                  borderRadius: '10px',
                                  fontWeight: '800',
                                  fontSize: '0.85rem',
                                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                                }}
                              >
                                Fill
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            {isLoadingPendingBlood ? 'Loading requested blood tests...' : 'No pending blood test requests available.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT SIDE: Requested Urine Test (CompleteStatus False) */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileSpreadsheet size={22} style={{ color: '#f59e0b' }} />
                    Requested Urine Test ({pendingUrineTests.length})
                  </h3>
                  <button
                    onClick={fetchPendingUrineTests}
                    disabled={isLoadingPendingUrine}
                    className="dash-search-btn"
                    style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <RefreshCw size={14} className={isLoadingPendingUrine ? 'spin-icon' : ''} />
                    Refresh
                  </button>
                </div>

                <div className="dash-table-container" style={{ overflowY: 'auto', maxHeight: '520px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>Patient Reg ID</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>Doctor Name</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800' }}>TestDate</th>
                        <th style={{ padding: '12px 14px', fontWeight: '800', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUrineTests && pendingUrineTests.length > 0 ? (
                        pendingUrineTests.map((item, index) => (
                          <tr key={item._id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px', fontWeight: '800', color: '#f59e0b' }}>
                              {getPatientRegID(item.PatientID)}
                            </td>
                            <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                              {getDoctorName(item.DoctorID)}
                            </td>
                            <td style={{ padding: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                              {formatOnlyDate(item.createdAt || item.createdAt)}
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenFillUrineModal(item)}
                                style={{
                                  padding: '8px 18px',
                                  borderRadius: '10px',
                                  fontWeight: '800',
                                  fontSize: '0.85rem',
                                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                  color: '#ffffff',
                                  border: 'none',
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                                }}
                              >
                                Fill
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            {isLoadingPendingUrine ? 'Loading requested urine tests...' : 'No pending urine test requests available.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: COMPLETED BLOOD TEST */}
        {activeTab === 'completedBloodTests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Microscope size={22} style={{ color: 'var(--teal-400)' }} />
                Completed Blood Test Records ({completedBloodTests.length})
              </h3>
              <button
                onClick={fetchCompletedBloodTests}
                disabled={isLoadingCompletedBlood}
                className="dash-search-btn"
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={15} className={isLoadingCompletedBlood ? 'spin-icon' : ''} />
                Refresh
              </button>
            </div>

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Reg ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>TestDate</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedBloodTests && completedBloodTests.length > 0 ? (
                    completedBloodTests.map((item, index) => (
                      <tr key={item._id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)' }}>
                          {getPatientRegID(item.PatientID)}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {getDoctorName(item.DoctorID)}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-muted)' }}>
                          {formatOnlyDate(item.updatedAt || item.createdAt)}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setReportData(item);
                              setReportType('blood');
                              setShowReportModal(true);
                            }}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '10px',
                              fontWeight: '800',
                              fontSize: '0.85rem',
                              background: 'rgba(45, 212, 191, 0.15)',
                              color: '#2dd4bf',
                              border: '1px solid rgba(45, 212, 191, 0.35)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {isLoadingCompletedBlood ? 'Loading completed blood test records...' : 'No completed blood test records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETED URINE TEST */}
        {activeTab === 'completedUrineTests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileSpreadsheet size={22} style={{ color: '#f59e0b' }} />
                Completed Urine Test Records ({completedUrineTests.length})
              </h3>
              <button
                onClick={fetchCompletedUrineTests}
                disabled={isLoadingCompletedUrine}
                className="dash-search-btn"
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={15} className={isLoadingCompletedUrine ? 'spin-icon' : ''} />
                Refresh
              </button>
            </div>

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Reg ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>TestDate</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedUrineTests && completedUrineTests.length > 0 ? (
                    completedUrineTests.map((item, index) => (
                      <tr key={item._id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: '#f59e0b' }}>
                          {getPatientRegID(item.PatientID)}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {getDoctorName(item.DoctorID)}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-muted)' }}>
                          {formatOnlyDate(item.updatedAt || item.createdAt)}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setReportData(item);
                              setReportType('urine');
                              setShowReportModal(true);
                            }}
                            style={{
                              padding: '8px 18px',
                              borderRadius: '10px',
                              fontWeight: '800',
                              fontSize: '0.85rem',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                              border: '1px solid rgba(245, 158, 11, 0.35)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {isLoadingCompletedUrine ? 'Loading completed urine test records...' : 'No completed urine test records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  {getInitials(myDetails?.FullName || user?.FullName || 'Lab Staff')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.FullName || user?.FullName || 'Lab Staff'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'labstaff@apexhealth.org'}
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
                      Role: Laboratory Staff
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laboratory License</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.LaboratoryLicenseNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Department || 'Clinical Laboratory'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Gender || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Birth</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.DateOfBirth ? myDetails.DateOfBirth.split('T')[0] : 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qualifications</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {Array.isArray(myDetails?.Qualifications) ? myDetails.Qualifications.join(', ') : (myDetails?.Qualifications || 'B.Sc Medical Laboratory Technology')}
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
              <strong>Warning:</strong> Deleting your account will permanently remove your laboratory staff credentials from the system.
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

      {/* 04. Fill Blood Test Report Modal */}
      {showFillBloodModal && selectedBloodTest && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LABORATORY DIAGNOSTICS</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Microscope size={22} style={{ color: 'var(--teal-400)' }} />
                  Fill Blood Test Report
                </h3>
              </div>
              <button className="icon-btn" onClick={() => setShowFillBloodModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '18px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>PATIENT:</span> <strong style={{ color: 'var(--teal-400)' }}>{getPatientRegID(selectedBloodTest.PatientID)}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>DOCTOR:</span> <strong style={{ color: 'var(--text-main)' }}>{getDoctorName(selectedBloodTest.DoctorID)}</strong></div>
            </div>

            {fillBloodError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {fillBloodError}
              </div>
            )}

            <form onSubmit={handleFillBloodTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Hemoglobin (g/dL)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 13.5"
                    value={hemoglobin}
                    onChange={(e) => setHemoglobin(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>WBC (/µL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 6500"
                    value={wbc}
                    onChange={(e) => setWbc(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>RBC (million/µL)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 4.8"
                    value={rbc}
                    onChange={(e) => setRbc(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Platelets (/µL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 250000"
                    value={platelets}
                    onChange={(e) => setPlatelets(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="e.g. 95"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  >
                    <option value="">Select Blood Group...</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Enter path lab remarks or notes..."
                  value={bloodRemarks}
                  onChange={(e) => setBloodRemarks(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowFillBloodModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBlood}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
                  }}
                >
                  {isSubmittingBlood ? 'Completing...' : 'Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 05. Fill Urine Test Report Modal */}
      {showFillUrineModal && selectedUrineTest && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '520px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>URINALYSIS DIAGNOSTICS</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={22} style={{ color: '#f59e0b' }} />
                  Fill Urine Test Report
                </h3>
              </div>
              <button className="icon-btn" onClick={() => setShowFillUrineModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '18px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>PATIENT:</span> <strong style={{ color: '#f59e0b' }}>{getPatientRegID(selectedUrineTest.PatientID)}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>DOCTOR:</span> <strong style={{ color: 'var(--text-main)' }}>{getDoctorName(selectedUrineTest.DoctorID)}</strong></div>
            </div>

            {fillUrineError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {fillUrineError}
              </div>
            )}

            <form onSubmit={handleFillUrineTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Pale Yellow"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Appearance</label>
                  <input
                    type="text"
                    placeholder="e.g. Clear"
                    value={appearance}
                    onChange={(e) => setAppearance(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 6.0"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Specific Gravity</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="e.g. 1.015"
                    value={specificGravity}
                    onChange={(e) => setSpecificGravity(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Protein</label>
                  <input
                    type="text"
                    placeholder="e.g. Nil"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Glucose</label>
                  <input
                    type="text"
                    placeholder="e.g. Nil"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Enter urinalysis remarks or notes..."
                  value={urineRemarks}
                  onChange={(e) => setUrineRemarks(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowFillUrineModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUrine}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
                  }}
                >
                  {isSubmittingUrine ? 'Completing...' : 'Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 06. Printable Lab Test Report Modal (Styled matching Doctor Dashboard Patient Care Print) */}
      {showReportModal && reportData && (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '500px', padding: '32px 28px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
            
            {/* Header Title */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.15)', color: 'var(--teal-400)', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartPulse size={30} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                Diagnostic Report Slip
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Official ApexCare Clinical Pathology Document
              </p>
            </div>

            {/* Printable Slip Card Area (Dashed Teal Border) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px dashed var(--teal-400)',
              borderRadius: '20px',
              padding: '24px 20px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal-400)', fontWeight: '800', marginBottom: '4px' }}>
                ApexCare Hospital System
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 20px 0', color: 'var(--text-main)' }}>
                {reportType === 'blood' ? 'Blood Test Clinical Report' : 'Urine Test Clinical Report'}
              </h2>

              {/* Patient PatientRegID (Big, Center and Top) */}
              <div style={{ background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  PATIENT REG ID
                </span>
                <div style={{ fontSize: '2.6rem', fontWeight: '900', color: 'var(--teal-400)', letterSpacing: '0.05em', margin: '4px 0 4px 0', fontFamily: 'var(--font-heading)' }}>
                  {getPatientRegID(reportData.PatientID)}
                </div>
              </div>

              {/* Doctor Name */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '14px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  ATTENDING DOCTOR
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getDoctorName(reportData.DoctorID)}
                </div>
              </div>

              {/* Lab Test Findings Section */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-400)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>
                  {reportType === 'blood' ? 'BLOOD TEST FINDINGS' : 'URINE TEST FINDINGS'}
                </span>
                
                {reportType === 'blood' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    <div>Hemoglobin: <strong>{reportData.Hemoglobin} g/dL</strong></div>
                    <div>WBC: <strong>{reportData.WBC} /µL</strong></div>
                    <div>RBC: <strong>{reportData.RBC} M/µL</strong></div>
                    <div>Platelets: <strong>{reportData.Platelets} /µL</strong></div>
                    <div>Blood Sugar: <strong>{reportData.BloodSugar} mg/dL</strong></div>
                    <div>Blood Group: <strong style={{ color: '#ef4444' }}>{reportData.BloodGroup}</strong></div>
                    <div style={{ gridColumn: 'span 2', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                      Remarks: <strong>{reportData.Remarks || 'N/A'}</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    <div>Color: <strong>{reportData.Color}</strong></div>
                    <div>Appearance: <strong>{reportData.Appearance}</strong></div>
                    <div>pH Level: <strong>{reportData.pH}</strong></div>
                    <div>Specific Gravity: <strong>{reportData.SpecificGravity}</strong></div>
                    <div>Protein: <strong>{reportData.Protein}</strong></div>
                    <div>Glucose: <strong>{reportData.Glucose}</strong></div>
                    <div style={{ gridColumn: 'span 2', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                      Remarks: <strong>{reportData.Remarks || 'N/A'}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Fee Footer Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span>Date: <strong style={{ color: 'var(--text-main)' }}>{formatOnlyDate(reportData.updatedAt || reportData.createdAt)}</strong></span>
                <span>Fee: <strong style={{ color: '#10b981' }}>Rs. {reportData.Fee || (reportType === 'blood' ? 1350 : 1450)}</strong></span>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>

              <button
                type="button"
                style={{
                  flex: 1.5,
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.98rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={() => window.print()}
              >
                <FileText size={18} />
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
