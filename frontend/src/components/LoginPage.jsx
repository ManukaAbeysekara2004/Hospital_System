import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Clock,
  PhoneCall,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  HeartPulse,
  UserPlus,
  Stethoscope,
  Pill,
  Receipt,
  Microscope,
  ClipboardList
} from 'lucide-react';
import DoctorRegistration from './DoctorRegistration';
import NurseRegistration from './NurseRegistration';
import AdminRegistration from './AdminRegistration';
import ReceptionistRegistration from './ReceptionistRegistration';
import PharmacistRegistration from './PharmacistRegistration';
import AccountantRegistration from './AccountantRegistration';
import LabStaffRegistration from './LabStaffRegistration';

import AdminDashboard from './dashboards/AdminDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import LabStaffDashboard from './dashboards/LabStaffDashboard';
import NurseDashboard from './dashboards/NurseDashboard';
import PharmacistDashboard from './dashboards/PharmacistDashboard';
import ReceptionistDashboard from './dashboards/ReceptionistDashboard';

import heroImg from '../assets/hospital_hero.png';

export default function LoginPage() {
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('login'); // 'login' | 'register-roles' | 'register-form' | 'dashboard'
  const [selectedRole, setSelectedRole] = useState(null);

  // User session state
  const [currentUser, setCurrentUser] = useState(null);

  // Unapproved Account Modal state
  const [showUnapprovedModal, setShowUnapprovedModal] = useState(false);
  const [unapprovedMessage, setUnapprovedMessage] = useState('');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Time state for live greeting & clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update root attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 7 Backend Login API endpoints
  const loginEndpoints = [
    { role: 'Admin', url: 'http://localhost:5000/api/admin/login' },
    { role: 'Accountant', url: 'http://localhost:5000/api/accountant/login' },
    { role: 'Doctor', url: 'http://localhost:5000/api/doctor/login' },
    { role: 'Laboratory Staff', url: 'http://localhost:5000/api/laboratory_staff/login' },
    { role: 'Nurse', url: 'http://localhost:5000/api/nurse/login' },
    { role: 'Pharmacist', url: 'http://localhost:5000/api/pharmacist/login' },
    { role: 'Receptionist', url: 'http://localhost:5000/api/receptionist/login' }
  ];

  // Role-based authentication handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both your hospital email address and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    let authenticatedUser = null;
    let isUnapproved = false;
    let unapprovedMsg = '';

    for (const ep of loginEndpoints) {
      try {
        const response = await fetch(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: trimmedEmail, Password: password })
        });

        const resData = await response.json();

        // Check if account is not approved yet (HTTP 403 or message check)
        if (response.status === 403 || (resData.message && resData.message.toLowerCase().includes('not been approved'))) {
          isUnapproved = true;
          unapprovedMsg = resData.message || 'Your account has not been approved yet';
          break;
        }

        if (response.ok && (response.status === 200 || response.status === 201)) {
          const userObj = resData.existingAdmin ||
            resData.existingAccountant ||
            resData.existingDoctor ||
            resData.existingLaboratoryStaff ||
            resData.existingNurse ||
            resData.existingPharmacist ||
            resData.existingReceptionist ||
            resData.user ||
            resData.admin ||
            resData.doctor ||
            resData.nurse ||
            resData.receptionist ||
            resData.pharmacist ||
            resData.accountant ||
            resData.laboratoryStaff;

          if (userObj) {
            authenticatedUser = userObj;
          } else {
            authenticatedUser = { Email: trimmedEmail, Role: ep.role };
          }
          break;
        }
      } catch (err) {
        console.error(`Login check error for ${ep.role}:`, err);
      }
    }

    setIsLoading(false);

    if (isUnapproved) {
      setUnapprovedMessage(unapprovedMsg);
      setShowUnapprovedModal(true);
      return;
    }

    if (authenticatedUser) {
      setCurrentUser(authenticatedUser);
      setViewMode('dashboard');
    } else {
      setErrorMessage('Invalid email address or password. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setViewMode('login');
    setErrorMessage('');
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setViewMode('register-form');
    setErrorMessage('');
  };

  // If user is authenticated and viewMode is 'dashboard', render corresponding dashboard
  if (viewMode === 'dashboard' && currentUser) {
    if (currentUser.Role === 'Admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Accountant') return <AccountantDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Doctor') return <DoctorDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Laboratory Staff') return <LabStaffDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Nurse') return <NurseDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Pharmacist') return <PharmacistDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    if (currentUser.Role === 'Receptionist') return <ReceptionistDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
    return <AdminDashboard user={currentUser} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />;
  }

  // 7 Big Registration Role Definitions (3, 3, 1 arrangement)
  const roleList = [
    {
      id: 'doctor',
      title: 'Doctor',
      subtitle: 'Physician & Clinical Care Access',
      description: 'Manage patient consultations, diagnose, & prescribe treatments.',
      icon: Stethoscope,
      color: '#0284c7',
      bgGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(13, 148, 136, 0.2) 100%)',
      borderColor: 'rgba(2, 132, 199, 0.4)'
    },
    {
      id: 'nurse',
      title: 'Nurse',
      subtitle: 'Patient Care & Ward Triage',
      description: 'Record vitals, manage ward beds, & support inpatient care.',
      icon: HeartPulse,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)',
      borderColor: 'rgba(16, 185, 129, 0.4)'
    },
    {
      id: 'admin',
      title: 'Admin',
      subtitle: 'System Administration & Oversight',
      description: 'Manage system settings, staff credentials, & security policies.',
      icon: ShieldCheck,
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.4)'
    },
    {
      id: 'receptionist',
      title: 'Receptionist',
      subtitle: 'Appointments & Patient Desk',
      description: 'Schedule appointments, register patients, & handle front desk.',
      icon: ClipboardList,
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.4)'
    },
    {
      id: 'pharmacist',
      title: 'Pharmacist',
      subtitle: 'Prescriptions & Drug Inventory',
      description: 'Dispense medications, verify prescriptions, & track medicine stock.',
      icon: Pill,
      color: '#ec4899',
      bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)',
      borderColor: 'rgba(236, 72, 153, 0.4)'
    },
    {
      id: 'accountant',
      title: 'Accountant',
      subtitle: 'Billing, Invoices & Financials',
      description: 'Process hospital payments, issue patient bills, & financial reports.',
      icon: Receipt,
      color: '#06b6d4',
      bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.2) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      id: 'laboratory_staff',
      title: 'Laboratory Staff',
      subtitle: 'Diagnostics & Blood/Urine Tests',
      description: 'Conduct lab tests, record test results, & manage diagnostic reports.',
      icon: Microscope,
      color: '#14b8a6',
      bgGradient: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(13, 148, 136, 0.25) 100%)',
      borderColor: 'rgba(20, 184, 166, 0.4)'
    }
  ];

  return (
    <div className="login-container">
      {/* Background ambient lighting effects */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      {/* Top Header Navigation */}
      <header className="top-nav">
        <a href="#home" className="brand-logo" onClick={() => setViewMode('login')}>
          <div className="logo-icon-wrapper">
            <HeartPulse size={30} />
          </div>
          <div className="brand-info">
            <h1>ApexCare Hospital System</h1>
            <span>Appointments & Internal Operations</span>
          </div>
        </a>

        <div className="nav-actions">
          <div className="status-badge">
            <span className="status-dot"></span>
            System Online: Operational (v3.4)
          </div>

          {/* Prominent High-Visibility Hotline Badge */}
          <div className="emergency-chip-prominent">
            <PhoneCall size={18} className="phone-icon-pulse" />
            <span className="hotline-label">Hotline:</span>
            <strong className="hotline-number">+94 77 123 4567</strong>
          </div>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-wrapper">

        {/* VIEW MODE 1: LOGIN PAGE */}
        {viewMode === 'login' && (
          <div className="login-card animate-fade-in">
            {/* Left Side: System Overview */}
            <div className="hero-side">
              <img src={heroImg} alt="ApexCare Hospital Facility" className="hero-bg-img" />
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <div className="hero-tag">
                  <Calendar size={16} />
                  Appointment & Internal Operations System
                </div>
                <h2 className="hero-heading">
                  Smart Hospital Appointment & Internal Management System
                </h2>
                <p className="hero-description">
                  Streamlining patient appointment scheduling, doctor availability, bed allocation, and daily hospital operations in one unified portal.
                </p>

                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <Calendar size={22} />
                    </div>
                    <div className="feature-text">
                      <h4>Appointment Scheduling Portal</h4>
                      <p>Manage outpatient bookings, doctor rosters, and patient consultations efficiently.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <Activity size={22} />
                    </div>
                    <div className="feature-text">
                      <h4>Internal System Operations</h4>
                      <p>Real-time tracking of ward beds, ICU telemetry, pharmacy stock, and staff shifts.</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon-wrapper">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="feature-text">
                      <h4>Secured Hospital Portal</h4>
                      <p>HIPAA & ISO 27001 compliant electronic health record protection.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-footer-stats">
                <div className="stat-item">
                  <h3>3,500+</h3>
                  <p>Monthly Appointments</p>
                </div>
                <div className="stat-item">
                  <h3>99.9%</h3>
                  <p>System Uptime</p>
                </div>
                <div className="stat-item">
                  <h3>450+</h3>
                  <p>Working Hospital Staff</p>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="auth-side">
              <div>
                <div className="auth-header">
                  <div className="greeting-time">
                    <span className="greeting-text">
                      <Sparkles size={15} style={{ display: 'inline', marginRight: '6px' }} />
                      {getGreeting()}
                    </span>
                    <span className="live-clock">
                      <Clock size={15} style={{ display: 'inline', marginRight: '6px' }} />
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <h2 className="auth-title">Login to ApexCare Hospital</h2>
                  <p className="auth-subtitle">
                    Enter your email address and password to access the internal hospital management system.
                  </p>
                </div>

                {errorMessage && (
                  <div className="error-banner animate-fade-in">
                    <AlertCircle size={18} />
                    {errorMessage}
                  </div>
                )}

                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="user-email">
                      Email Address
                    </label>
                    <div className="input-field-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        id="user-email"
                        type="email"
                        className="input-field"
                        placeholder="e.g. staff.member@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="user-password">
                      Password
                    </label>
                    <div className="input-field-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        id="user-password"
                        type={showPassword ? 'text' : 'password'}
                        className="input-field"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-options-centered">
                    <a
                      href="#forgot"
                      className="forgot-link-centered"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link has been dispatched to your official hospital email address.');
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn-large"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin" style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}></div>
                        Authenticating Credentials...
                      </>
                    ) : (
                      <>
                        Login to the system
                        <ArrowRight size={22} />
                      </>
                    )}
                  </button>

                  <div className="registration-notice-box animate-fade-in">
                    <div className="reg-title-row">
                      <UserPlus size={18} className="reg-icon" />
                      <span className="reg-question">Don't have an account?</span>
                      <button
                        type="button"
                        className="register-link-btn"
                        onClick={() => {
                          setViewMode('register-roles');
                          setErrorMessage('');
                        }}
                      >
                        Register here
                      </button>
                    </div>
                    <p className="reg-disclaimer">
                      Only authorized hospital staff can register for an account.
                    </p>
                  </div>
                </form>
              </div>

              <div className="auth-footer">
                <div className="compliance-tag">
                  <ShieldCheck size={16} style={{ color: '#10b981' }} />
                  HIPAA & ISO Certified Medical Portal
                </div>
                <div>
                  System Node #4092 • Restricted Access
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 2: REGISTER ROLE SELECTION PAGE (3, 3, 1 BIG BUTTONS) */}
        {viewMode === 'register-roles' && (
          <div className="register-roles-container animate-fade-in">
            <div className="register-roles-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => setViewMode('login')}
              >
                <ArrowLeft size={18} />
                Back to Login
              </button>

              <h2 className="create-account-title">Create Your Account</h2>
              <p className="create-account-subtitle">
                Select your role to continue with registration.
              </p>
            </div>

            {/* 7 Big Role Buttons Grid: Row 1 (3), Row 2 (3), Row 3 (1) */}
            <div className="roles-grid-layout">
              {/* Row 1: Doctor, Nurse, Admin */}
              <div className="roles-row-three">
                {roleList.slice(0, 3).map((r) => {
                  const IconComp = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="big-role-card"
                      style={{
                        background: r.bgGradient,
                        borderColor: r.borderColor
                      }}
                      onClick={() => handleSelectRole(r)}
                    >
                      <div className="big-role-header">
                        <div className="big-role-icon-badge" style={{ color: r.color, background: 'rgba(255, 255, 255, 0.12)' }}>
                          <IconComp size={32} />
                        </div>
                        <span className="role-tag-chip" style={{ color: r.color }}>Authorized Staff</span>
                      </div>
                      <h3 className="big-role-title">{r.title}</h3>
                      <span className="big-role-subtitle">{r.subtitle}</span>
                      <p className="big-role-desc">{r.description}</p>
                      <div className="big-role-action">
                        <span>Register as {r.title}</span>
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Receptionist, Pharmacist, Accountant */}
              <div className="roles-row-three">
                {roleList.slice(3, 6).map((r) => {
                  const IconComp = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="big-role-card"
                      style={{
                        background: r.bgGradient,
                        borderColor: r.borderColor
                      }}
                      onClick={() => handleSelectRole(r)}
                    >
                      <div className="big-role-header">
                        <div className="big-role-icon-badge" style={{ color: r.color, background: 'rgba(255, 255, 255, 0.12)' }}>
                          <IconComp size={32} />
                        </div>
                        <span className="role-tag-chip" style={{ color: r.color }}>Authorized Staff</span>
                      </div>
                      <h3 className="big-role-title">{r.title}</h3>
                      <span className="big-role-subtitle">{r.subtitle}</span>
                      <p className="big-role-desc">{r.description}</p>
                      <div className="big-role-action">
                        <span>Register as {r.title}</span>
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Laboratory Staff (1 centered) */}
              <div className="roles-row-one">
                {roleList.slice(6, 7).map((r) => {
                  const IconComp = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className="big-role-card big-role-card-wide"
                      style={{
                        background: r.bgGradient,
                        borderColor: r.borderColor
                      }}
                      onClick={() => handleSelectRole(r)}
                    >
                      <div className="big-role-header">
                        <div className="big-role-icon-badge" style={{ color: r.color, background: 'rgba(255, 255, 255, 0.12)' }}>
                          <IconComp size={34} />
                        </div>
                        <span className="role-tag-chip" style={{ color: r.color }}>Diagnostic Staff</span>
                      </div>
                      <h3 className="big-role-title">{r.title}</h3>
                      <span className="big-role-subtitle">{r.subtitle}</span>
                      <p className="big-role-desc">{r.description}</p>
                      <div className="big-role-action">
                        <span>Register as {r.title}</span>
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="register-footer-note">
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              Only verified hospital employees with official credentials can complete registration.
            </div>
          </div>
        )}

        {/* VIEW MODE 3: SPECIFIC ROLE REGISTRATION FORM */}
        {viewMode === 'register-form' && selectedRole && (
          selectedRole.id === 'doctor' ? (
            <DoctorRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'nurse' ? (
            <NurseRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'admin' ? (
            <AdminRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'receptionist' ? (
            <ReceptionistRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'pharmacist' ? (
            <PharmacistRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'accountant' ? (
            <AccountantRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : selectedRole.id === 'laboratory_staff' ? (
            <LabStaffRegistration
              onBackToRoles={() => setViewMode('register-roles')}
              onBackToLogin={() => setViewMode('login')}
            />
          ) : null
        )}

      </main>

      {/* UNAPPROVED ACCOUNT POPUP MODAL */}
      {showUnapprovedModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '32px 28px' }}>
            <div className="modal-icon-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', margin: '0 auto 18px auto', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={36} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ color: '#ef4444', textAlign: 'center', margin: '0 0 12px 0', fontSize: '1.3rem', fontWeight: '800' }}>
              Account Approval Status
            </h3>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '24px', fontWeight: '600', lineHeight: '1.5' }}>
              {unapprovedMessage || 'Your account has not been approved yet'}
            </p>
            <button
              className="modal-action-btn"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', width: '100%', padding: '12px 24px', fontWeight: '700', borderRadius: '10px' }}
              onClick={() => {
                setShowUnapprovedModal(false);
                setEmail('');
                setPassword('');
                setErrorMessage('');
                setViewMode('login');
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
