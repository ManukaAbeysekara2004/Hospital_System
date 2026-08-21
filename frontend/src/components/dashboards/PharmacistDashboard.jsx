import React, { useState, useEffect } from 'react';
import {
  Pill,
  LogOut,
  Clock,
  Sun,
  Moon,
  LayoutDashboard,
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
  Search,
  Plus,
  Edit,
  FileText,
  DollarSign,
  PackageCheck,
  Boxes
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  issued_medicine: 'Issued Medicine Records',
  medicine_management: 'Medicine Management',
  stock: 'Stock Status & Level Tracking',
  settings: 'Account Settings'
};

export default function PharmacistDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pharmacist Settings State
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

  // Medicines State
  const [medicines, setMedicines] = useState([]);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // CompleteStatus False Medicine Bills State (Dashboard)
  const [pendingBills, setPendingBills] = useState([]);
  const [isLoadingPendingBills, setIsLoadingPendingBills] = useState(false);
  const [dashSearchQuery, setDashSearchQuery] = useState('');

  // CompleteStatus True Medicine Bills State (Issued Medicine)
  const [issuedBills, setIssuedBills] = useState([]);
  const [isLoadingIssuedBills, setIsLoadingIssuedBills] = useState(false);
  const [issuedSearchQuery, setIssuedSearchQuery] = useState('');

  // Patient & Doctor Lookup Lists
  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  // Bill Details & Print Modals State
  const [selectedBillForDetails, setSelectedBillForDetails] = useState(null);
  const [isCompletingBill, setIsCompletingBill] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printBillData, setPrintBillData] = useState(null);

  // Add Medicine Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTabletName, setAddTabletName] = useState('');
  const [addQuantity, setAddQuantity] = useState('');
  const [addUnitPrice, setAddUnitPrice] = useState('');
  const [addError, setAddError] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Edit Medicine Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnitPrice, setEditUnitPrice] = useState('');
  const [editError, setEditError] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

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

  const pharmacistId = user?._id || user?.id || user?.existingPharmacist?._id || myDetails?._id;

  const fetchPatientsAndDoctors = async () => {
    try {
      const [pRes, dRes] = await Promise.all([
        fetch('http://localhost:5000/api/patient/get-all-patients').catch(() => null),
        fetch('http://localhost:5000/api/doctor/get-all-doctor-details').catch(() => null)
      ]);
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setPatientsList(pData.allPatients || pData.getAllPatients || pData.patients || (Array.isArray(pData) ? pData : []));
      }
      if (dRes && dRes.ok) {
        const dData = await dRes.json();
        setDoctorsList(dData.allDoctor || dData.getAllDoctorDetails || dData.doctors || (Array.isArray(dData) ? dData : []));
      }
    } catch (err) {
      console.error('Error fetching patients or doctors:', err);
    }
  };

  const fetchMyDetails = async () => {
    if (!pharmacistId) return;
    setIsLoadingMyDetails(true);
    setMyDetailsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/pharmacist/details/${pharmacistId}`);
      const data = await response.json();
      if (response.ok) {
        const details = data.existingPharmacist || data.pharmacistDetails || data.pharmacist;
        setMyDetails(details);
        setNewPhone(details?.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load pharmacist details.');
      }
    } catch (err) {
      console.error('Error fetching pharmacist details:', err);
      setMyDetailsError('Could not connect to backend server.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  // Show all available medicine using get_All_Medicine_Details function
  const fetchMedicines = async () => {
    setIsLoadingMedicines(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicine/get-all-medicine-details');
      if (response.ok) {
        const data = await response.json();
        setMedicines(data.getAllMedicine || data.allMedicine || data.medicines || []);
      }
    } catch (e) {
      console.error('Error fetching medicines:', e);
    } finally {
      setIsLoadingMedicines(false);
    }
  };

  // Call get_Complete_Status_False_Medicine_Bill function
  const fetchPendingBills = async () => {
    setIsLoadingPendingBills(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicine/get-complete-status-false-medicine-bill');
      if (response.ok) {
        const data = await response.json();
        const bills = data.complete_Status_False_MedicineBill || data.complete_Status_False_MedicineBills || [];
        setPendingBills(Array.isArray(bills) ? bills : bills ? [bills] : []);
      }
    } catch (e) {
      console.error('Error fetching pending bills:', e);
    } finally {
      setIsLoadingPendingBills(false);
    }
  };

  // Call get_Complete_Status_True_Medicine_Bill function
  const fetchIssuedBills = async () => {
    setIsLoadingIssuedBills(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicine/get-complete-status-true-medicine-bill');
      if (response.ok) {
        const data = await response.json();
        const bills = data.complete_Status_True_MedicineBill || data.complete_Status_True_MedicineBills || [];
        setIssuedBills(Array.isArray(bills) ? bills : bills ? [bills] : []);
      }
    } catch (e) {
      console.error('Error fetching issued bills:', e);
    } finally {
      setIsLoadingIssuedBills(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchPendingBills();
    fetchIssuedBills();
    fetchPatientsAndDoctors();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchPendingBills();
      fetchPatientsAndDoctors();
    } else if (activeTab === 'issued_medicine') {
      fetchIssuedBills();
      fetchPatientsAndDoctors();
    } else if (activeTab === 'medicine_management' || activeTab === 'stock') {
      fetchMedicines();
    } else if (activeTab === 'settings') {
      fetchMyDetails();
    }
  }, [activeTab]);

  const getPatientDetails = (patientId) => {
    if (!patientId) return null;
    if (typeof patientId === 'object' && (patientId.PatientRegID || patientId.FullName)) return patientId;
    const pStr = String(patientId).trim().toLowerCase();
    return patientsList.find(p =>
      String(p._id).toLowerCase() === pStr ||
      String(p.PatientID || '').toLowerCase() === pStr ||
      String(p.PatientRegID || '').toLowerCase() === pStr ||
      String(p.NICNumber || '').toLowerCase() === pStr
    ) || null;
  };

  const getDoctorDetails = (doctorId) => {
    if (!doctorId) return null;
    if (typeof doctorId === 'object' && doctorId.FullName) return doctorId;
    const dStr = String(doctorId).trim().toLowerCase();
    return doctorsList.find(d =>
      String(d._id).toLowerCase() === dStr ||
      String(d.DoctorID || '').toLowerCase() === dStr ||
      String(d.FullName || '').toLowerCase() === dStr ||
      `dr. ${String(d.FullName || '').toLowerCase()}` === dStr
    ) || null;
  };

  // Call update_Complete_Status to set CompleteStatus = true and trigger print modal
  const handleCompleteBill = async (bill) => {
    if (!bill || !bill._id) return;
    setIsCompletingBill(true);
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/update-complete-status/${bill._id}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        const patientObj = getPatientDetails(bill.PatientID);
        const doctorObj = getDoctorDetails(bill.DoctorID);

        const printData = {
          billId: bill._id,
          patientRegId: patientObj?.PatientRegID || bill.PatientID,
          patientName: patientObj?.FullName || 'Patient',
          doctorName: doctorObj?.FullName ? `Dr. ${doctorObj.FullName}` : (String(bill.DoctorID).startsWith('Dr.') ? bill.DoctorID : `Dr. ${bill.DoctorID}`),
          addedMedicines: bill.Added_Medicines ? bill.Added_Medicines.filter(m => m.Added === true || m.Added === 'true') : [],
          unavailableMedicines: bill.Added_Medicines ? bill.Added_Medicines.filter(m => m.Added === false || m.Added === 'false' || m.Price === 0 || !m.Added) : [],
          totalBill: bill.Total_Bill || 0,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setSelectedBillForDetails(null);
        setPrintBillData(printData);
        setShowPrintModal(true);

        // Call update_Medicine_PaidStatus_And_Full_Payment on Payment_Controller (Item 12)
        try {
          await fetch(`http://localhost:5000/api/payment/update-medicine-paidstatus-and-full-payment/${bill._id}/${bill.PatientID}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Error updating medicine paid status & full payment:', e);
        }

        fetchPendingBills();
        fetchIssuedBills();
      }
    } catch (err) {
      console.error('Error updating complete status:', err);
    } finally {
      setIsCompletingBill(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'PH';
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

  // Add Medicine using add_Medicine function
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!addTabletName.trim()) {
      setAddError('Please enter a Tablet Name.');
      return;
    }
    if (addQuantity === '' || Number(addQuantity) < 0) {
      setAddError('Please enter a valid non-negative Quantity.');
      return;
    }
    if (addUnitPrice === '' || Number(addUnitPrice) < 0) {
      setAddError('Please enter a valid non-negative Unit Price.');
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicine/add-medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TabletName: addTabletName.trim(),
          Quantity: Number(addQuantity),
          UnitPrice: Number(addUnitPrice)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setShowAddModal(false);
        setAddTabletName('');
        setAddQuantity('');
        setAddUnitPrice('');
        fetchMedicines();
      } else {
        setAddError(data.message || 'Failed to add medicine.');
      }
    } catch (err) {
      console.error('Error adding medicine:', err);
      setAddError('Could not connect to backend server.');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // Open Edit Modal & update Quantity and UnitPrice using update_Medicine_Quantity and update_Medicine_UnitPrice
  const openEditModal = (med) => {
    setSelectedMedicine(med);
    setEditQuantity(med.Quantity !== undefined ? med.Quantity : '');
    setEditUnitPrice(med.UnitPrice !== undefined ? med.UnitPrice : '');
    setEditError('');
    setShowEditModal(true);
  };

  const handleUpdateMedicineSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedicine) return;
    setEditError('');

    if (editQuantity === '' || Number(editQuantity) < 0) {
      setEditError('Please enter a valid non-negative Quantity.');
      return;
    }
    if (editUnitPrice === '' || Number(editUnitPrice) < 0) {
      setEditError('Please enter a valid non-negative Unit Price.');
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const medId = selectedMedicine._id;

      // Update Quantity
      const qtyRes = await fetch(`http://localhost:5000/api/medicine/update-medicine-quantity/${medId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Quantity: Number(editQuantity) })
      });

      // Update UnitPrice
      const priceRes = await fetch(`http://localhost:5000/api/medicine/update-medicine-unitprice/${medId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UnitPrice: Number(editUnitPrice) })
      });

      if (qtyRes.ok && priceRes.ok) {
        setShowEditModal(false);
        setSelectedMedicine(null);
        fetchMedicines();
      } else {
        const qtyData = !qtyRes.ok ? await qtyRes.json() : null;
        const priceData = !priceRes.ok ? await priceRes.json() : null;
        setEditError(qtyData?.message || priceData?.message || 'Failed to update medicine details.');
      }
    } catch (err) {
      console.error('Error updating medicine:', err);
      setEditError('Could not connect to backend server.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Delete Medicine Confirmation Modal State
  const [showDeleteMedModal, setShowDeleteMedModal] = useState(false);
  const [medToDelete, setMedToDelete] = useState(null);
  const [isDeletingMed, setIsDeletingMed] = useState(false);
  const [deleteMedError, setDeleteMedError] = useState('');

  // Open Delete Medicine Modal
  const handleOpenDeleteMedModal = (med) => {
    setMedToDelete(med);
    setDeleteMedError('');
    setShowDeleteMedModal(true);
  };

  // Confirm and Execute Delete_Medicine Call
  const handleConfirmDeleteMedicine = async () => {
    if (!medToDelete) return;
    setIsDeletingMed(true);
    setDeleteMedError('');

    try {
      const response = await fetch(`http://localhost:5000/api/medicine/delete-medicine/${medToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingMed(false);
        setShowDeleteMedModal(false);
        setMedToDelete(null);
        fetchMedicines();
      } else {
        setIsDeletingMed(false);
        setDeleteMedError(resData.message || 'Failed to delete medicine.');
      }
    } catch (err) {
      console.error('Error deleting medicine:', err);
      setIsDeletingMed(false);
      setDeleteMedError('Could not connect to backend server to delete medicine.');
    }
  };

  const handleUpdatePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');

    if (!pharmacistId) {
      setPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newPhone.trim())) {
      setPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await fetch(`http://localhost:5000/api/pharmacist/update-phone-number/${pharmacistId}`, {
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

    if (!pharmacistId) {
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
      const response = await fetch(`http://localhost:5000/api/pharmacist/update-password/${pharmacistId}`, {
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

    if (!pharmacistId) {
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
      const response = await fetch(`http://localhost:5000/api/pharmacist/delete/${pharmacistId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacistId: pharmacistId,
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
      console.error('Error deleting pharmacist account:', err);
      setIsDeleting(false);
      setDeleteError('Could not connect to backend server.');
    }
  };

  // Search filter by TabletName
  const filteredMedicines = medicines.filter(m =>
    (m.TabletName || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Pharmacist</strong>
          </div>

          {/* Sidebar Nav Items: Dashboard, Issued Medicine, Medicine Management, Stock, Settings */}
          <nav className="dash-sidebar-nav">
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'issued_medicine' ? 'active' : ''}`} onClick={() => setActiveTab('issued_medicine')}>
              <FileText size={18} />
              Issued Medicine
            </button>
            <button className={`dash-nav-item ${activeTab === 'medicine_management' ? 'active' : ''}`} onClick={() => setActiveTab('medicine_management')}>
              <Pill size={18} />
              Medicine Management
            </button>
            <button className={`dash-nav-item ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>
              <Boxes size={18} />
              Medicine Stock
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
              {getInitials(myDetails?.FullName || user?.FullName || 'Pharmacist')}
            </div>
            <div className="dash-user-details">
              <h5>{myDetails?.FullName || user?.FullName || 'Pharmacist'}</h5>
              <p>{myDetails?.Email || user?.Email || 'pharmacist@apexhealth.org'}</p>
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
                Pharmacy & Pharmaceutical Supplies
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Pharmacy Management Dashboard
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
              PHARMACY DASHBOARD | Session Active
            </span>
            <h2>Welcome back, {myDetails?.FullName || user?.FullName || 'Pharmacist'}</h2>
            {activeTab === 'dashboard' && (
              <p>
                Apex Health pharmaceutical distribution portal. Manage drug inventory stock levels, prescription fulfillment, batch tracking, and pharmaceutical billing.
              </p>
            )}
          </div>

          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW - CompleteStatus: false Medicine Bills */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            {/* Search bar on top to search by Patient Reg ID or NIC */}
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="dash-search-input-wrapper" style={{ flex: 1, minWidth: '280px', height: '46px' }}>
                <Search size={18} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search medicine bill by Patient Reg ID or NIC..."
                  value={dashSearchQuery}
                  onChange={(e) => setDashSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
                {dashSearchQuery && (
                  <button
                    onClick={() => setDashSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 10px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={fetchPendingBills}
                disabled={isLoadingPendingBills}
                className="dash-search-btn"
                style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={16} className={isLoadingPendingBills ? 'spin-icon' : ''} />
                {isLoadingPendingBills ? 'Refreshing...' : 'Refresh Bills'}
              </button>
            </div>

            {/* List of CompleteStatus: false Medicine Bills */}
            {isLoadingPendingBills ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <RefreshCw size={20} className="spin-icon" />
                Loading pending medicine bills...
              </div>
            ) : (() => {
              const filteredPendingBills = pendingBills.filter((bill) => {
                if (!dashSearchQuery.trim()) return true;
                const q = dashSearchQuery.toLowerCase().trim();
                const patientObj = getPatientDetails(bill.PatientID);
                const regId = (patientObj?.PatientRegID || bill.PatientID || '').toLowerCase();
                const nic = (patientObj?.NICNumber || patientObj?.NICPassportNumber || '').toLowerCase();
                const pName = (patientObj?.FullName || '').toLowerCase();
                return regId.includes(q) || nic.includes(q) || pName.includes(q);
              });

              if (filteredPendingBills.length === 0) {
                return (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
                    <h4>No Pending Medicine Bills Found</h4>
                    <p style={{ fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                      {dashSearchQuery ? `No pending bills matching "${dashSearchQuery}"` : 'All prescribed medicine bills have been fulfilled and issued.'}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
                  {filteredPendingBills.map((bill, idx) => {
                    const patientObj = getPatientDetails(bill.PatientID);
                    const doctorObj = getDoctorDetails(bill.DoctorID);
                    const patientRegID = patientObj?.PatientRegID || bill.PatientID;
                    const doctorName = doctorObj?.FullName
                      ? `Dr. ${doctorObj.FullName}`
                      : (String(bill.DoctorID).startsWith('Dr.') ? bill.DoctorID : `Dr. ${bill.DoctorID}`);

                    return (
                      <div
                        key={bill._id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-card)',
                          border: '1.5px solid rgba(245, 158, 11, 0.45)',
                          borderRadius: '16px',
                          padding: '16px 24px',
                          gap: '20px',
                          boxShadow: 'var(--shadow-card)',
                          flexWrap: 'wrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {/* Left 01: Patient Reg ID */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                              PATIENT REG ID
                            </span>
                            <strong style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--teal-400)' }}>
                              {patientRegID}
                            </strong>
                            {patientObj?.FullName && (
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'block', fontWeight: '700' }}>
                                {patientObj.FullName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Center 02: Doctor Name */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                            PRESCRIBING DOCTOR
                          </span>
                          <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            {doctorName}
                          </strong>
                        </div>

                        {/* Center 03: Total Bill */}
                        <div style={{ minWidth: '150px' }}>
                          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                            TOTAL BILL
                          </span>
                          <strong style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                            ${Number(bill.Total_Bill || 0).toFixed(2)}
                          </strong>
                        </div>

                        {/* Far Right Corner Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedBillForDetails(bill)}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            fontSize: '0.88rem',
                            background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                            flexShrink: 0,
                            marginLeft: 'auto'
                          }}
                        >
                          <Eye size={16} /> View Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 2: ISSUED MEDICINE - CompleteStatus: true Medicine Bills */}
        {activeTab === 'issued_medicine' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="dash-search-input-wrapper" style={{ flex: 1, minWidth: '280px', height: '46px' }}>
                <Search size={18} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search issued bills by Patient Reg ID, Doctor Name or NIC..."
                  value={issuedSearchQuery}
                  onChange={(e) => setIssuedSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
                {issuedSearchQuery && (
                  <button
                    onClick={() => setIssuedSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 10px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  fetchIssuedBills();
                  fetchPatientsAndDoctors();
                }}
                disabled={isLoadingIssuedBills}
                className="dash-search-btn"
                style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={16} className={isLoadingIssuedBills ? 'spin-icon' : ''} />
                {isLoadingIssuedBills ? 'Refreshing...' : 'Refresh Records'}
              </button>
            </div>

            {isLoadingIssuedBills ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <RefreshCw size={20} className="spin-icon" />
                Loading issued medicine bills...
              </div>
            ) : (() => {
              const filteredIssuedBills = issuedBills.filter((bill) => {
                if (!issuedSearchQuery.trim()) return true;
                const q = issuedSearchQuery.toLowerCase().trim();
                const patientObj = getPatientDetails(bill.PatientID);
                const doctorObj = getDoctorDetails(bill.DoctorID);
                const regId = (patientObj?.PatientRegID || bill.PatientID || '').toLowerCase();
                const nic = (patientObj?.NICNumber || patientObj?.NICPassportNumber || '').toLowerCase();
                const pName = (patientObj?.FullName || '').toLowerCase();
                const dName = (doctorObj?.FullName || bill.DoctorID || '').toLowerCase();
                return regId.includes(q) || nic.includes(q) || pName.includes(q) || dName.includes(q);
              });

              if (filteredIssuedBills.length === 0) {
                return (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <PackageCheck size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
                    <h4>No Issued Medicine Records Found</h4>
                    <p style={{ fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                      {issuedSearchQuery ? `No records matching "${issuedSearchQuery}"` : 'Completed and issued medicine bills will appear here.'}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
                  {filteredIssuedBills.map((bill, idx) => {
                    const patientObj = getPatientDetails(bill.PatientID);
                    const doctorObj = getDoctorDetails(bill.DoctorID);
                    const patientRegID = patientObj?.PatientRegID || bill.PatientID;
                    const doctorName = doctorObj?.FullName
                      ? `Dr. ${doctorObj.FullName}`
                      : (String(bill.DoctorID).startsWith('Dr.') ? bill.DoctorID : `Dr. ${bill.DoctorID}`);

                    return (
                      <div
                        key={bill._id || idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '16px 24px',
                          gap: '20px',
                          boxShadow: 'var(--shadow-card)',
                          flexWrap: 'wrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {/* Left 01: Patient Reg ID */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <PackageCheck size={20} />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                              PATIENT REG ID
                            </span>
                            <strong style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--teal-400)' }}>
                              {patientRegID}
                            </strong>
                            {patientObj?.FullName && (
                              <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'block', fontWeight: '700' }}>
                                {patientObj.FullName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Center 02: Doctor Name */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                            PRESCRIBING DOCTOR
                          </span>
                          <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            {doctorName}
                          </strong>
                        </div>

                        {/* Center 03: Total Bill */}
                        <div style={{ minWidth: '150px' }}>
                          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800', display: 'block' }}>
                            TOTAL BILL
                          </span>
                          <strong style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                            ${Number(bill.Total_Bill || 0).toFixed(2)}
                          </strong>
                        </div>

                        {/* Far Right Corner Button: View Issued Bill */}
                        <button
                          type="button"
                          onClick={() => {
                            setPrintBillData({
                              billId: bill._id,
                              patientRegId: patientRegID,
                              patientName: patientObj?.FullName || 'Patient',
                              doctorName: doctorObj?.FullName ? `Dr. ${doctorObj.FullName}` : (String(bill.DoctorID).startsWith('Dr.') ? bill.DoctorID : `Dr. ${bill.DoctorID}`),
                              addedMedicines: bill.Added_Medicines ? bill.Added_Medicines.filter(m => m.Added === true || m.Added === 'true') : [],
                              unavailableMedicines: bill.Added_Medicines ? bill.Added_Medicines.filter(m => m.Added === false || m.Added === 'false' || m.Price === 0 || !m.Added) : [],
                              totalBill: bill.Total_Bill || 0,
                              date: bill.updatedAt ? new Date(bill.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
                              time: bill.updatedAt ? new Date(bill.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            });
                            setShowPrintModal(true);
                          }}
                          style={{
                            padding: '10px 22px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            fontSize: '0.88rem',
                            background: 'rgba(45, 212, 191, 0.15)',
                            color: 'var(--teal-400)',
                            border: '1px solid rgba(45, 212, 191, 0.35)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            flexShrink: 0,
                            marginLeft: 'auto',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Eye size={16} /> View Issued Bill
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 3: MEDICINE MANAGEMENT */}
        {activeTab === 'medicine_management' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            {/* Search bar to search medicine by TabletName + "Add medicine" button right corner */}
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="dash-search-input-wrapper" style={{ flex: 1, minWidth: '280px', height: '46px' }}>
                <Search size={18} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search medicine by Tablet Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 10px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setAddTabletName('');
                  setAddQuantity('');
                  setAddUnitPrice('');
                  setAddError('');
                  setShowAddModal(true);
                }}
                style={{
                  padding: '12px 22px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={18} />
                Add Medicine
              </button>
            </div>

            {/* Display all available medicine with TabletName, Quantity, UnitPrice, Edit & Delete icons */}
            {isLoadingMedicines ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <RefreshCw size={20} className="spin-icon" />
                Loading medicines...
              </div>
            ) : filteredMedicines.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Pill size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
                <h4>No Medicines Found</h4>
                <p style={{ fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                  {searchQuery ? `No medicines matching "${searchQuery}"` : 'No medicines available in inventory. Click "Add Medicine" to add one.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filteredMedicines.map((med) => (
                  <div
                    key={med._id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '18px',
                      padding: '22px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      position: 'relative',
                      gap: '16px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    {/* Top Header Row with TabletName and Corner Action Icons (Edit & Delete) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(13, 148, 136, 0.15)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Pill size={20} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                            {med.TabletName}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Medicine Item</span>
                        </div>
                      </div>

                      {/* Corner Action Icons: Edit & Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(med)}
                          title="Edit Medicine Details"
                          style={{
                            background: 'rgba(13, 148, 136, 0.12)',
                            color: '#0d9488',
                            border: '1px solid rgba(13, 148, 136, 0.3)',
                            borderRadius: '10px',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteMedModal(med)}
                          title="Delete Medicine"
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '10px',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Unit Price Details */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600' }}>Available Quantity:</span>
                        <span style={{
                          fontSize: '0.92rem',
                          fontWeight: '800',
                          color: Number(med.Quantity) < 50 ? '#ef4444' : Number(med.Quantity) < 100 ? '#f59e0b' : '#10b981',
                          background: Number(med.Quantity) < 50 ? 'rgba(239, 68, 68, 0.15)' : Number(med.Quantity) < 100 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          border: Number(med.Quantity) < 50 ? '1px solid rgba(239, 68, 68, 0.3)' : Number(med.Quantity) < 100 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '2px 10px',
                          borderRadius: '8px'
                        }}>
                          {med.Quantity} {med.Quantity === 1 ? 'unit' : 'units'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: '600' }}>Unit Price:</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--teal-400)' }}>
                          ${Number(med.UnitPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STOCK STATUS */}
        {activeTab === 'stock' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Boxes size={22} style={{ color: 'var(--teal-400)' }} />
                Medicine Stock Levels Overview
              </h3>

              <button
                onClick={fetchMedicines}
                disabled={isLoadingMedicines}
                className="dash-search-btn"
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                title="Refresh Stock Data"
              >
                <RefreshCw size={15} className={isLoadingMedicines ? 'spin-icon' : ''} />
                {isLoadingMedicines ? 'Refreshing...' : 'Refresh Stock Data'}
              </button>
            </div>

            {/* Stock Summary Header Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  <AlertCircle size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Low Stock (&lt; 50)</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#ef4444' }}>
                    {medicines.filter(m => Number(m.Quantity) < 50).length} Items
                  </h3>
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  <Boxes size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medium Stock (50 - 99)</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                    {medicines.filter(m => Number(m.Quantity) >= 50 && Number(m.Quantity) < 100).length} Items
                  </h3>
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Good Stock (100+)</span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                    {medicines.filter(m => Number(m.Quantity) >= 100).length} Items
                  </h3>
                </div>
              </div>
            </div>

            {/* 3 Columns for Low, Medium, Good Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
              
              {/* 1. Low Stock Column (Red) */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} />
                    Low Stock (Red)
                  </h4>
                  <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '3px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800' }}>
                    Qty &lt; 50
                  </span>
                </div>

                {medicines.filter(m => Number(m.Quantity) < 50).length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No medicines in Low Stock range.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {medicines.filter(m => Number(m.Quantity) < 50).map(med => (
                      <div key={med._id} style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Pill size={18} style={{ color: '#ef4444' }} />
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{med.TabletName}</strong>
                        </div>
                        <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: '800', padding: '4px 12px', borderRadius: '10px', fontSize: '0.88rem' }}>
                          Qty: {med.Quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Medium Stock Column (Orange/Yellow) */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Boxes size={18} />
                    Medium Stock (Medium)
                  </h4>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800' }}>
                    50 ≤ Qty &lt; 100
                  </span>
                </div>

                {medicines.filter(m => Number(m.Quantity) >= 50 && Number(m.Quantity) < 100).length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No medicines in Medium Stock range.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {medicines.filter(m => Number(m.Quantity) >= 50 && Number(m.Quantity) < 100).map(med => (
                      <div key={med._id} style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Pill size={18} style={{ color: '#f59e0b' }} />
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{med.TabletName}</strong>
                        </div>
                        <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontWeight: '800', padding: '4px 12px', borderRadius: '10px', fontSize: '0.88rem' }}>
                          Qty: {med.Quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Good Stock Column (Green) */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    Good Stock (Green)
                  </h4>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800' }}>
                    Qty ≥ 100
                  </span>
                </div>

                {medicines.filter(m => Number(m.Quantity) >= 100).length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No medicines in Good Stock range.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {medicines.filter(m => Number(m.Quantity) >= 100).map(med => (
                      <div key={med._id} style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Pill size={18} style={{ color: '#10b981' }} />
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{med.TabletName}</strong>
                        </div>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: '800', padding: '4px 12px', borderRadius: '10px', fontSize: '0.88rem' }}>
                          Qty: {med.Quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
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
                  {getInitials(myDetails?.FullName || user?.FullName || 'Pharmacist')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.FullName || user?.FullName || 'Pharmacist'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'pharmacist@apexhealth.org'}
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
                      Role: Pharmacist
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pharmacy License</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.PharmacyLicenseNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Department || 'Central Pharmacy'}
                  </h4>
                </div>
              </div>

              {/* 3 Action Buttons */}
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

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} style={{ color: 'var(--teal-400)' }} />
                Add New Medicine
              </h3>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            {addError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {addError}
              </div>
            )}

            <form onSubmit={handleAddMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Tablet Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol 500mg"
                  value={addTabletName}
                  onChange={(e) => setAddTabletName(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Unit Price ($ / LKR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 5.50"
                  value={addUnitPrice}
                  onChange={(e) => setAddUnitPrice(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isSubmittingAdd}>
                  {isSubmittingAdd ? 'Adding...' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && selectedMedicine && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit size={20} style={{ color: 'var(--teal-400)' }} />
                Edit Medicine Details
              </h3>
              <button className="icon-btn" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(13, 148, 136, 0.12)', border: '1px solid rgba(13, 148, 136, 0.3)', color: 'var(--teal-400)', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.88rem' }}>
              <strong>Tablet Name:</strong> {selectedMedicine.TabletName}
            </div>

            {editError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateMedicineSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Update Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter new quantity"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Update Unit Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter new unit price"
                  value={editUnitPrice}
                  onChange={(e) => setEditUnitPrice(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Medicine Confirmation Modal Window */}
      {showDeleteMedModal && medToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '22px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Delete Medicine Record?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Are you sure you want to permanently remove <strong style={{ color: 'var(--text-main)' }}>{medToDelete.TabletName}</strong> from inventory stock?
            </p>

            {deleteMedError && (
              <div className="error-banner" style={{ marginBottom: '18px', fontSize: '0.88rem', textAlign: 'left' }}>
                <AlertCircle size={16} />
                {deleteMedError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => {
                  setShowDeleteMedModal(false);
                  setMedToDelete(null);
                  setDeleteMedError('');
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingMed}
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
                onClick={handleConfirmDeleteMedicine}
              >
                {isDeletingMed ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal: Update Phone Number */}
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

      {/* Settings Modal: Update Password */}
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

      {/* Settings Modal: Delete Account */}
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
              <strong>Warning:</strong> Deleting your account will permanently remove your pharmacist credentials from the system.
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

      {/* BILL DETAILS MODAL FOR CompleteStatus: false */}
      {selectedBillForDetails && (() => {
        const patientObj = getPatientDetails(selectedBillForDetails.PatientID);
        const doctorObj = getDoctorDetails(selectedBillForDetails.DoctorID);
        const patientRegID = patientObj?.PatientRegID || selectedBillForDetails.PatientID;
        const patientName = patientObj?.FullName || 'N/A';
        const doctorName = doctorObj?.FullName
          ? `Dr. ${doctorObj.FullName}`
          : (String(selectedBillForDetails.DoctorID).startsWith('Dr.') ? selectedBillForDetails.DoctorID : `Dr. ${selectedBillForDetails.DoctorID}`);

        const addedTrueMedicines = (selectedBillForDetails.Added_Medicines || []).filter(m => m.Added === true);
        const addedFalseMedicines = (selectedBillForDetails.Added_Medicines || []).filter(m => m.Added === false || m.Price === 0 || !m.Added);

        return (
          <div className="modal-overlay" style={{ zIndex: 1100 }}>
            <div className="modal-content" style={{ maxWidth: '680px', padding: '28px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px' }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={22} style={{ color: 'var(--teal-400)' }} />
                  Prescribed Medicine Bill Details
                </h3>
                <button className="icon-btn" onClick={() => setSelectedBillForDetails(null)}>
                  <X size={20} />
                </button>
              </div>

              {/* Patient & Doctor Header Info Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px', background: 'var(--bg-glass)', padding: '18px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PATIENT INFORMATION
                  </span>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--teal-400)', marginTop: '4px' }}>
                    {patientRegID}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: '700', marginTop: '2px' }}>
                    {patientName}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PRESCRIBING DOCTOR
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                    {doctorName}
                  </div>
                </div>
              </div>

              {/* SECTION 1: Added & Available Medicines */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Available Medicines (Issued by Hospital)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {addedTrueMedicines.length} Item(s)
                  </span>
                </div>

                {addedTrueMedicines.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    No available medicines added to bill.
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-glass)', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px 16px', background: 'rgba(16, 185, 129, 0.1)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.78rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>
                      <span>Medicine Name</span>
                      <span style={{ textAlign: 'center' }}>Quantity</span>
                      <span style={{ textAlign: 'right' }}>Price</span>
                    </div>
                    {addedTrueMedicines.map((med, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 16px', borderBottom: idx < addedTrueMedicines.length - 1 ? '1px solid var(--border-color)' : 'none', alignItems: 'center', fontSize: '0.92rem' }}>
                        <strong style={{ color: 'var(--text-main)', fontWeight: '800' }}>{med.MedicineName}</strong>
                        <span style={{ textAlign: 'center', color: 'var(--text-main)', fontWeight: '700' }}>{med.Quantity}</span>
                        <strong style={{ textAlign: 'right', color: '#10b981', fontWeight: '900' }}>${Number(med.Price || 0).toFixed(2)}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 2: Total Bill Banner */}
              <div style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)', border: '2px solid var(--teal-400)', borderRadius: '16px', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-400)', fontWeight: '800' }}>TOTAL PHARMACEUTICAL BILL</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>Hospital Pharmacy Payable Total</div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-heading)' }}>
                  ${Number(selectedBillForDetails.Total_Bill || 0).toFixed(2)}
                </div>
              </div>

              {/* SECTION 3: Unavailable / Out of Stock Medicines */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> Unavailable / Out of Stock Medicines (Need To Buy Outside)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {addedFalseMedicines.length} Item(s)
                  </span>
                </div>

                {addedFalseMedicines.length === 0 ? (
                  <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                    None (All prescribed medicines were available and added to bill).
                  </div>
                ) : (
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.25)', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px 16px', background: 'rgba(239, 68, 68, 0.12)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.78rem', fontWeight: '800', color: '#ef4444', textTransform: 'uppercase' }}>
                      <span>Medicine Name</span>
                      <span style={{ textAlign: 'center' }}>Quantity</span>
                      <span style={{ textAlign: 'right' }}>Status</span>
                    </div>
                    {addedFalseMedicines.map((med, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 16px', borderBottom: idx < addedFalseMedicines.length - 1 ? '1px solid rgba(239, 68, 68, 0.15)' : 'none', alignItems: 'center', fontSize: '0.92rem' }}>
                        <strong style={{ color: 'var(--text-main)', fontWeight: '800' }}>{med.MedicineName}</strong>
                        <span style={{ textAlign: 'center', color: 'var(--text-main)', fontWeight: '700' }}>{med.Quantity}</span>
                        <span style={{ textAlign: 'right', fontSize: '0.78rem', fontWeight: '800', color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '4px 8px', borderRadius: '6px' }}>
                          Buy Outside
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" className="back-btn" onClick={() => setSelectedBillForDetails(null)}>
                  Close
                </button>
                <button
                  type="button"
                  disabled={isCompletingBill}
                  onClick={() => handleCompleteBill(selectedBillForDetails)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CheckCircle2 size={18} />
                  {isCompletingBill ? 'Completing...' : 'Complete & Print Bill'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PRINT RECEIPT MODAL WITH "Need To Buy From Outside Pharmacy" SECTION */}
      {showPrintModal && printBillData && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '620px', padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={22} style={{ color: '#10b981' }} />
                Official Medicine Bill Receipt
              </h3>
              <button className="icon-btn" onClick={() => setShowPrintModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Printable Slip Area */}
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
                ApexCare Hospital System | Pharmacy Division
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 20px 0', color: 'var(--text-main)' }}>
                Official Prescribed Medicine Receipt
              </h2>

              {/* Patient Reg ID & Name Box */}
              <div style={{ background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '16px', padding: '18px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  PATIENT REG ID
                </span>
                <div style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--teal-400)', letterSpacing: '0.05em', margin: '4px 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                  {printBillData.patientRegId}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {printBillData.patientName}
                </div>
              </div>

              {/* Doctor Name */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '12px 18px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  PRESCRIBING DOCTOR
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                  Dr. {printBillData.doctorName}
                </div>
              </div>

              {/* Prescribed Added Medicines List */}
              <div style={{ textAlign: 'left', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10b981', fontWeight: '800', display: 'block', marginBottom: '8px' }}>
                  ISSUED HOSPITAL MEDICINES
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  {printBillData.addedMedicines && printBillData.addedMedicines.length > 0 ? (
                    printBillData.addedMedicines.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        <span>{item.MedicineName} x{item.Quantity}</span>
                        <strong style={{ color: '#10b981' }}>${Number(item.Price || 0).toFixed(2)}</strong>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No medicines issued by hospital.</span>
                  )}
                </div>
              </div>

              {/* Total Paid Bill Box */}
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid rgba(16, 185, 129, 0.4)', borderRadius: '14px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase' }}>TOTAL PAID BILL</span>
                <strong style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>${Number(printBillData.totalBill || 0).toFixed(2)}</strong>
              </div>

              {/* TOPIC DOWN: NEED TO BUY FROM OUTSIDE PHARMACY (Only show if there are unavailable medicines) */}
              {printBillData.unavailableMedicines && printBillData.unavailableMedicines.length > 0 && (
                <div style={{ textAlign: 'left', marginBottom: '18px', background: 'rgba(239, 68, 68, 0.06)', border: '1.5px dashed rgba(239, 68, 68, 0.4)', borderRadius: '14px', padding: '16px' }}>
                  <span style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ef4444', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertCircle size={16} /> NEED TO BUY FROM OUTSIDE PHARMACY
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {printBillData.unavailableMedicines.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-main)', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                        <span>• <strong>{item.MedicineName}</strong> (Qty: {item.Quantity})</span>
                        <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: '800' }}>Out of Hospital Stock</span>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                      * Please present this prescription note to any external pharmacy to purchase the items listed above.
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Time Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', fontSize: '0.84rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <span>Date: <strong style={{ color: 'var(--text-main)' }}>{printBillData.date}</strong></span>
                <span>Time: <strong style={{ color: 'var(--text-main)' }}>{printBillData.time}</strong></span>
                <span>Status: <strong style={{ color: '#10b981' }}>COMPLETED ✅</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
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
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
                }}
                onClick={() => window.print()}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
