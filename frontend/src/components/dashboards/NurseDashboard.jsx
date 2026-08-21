import React, { useState, useEffect } from 'react';
import {
  Heart,
  LogOut,
  Clock,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  Calendar,
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
  Activity,
  ShieldCheck,
  Search,
  Stethoscope
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  completeWorks: 'Complete Works',
  doctors: 'Medical Doctors',
  settings: 'Account Settings'
};

export default function NurseDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Nurse Settings State
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

  // Data States
  const [allPatients, setAllPatients] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Nurse Works Data State
  const [nurseWorksList, setNurseWorksList] = useState([]);
  const [isLoadingNurseWorks, setIsLoadingNurseWorks] = useState(false);
  const [nurseWorksError, setNurseWorksError] = useState('');
  const [updatingWorkId, setUpdatingWorkId] = useState(null);

  // Complete Works Search & Modal State
  const [completeWorksSearchQuery, setCompleteWorksSearchQuery] = useState('');
  const [selectedWorkToView, setSelectedWorkToView] = useState(null);

  // Doctors State
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorFetchError, setDoctorFetchError] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Complete All Nurse Work Confirmation Modal State
  const [selectedWorkToCompleteAll, setSelectedWorkToCompleteAll] = useState(null);
  const [isCompletingAll, setIsCompletingAll] = useState(false);
  const [completeAllError, setCompleteAllError] = useState('');

  // Dashboard Pending Works Search State
  const [dashSearchQuery, setDashSearchQuery] = useState('');

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

  const nurseId = user?._id || user?.id || user?.existingNurse?._id || myDetails?._id;

  const fetchMyDetails = async () => {
    if (!nurseId) return;
    setIsLoadingMyDetails(true);
    setMyDetailsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/nurse/details/${nurseId}`);
      const data = await response.json();
      if (response.ok) {
        const details = data.existingNurse || data.nurseDetails || data.nurse;
        setMyDetails(details);
        setNewPhone(details?.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load nurse details.');
      }
    } catch (err) {
      console.error('Error fetching nurse details:', err);
      setMyDetailsError('Could not connect to backend server.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      const [patRes, apptRes] = await Promise.all([
        fetch('http://localhost:5000/api/patient/get-all-patients').catch(() => null),
        fetch('http://localhost:5000/api/appointment/get-all-pending-appointments').catch(() => null)
      ]);

      let pts = [];
      if (patRes && patRes.ok) {
        const d = await patRes.json();
        pts = d.allPatients || d.allPatient || d.patients || [];
        setAllPatients(pts);
      }
      if (apptRes && apptRes.ok) {
        const d = await apptRes.json();
        setAllAppointments(d.allPendingAppointments || d.appointments || []);
      }
      return pts;
    } catch (e) {
      console.error('Error loading live data:', e);
    }
    return [];
  };

  // Fetch Nurse Works for Logged In Nurse (Get_Nurse_Work_By_NurseId)
  const fetchNurseWorks = async () => {
    if (!nurseId) return;
    setIsLoadingNurseWorks(true);
    setNurseWorksError('');
    try {
      if (!allPatients || allPatients.length === 0) {
        await fetchLiveData();
      }
      const response = await fetch(`http://localhost:5000/api/nurse-works/by-nurse/${nurseId}`);
      const data = await response.json();
      if (response.ok) {
        const works = Array.isArray(data.nurse_work)
          ? data.nurse_work
          : data.nurse_work
            ? [data.nurse_work]
            : [];
        setNurseWorksList(works);
      } else {
        setNurseWorksList([]);
        setNurseWorksError(data.message || 'No nurse works found.');
      }
    } catch (err) {
      console.error('Error fetching nurse works:', err);
      setNurseWorksError('Could not connect to backend server.');
    } finally {
      setIsLoadingNurseWorks(false);
    }
  };

  // Fetch All Doctor Details (Get_All_Doctor_Details)
  const fetchAllDoctorDetails = async () => {
    setIsLoadingDoctors(true);
    setDoctorFetchError('');
    try {
      const response = await fetch('http://localhost:5000/api/doctor/get-all-doctor-details');
      const data = await response.json();
      if (response.ok && data.allDoctor) {
        setDoctorsList(data.allDoctor);
      } else {
        setDoctorFetchError(data.message || 'Failed to fetch doctor details.');
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
      setDoctorFetchError('Could not connect to backend server to load doctors.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    fetchAllDoctorDetails();
  }, []);

  useEffect(() => {
    if (nurseId) {
      fetchNurseWorks();
    }
  }, [nurseId, activeTab]);

  useEffect(() => {
    if (activeTab === 'doctors') {
      fetchAllDoctorDetails();
    } else if (activeTab === 'settings') {
      fetchMyDetails();
    }
  }, [activeTab]);

  const getPatientDetails = (patientId) => {
    if (!patientId) return null;
    if (typeof patientId === 'object') {
      if (patientId.PatientRegID || patientId.FullName) return patientId;
      if (patientId._id) patientId = patientId._id;
    }
    const targetStr = String(patientId).trim();
    return allPatients.find(p =>
      String(p._id || '').trim() === targetStr ||
      String(p.PatientID || '').trim() === targetStr ||
      String(p.PatientRegID || '').trim() === targetStr
    ) || null;
  };

  // Update Individual Work Done (Update_Nurse_Work)
  const handleMarkWorkDone = async (nurseWorkId, workId) => {
    setUpdatingWorkId(`${nurseWorkId}_${workId}`);
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/update/${nurseWorkId}/${workId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Done: true })
      });
      const data = await response.json();
      if (response.ok) {
        setNurseWorksList(prev =>
          prev.map(nw => {
            if (nw._id === nurseWorkId) {
              const updatedWorks = (nw.Works || []).map(w =>
                w._id === workId ? { ...w, Done: true } : w
              );
              return { ...nw, Works: updatedWorks };
            }
            return nw;
          })
        );
      } else {
        setNurseWorksError(data.message || 'Failed to update work status.');
      }
    } catch (err) {
      console.error('Error updating work status:', err);
      setNurseWorksError('Could not connect to backend server to update work status.');
    } finally {
      setUpdatingWorkId(null);
    }
  };

  // Open Complete All Confirmation Modal
  const handleOpenCompleteAllModal = (nw) => {
    setSelectedWorkToCompleteAll(nw);
    setCompleteAllError('');
  };

  // Confirm Complete All Works (Update_AllDone)
  const confirmCompleteAllWork = async () => {
    if (!selectedWorkToCompleteAll) return;
    setIsCompletingAll(true);
    setCompleteAllError('');
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/update-alldone/${selectedWorkToCompleteAll._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AllDone: true })
      });
      const data = await response.json();
      if (response.ok) {
        setNurseWorksList(prev =>
          prev.map(nw => (nw._id === selectedWorkToCompleteAll._id ? { ...nw, AllDone: true } : nw))
        );
        setIsCompletingAll(false);
        setSelectedWorkToCompleteAll(null);
      } else {
        setIsCompletingAll(false);
        setCompleteAllError(data.message || 'Failed to update AllDone status.');
      }
    } catch (err) {
      console.error('Error completing all works:', err);
      setIsCompletingAll(false);
      setCompleteAllError('Could not connect to backend server.');
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'NR';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogoutClick = async () => {
    if (nurseId) {
      try {
        await fetch(`http://localhost:5000/api/nurse/logout/${nurseId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('Error executing Nurse_Logout:', err);
      }
    }
    onLogout();
  };

  const handleUpdatePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');

    if (!nurseId) {
      setPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newPhone.trim())) {
      setPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await fetch(`http://localhost:5000/api/nurse/update-phone-number/${nurseId}`, {
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

    if (!nurseId) {
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
      const response = await fetch(`http://localhost:5000/api/nurse/update-password/${nurseId}`, {
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

    if (!nurseId) {
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
      const response = await fetch(`http://localhost:5000/api/nurse/delete/${nurseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nurseId: nurseId,
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
      console.error('Error deleting nurse account:', err);
      setIsDeleting(false);
      setDeleteError('Could not connect to backend server.');
    }
  };

  const filteredPatients = allPatients.filter(p =>
    (p.FullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.PatientRegID || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Nurse</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'completeWorks' ? 'active' : ''}`} onClick={() => setActiveTab('completeWorks')}>
              <CheckCircle2 size={18} />
              Complete Works
            </button>
            <button className={`dash-nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
              <Users size={18} />
              Doctors
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
              {getInitials(myDetails?.FullName || user?.FullName || 'Nurse')}
            </div>
            <div className="dash-user-details">
              <h5>Nurse {myDetails?.FullName || user?.FullName || 'Nurse'}</h5>
              <p>{myDetails?.Email || user?.Email || 'nurse@apexhealth.org'}</p>
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
                Nursing & In-Patient Ward Operations
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Nurse Management Dashboard
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
              NURSE DASHBOARD | Session Active
            </span>
            <h2>Welcome back, Nurse {myDetails?.FullName || user?.FullName || 'Nurse'}</h2>
            {activeTab === 'dashboard' && (
              <p>
                Apex Health clinical nursing management portal. Track ward room assignments, vital signs monitoring, medication distribution, and shift handovers.
              </p>
            )}
          </div>

          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW (Nurse Works AllDone = false) */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {nurseWorksError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {nurseWorksError}
              </div>
            )}

            {(() => {
              const pendingWorks = nurseWorksList.filter(nw => nw.AllDone === false);

              if (isLoadingNurseWorks) {
                return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading active nurse works...</div>;
              }

              if (pendingWorks.length === 0) {
                return (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '360px', background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--border-color)', padding: '40px', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(45, 212, 191, 0.12)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>All Caught Up!</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>No pending nurse work assignments currently assigned to you.</p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                  {pendingWorks.map((nw) => {
                    const patientObj = getPatientDetails(nw.PatientID);
                    const patientRegIdStr = patientObj?.PatientRegID || (typeof nw.PatientID === 'object' ? nw.PatientID?.PatientRegID : null) || 'N/A';
                    const patientNameStr = patientObj?.FullName || (typeof nw.PatientID === 'object' ? nw.PatientID?.FullName : null) || 'N/A';

                    return (
                      <div
                        key={nw._id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1.5px solid rgba(45, 212, 191, 0.4)',
                          borderRadius: '22px',
                          padding: '24px',
                          boxShadow: 'var(--shadow-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '18px',
                          width: '100%'
                        }}
                      >
                        {/* Header Banner */}
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            PATIENT CARE ASSIGNMENT
                          </span>
                          <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.4rem', fontWeight: '900', color: 'var(--teal-400)' }}>
                            Patient Reg ID: {patientRegIdStr}
                          </h3>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Patient Name: {patientNameStr}
                          </h4>
                        </div>

                        {/* Works Instructions List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            WORK INSTRUCTIONS ({nw.Works?.length || 0})
                          </span>

                          {nw.Works && nw.Works.length > 0 ? (
                            nw.Works.map((w, idx) => {
                              const isWorkDone = w.Done === true;
                              const isUpdating = updatingWorkId === `${nw._id}_${w._id}`;

                              return (
                                <div
                                  key={w._id || idx}
                                  style={{
                                    background: isWorkDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                    border: isWorkDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                                    borderRadius: '14px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ background: isWorkDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(45, 212, 191, 0.15)', color: isWorkDone ? '#10b981' : '#2dd4bf', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800' }}>
                                      #{idx + 1}
                                    </span>
                                    <span style={{ fontSize: '0.94rem', fontWeight: '700', color: isWorkDone ? '#10b981' : 'var(--text-main)', textDecoration: isWorkDone ? 'line-through' : 'none' }}>
                                      {w.Work}
                                    </span>
                                  </div>

                                  {isWorkDone ? (
                                    <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <CheckCircle2 size={14} /> Done
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() => handleMarkWorkDone(nw._id, w._id)}
                                      className="dash-search-btn"
                                      style={{ padding: '6px 16px', fontSize: '0.84rem', borderRadius: '10px', fontWeight: '800' }}
                                    >
                                      {isUpdating ? 'Updating...' : 'Done'}
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                              No work instructions listed.
                            </div>
                          )}
                        </div>

                        {/* Complete All Button Down Section */}
                        <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenCompleteAllModal(nw)}
                            style={{
                              padding: '10px 24px',
                              borderRadius: '12px',
                              fontWeight: '800',
                              fontSize: '0.9rem',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <CheckCircle2 size={16} />
                            Complete All
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

        {/* TAB 2: COMPLETE WORKS (Nurse Works AllDone = true) */}
        {activeTab === 'completeWorks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Search Bar Toolbar */}
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />
              <div className="dash-search-center-group" style={{ flex: 1, maxWidth: '640px' }}>
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search completed works by Patient Name or Patient Reg ID..."
                    value={completeWorksSearchQuery}
                    onChange={(e) => setCompleteWorksSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                {completeWorksSearchQuery && (
                  <button
                    onClick={() => setCompleteWorksSearchQuery('')}
                    className="back-btn"
                    style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchNurseWorks}
                  disabled={isLoadingNurseWorks}
                  className="dash-search-btn"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Refresh Completed Works"
                >
                  <RefreshCw size={16} className={isLoadingNurseWorks ? 'spin-icon' : ''} />
                  {isLoadingNurseWorks ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="dash-toolbar-right-group" />
            </div>

            {/* Completed Nurse Works Table */}
            <div className="dash-patient-section">
              {(() => {
                const completedWorks = nurseWorksList.filter(nw => nw.AllDone === true);
                const filteredWorks = completedWorks.filter(nw => {
                  const patientObj = getPatientDetails(nw.PatientID);
                  const query = completeWorksSearchQuery.toLowerCase().trim();
                  if (!query) return true;
                  const nameMatch = (patientObj?.FullName || '').toLowerCase().includes(query);
                  const regMatch = (patientObj?.PatientRegID || nw.PatientID || '').toLowerCase().includes(query);
                  return nameMatch || regMatch;
                });

                return (
                  <>
                    <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                        Completed Nurse Work Assignments
                      </h3>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Showing {filteredWorks.length} of {completedWorks.length} completed works
                      </span>
                    </div>

                    <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                        <thead>
                          <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Reg ID</th>
                            <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Name</th>
                            <th style={{ padding: '16px 20px', fontWeight: '800' }}>AllDone Status</th>
                            <th style={{ padding: '16px 20px', fontWeight: '800' }}>Complete Date</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredWorks.length > 0 ? (
                            filteredWorks.map((nw) => {
                              const patientObj = getPatientDetails(nw.PatientID);
                              const completeDateStr = nw.CompleteDate
                                ? new Date(nw.CompleteDate).toLocaleDateString()
                                : nw.updatedAt
                                  ? new Date(nw.updatedAt).toLocaleDateString()
                                  : 'Today';

                              return (
                                <tr key={nw._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                                  <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>
                                    {patientObj?.PatientRegID || nw.PatientID}
                                  </td>
                                  <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                                    {patientObj?.FullName || 'N/A'}
                                  </td>
                                  <td style={{ padding: '16px 20px' }}>
                                    <span style={{
                                      background: 'rgba(16, 185, 129, 0.18)',
                                      color: '#10b981',
                                      border: '1px solid rgba(16, 185, 129, 0.4)',
                                      padding: '4px 12px',
                                      borderRadius: '14px',
                                      fontSize: '0.8rem',
                                      fontWeight: '800'
                                    }}>
                                      Completed
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {completeDateStr}
                                  </td>
                                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                    <button
                                      className="icon-btn"
                                      onClick={() => setSelectedWorkToView(nw)}
                                      style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'rgba(45, 212, 191, 0.15)',
                                        color: '#2dd4bf',
                                        border: '1px solid rgba(45, 212, 191, 0.35)',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                      }}
                                      title="View All Instructions"
                                    >
                                      <Eye size={18} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                {isLoadingNurseWorks ? 'Loading completed works...' : completeWorksSearchQuery ? `No completed works matching "${completeWorksSearchQuery}".` : 'No completed works found.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: DOCTORS PAGE (Identical to Doctor Management Dashboard Doctor Page) */}
        {activeTab === 'doctors' && (
          <div className="dash-doctors-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Search & Refresh Toolbar */}
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group" style={{ flex: 1, maxWidth: '640px' }}>
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search doctor by Name, Room Number or Specialization..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                {doctorSearchQuery && (
                  <button
                    onClick={() => setDoctorSearchQuery('')}
                    className="back-btn"
                    style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchAllDoctorDetails}
                  disabled={isLoadingDoctors}
                  className="dash-search-btn"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Refresh Doctors"
                >
                  <RefreshCw size={16} className={isLoadingDoctors ? 'spin-icon' : ''} />
                  {isLoadingDoctors ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {doctorFetchError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {doctorFetchError}
              </div>
            )}

            {/* Doctors Grid - 4 Boxes Per Line (Identical to Doctor Management Dashboard) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              paddingBottom: '20px'
            }}>
              {(() => {
                const filteredAndSortedDoctors = doctorsList
                  .filter((doc) => {
                    if (!doctorSearchQuery.trim()) return true;
                    const q = doctorSearchQuery.toLowerCase().trim();
                    const name = (doc.FullName || '').toLowerCase();
                    const room = (doc.RoomNumber || '').toLowerCase();
                    const spec = (doc.Specialization || doc.Department || '').toLowerCase();
                    return name.includes(q) || room.includes(q) || spec.includes(q);
                  })
                  .sort((a, b) => {
                    const availA = a.InHospitalAvailability === true;
                    const availB = b.InHospitalAvailability === true;

                    if (availA && !availB) return -1;
                    if (!availA && availB) return 1;

                    const countA = typeof a.NoOfAppointments === 'number' ? a.NoOfAppointments : 0;
                    const countB = typeof b.NoOfAppointments === 'number' ? b.NoOfAppointments : 0;
                    return countA - countB;
                  });

                if (isLoadingDoctors) {
                  return (
                    <div style={{
                      gridColumn: 'span 4',
                      textAlign: 'center',
                      padding: '48px',
                      background: 'var(--bg-card)',
                      borderRadius: '18px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      fontSize: '1rem'
                    }}>
                      Loading medical doctor details...
                    </div>
                  );
                }

                if (filteredAndSortedDoctors.length === 0) {
                  return (
                    <div style={{
                      gridColumn: 'span 4',
                      textAlign: 'center',
                      padding: '48px',
                      background: 'var(--bg-card)',
                      borderRadius: '18px',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      fontSize: '1rem'
                    }}>
                      {doctorSearchQuery ? `No doctor matches found for "${doctorSearchQuery}".` : 'No doctor records found.'}
                    </div>
                  );
                }

                return filteredAndSortedDoctors.map((doc) => {
                  const isAvailable = doc.InHospitalAvailability === true;
                  return (
                    <div
                      key={doc._id}
                      style={{
                        background: 'var(--bg-card)',
                        border: isAvailable
                          ? '1.5px solid rgba(45, 212, 191, 0.45)'
                          : '1.5px solid rgba(239, 68, 68, 0.45)',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: 'var(--shadow-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '16px',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      {/* Top Bar: Icon & Availability Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          background: isAvailable ? 'rgba(45, 212, 191, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                          color: isAvailable ? 'var(--teal-400)' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Stethoscope size={22} />
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                          background: isAvailable ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.15)',
                          color: isAvailable ? '#10b981' : '#dc2626',
                          border: isAvailable ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.35)'
                        }}>
                          {isAvailable ? 'In-Hospital Available' : 'Not Available'}
                        </span>
                      </div>

                      {/* Doctor FullName & Specialization */}
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-main)' }}>
                          Dr. {doc.FullName}
                        </h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--teal-400)', fontWeight: '700' }}>
                          {doc.Specialization || doc.Department || 'General Physician'}
                        </span>
                      </div>

                      {/* Info Details: RoomNumber & NoOfAppointments */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Room Number:</span>
                          <strong style={{ color: 'var(--teal-400)', fontWeight: '800', fontSize: '0.95rem' }}>
                            Room {doc.RoomNumber || 'N/A'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>No. of Appointments:</span>
                          <strong style={{ color: 'var(--teal-400)', fontWeight: '800', fontSize: '0.95rem' }}>
                            {typeof doc.NoOfAppointments === 'number' ? doc.NoOfAppointments : 0}
                          </strong>
                        </div>
                      </div>

                      {/* StopAppointments Status Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-color)',
                        fontSize: '0.84rem'
                      }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Stop Appointments:</span>
                        {doc.StopAppointments ? (
                          <span style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#dc2626',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            padding: '3px 10px',
                            borderRadius: '14px',
                            fontWeight: '800',
                            fontSize: '0.78rem'
                          }}>
                            Stopped
                          </span>
                        ) : (
                          <span style={{
                            background: 'rgba(16, 185, 129, 0.18)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.4)',
                            padding: '3px 10px',
                            borderRadius: '14px',
                            fontWeight: '800',
                            fontSize: '0.78rem'
                          }}>
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* LEGACY TABS (EMPTY BODIES) */}
        {(activeTab === 'patients' || activeTab === 'nurseWorks' || activeTab === 'appointments') && (
          <div style={{ flex: 1 }} />
        )}

        {/* TAB 5: SETTINGS */}
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
                  {getInitials(myDetails?.FullName || user?.FullName || 'Nurse')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Nurse {myDetails?.FullName || user?.FullName || 'Nurse'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'nurse@apexhealth.org'}
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
                      Role: Nurse
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
                    Nurse {myDetails?.FullName || 'N/A'}
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nurse License Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.NurseLicenseNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Department || 'Nursing Care'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Gender || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shift</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Shift || 'Day Shift'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duty Status</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: myDetails?.IsInWork ? '#10b981' : '#f59e0b' }}>
                    {myDetails?.IsInWork ? 'On Duty ✅' : 'Off Duty ⏸️'}
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
              <strong>Warning:</strong> Deleting your account will permanently remove your nurse credentials from the system.
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

      {/* 01. View Completed Work Instructions Modal */}
      {selectedWorkToView && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '580px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                Completed Work Instructions
              </h3>
              <button className="icon-btn" onClick={() => setSelectedWorkToView(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '800', color: 'var(--teal-400)' }}>
                Patient Reg ID: {getPatientDetails(selectedWorkToView.PatientID)?.PatientRegID || selectedWorkToView.PatientID}
              </h4>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '700' }}>
                Patient Name: {getPatientDetails(selectedWorkToView.PatientID)?.FullName || 'N/A'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                INSTRUCTION LIST ({selectedWorkToView.Works?.length || 0})
              </span>

              {selectedWorkToView.Works && selectedWorkToView.Works.length > 0 ? (
                selectedWorkToView.Works.map((w, idx) => (
                  <div
                    key={w._id || idx}
                    style={{
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '800' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.94rem', fontWeight: '700', color: '#10b981' }}>
                        {w.Work}
                      </span>
                    </div>

                    <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: '10px', fontSize: '0.76rem', fontWeight: '800' }}>
                      Done ✓
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No instructions listed.</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button type="button" className="back-btn" onClick={() => setSelectedWorkToView(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 02. Complete All Works Confirmation Modal Window (Identical to Doctor Dashboard Delete Modal) */}
      {selectedWorkToCompleteAll && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '22px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Complete All Work Assignments?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to mark all work instructions as completed for{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                {getPatientDetails(selectedWorkToCompleteAll.PatientID)?.FullName || 'Patient ID: ' + selectedWorkToCompleteAll.PatientID}
              </strong>{' '}
              (<span style={{ color: 'var(--teal-400)', fontWeight: '700' }}>{getPatientDetails(selectedWorkToCompleteAll.PatientID)?.PatientRegID || selectedWorkToCompleteAll.PatientID}</span>)?
            </p>

            {completeAllError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {completeAllError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setSelectedWorkToCompleteAll(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isCompletingAll}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={confirmCompleteAllWork}
              >
                {isCompletingAll ? 'Completing...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
