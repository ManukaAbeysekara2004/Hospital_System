import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Users,
  LogOut,
  Sun,
  Moon,
  Database,
  UserPlus,
  FileText,
  LayoutDashboard,
  CreditCard,
  Settings,
  Stethoscope,
  Calendar,
  HeartPulse,
  Sparkles,
  Clock,
  Bell
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="dash-layout-container">
      {/* Left Sidebar */}
      <aside className="dash-sidebar">
        <div>
          {/* Brand Header */}
          <div className="dash-sidebar-brand">
            <div className="dash-sidebar-logo">
              HMS
            </div>
            <div className="dash-sidebar-brand-text">
              <h3>Apex Health</h3>
              <span>Enterprise Portal</span>
            </div>
          </div>

          {/* Access Role Badge */}
          <div className="dash-sidebar-role-badge">
            <span className="dot"></span>
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Admin</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className="dash-nav-item active">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="dash-nav-item">
              <Users size={18} />
              Patients
            </button>
            <button className="dash-nav-item">
              <Stethoscope size={18} />
              Doctors
            </button>
            <button className="dash-nav-item">
              <Calendar size={18} />
              Appointments
            </button>
            <button className="dash-nav-item">
              <CreditCard size={18} />
              Billing & Payments
            </button>
            <button className="dash-nav-item">
              <Settings size={18} />
              Settings
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-profile-summary">
            <div className="dash-user-avatar">
              {getInitials(user?.FullName || 'Administrator')}
            </div>
            <div className="dash-user-details">
              <h5>{user?.FullName || 'Administrator'}</h5>
              <p>{user?.Email || 'admin@apexhealth.org'}</p>
            </div>
          </div>

          <button className="dash-logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Right Main Content Area */}
      <main className="dash-main-content">
        {/* Top Navbar Header */}
        <header className="dash-top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Login Page Icon & Title */}
          <div className="dash-header-title-box" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="logo-icon-wrapper" style={{ width: '46px', height: '46px', borderRadius: '14px' }}>
              <HeartPulse size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                ApexCare Hospital System
              </h2>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--teal-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Appointments & Internal Operations
              </p>
            </div>
          </div>

          {/* Center: Large Prominent Dashboard Name */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Admin Management Dashboard
            </h3>
          </div>

          {/* Right: Live Greeting, Live Clock & Theme Toggle */}
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

            {/* Sun / Moon Theme Toggle Button */}
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
              ADMINISTRATOR DASHBOARD | Session Active
            </span>
            <h2>Welcome back, {user?.FullName || 'Administrator'}</h2>
            <p>
              Apex Health International Hospital live system administration & access security control. Manage staff accounts, system logs, and hospital metrics.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="dash-hero-action-buttons">
            <button className="dash-action-btn-primary">
              <UserPlus size={16} />
              Add Staff
            </button>
            <button className="dash-action-btn-secondary">
              <ShieldCheck size={16} />
              Approvals
            </button>
            <button className="dash-action-btn-secondary">
              <Database size={16} />
              Logs
            </button>
            <button className="dash-action-btn-secondary">
              <FileText size={16} />
              Reports
            </button>
          </div>
        </div>

        {/* 6 Metric Stat Cards Grid */}
        <div className="dash-stats-grid">
          {/* Card 1 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>TOTAL PATIENTS</span>
              <h3>1,250</h3>
              <p>
                Registered Patients <strong style={{ color: '#10b981', marginLeft: 'auto' }}>↑ 14%</strong>
              </p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
              <Users size={24} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>TOTAL DOCTORS</span>
              <h3>45</h3>
              <p>On Duty & Specialist Staff</p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
              <Stethoscope size={24} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>TOTAL STAFF</span>
              <h3>450+</h3>
              <p>
                Hospital Personnel <strong style={{ color: '#10b981', marginLeft: 'auto' }}>↑ 5%</strong>
              </p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
              <Users size={24} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>VERIFIED ACCOUNTS</span>
              <h3>428</h3>
              <p>Approved Staff Accounts</p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <UserCheck size={24} />
            </div>
          </div>

          {/* Card 5 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>PENDING APPROVALS</span>
              <h3>22</h3>
              <p>Requires Review</p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <Bell size={24} />
            </div>
          </div>

          {/* Card 6 */}
          <div className="dash-stat-card">
            <div className="dash-stat-info">
              <span>SECURITY INDEX</span>
              <h3>99.98%</h3>
              <p>System Health Index</p>
            </div>
            <div className="dash-stat-icon-wrapper" style={{ background: 'rgba(13, 148, 136, 0.15)', color: '#0d9488' }}>
              <Database size={24} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
