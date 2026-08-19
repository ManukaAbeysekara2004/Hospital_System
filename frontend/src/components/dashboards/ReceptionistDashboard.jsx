import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  LogOut,
  Calendar,
  Sun,
  Moon,
  UserPlus,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Clock,
  FlaskConical,
  Search,
  Users,
  CheckCircle2,
  X,
  Phone,
  User,
  Stethoscope,
  Pencil,
  AlertCircle,
  Trash2
} from 'lucide-react';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
const months = [
  { value: '01', label: 'January (01)' },
  { value: '02', label: 'February (02)' },
  { value: '03', label: 'March (03)' },
  { value: '04', label: 'April (04)' },
  { value: '05', label: 'May (05)' },
  { value: '06', label: 'June (06)' },
  { value: '07', label: 'July (07)' },
  { value: '08', label: 'August (08)' },
  { value: '09', label: 'September (09)' },
  { value: '10', label: 'October (10)' },
  { value: '11', label: 'November (11)' },
  { value: '12', label: 'December (12)' }
];
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

export default function ReceptionistDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Add Patient Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPatient, setNewPatient] = useState({
    FullName: '',
    NICNumber: '',
    Gender: 'Male',
    dobYear: '2000',
    dobMonth: '01',
    dobDay: '01',
    ContactNumber: '',
    Address: ''
  });

  // Edit Contact Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editContactNumber, setEditContactNumber] = useState('');
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Appointment Modal State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentPatient, setAppointmentPatient] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorForAppt, setSelectedDoctorForAppt] = useState(null);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorFetchError, setDoctorFetchError] = useState('');
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState('');
  const [appointmentError, setAppointmentError] = useState('');

  // Print Appointment Slip Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Open Add Appointment Modal and fetch Doctor Details using Get_Doctor_Details endpoint
  const handleOpenAddAppointmentModal = async (patient) => {
    setAppointmentPatient(patient);
    setShowAppointmentModal(true);
    setAppointmentSuccess('');
    setAppointmentError('');
    setDoctorFetchError('');
    setIsLoadingDoctors(true);
    setDoctorsList([]);
    setSelectedDoctorForAppt(null);

    try {
      const response = await fetch('http://localhost:5000/api/doctor/get-all-doctor-details');
      const data = await response.json();

      if (response.ok && data.allDoctor) {
        // Fetch each doctor details via Get_Doctor_Details endpoint (/api/doctor/details/:doctorId)
        const detailedDoctors = await Promise.all(
          data.allDoctor.map(async (doc) => {
            try {
              const docRes = await fetch(`http://localhost:5000/api/doctor/details/${doc._id}`);
              const docData = await docRes.json();
              if (docRes.ok && docData.doctorDetails) {
                return docData.doctorDetails;
              }
            } catch (e) {
              console.error(`Error fetching doctor details for ${doc._id}:`, e);
            }
            return doc;
          })
        );

        // 01 & 04: Sort doctors: Both true (InHospitalAvailability && !StopAppointments) first, then by NoOfAppointments ascending (lowest on top)
        const sortedDoctors = [...detailedDoctors].sort((a, b) => {
          const availA = a.InHospitalAvailability === true && !a.StopAppointments;
          const availB = b.InHospitalAvailability === true && !b.StopAppointments;

          if (availA && !availB) return -1;
          if (!availA && availB) return 1;

          const countA = typeof a.NoOfAppointments === 'number' ? a.NoOfAppointments : 0;
          const countB = typeof b.NoOfAppointments === 'number' ? b.NoOfAppointments : 0;

          return countA - countB;
        });

        setDoctorsList(sortedDoctors);

        // Auto-select top available doctor with lowest NoOfAppointments
        const firstAvailable = sortedDoctors.find(
          (d) => d.InHospitalAvailability === true && !d.StopAppointments
        );
        setSelectedDoctorForAppt(firstAvailable || null);
      } else {
        setDoctorFetchError(data.message || 'Failed to fetch doctors.');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctorFetchError('Could not connect to backend server to load doctors.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  // Submit Handler for Creating Appointment (calls Add_Appointment in Appointment_Controller.js)
  const handleSelectDoctorAndCreateAppointment = async (doctorTarget) => {
    const doctor = doctorTarget || selectedDoctorForAppt;
    if (!appointmentPatient || !doctor) return;

    setIsCreatingAppointment(true);
    setAppointmentSuccess('');
    setAppointmentError('');

    const patientId = appointmentPatient._id;
    const doctorId = doctor._id;
    const billPricesId = '6a80c93ebfa6d7d230ce2a27';

    try {
      const response = await fetch(`http://localhost:5000/api/appointment/add-appointment/${patientId}/${doctorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BillPricesID: billPricesId
        })
      });

      const resData = await response.json();

      if (response.ok) {
        // Set print slip data with PatientRegID and Doctor RoomNumber
        setPrintData({
          patientRegId: appointmentPatient.PatientRegID,
          patientName: appointmentPatient.FullName,
          doctorName: doctor.FullName,
          roomNumber: doctor.RoomNumber || 'N/A',
          fee: resData.newAppointment?.Fee || 1500,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // Close Add Appointment window immediately
        setShowAppointmentModal(false);
        setAppointmentSuccess('');

        // Open Print Slip window
        setShowPrintModal(true);

        fetchPatients();
      } else {
        setAppointmentError(resData.message || 'Failed to create appointment.');
      }
    } catch (err) {
      console.error('Error creating appointment:', err);
      setAppointmentError('Could not connect to server to create appointment.');
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all patients from backend
  const fetchPatients = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/patient/get-all-patients');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allPatients || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (b.PatientRegID || '').localeCompare(a.PatientRegID || '');
        });
        setPatients(sorted);
      } else {
        setApiError(data.message || 'Failed to fetch patients.');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'EW';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredPatients = patients.filter(patient => {
    const q = searchQuery.toLowerCase();
    return (
      (patient.FullName && patient.FullName.toLowerCase().includes(q)) ||
      (patient.PatientRegID && patient.PatientRegID.toLowerCase().includes(q)) ||
      (patient.ContactNumber && patient.ContactNumber.includes(q)) ||
      (patient.NICNumber && patient.NICNumber.toLowerCase().includes(q))
    );
  });

  const handleSearch = () => {
    // Search is handled dynamically by filteredPatients
  };

  // Submit Handler for Adding Patient (calls Add_Patient_Record in Patient_Controller.js)
  const handleAddPatientSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!newPatient.FullName.trim()) {
      setModalError('Please enter Full Name.');
      return;
    }
    if (!newPatient.NICNumber.trim()) {
      setModalError('Please enter NIC Number.');
      return;
    }
    if (!/^\d{10}$/.test(newPatient.ContactNumber.trim())) {
      setModalError('Contact Number must contain exactly 10 digits.');
      return;
    }
    if (!newPatient.Address.trim()) {
      setModalError('Please enter Address.');
      return;
    }

    const assembledDOB = `${newPatient.dobYear}-${newPatient.dobMonth}-${newPatient.dobDay}`;

    const payload = {
      FullName: newPatient.FullName.trim(),
      NICNumber: newPatient.NICNumber.trim(),
      Gender: newPatient.Gender,
      DateOfBirth: assembledDOB,
      ContactNumber: newPatient.ContactNumber.trim(),
      Address: newPatient.Address.trim()
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/patient/add-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (response.ok) {
        setIsSubmitting(false);
        setShowAddModal(false);
        setNewPatient({
          FullName: '',
          NICNumber: '',
          Gender: 'Male',
          dobYear: '2000',
          dobMonth: '01',
          dobDay: '01',
          ContactNumber: '',
          Address: ''
        });
        fetchPatients();
      } else {
        setIsSubmitting(false);
        setModalError(resData.message || resData.error || 'Failed to add patient.');
      }
    } catch (err) {
      console.error('Error adding patient:', err);
      setIsSubmitting(false);
      setModalError('Could not connect to backend server.');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setEditContactNumber(patient.ContactNumber || '');
    setEditError('');
    setShowEditModal(true);
  };

  // Submit Handler for Updating Contact Number
  const handleUpdateContactSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!/^\d{10}$/.test(editContactNumber.trim())) {
      setEditError('Contact Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`http://localhost:5000/api/patient/update-contact-number/${selectedPatient._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ContactNumber: editContactNumber.trim() })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsUpdating(false);
        setShowEditModal(false);
        setSelectedPatient(null);
        fetchPatients();
      } else {
        setIsUpdating(false);
        setEditError(resData.message || 'Failed to update contact number.');
      }
    } catch (err) {
      console.error('Error updating contact number:', err);
      setIsUpdating(false);
      setEditError('Could not connect to backend server.');
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  // Confirm and Execute Patient Deletion
  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/patient/delete/${patientToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        setPatientToDelete(null);
        fetchPatients();
      } else {
        setIsDeleting(false);
        alert(resData.message || 'Failed to delete patient record.');
      }
    } catch (err) {
      console.error('Error deleting patient:', err);
      setIsDeleting(false);
      alert('Could not connect to backend server to delete patient.');
    }
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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Receptionist</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className="dash-nav-item active">
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className="dash-nav-item">
              <Calendar size={18} />
              Appointments
            </button>
            <button className="dash-nav-item">
              <Stethoscope size={18} />
              Doctors
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
              {getInitials(user?.FullName || 'Emily Watson')}
            </div>
            <div className="dash-user-details">
              <h5>{user?.FullName || 'Emily Watson'}</h5>
              <p>{user?.Email || 'receptionist@apexhealth.org'}</p>
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
              Receptionist Management Dashboard
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
              RECEPTIONIST DASHBOARD | Session Active
            </span>
            <h2>Welcome back, {user?.FullName || 'Emily Watson'}</h2>
            <p>
              Apex Health International Hospital live operations overview. Manage patient registrations, appointment booking, and desk support operations.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="dash-hero-action-buttons">
            <button className="dash-action-btn-primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={16} />
              Add Patient
            </button>
            <button className="dash-action-btn-secondary">
              <Calendar size={16} />
              Book Appt
            </button>
            <button className="dash-action-btn-secondary">
              <FlaskConical size={16} />
              Request Lab
            </button>
            <button className="dash-action-btn-secondary">
              <FileText size={16} />
              Invoice
            </button>
          </div>
        </div>

        {/* Search Bar & Add Patient Button Toolbar Under Welcome Back Box */}
        <div className="dash-search-toolbar">
          {/* Left Spacer so search box is dead center */}
          <div className="dash-toolbar-left-space" />

          {/* Center Search Bar & Search Button */}
          <div className="dash-search-center-group">
            <div className="dash-search-input-wrapper">
              <Search size={18} className="dash-search-icon" />
              <input
                type="text"
                placeholder="Search by Patient Name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dash-search-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="dash-search-btn" onClick={handleSearch}>
              <Search size={16} />
              Search
            </button>
          </div>

          {/* Right Corner: Add Patient Button */}
          <div className="dash-toolbar-right-group">
            <button className="dash-add-patient-btn" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} />
              Add Patient
            </button>
          </div>
        </div>

        {/* Patient Details Table */}
        <div className="dash-patient-section">
          <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} style={{ color: 'var(--teal-400)' }} />
              Patient Details
            </h3>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Showing {filteredPatients.length} of {patients.length} patients
            </span>
          </div>

          {apiError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              {apiError}
            </div>
          )}

          <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient ID</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800' }}>Name</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800' }}>Gender</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800' }}>Contact Number</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id || patient.PatientRegID} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{patient.PatientRegID}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{patient.FullName}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{patient.NICNumber || 'N/A'}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{patient.Gender}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{patient.ContactNumber}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <button
                            className="dash-search-btn"
                            style={{ padding: '8px 18px', fontSize: '0.9rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '7px' }}
                            onClick={() => handleOpenAddAppointmentModal(patient)}
                          >
                            <Calendar size={16} />
                            Add Appointment
                          </button>
                          <button
                            className="icon-btn"
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: 'rgba(2, 132, 199, 0.18)',
                              color: '#0284c7',
                              border: '1px solid rgba(2, 132, 199, 0.35)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            title="Edit Contact Number"
                            onClick={() => handleOpenEditModal(patient)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="icon-btn"
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            title="Delete Patient Record"
                            onClick={() => handleOpenDeleteModal(patient)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                      {isLoading ? 'Loading patient details...' : searchQuery ? `No patient matches found for "${searchQuery}".` : 'No patient records registered yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Adding New Patient */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '780px', width: '92%', textAlign: 'left', padding: '40px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)' }}>Register New Patient</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.92rem', color: 'var(--text-muted)' }}>Enter complete patient details below</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Close Window"
              >
                <X size={28} />
              </button>
            </div>

            {modalError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddPatientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.FullName}
                    onChange={(e) => setNewPatient({ ...newPatient, FullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>NIC Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 199512345678"
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.NICNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, NICNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>Gender *</label>
                  <select
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.Gender}
                    onChange={(e) => setNewPatient({ ...newPatient, Gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>
                    Contact Number * <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)' }}>(10 Digits)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 0771234567"
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.ContactNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, ContactNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>
                  Date Of Birth * <span style={{ fontSize: '0.82rem', color: 'var(--teal-400)' }}>(Formatted YYYY-MM-DD: {newPatient.dobYear}-{newPatient.dobMonth}-{newPatient.dobDay})</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <select
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.dobYear}
                    onChange={(e) => setNewPatient({ ...newPatient, dobYear: e.target.value })}
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y} (Year)</option>
                    ))}
                  </select>

                  <select
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.dobMonth}
                    onChange={(e) => setNewPatient({ ...newPatient, dobMonth: e.target.value })}
                  >
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>

                  <select
                    className="input-field"
                    style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                    value={newPatient.dobDay}
                    onChange={(e) => setNewPatient({ ...newPatient, dobDay: e.target.value })}
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d} (Day)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.92rem', marginBottom: '8px' }}>Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No 123, Main Street, Colombo 03"
                  className="input-field"
                  style={{ padding: '14px 16px', fontSize: '0.95rem' }}
                  value={newPatient.Address}
                  onChange={(e) => setNewPatient({ ...newPatient, Address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="back-btn"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', fontSize: '0.95rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="dash-add-patient-btn"
                  style={{ flex: 2, justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '0.98rem' }}
                >
                  {isSubmitting ? (
                    'Saving...'
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Contact Number */}
      {showEditModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'left', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.18)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>Edit Patient Contact</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedPatient.FullName} ({selectedPatient.PatientRegID})</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {editError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">New Contact Number * (10 digits)</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 0771234567"
                  className="input-field"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="back-btn"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="dash-add-patient-btn"
                  style={{ flex: 1.5, justifyContent: 'center', background: '#0284c7' }}
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Window */}
      {showDeleteModal && patientToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertCircle size={32} />
            </div>

            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Are you sure you want to delete this patient?
            </h3>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => {
                  setShowDeleteModal(false);
                  setPatientToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={handleConfirmDelete}
              >
                {isDeleting ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Appointment Window / Modal */}
      {showAppointmentModal && appointmentPatient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', width: '92%', textAlign: 'left', padding: '38px', borderRadius: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={26} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>Add Patient Appointment</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>Select an available doctor to issue an appointment</p>
                </div>
              </div>
              <button
                onClick={() => setShowAppointmentModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Close Window"
              >
                <X size={24} />
              </button>
            </div>

            {/* Patient Info Header (PatientRegID Big, Center and Top) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.12) 0%, rgba(20, 184, 166, 0.06) 100%)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                PATIENT REGISTRATION ID
              </span>
              <h1 style={{
                fontSize: '2.6rem',
                fontWeight: '900',
                margin: '4px 0 6px 0',
                color: 'var(--teal-400)',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-heading)'
              }}>
                {appointmentPatient.PatientRegID}
              </h1>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                {appointmentPatient.FullName}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                <span>Gender: <strong style={{ color: 'var(--text-main)' }}>{appointmentPatient.Gender}</strong></span>
                <span>NIC: <strong style={{ color: 'var(--text-main)' }}>{appointmentPatient.NICNumber || 'N/A'}</strong></span>
                <span>Phone: <strong style={{ color: 'var(--text-main)' }}>{appointmentPatient.ContactNumber}</strong></span>
              </div>
            </div>

            {/* Feedback Alerts */}
            {appointmentSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700' }}>
                <CheckCircle2 size={22} />
                {appointmentSuccess}
              </div>
            )}

            {appointmentError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                <AlertCircle size={22} />
                {appointmentError}
              </div>
            )}

            {doctorFetchError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', marginBottom: '20px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' }}>
                <AlertCircle size={22} />
                {doctorFetchError}
              </div>
            )}

            {/* Available Doctors Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={20} style={{ color: 'var(--teal-400)' }} />
                Available Doctors
              </h4>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Select a doctor from the list below
              </span>
            </div>

            {/* Doctors List */}
            <div style={{ maxHeight: '440px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {isLoadingDoctors ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Loading doctor details via Get_Doctor_Details...
                </div>
              ) : doctorsList.length > 0 ? (
                doctorsList.map((doc) => {
                  const isAvailable = doc.InHospitalAvailability === true && !doc.StopAppointments;
                  const isSelected = selectedDoctorForAppt?._id === doc._id;

                  return (
                    <div
                      key={doc._id}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedDoctorForAppt(doc);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '2px solid #10b981' : '1px solid var(--border-color)',
                        borderRadius: '16px',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: isAvailable ? (isSelected ? '#10b981' : 'rgba(16, 185, 129, 0.15)') : 'rgba(255, 255, 255, 0.06)',
                          color: isAvailable ? (isSelected ? '#ffffff' : '#10b981') : '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}>
                          <Stethoscope size={22} />
                        </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              Dr. {doc.FullName}
                              <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#2dd4bf', background: 'rgba(45, 212, 191, 0.2)', border: '1px solid rgba(45, 212, 191, 0.4)', padding: '4px 12px', borderRadius: '8px' }}>
                                Room: {doc.RoomNumber || 'N/A'}
                              </span>
                            </div>
                            <div style={{ fontSize: '1.02rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>Appointments:</span>
                              <strong style={{ color: !doc.StopAppointments ? '#10b981' : '#ef4444', fontSize: '1.08rem', fontWeight: '900', background: !doc.StopAppointments ? 'rgba(16, 185, 129, 0.18)' : 'rgba(239, 68, 68, 0.18)', padding: '3px 10px', borderRadius: '8px', border: !doc.StopAppointments ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)' }}>
                                {!doc.StopAppointments ? `Active (${doc.NoOfAppointments ?? 0})` : `Stopped (${doc.NoOfAppointments ?? 0})`}
                              </strong>
                            </div>
                          </div>
                      </div>

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) {
                            setSelectedDoctorForAppt(doc);
                          }
                        }}
                        style={{
                          padding: '10px 22px',
                          borderRadius: '12px',
                          fontWeight: '800',
                          fontSize: '0.92rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          background: isAvailable
                            ? (isSelected ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.15)')
                            : '#4b5563',
                          color: isAvailable ? (isSelected ? '#ffffff' : '#10b981') : '#9ca3af',
                          border: isAvailable ? (isSelected ? 'none' : '1px solid rgba(16, 185, 129, 0.3)') : '1px solid rgba(255, 255, 255, 0.1)',
                          opacity: isAvailable ? 1 : 0.6,
                          boxShadow: (isAvailable && isSelected) ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '100px'
                        }}
                      >
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  No doctors found in the system.
                </div>
              )}
            </div>

            {/* Bottom Footer with Create Appointment Button */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ padding: '12px 22px', borderRadius: '12px', fontSize: '0.95rem' }}
                onClick={() => setShowAppointmentModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedDoctorForAppt || isCreatingAppointment}
                onClick={() => handleSelectDoctorAndCreateAppointment(selectedDoctorForAppt)}
                style={{
                  padding: '12px 30px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.98rem',
                  cursor: (selectedDoctorForAppt && !isCreatingAppointment) ? 'pointer' : 'not-allowed',
                  background: (selectedDoctorForAppt && !isCreatingAppointment)
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#4b5563',
                  color: selectedDoctorForAppt ? '#ffffff' : '#9ca3af',
                  border: 'none',
                  opacity: (selectedDoctorForAppt && !isCreatingAppointment) ? 1 : 0.6,
                  boxShadow: selectedDoctorForAppt ? '0 4px 16px rgba(16, 185, 129, 0.4)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Calendar size={18} />
                {isCreatingAppointment ? 'Creating Appointment...' : 'Create Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Appointment Ticket Window / Modal */}
      {showPrintModal && printData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '540px', width: '92%', textAlign: 'center', padding: '36px', borderRadius: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Appointment Ticket Created</h3>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  cursor: 'pointer'
                }}
                title="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Printable Slip Card Area */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '2px dashed var(--teal-400)',
                borderRadius: '20px',
                padding: '28px 24px',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal-400)', fontWeight: '800', marginBottom: '4px' }}>
                ApexCare Hospital System
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 20px 0', color: 'var(--text-main)' }}>
                Official Appointment Token
              </h2>

              {/* Patient PatientRegID (Big, Center and Top) */}
              <div style={{ background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '16px', padding: '18px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  PATIENT ID
                </span>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--teal-400)', letterSpacing: '0.05em', margin: '4px 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                  {printData.patientRegId}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {printData.patientName}
                </div>
              </div>

              {/* Doctor Name & Room Number (Big, Center and Clear) */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  ASSIGNED CONSULTATION ROOM
                </span>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: '900',
                  color: '#2dd4bf',
                  background: 'rgba(45, 212, 191, 0.22)',
                  border: '2px solid rgba(45, 212, 191, 0.4)',
                  borderRadius: '14px',
                  padding: '10px 20px',
                  display: 'inline-block',
                  margin: '8px 0 12px 0'
                }}>
                  Room: {printData.roomNumber}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Dr. {printData.doctorName}
                </div>
              </div>

              {/* Date & Time Footer info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', fontSize: '0.86rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <span>Date: <strong style={{ color: 'var(--text-main)' }}>{printData.date}</strong></span>
                <span>Time: <strong style={{ color: 'var(--text-main)' }}>{printData.time}</strong></span>
                <span>Fee: <strong style={{ color: '#10b981' }}>Rs. {printData.fee}</strong></span>
              </div>
            </div>

            {/* Print & Close Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setShowPrintModal(false)}
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
                Print Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


