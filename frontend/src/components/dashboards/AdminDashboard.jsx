import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
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
  Search,
  CheckCircle2,
  X,
  Phone,
  User,
  Pencil,
  AlertCircle,
  Trash2,
  Pill,
  Receipt,
  Microscope,
  UserCheck,
  Eye,
  XCircle,
  RefreshCw,
  EyeOff,
  Key,
  Mail,
  Boxes
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard',
  patients: 'Patients',
  doctors: 'Doctors',
  nurses: 'Nurse',
  admins: 'Admin',
  receptionists: 'Receptionist',
  pharmacists: 'Pharmacist',
  accountants: 'Accountant',
  labstaff: 'Laboratory Staff',
  appointments: 'Appointments',
  medicine_stock: 'Medicine Stock',
  billing: 'Billing & Payments',
  settings: 'Settings'
};

export default function AdminDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Patient Management State
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientApiError, setPatientApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Doctor Management State
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorApiError, setDoctorApiError] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [isUpdatingDoctorStatus, setIsUpdatingDoctorStatus] = useState(false);
  const [isDeletingDoctor, setIsDeletingDoctor] = useState(false);
  const [showDoctorDeleteModal, setShowDoctorDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  // Nurse Management State
  const [nurses, setNurses] = useState([]);
  const [isLoadingNurses, setIsLoadingNurses] = useState(false);
  const [nurseApiError, setNurseApiError] = useState('');
  const [nurseSearchQuery, setNurseSearchQuery] = useState('');
  const [nurseFilter, setNurseFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedNurseModal, setSelectedNurseModal] = useState(null);
  const [isUpdatingNurseStatus, setIsUpdatingNurseStatus] = useState(false);
  const [isDeletingNurse, setIsDeletingNurse] = useState(false);
  const [showNurseDeleteModal, setShowNurseDeleteModal] = useState(false);
  const [nurseToDelete, setNurseToDelete] = useState(null);

  // Admin Management State
  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [adminApiError, setAdminApiError] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminFilter, setAdminFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedAdminModal, setSelectedAdminModal] = useState(null);
  const [isUpdatingAdminStatus, setIsUpdatingAdminStatus] = useState(false);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);
  const [showAdminDeleteModal, setShowAdminDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Receptionist Management State
  const [receptionists, setReceptionists] = useState([]);
  const [isLoadingReceptionists, setIsLoadingReceptionists] = useState(false);
  const [receptionistApiError, setReceptionistApiError] = useState('');
  const [receptionistSearchQuery, setReceptionistSearchQuery] = useState('');
  const [receptionistFilter, setReceptionistFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedReceptionistModal, setSelectedReceptionistModal] = useState(null);
  const [isUpdatingReceptionistStatus, setIsUpdatingReceptionistStatus] = useState(false);
  const [isDeletingReceptionist, setIsDeletingReceptionist] = useState(false);
  const [showReceptionistDeleteModal, setShowReceptionistDeleteModal] = useState(false);
  const [receptionistToDelete, setReceptionistToDelete] = useState(null);

  // Pharmacist Management State
  const [pharmacists, setPharmacists] = useState([]);
  const [isLoadingPharmacists, setIsLoadingPharmacists] = useState(false);
  const [pharmacistApiError, setPharmacistApiError] = useState('');
  const [pharmacistSearchQuery, setPharmacistSearchQuery] = useState('');
  const [pharmacistFilter, setPharmacistFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedPharmacistModal, setSelectedPharmacistModal] = useState(null);
  const [isUpdatingPharmacistStatus, setIsUpdatingPharmacistStatus] = useState(false);
  const [isDeletingPharmacist, setIsDeletingPharmacist] = useState(false);
  const [showPharmacistDeleteModal, setShowPharmacistDeleteModal] = useState(false);
  const [pharmacistToDelete, setPharmacistToDelete] = useState(null);

  // Accountant Management State
  const [accountants, setAccountants] = useState([]);
  const [isLoadingAccountants, setIsLoadingAccountants] = useState(false);
  const [accountantApiError, setAccountantApiError] = useState('');
  const [accountantSearchQuery, setAccountantSearchQuery] = useState('');
  const [accountantFilter, setAccountantFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedAccountantModal, setSelectedAccountantModal] = useState(null);
  const [isUpdatingAccountantStatus, setIsUpdatingAccountantStatus] = useState(false);
  const [isDeletingAccountant, setIsDeletingAccountant] = useState(false);
  const [showAccountantDeleteModal, setShowAccountantDeleteModal] = useState(false);
  const [accountantToDelete, setAccountantToDelete] = useState(null);

  // Laboratory Staff Management State
  const [labStaff, setLabStaff] = useState([]);
  const [isLoadingLabStaff, setIsLoadingLabStaff] = useState(false);
  const [labStaffApiError, setLabStaffApiError] = useState('');
  const [labStaffSearchQuery, setLabStaffSearchQuery] = useState('');
  const [labStaffFilter, setLabStaffFilter] = useState('approved'); // 'approved' | 'pending'
  const [selectedLabStaffModal, setSelectedLabStaffModal] = useState(null);
  const [isUpdatingLabStaffStatus, setIsUpdatingLabStaffStatus] = useState(false);
  const [isDeletingLabStaff, setIsDeletingLabStaff] = useState(false);
  const [showLabStaffDeleteModal, setShowLabStaffDeleteModal] = useState(false);
  const [labStaffToDelete, setLabStaffToDelete] = useState(null);

  // Appointments Management State
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [inprogressAppointments, setInprogressAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [apptApiError, setApptApiError] = useState('');
  const [apptSearchQuery, setApptSearchQuery] = useState('');

  // Delete Appointment Modal State
  const [showDeleteApptModal, setShowDeleteApptModal] = useState(false);
  const [apptToDelete, setApptToDelete] = useState(null);
  const [isDeletingAppt, setIsDeletingAppt] = useState(false);

  // Settings Tab State
  const [myAdminDetails, setMyAdminDetails] = useState(null);
  const [isLoadingMyAdminDetails, setIsLoadingMyAdminDetails] = useState(false);
  const [myAdminDetailsError, setMyAdminDetailsError] = useState('');

  // 01. Update Phone Number Modal State
  const [showMyAdminPhoneModal, setShowMyAdminPhoneModal] = useState(false);
  const [newMyAdminPhone, setNewMyAdminPhone] = useState('');
  const [myAdminPhoneError, setMyAdminPhoneError] = useState('');
  const [myAdminPhoneSuccess, setMyAdminPhoneSuccess] = useState('');
  const [isUpdatingMyAdminPhone, setIsUpdatingMyAdminPhone] = useState(false);

  // 02. Update Password Modal State
  const [showMyAdminPasswordModal, setShowMyAdminPasswordModal] = useState(false);
  const [myAdminOldPassword, setMyAdminOldPassword] = useState('');
  const [myAdminNewPassword, setMyAdminNewPassword] = useState('');
  const [myAdminConfirmPassword, setMyAdminConfirmPassword] = useState('');
  const [showMyAdminOldPassword, setShowMyAdminOldPassword] = useState(false);
  const [showMyAdminNewPassword, setShowMyAdminNewPassword] = useState(false);
  const [showMyAdminConfirmPassword, setShowMyAdminConfirmPassword] = useState(false);
  const [myAdminPasswordError, setMyAdminPasswordError] = useState('');
  const [myAdminPasswordSuccess, setMyAdminPasswordSuccess] = useState('');
  const [isUpdatingMyAdminPassword, setIsUpdatingMyAdminPassword] = useState(false);

  // 03. Delete Admin Account Modal State
  const [showDeleteAdminAccountModal, setShowDeleteAdminAccountModal] = useState(false);
  const [deleteAdminAccountPassword, setDeleteAdminAccountPassword] = useState('');
  const [showDeleteAdminPassword, setShowDeleteAdminPassword] = useState(false);
  const [deleteAdminAccountError, setDeleteAdminAccountError] = useState('');
  const [isDeletingAdminAccount, setIsDeletingAdminAccount] = useState(false);

  // Medicine Stock State
  const [medicines, setMedicines] = useState([]);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);

  // Billing & Payments (Completed Bills) State
  const [completedPaymentsList, setCompletedPaymentsList] = useState([]);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [completedError, setCompletedError] = useState('');
  const [completedSearchQuery, setCompletedSearchQuery] = useState('');

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

  const getPatientRegIDForBill = (pay) => {
    if (pay?.PatientDetails?.PatientRegID) return pay.PatientDetails.PatientRegID;
    if (pay?.PatientRegID && typeof pay.PatientRegID === 'string' && pay.PatientRegID.startsWith('PAT-')) {
      return pay.PatientRegID;
    }
    const found = patients.find(p => String(p._id) === String(pay?.PatientID) || p.PatientRegID === pay?.PatientID);
    if (found?.PatientRegID) return found.PatientRegID;
    return 'N/A';
  };

  const getPatientNameForBill = (pay) => {
    if (pay?.PatientDetails?.FullName) return pay.PatientDetails.FullName;
    if (pay?.FullName) return pay.FullName;
    const found = patients.find(p => String(p._id) === String(pay?.PatientID) || p.PatientRegID === pay?.PatientID);
    if (found?.FullName) return found.FullName;
    return 'Patient Record';
  };

  const getPaymentItemsForBill = (pay) => {
    const items = [];
    if (Array.isArray(pay.Appoinment_Fee)) {
      pay.Appoinment_Fee.forEach(item => {
        items.push({ name: item.BillName || 'Appointment Fee', amount: item.Appoinment_Fee || 0, done: item.Done === true });
      });
    }
    if (Array.isArray(pay.Blood_test_Fee)) {
      pay.Blood_test_Fee.forEach(item => {
        items.push({ name: item.BillName || 'Blood Test Fee', amount: item.BloodTestFee || 0, done: item.Done === true });
      });
    }
    if (Array.isArray(pay.Urine_test_Fee)) {
      pay.Urine_test_Fee.forEach(item => {
        items.push({ name: item.BillName || 'Urine Test Fee', amount: item.UrineTestFee || 0, done: item.Done === true });
      });
    }
    if (Array.isArray(pay.Medicine_Fee)) {
      pay.Medicine_Fee.forEach(item => {
        items.push({ name: item.BillName || 'Medicine Fee', amount: item.MedicinePrice || 0, done: item.Done === true });
      });
    }
    return items;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    setPatientApiError('');
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
        setPatientApiError(data.message || 'Failed to fetch patients.');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatientApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    setDoctorApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/doctor/get-all-doctor-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allDoctor || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setDoctors(sorted);
      } else {
        setDoctors([]);
        setDoctorApiError(data.message || 'Failed to fetch doctor details.');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctorApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const fetchNurses = async () => {
    setIsLoadingNurses(true);
    setNurseApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/nurse/get-all-nurse-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allNurse || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setNurses(sorted);
      } else {
        setNurses([]);
        setNurseApiError(data.message || 'Failed to fetch nurse details.');
      }
    } catch (err) {
      console.error('Error fetching nurses:', err);
      setNurseApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingNurses(false);
    }
  };

  const fetchAdmins = async () => {
    setIsLoadingAdmins(true);
    setAdminApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/admin/get-all-admin-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allAdmin || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setAdmins(sorted);
      } else {
        setAdmins([]);
        setAdminApiError(data.message || 'Failed to fetch admin details.');
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdminApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const fetchReceptionists = async () => {
    setIsLoadingReceptionists(true);
    setReceptionistApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/receptionist/get-all-receptionist-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allReceptionist || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setReceptionists(sorted);
      } else {
        setReceptionists([]);
        setReceptionistApiError(data.message || 'Failed to fetch receptionist details.');
      }
    } catch (err) {
      console.error('Error fetching receptionists:', err);
      setReceptionistApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingReceptionists(false);
    }
  };

  const fetchPharmacists = async () => {
    setIsLoadingPharmacists(true);
    setPharmacistApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/pharmacist/get-all-pharmacist-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allPharmacist || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setPharmacists(sorted);
      } else {
        setPharmacists([]);
        setPharmacistApiError(data.message || 'Failed to fetch pharmacist details.');
      }
    } catch (err) {
      console.error('Error fetching pharmacists:', err);
      setPharmacistApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingPharmacists(false);
    }
  };

  const fetchAccountants = async () => {
    setIsLoadingAccountants(true);
    setAccountantApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/accountant/get-all-accountant-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allAccountant || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setAccountants(sorted);
      } else {
        setAccountants([]);
        setAccountantApiError(data.message || 'Failed to fetch accountant details.');
      }
    } catch (err) {
      console.error('Error fetching accountants:', err);
      setAccountantApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingAccountants(false);
    }
  };

  const fetchLabStaff = async () => {
    setIsLoadingLabStaff(true);
    setLabStaffApiError('');
    try {
      const response = await fetch('http://localhost:5000/api/laboratory_staff/get-all-lab-staff-details');
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.allLabStaff || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (a.FullName || '').localeCompare(b.FullName || '');
        });
        setLabStaff(sorted);
      } else {
        setLabStaff([]);
        setLabStaffApiError(data.message || 'Failed to fetch laboratory staff details.');
      }
    } catch (err) {
      console.error('Error fetching lab staff:', err);
      setLabStaffApiError('Could not connect to backend server. Make sure Node server is running on port 5000.');
    } finally {
      setIsLoadingLabStaff(false);
    }
  };

  const fetchAppointmentsData = async () => {
    setIsLoadingAppointments(true);
    setApptApiError('');

    try {
      const [pendingRes, inprogRes, compRes] = await Promise.all([
        fetch('http://localhost:5000/api/appointment/get-all-pending-appointments'),
        fetch('http://localhost:5000/api/appointment/get-all-inprogress-appointments'),
        fetch('http://localhost:5000/api/appointment/get-all-completed-appointments')
      ]);

      const pendingData = await pendingRes.json();
      const inprogData = await inprogRes.json();
      const compData = await compRes.json();

      if (pendingRes.ok) {
        setPendingAppointments(pendingData.allPendingAppointments || pendingData.allAppointments || []);
      } else {
        setPendingAppointments([]);
      }

      if (inprogRes.ok) {
        setInprogressAppointments(inprogData.allInprogressAppointments || inprogData.allAppointments || []);
      } else {
        setInprogressAppointments([]);
      }

      if (compRes.ok) {
        setCompletedAppointments(compData.allCompletedAppointments || compData.allAppointments || []);
      } else {
        setCompletedAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setApptApiError('Could not connect to backend server to load appointments.');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const getPatientDetails = (patientId) => {
    if (!patientId) return null;
    if (typeof patientId === 'object' && patientId.PatientRegID) return patientId;
    return patients.find(p => String(p._id) === String(patientId) || p.PatientID === patientId);
  };

  const getDoctorDetails = (doctorId) => {
    if (!doctorId) return null;
    if (typeof doctorId === 'object' && doctorId.FullName) return doctorId;
    return doctors.find(d => String(d._id) === String(doctorId) || d.DoctorID === doctorId);
  };

  const filterAppointments = (list) => {
    if (!apptSearchQuery.trim()) return list;
    const query = apptSearchQuery.toLowerCase();
    return list.filter(appt => {
      const p = getPatientDetails(appt.PatientID);
      const d = getDoctorDetails(appt.DoctorID);
      const pRegID = p?.PatientRegID ? p.PatientRegID.toLowerCase() : '';
      const pName = p?.FullName ? p.FullName.toLowerCase() : '';
      const dName = d?.FullName ? d.FullName.toLowerCase() : '';
      return pRegID.includes(query) || pName.includes(query) || dName.includes(query);
    });
  };

  const handleOpenDeleteApptModal = (appt) => {
    setApptToDelete(appt);
    setShowDeleteApptModal(true);
  };

  const handleConfirmDeleteAppt = async () => {
    if (!apptToDelete) return;
    setIsDeletingAppt(true);

    try {
      const response = await fetch(`http://localhost:5000/api/appointment/delete-appointment/${apptToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();

      if (response.ok) {
        setIsDeletingAppt(false);
        setShowDeleteApptModal(false);
        setApptToDelete(null);
        fetchAppointmentsData();
      } else {
        setIsDeletingAppt(false);
        alert(resData.message || 'Failed to delete appointment.');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setIsDeletingAppt(false);
      alert('Could not connect to backend server to delete appointment.');
    }
  };

  // 01. Fetch Admin Details using Get_Admin_Details endpoint
  const fetchMyAdminDetails = async () => {
    const adminId = user?._id || user?.id || user?.adminDetails?._id;
    if (!adminId) return;

    setIsLoadingMyAdminDetails(true);
    setMyAdminDetailsError('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/details/${adminId}`);
      const data = await response.json();
      if (response.ok && data.adminDetails) {
        setMyAdminDetails(data.adminDetails);
        setNewMyAdminPhone(data.adminDetails.PhoneNumber || '');
      } else {
        setMyAdminDetailsError(data.message || 'Failed to load admin details.');
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
      setMyAdminDetailsError('Could not connect to backend server to load profile.');
    } finally {
      setIsLoadingMyAdminDetails(false);
    }
  };

  // 02. Update Phone Number Submit Handler (calls Update_Phone_Number)
  const handleUpdateMyAdminPhoneSubmit = async (e) => {
    e.preventDefault();
    setMyAdminPhoneError('');
    setMyAdminPhoneSuccess('');

    const adminId = user?._id || user?.id || user?.adminDetails?._id;
    if (!adminId) {
      setMyAdminPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newMyAdminPhone.trim())) {
      setMyAdminPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingMyAdminPhone(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-phone-number/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ PhoneNumber: newMyAdminPhone.trim() })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsUpdatingMyAdminPhone(false);
        setMyAdminPhoneSuccess('Phone Number updated successfully!');
        setTimeout(() => {
          setShowMyAdminPhoneModal(false);
          setMyAdminPhoneSuccess('');
        }, 1200);
        fetchMyAdminDetails();
      } else {
        setIsUpdatingMyAdminPhone(false);
        setMyAdminPhoneError(resData.message || 'Failed to update phone number.');
      }
    } catch (err) {
      console.error('Error updating phone number:', err);
      setIsUpdatingMyAdminPhone(false);
      setMyAdminPhoneError('Could not connect to backend server.');
    }
  };

  // 03. Update Password Submit Handler (calls Update_Password)
  const handleUpdateMyAdminPasswordSubmit = async (e) => {
    e.preventDefault();
    setMyAdminPasswordError('');
    setMyAdminPasswordSuccess('');

    const adminId = user?._id || user?.id || user?.adminDetails?._id;
    if (!adminId) {
      setMyAdminPasswordError('User session ID not found.');
      return;
    }

    if (!myAdminOldPassword) {
      setMyAdminPasswordError('Please enter your current password.');
      return;
    }

    if (!myAdminNewPassword || myAdminNewPassword.length < 6) {
      setMyAdminPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (myAdminNewPassword !== myAdminConfirmPassword) {
      setMyAdminPasswordError('New passwords do not match.');
      return;
    }

    setIsUpdatingMyAdminPassword(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-password/${adminId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          OldPassword: myAdminOldPassword,
          NewPassword: myAdminNewPassword
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsUpdatingMyAdminPassword(false);
        setMyAdminPasswordSuccess('Password updated successfully!');
        setMyAdminOldPassword('');
        setMyAdminNewPassword('');
        setMyAdminConfirmPassword('');
        setTimeout(() => {
          setShowMyAdminPasswordModal(false);
          setMyAdminPasswordSuccess('');
        }, 1200);
      } else {
        setIsUpdatingMyAdminPassword(false);
        setMyAdminPasswordError(resData.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setIsUpdatingMyAdminPassword(false);
      setMyAdminPasswordError('Could not connect to backend server.');
    }
  };

  // 04. Delete Admin Submit Handler (calls Delete_Admin)
  const handleDeleteMyAdminAccountSubmit = async (e) => {
    e.preventDefault();
    setDeleteAdminAccountError('');

    const adminId = user?._id || user?.id || myAdminDetails?._id || user?.adminDetails?._id;
    if (!adminId) {
      setDeleteAdminAccountError('User session ID not found.');
      return;
    }

    const pass = (deleteAdminAccountPassword || '').trim();
    if (!pass) {
      setDeleteAdminAccountError('Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeletingAdminAccount(true);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminId: adminId,
          Password: pass
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsDeletingAdminAccount(false);
        setShowDeleteAdminAccountModal(false);
        onLogout();
      } else {
        setIsDeletingAdminAccount(false);
        setDeleteAdminAccountError(resData.message || 'Failed to delete account. Incorrect password.');
      }
    } catch (err) {
      console.error('Error deleting admin account:', err);
      setIsDeletingAdminAccount(false);
      setDeleteAdminAccountError('Could not connect to backend server.');
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchPatients();
      fetchDoctors();
      fetchNurses();
      fetchAdmins();
      fetchReceptionists();
      fetchPharmacists();
      fetchLabStaff();
      fetchAppointmentsData();
      fetchCompletedPayments();
    } else if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'doctors') {
      setDoctorFilter('approved');
      fetchDoctors();
    } else if (activeTab === 'nurses') {
      setNurseFilter('approved');
      fetchNurses();
    } else if (activeTab === 'admins') {
      setAdminFilter('approved');
      fetchAdmins();
    } else if (activeTab === 'receptionists') {
      setReceptionistFilter('approved');
      fetchReceptionists();
    } else if (activeTab === 'pharmacists') {
      setPharmacistFilter('approved');
      fetchPharmacists();
    } else if (activeTab === 'accountants') {
      setAccountantFilter('approved');
      fetchAccountants();
    } else if (activeTab === 'labstaff') {
      setLabStaffFilter('approved');
      fetchLabStaff();
    } else if (activeTab === 'appointments') {
      fetchPatients();
      fetchDoctors();
      fetchAppointmentsData();
    } else if (activeTab === 'medicine_stock') {
      fetchMedicines();
    } else if (activeTab === 'billing') {
      fetchPatients();
      fetchCompletedPayments();
    } else if (activeTab === 'settings') {
      fetchMyAdminDetails();
    }
  }, [activeTab]);

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

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toISOString().split('T')[0];
    } catch (e) {
      return 'N/A';
    }
  };

  const filteredPatients = patients.filter(patient => {
    const q = searchQuery.toLowerCase();
    return (
      (patient.FullName && patient.FullName.toLowerCase().includes(q)) ||
      (patient.PatientRegID && patient.PatientRegID.toLowerCase().includes(q))
    );
  });

  const filteredDoctors = doctors.filter(doctor => {
    const q = doctorSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (doctor.FullName && doctor.FullName.toLowerCase().includes(q)) ||
      (doctor.NICPassportNumber && doctor.NICPassportNumber.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (doctorFilter === 'pending') {
      matchesStatus = doctor.Approve !== true;
    } else {
      matchesStatus = doctor.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleToggleDoctorApproveStatus = async (doctor) => {
    if (!doctor || !doctor._id) return;
    setIsUpdatingDoctorStatus(true);
    const newApproveStatus = !doctor.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-doctor-approve-status/${doctor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingDoctorStatus(false);
        if (selectedDoctorModal && selectedDoctorModal._id === doctor._id) {
          setSelectedDoctorModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchDoctors();
      } else {
        setIsUpdatingDoctorStatus(false);
        alert(resData.message || 'Failed to update doctor approve status.');
      }
    } catch (err) {
      console.error('Error updating doctor approve status:', err);
      setIsUpdatingDoctorStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenDoctorDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDoctorDeleteModal(true);
  };

  const filteredNurses = nurses.filter(nurseItem => {
    const q = nurseSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (nurseItem.FullName && nurseItem.FullName.toLowerCase().includes(q)) ||
      (nurseItem.NICNumber && nurseItem.NICNumber.toLowerCase().includes(q)) ||
      (nurseItem.EmployeeID && nurseItem.EmployeeID.toLowerCase().includes(q)) ||
      (nurseItem.NursingLicenseNumber && nurseItem.NursingLicenseNumber.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (nurseFilter === 'pending') {
      matchesStatus = nurseItem.Approve !== true;
    } else {
      matchesStatus = nurseItem.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleToggleNurseApproveStatus = async (nurseDoc) => {
    if (!nurseDoc || !nurseDoc._id) return;
    setIsUpdatingNurseStatus(true);
    const newApproveStatus = !nurseDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-nurse-approve-status/${nurseDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingNurseStatus(false);
        if (selectedNurseModal && selectedNurseModal._id === nurseDoc._id) {
          setSelectedNurseModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchNurses();
      } else {
        setIsUpdatingNurseStatus(false);
        alert(resData.message || 'Failed to update nurse approve status.');
      }
    } catch (err) {
      console.error('Error updating nurse approve status:', err);
      setIsUpdatingNurseStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenNurseDeleteModal = (nurseDoc) => {
    setNurseToDelete(nurseDoc);
    setShowNurseDeleteModal(true);
  };

  const handleConfirmDeleteNurse = async () => {
    if (!nurseToDelete || !nurseToDelete._id) return;
    setIsDeletingNurse(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-nurse/${nurseToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingNurse(false);
        setShowNurseDeleteModal(false);
        if (selectedNurseModal && selectedNurseModal._id === nurseToDelete._id) {
          setSelectedNurseModal(null);
        }
        setNurseToDelete(null);
        fetchNurses();
      } else {
        setIsDeletingNurse(false);
        alert(resData.message || 'Failed to delete nurse record.');
      }
    } catch (err) {
      console.error('Error deleting nurse:', err);
      setIsDeletingNurse(false);
      alert('Could not connect to backend server to delete nurse.');
    }
  };

  const filteredAdmins = admins.filter(adminItem => {
    const q = adminSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (adminItem.FullName && adminItem.FullName.toLowerCase().includes(q)) ||
      (adminItem.NICNumber && adminItem.NICNumber.toLowerCase().includes(q)) ||
      (adminItem.AdminID && adminItem.AdminID.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (adminFilter === 'pending') {
      matchesStatus = adminItem.Approve !== true;
    } else {
      matchesStatus = adminItem.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleToggleAdminApproveStatus = async (adminDoc) => {
    if (!adminDoc || !adminDoc._id) return;
    setIsUpdatingAdminStatus(true);
    const newApproveStatus = !adminDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-admin-approve-status/${adminDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingAdminStatus(false);
        if (selectedAdminModal && selectedAdminModal._id === adminDoc._id) {
          setSelectedAdminModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchAdmins();
      } else {
        setIsUpdatingAdminStatus(false);
        alert(resData.message || 'Failed to update admin approve status.');
      }
    } catch (err) {
      console.error('Error updating admin approve status:', err);
      setIsUpdatingAdminStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenAdminDeleteModal = (adminDoc) => {
    setAdminToDelete(adminDoc);
    setShowAdminDeleteModal(true);
  };

  const handleConfirmDeleteAdmin = async () => {
    if (!adminToDelete || !adminToDelete._id) return;
    setIsDeletingAdmin(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-admin/${adminToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingAdmin(false);
        setShowAdminDeleteModal(false);
        if (selectedAdminModal && selectedAdminModal._id === adminToDelete._id) {
          setSelectedAdminModal(null);
        }
        setAdminToDelete(null);
        fetchAdmins();
      } else {
        setIsDeletingAdmin(false);
        alert(resData.message || 'Failed to delete admin record.');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      setIsDeletingAdmin(false);
      alert('Could not connect to backend server to delete admin.');
    }
  };

  const filteredReceptionists = receptionists.filter(rec => {
    const q = receptionistSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (rec.FullName && rec.FullName.toLowerCase().includes(q)) ||
      (rec.NICNumber && rec.NICNumber.toLowerCase().includes(q)) ||
      (rec.EmployeeID && rec.EmployeeID.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (receptionistFilter === 'pending') {
      matchesStatus = rec.Approve !== true;
    } else {
      matchesStatus = rec.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleToggleReceptionistApproveStatus = async (recDoc) => {
    if (!recDoc || !recDoc._id) return;
    setIsUpdatingReceptionistStatus(true);
    const newApproveStatus = !recDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-receptionist-approve-status/${recDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingReceptionistStatus(false);
        if (selectedReceptionistModal && selectedReceptionistModal._id === recDoc._id) {
          setSelectedReceptionistModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchReceptionists();
      } else {
        setIsUpdatingReceptionistStatus(false);
        alert(resData.message || 'Failed to update receptionist approve status.');
      }
    } catch (err) {
      console.error('Error updating receptionist approve status:', err);
      setIsUpdatingReceptionistStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenReceptionistDeleteModal = (recDoc) => {
    setReceptionistToDelete(recDoc);
    setShowReceptionistDeleteModal(true);
  };

  const handleConfirmDeleteReceptionist = async () => {
    if (!receptionistToDelete || !receptionistToDelete._id) return;
    setIsDeletingReceptionist(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-receptionist/${receptionistToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingReceptionist(false);
        setShowReceptionistDeleteModal(false);
        if (selectedReceptionistModal && selectedReceptionistModal._id === receptionistToDelete._id) {
          setSelectedReceptionistModal(null);
        }
        setReceptionistToDelete(null);
        fetchReceptionists();
      } else {
        setIsDeletingReceptionist(false);
        alert(resData.message || 'Failed to delete receptionist record.');
      }
    } catch (err) {
      console.error('Error deleting receptionist:', err);
      setIsDeletingReceptionist(false);
      alert('Could not connect to backend server to delete receptionist.');
    }
  };

  const filteredPharmacists = pharmacists.filter(ph => {
    const q = pharmacistSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (ph.FullName && ph.FullName.toLowerCase().includes(q)) ||
      (ph.NICNumber && ph.NICNumber.toLowerCase().includes(q)) ||
      (ph.PharmacyLicenseNumber && ph.PharmacyLicenseNumber.toLowerCase().includes(q)) ||
      (ph.EmployeeID && ph.EmployeeID.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (pharmacistFilter === 'pending') {
      matchesStatus = ph.Approve !== true;
    } else {
      matchesStatus = ph.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleTogglePharmacistApproveStatus = async (phDoc) => {
    if (!phDoc || !phDoc._id) return;
    setIsUpdatingPharmacistStatus(true);
    const newApproveStatus = !phDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-pharmacist-approve-status/${phDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingPharmacistStatus(false);
        if (selectedPharmacistModal && selectedPharmacistModal._id === phDoc._id) {
          setSelectedPharmacistModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchPharmacists();
      } else {
        setIsUpdatingPharmacistStatus(false);
        alert(resData.message || 'Failed to update pharmacist approve status.');
      }
    } catch (err) {
      console.error('Error updating pharmacist approve status:', err);
      setIsUpdatingPharmacistStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenPharmacistDeleteModal = (phDoc) => {
    setPharmacistToDelete(phDoc);
    setShowPharmacistDeleteModal(true);
  };

  const handleConfirmDeletePharmacist = async () => {
    if (!pharmacistToDelete || !pharmacistToDelete._id) return;
    setIsDeletingPharmacist(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-pharmacist/${pharmacistToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingPharmacist(false);
        setShowPharmacistDeleteModal(false);
        if (selectedPharmacistModal && selectedPharmacistModal._id === pharmacistToDelete._id) {
          setSelectedPharmacistModal(null);
        }
        setPharmacistToDelete(null);
        fetchPharmacists();
      } else {
        setIsDeletingPharmacist(false);
        alert(resData.message || 'Failed to delete pharmacist record.');
      }
    } catch (err) {
      console.error('Error deleting pharmacist:', err);
      setIsDeletingPharmacist(false);
      alert('Could not connect to backend server to delete pharmacist.');
    }
  };

  const filteredAccountants = accountants.filter(acc => {
    const q = accountantSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (acc.FullName && acc.FullName.toLowerCase().includes(q)) ||
      (acc.NICNumber && acc.NICNumber.toLowerCase().includes(q)) ||
      (acc.EmployeeID && acc.EmployeeID.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (accountantFilter === 'pending') {
      matchesStatus = acc.Approve !== true;
    } else {
      matchesStatus = acc.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const filteredLabStaff = labStaff.filter(item => {
    const q = labStaffSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      (item.FullName && item.FullName.toLowerCase().includes(q)) ||
      (item.NICNumber && item.NICNumber.toLowerCase().includes(q))
    );

    let matchesStatus = true;
    if (labStaffFilter === 'pending') {
      matchesStatus = item.Approve !== true;
    } else {
      matchesStatus = item.Approve === true;
    }

    return matchesSearch && matchesStatus;
  });

  const handleToggleAccountantApproveStatus = async (accDoc) => {
    if (!accDoc || !accDoc._id) return;
    setIsUpdatingAccountantStatus(true);
    const newApproveStatus = !accDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-accountant-approve-status/${accDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingAccountantStatus(false);
        if (selectedAccountantModal && selectedAccountantModal._id === accDoc._id) {
          setSelectedAccountantModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchAccountants();
      } else {
        setIsUpdatingAccountantStatus(false);
        alert(resData.message || 'Failed to update accountant approve status.');
      }
    } catch (err) {
      console.error('Error updating accountant approve status:', err);
      setIsUpdatingAccountantStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenAccountantDeleteModal = (accDoc) => {
    setAccountantToDelete(accDoc);
    setShowAccountantDeleteModal(true);
  };

  const handleConfirmDeleteAccountant = async () => {
    if (!accountantToDelete || !accountantToDelete._id) return;
    setIsDeletingAccountant(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-accountant/${accountantToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingAccountant(false);
        setShowAccountantDeleteModal(false);
        if (selectedAccountantModal && selectedAccountantModal._id === accountantToDelete._id) {
          setSelectedAccountantModal(null);
        }
        setAccountantToDelete(null);
        fetchAccountants();
      } else {
        setIsDeletingAccountant(false);
        alert(resData.message || 'Failed to delete accountant record.');
      }
    } catch (err) {
      console.error('Error deleting accountant:', err);
      setIsDeletingAccountant(false);
      alert('Could not connect to backend server to delete accountant.');
    }
  };

  const handleToggleLabStaffApproveStatus = async (labStaffDoc) => {
    if (!labStaffDoc || !labStaffDoc._id) return;
    setIsUpdatingLabStaffStatus(true);
    const newApproveStatus = !labStaffDoc.Approve;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/update-lab-staff-approve-status/${labStaffDoc._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Approve: newApproveStatus })
      });
      const resData = await response.json();
      if (response.ok) {
        setIsUpdatingLabStaffStatus(false);
        if (selectedLabStaffModal && selectedLabStaffModal._id === labStaffDoc._id) {
          setSelectedLabStaffModal(prev => prev ? { ...prev, Approve: newApproveStatus } : null);
        }
        fetchLabStaff();
      } else {
        setIsUpdatingLabStaffStatus(false);
        alert(resData.message || 'Failed to update laboratory staff approve status.');
      }
    } catch (err) {
      console.error('Error updating lab staff approve status:', err);
      setIsUpdatingLabStaffStatus(false);
      alert('Could not connect to backend server.');
    }
  };

  const handleOpenLabStaffDeleteModal = (labStaffDoc) => {
    setLabStaffToDelete(labStaffDoc);
    setShowLabStaffDeleteModal(true);
  };

  const handleConfirmDeleteLabStaff = async () => {
    if (!labStaffToDelete || !labStaffToDelete._id) return;
    setIsDeletingLabStaff(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-lab-staff/${labStaffToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingLabStaff(false);
        setShowLabStaffDeleteModal(false);
        if (selectedLabStaffModal && selectedLabStaffModal._id === labStaffToDelete._id) {
          setSelectedLabStaffModal(null);
        }
        setLabStaffToDelete(null);
        fetchLabStaff();
      } else {
        setIsDeletingLabStaff(false);
        alert(resData.message || 'Failed to delete laboratory staff record.');
      }
    } catch (err) {
      console.error('Error deleting lab staff:', err);
      setIsDeletingLabStaff(false);
      alert('Could not connect to backend server to delete laboratory staff.');
    }
  };

  const handleConfirmDeleteDoctor = async () => {
    if (!doctorToDelete || !doctorToDelete._id) return;
    setIsDeletingDoctor(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-doctor/${doctorToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingDoctor(false);
        setShowDoctorDeleteModal(false);
        if (selectedDoctorModal && selectedDoctorModal._id === doctorToDelete._id) {
          setSelectedDoctorModal(null);
        }
        setDoctorToDelete(null);
        fetchDoctors();
      } else {
        setIsDeletingDoctor(false);
        alert(resData.message || 'Failed to delete doctor record.');
      }
    } catch (err) {
      console.error('Error deleting doctor:', err);
      setIsDeletingDoctor(false);
      alert('Could not connect to backend server to delete doctor.');
    }
  };

  const handleOpenEditModal = (patient) => {
    setSelectedPatient(patient);
    setEditContactNumber(patient.ContactNumber || '');
    setEditError('');
    setShowEditModal(true);
  };

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

  const handleOpenDeleteModal = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Admin</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)', paddingRight: '4px' }}>
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
              <Users size={18} />
              Patients
            </button>
            <button className={`dash-nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
              <Stethoscope size={18} />
              Doctors
            </button>
            <button className={`dash-nav-item ${activeTab === 'nurses' ? 'active' : ''}`} onClick={() => setActiveTab('nurses')}>
              <HeartPulse size={18} />
              Nurse
            </button>
            <button className={`dash-nav-item ${activeTab === 'admins' ? 'active' : ''}`} onClick={() => setActiveTab('admins')}>
              <ShieldCheck size={18} />
              Admin
            </button>
            <button className={`dash-nav-item ${activeTab === 'receptionists' ? 'active' : ''}`} onClick={() => setActiveTab('receptionists')}>
              <UserCheck size={18} />
              Receptionist
            </button>
            <button className={`dash-nav-item ${activeTab === 'pharmacists' ? 'active' : ''}`} onClick={() => setActiveTab('pharmacists')}>
              <Pill size={18} />
              Pharmacist
            </button>
            <button className={`dash-nav-item ${activeTab === 'accountants' ? 'active' : ''}`} onClick={() => setActiveTab('accountants')}>
              <Receipt size={18} />
              Accountant
            </button>
            <button className={`dash-nav-item ${activeTab === 'labstaff' ? 'active' : ''}`} onClick={() => setActiveTab('labstaff')}>
              <Microscope size={18} />
              Laboratory Staff
            </button>
            <button className={`dash-nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              <Calendar size={18} />
              Appointments
            </button>
            <button className={`dash-nav-item ${activeTab === 'medicine_stock' ? 'active' : ''}`} onClick={() => setActiveTab('medicine_stock')}>
              <Boxes size={18} />
              Medicine Stock
            </button>
            <button className={`dash-nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
              <CreditCard size={18} />
              Billing & Payments
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
            {activeTab === 'dashboard' && (
              <p>
                Apex Health International Hospital live system administration & access security control. Manage staff accounts, system logs, and hospital metrics.
              </p>
            )}
          </div>

          {/* Right Active Page Title Badge */}
          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* Dashboard Overview Section */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
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
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Total Settlement Bills
                      </span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                        {completedPaymentsList.length} Payments Completed
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('billing')}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#10b981',
                        padding: '10px 18px',
                        borderRadius: '14px',
                        fontWeight: '800',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      View Billing <CreditCard size={16} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 8 System Metric Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {/* 1. Patients Card */}
              <div
                onClick={() => setActiveTab('patients')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} />
                  </div>
                  <span style={{ background: 'rgba(45, 212, 191, 0.15)', color: 'var(--teal-400)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Patients
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Patients
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingPatients ? '...' : patients.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Registered System Patients</span>
                  <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>View All &rarr;</span>
                </div>
              </div>

              {/* 2. Doctors Card */}
              <div
                onClick={() => setActiveTab('doctors')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.18)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stethoscope size={24} />
                  </div>
                  <span style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Doctors
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Doctors
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingDoctors ? '...' : doctors.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{doctors.filter(d => d.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{doctors.filter(d => d.Approve !== true).length}</strong></span>
                  <span style={{ color: '#0284c7', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 3. Nurses Card */}
              <div
                onClick={() => setActiveTab('nurses')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.18)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HeartPulse size={24} />
                  </div>
                  <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Nurse
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Nurses
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingNurses ? '...' : nurses.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{nurses.filter(n => n.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{nurses.filter(n => n.Approve !== true).length}</strong></span>
                  <span style={{ color: '#ec4899', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 4. Admins Card */}
              <div
                onClick={() => setActiveTab('admins')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.18)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Admin
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Admins
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingAdmins ? '...' : admins.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{admins.filter(a => a.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{admins.filter(a => a.Approve !== true).length}</strong></span>
                  <span style={{ color: '#a855f7', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 5. Receptionists Card */}
              <div
                onClick={() => setActiveTab('receptionists')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={24} />
                  </div>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Receptionist
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Receptionists
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingReceptionists ? '...' : receptionists.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{receptionists.filter(r => r.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{receptionists.filter(r => r.Approve !== true).length}</strong></span>
                  <span style={{ color: '#f59e0b', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 6. Pharmacists Card */}
              <div
                onClick={() => setActiveTab('pharmacists')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pill size={24} />
                  </div>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Pharmacist
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Pharmacists
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingPharmacists ? '...' : pharmacists.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{pharmacists.filter(p => p.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{pharmacists.filter(p => p.Approve !== true).length}</strong></span>
                  <span style={{ color: '#10b981', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 7. Laboratory Staff Card */}
              <div
                onClick={() => setActiveTab('labstaff')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.18)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Microscope size={24} />
                  </div>
                  <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Lab Staff
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Laboratory Staff
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingLabStaff ? '...' : labStaff.length}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Approved: <strong style={{ color: '#10b981' }}>{labStaff.filter(l => l.Approve === true).length}</strong> | Pending: <strong style={{ color: '#ef4444' }}>{labStaff.filter(l => l.Approve !== true).length}</strong></span>
                  <span style={{ color: '#6366f1', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>

              {/* 8. Appointments Card */}
              <div
                onClick={() => setActiveTab('appointments')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
                className="dash-stat-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.18)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={24} />
                  </div>
                  <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '800' }}>
                    Appointments
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Appointments
                  </span>
                  <h2 style={{ margin: '4px 0 0 0', fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                    {isLoadingAppointments ? '...' : (pendingAppointments.length + inprogressAppointments.length + completedAppointments.length)}
                  </h2>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pending: <strong style={{ color: '#f59e0b' }}>{pendingAppointments.length}</strong> | In-Prog: <strong style={{ color: '#0284c7' }}>{inprogressAppointments.length}</strong> | Done: <strong style={{ color: '#10b981' }}>{completedAppointments.length}</strong></span>
                  <span style={{ color: '#0ea5e9', fontWeight: '800' }}>View &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar & Toolbar Under Welcome Back Box */}
        {activeTab === 'patients' && (
          <div className="dash-search-toolbar">
            <div className="dash-toolbar-left-space" />

            <div className="dash-search-center-group">
              <div className="dash-search-input-wrapper">
                <Search size={18} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search by Patient Name or Patient ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
              </div>
              <button className="dash-search-btn">
                <Search size={16} />
                Search
              </button>
            </div>

            <div className="dash-toolbar-right-group" />
          </div>
        )}

        {/* Patient Details Table */}
        {activeTab === 'patients' && (
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

            {patientApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {patientApiError}
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
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Registration Date</th>
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
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{formatDateOnly(patient.createdAt)}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
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
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingPatients ? 'Loading patient details...' : searchQuery ? `No patient matches found for "${searchQuery}".` : 'No patient records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctor Search Toolbar */}
        {activeTab === 'doctors' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search doctor by Name or NIC / Passport Number..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Doctor Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setDoctorFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: doctorFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: doctorFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: doctorFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: doctorFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({doctors.filter(d => d.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setDoctorFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: doctorFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: doctorFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: doctorFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: doctorFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({doctors.filter(d => d.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {doctors.filter(d => d.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending doctor accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Doctor Details Table */}
        {activeTab === 'doctors' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={20} style={{ color: 'var(--teal-400)' }} />
                Doctor Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>
            </div>

            {doctorApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {doctorApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Medical License No</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Specialization</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Room Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doc) => (
                      <tr
                        key={doc._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedDoctorModal(doc)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Stethoscope size={16} style={{ color: 'var(--teal-400)' }} />
                            {doc.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{doc.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{doc.MedicalLicenseNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{doc.Specialization || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{doc.RoomNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {doc.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Doctor Details"
                              onClick={() => setSelectedDoctorModal(doc)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingDoctors ? 'Loading doctor details...' : doctorSearchQuery ? `No doctor matches found for "${doctorSearchQuery}".` : 'No doctor records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Nurse Search Toolbar & Filter Buttons */}
        {activeTab === 'nurses' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search nurse by Name, Employee ID or License No..."
                    value={nurseSearchQuery}
                    onChange={(e) => setNurseSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Nurse Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setNurseFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: nurseFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: nurseFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: nurseFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: nurseFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({nurses.filter(n => n.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setNurseFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: nurseFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: nurseFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: nurseFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: nurseFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({nurses.filter(n => n.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {nurses.filter(n => n.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending nurse accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Nurse Details Table */}
        {activeTab === 'nurses' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={20} style={{ color: 'var(--teal-400)' }} />
                Nurse Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredNurses.length} of {nurses.length} nurses
              </span>
            </div>

            {nurseApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {nurseApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Nursing License No</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Assigned Ward</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Employee ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNurses.length > 0 ? (
                    filteredNurses.map((nurseItem) => (
                      <tr
                        key={nurseItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedNurseModal(nurseItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HeartPulse size={16} style={{ color: 'var(--teal-400)' }} />
                            {nurseItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{nurseItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{nurseItem.NursingLicenseNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{nurseItem.AssignedWard || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{nurseItem.EmployeeID || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {nurseItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Nurse Details"
                              onClick={() => setSelectedNurseModal(nurseItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingNurses ? 'Loading nurse details...' : nurseSearchQuery ? `No nurse matches found for "${nurseSearchQuery}".` : 'No nurse records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Search Toolbar & Filter Buttons */}
        {activeTab === 'admins' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search admin by Full Name or NIC Number..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Admin Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setAdminFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: adminFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: adminFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: adminFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: adminFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({admins.filter(a => a.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setAdminFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: adminFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: adminFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: adminFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: adminFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({admins.filter(a => a.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {admins.filter(a => a.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending admin accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Admin Details Table */}
        {activeTab === 'admins' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--teal-400)' }} />
                Admin Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredAdmins.length} of {admins.length} admins
              </span>
            </div>

            {adminApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {adminApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Admin ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Hospital Branch</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((adminItem) => (
                      <tr
                        key={adminItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedAdminModal(adminItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={16} style={{ color: 'var(--teal-400)' }} />
                            {adminItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{adminItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{adminItem.NICNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{adminItem.AdminID || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{adminItem.HospitalBranch || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {adminItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Admin Details"
                              onClick={() => setSelectedAdminModal(adminItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingAdmins ? 'Loading admin details...' : adminSearchQuery ? `No admin matches found for "${adminSearchQuery}".` : 'No admin records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Receptionist Search Toolbar & Filter Buttons */}
        {activeTab === 'receptionists' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search receptionist by Full Name or NIC Number..."
                    value={receptionistSearchQuery}
                    onChange={(e) => setReceptionistSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Receptionist Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setReceptionistFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: receptionistFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: receptionistFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: receptionistFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: receptionistFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({receptionists.filter(r => r.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setReceptionistFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: receptionistFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: receptionistFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: receptionistFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: receptionistFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({receptionists.filter(r => r.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {receptionists.filter(r => r.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending receptionist accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Receptionist Details Table */}
        {activeTab === 'receptionists' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} style={{ color: 'var(--teal-400)' }} />
                Receptionist Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredReceptionists.length} of {receptionists.length} receptionists
              </span>
            </div>

            {receptionistApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {receptionistApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Employee ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Assigned Desk Counter</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceptionists.length > 0 ? (
                    filteredReceptionists.map((recItem) => (
                      <tr
                        key={recItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedReceptionistModal(recItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <UserCheck size={16} style={{ color: 'var(--teal-400)' }} />
                            {recItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{recItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{recItem.NICNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{recItem.EmployeeID || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{recItem.AssignedDeskCounter || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {recItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Receptionist Details"
                              onClick={() => setSelectedReceptionistModal(recItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingReceptionists ? 'Loading receptionist details...' : receptionistSearchQuery ? `No receptionist matches found for "${receptionistSearchQuery}".` : 'No receptionist records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pharmacist Search Toolbar & Filter Buttons */}
        {activeTab === 'pharmacists' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search pharmacist by Full Name or NIC Number..."
                    value={pharmacistSearchQuery}
                    onChange={(e) => setPharmacistSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Pharmacist Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setPharmacistFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: pharmacistFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: pharmacistFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: pharmacistFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: pharmacistFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({pharmacists.filter(p => p.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setPharmacistFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: pharmacistFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: pharmacistFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: pharmacistFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: pharmacistFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({pharmacists.filter(p => p.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {pharmacists.filter(p => p.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending pharmacist accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Pharmacist Details Table */}
        {activeTab === 'pharmacists' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={20} style={{ color: 'var(--teal-400)' }} />
                Pharmacist Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredPharmacists.length} of {pharmacists.length} pharmacists
              </span>
            </div>

            {pharmacistApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {pharmacistApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Pharmacy License No</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>License Expiry Date</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPharmacists.length > 0 ? (
                    filteredPharmacists.map((phItem) => (
                      <tr
                        key={phItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedPharmacistModal(phItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Pill size={16} style={{ color: 'var(--teal-400)' }} />
                            {phItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{phItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{phItem.NICNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{phItem.PharmacyLicenseNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{formatDateOnly(phItem.LicenseExpiryDate)}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {phItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Pharmacist Details"
                              onClick={() => setSelectedPharmacistModal(phItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingPharmacists ? 'Loading pharmacist details...' : pharmacistSearchQuery ? `No pharmacist matches found for "${pharmacistSearchQuery}".` : 'No pharmacist records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Accountant Search Toolbar & Filter Buttons */}
        {activeTab === 'accountants' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search accountant by Full Name or NIC Number..."
                    value={accountantSearchQuery}
                    onChange={(e) => setAccountantSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Accountant Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setAccountantFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: accountantFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: accountantFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: accountantFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: accountantFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({accountants.filter(a => a.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setAccountantFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: accountantFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: accountantFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: accountantFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: accountantFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({accountants.filter(a => a.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {accountants.filter(a => a.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending accountant accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Accountant Details Table */}
        {activeTab === 'accountants' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={20} style={{ color: 'var(--teal-400)' }} />
                Accountant Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredAccountants.length} of {accountants.length} accountants
              </span>
            </div>

            {accountantApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {accountantApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Employee ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Job Position</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccountants.length > 0 ? (
                    filteredAccountants.map((accItem) => (
                      <tr
                        key={accItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedAccountantModal(accItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Receipt size={16} style={{ color: 'var(--teal-400)' }} />
                            {accItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{accItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{accItem.NICNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{accItem.EmployeeID || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{accItem.JobPosition || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {accItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Accountant Details"
                              onClick={() => setSelectedAccountantModal(accItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingAccountants ? 'Loading accountant details...' : accountantSearchQuery ? `No accountant matches found for "${accountantSearchQuery}".` : 'No accountant records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Laboratory Staff Search Toolbar & Filter Buttons */}
        {activeTab === 'labstaff' && (
          <>
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />

              <div className="dash-search-center-group">
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search lab staff by Full Name or NIC Number..."
                    value={labStaffSearchQuery}
                    onChange={(e) => setLabStaffSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                <button className="dash-search-btn">
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="dash-toolbar-right-group" />
            </div>

            {/* Laboratory Staff Status Filter Buttons Under Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '-6px', marginBottom: '-14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setLabStaffFilter('approved')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: labStaffFilter === 'approved' ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: labStaffFilter === 'approved' ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-card)',
                  color: labStaffFilter === 'approved' ? '#10b981' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: labStaffFilter === 'approved' ? '0 0 12px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <CheckCircle2 size={16} />
                Approve ({labStaff.filter(l => l.Approve === true).length})
              </button>

              <button
                type="button"
                onClick={() => setLabStaffFilter('pending')}
                style={{
                  padding: '9px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: labStaffFilter === 'pending' ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  background: labStaffFilter === 'pending' ? 'rgba(239, 68, 68, 0.18)' : 'var(--bg-card)',
                  color: labStaffFilter === 'pending' ? '#ef4444' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: labStaffFilter === 'pending' ? '0 0 12px rgba(239, 68, 68, 0.2)' : 'none',
                  position: 'relative'
                }}
              >
                <XCircle size={16} />
                (Pending / Rejected) ({labStaff.filter(l => l.Approve !== true).length})

                {/* Red Notification Dot Badge */}
                {labStaff.filter(l => l.Approve !== true).length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      boxShadow: '0 0 8px #ef4444',
                      border: '2px solid var(--bg-card)'
                    }}
                    title="Pending laboratory staff accounts requiring approval"
                  />
                )}
              </button>
            </div>
          </>
        )}

        {/* Laboratory Staff Details Table */}
        {activeTab === 'labstaff' && (
          <div className="dash-patient-section" style={{ marginTop: '-10px' }}>
            <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Microscope size={20} style={{ color: 'var(--teal-400)' }} />
                Laboratory Staff Details
              </h3>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing {filteredLabStaff.length} of {labStaff.length} laboratory staff
              </span>
            </div>

            {labStaffApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {labStaffApiError}
              </div>
            )}

            <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Full Name</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Phone Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>NIC Number</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Laboratory License No</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Employee ID</th>
                    <th style={{ padding: '16px 20px', fontWeight: '800' }}>Approve</th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabStaff.length > 0 ? (
                    filteredLabStaff.map((labItem) => (
                      <tr
                        key={labItem._id}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease', cursor: 'pointer' }}
                        onClick={() => setSelectedLabStaffModal(labItem)}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Microscope size={16} style={{ color: 'var(--teal-400)' }} />
                            {labItem.FullName}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{labItem.PhoneNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>{labItem.NICNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{labItem.LaboratoryLicenseNumber || 'N/A'}</td>
                        <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>{labItem.EmployeeID || 'N/A'}</td>
                        <td style={{ padding: '16px 20px' }}>
                          {labItem.Approve ? (
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <CheckCircle2 size={14} /> Approved
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#ef4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.84rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <XCircle size={14} /> Pending / Rejected
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <button
                              className="icon-btn"
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(45, 212, 191, 0.18)',
                                color: 'var(--teal-400)',
                                border: '1px solid rgba(45, 212, 191, 0.35)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="View Laboratory Staff Details"
                              onClick={() => setSelectedLabStaffModal(labItem)}
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.02rem' }}>
                        {isLoadingLabStaff ? 'Loading laboratory staff details...' : labStaffSearchQuery ? `No laboratory staff matches found for "${labStaffSearchQuery}".` : 'No laboratory staff records registered yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeTab === 'appointments' && (
          <div className="dash-appointments-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Header Toolbar & Search Bar */}
            <div className="dash-search-toolbar">
              {/* Left Spacer so search box is dead center */}
              <div className="dash-toolbar-left-space" />

              {/* Center Search Bar & Search/Refresh Buttons */}
              <div className="dash-search-center-group" style={{ flex: 1, maxWidth: '640px' }}>
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by Patient Reg ID or Patient Name..."
                    value={apptSearchQuery}
                    onChange={(e) => setApptSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                {apptSearchQuery && (
                  <button
                    onClick={() => setApptSearchQuery('')}
                    className="back-btn"
                    style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchAppointmentsData}
                  disabled={isLoadingAppointments}
                  className="dash-search-btn"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Refresh Appointments"
                >
                  <RefreshCw size={16} className={isLoadingAppointments ? 'spin-icon' : ''} />
                  {isLoadingAppointments ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Right Corner Spacer */}
              <div className="dash-toolbar-right-group" />
            </div>

            {apptApiError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {apptApiError}
              </div>
            )}

            {/* 3 Parallel Columns (Pending, Inprogress, Completed) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              alignItems: 'start'
            }}>

              {/* 01. PENDING APPOINTMENTS COLUMN - COLOR YELLOW */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}>
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>Pending Appointments</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Get_All_Pending_Appointments</span>
                    </div>
                  </div>
                  <span style={{
                    background: 'rgba(245, 158, 11, 0.22)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.88rem',
                    fontWeight: '800'
                  }}>
                    {filterAppointments(pendingAppointments).length}
                  </span>
                </div>

                {/* List of Pending Appointments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                  {isLoadingAppointments ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Loading pending appointments...
                    </div>
                  ) : filterAppointments(pendingAppointments).length > 0 ? (
                    filterAppointments(pendingAppointments).map((appt) => {
                      const patientObj = getPatientDetails(appt.PatientID);
                      const doctorObj = getDoctorDetails(appt.DoctorID);

                      return (
                        <div key={appt._id} style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease'
                        }}>
                          {/* Top Badge Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
                              {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Today'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '8px' }}>
                              Pending
                            </span>
                          </div>

                          {/* Appointment Details */}
                          <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800' }}>
                                PATIENT REG ID
                              </span>
                              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
                                {patientObj?.PatientRegID || appt.PatientID}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Doctor Name:</span>
                              <strong style={{ color: 'var(--text-main)' }}>Dr. {doctorObj?.FullName || appt.DoctorID}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Room Number:</span>
                              <strong style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.18)', padding: '2px 10px', borderRadius: '6px', fontSize: '0.86rem' }}>
                                Room {doctorObj?.RoomNumber || 'N/A'}
                              </strong>
                            </div>
                          </div>

                          {/* Bottom Row: Delete Button */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '4px' }}>
                            <button
                              onClick={() => handleOpenDeleteApptModal(appt)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.16)',
                                color: '#ef4444',
                                border: '1.5px solid rgba(239, 68, 68, 0.4)',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '0.86rem',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '7px',
                                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)',
                                transition: 'all 0.2s ease'
                              }}
                              title="Delete Appointment"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                      {apptSearchQuery ? `No pending appointments found matching "${apptSearchQuery}".` : 'No pending appointments in queue.'}
                    </div>
                  )}
                </div>
              </div>

              {/* 02. INPROGRESS APPOINTMENTS COLUMN - COLOR BLUE */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1.5px solid rgba(2, 132, 199, 0.4)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}>
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.18)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Stethoscope size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>In-Progress Appointments</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Get_All_Inprogress_Appointments</span>
                    </div>
                  </div>
                  <span style={{
                    background: 'rgba(2, 132, 199, 0.22)',
                    color: '#0284c7',
                    border: '1px solid rgba(2, 132, 199, 0.4)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.88rem',
                    fontWeight: '800'
                  }}>
                    {filterAppointments(inprogressAppointments).length}
                  </span>
                </div>

                {/* List of In-Progress Appointments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                  {isLoadingAppointments ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Loading in-progress appointments...
                    </div>
                  ) : filterAppointments(inprogressAppointments).length > 0 ? (
                    filterAppointments(inprogressAppointments).map((appt) => {
                      const patientObj = getPatientDetails(appt.PatientID);
                      const doctorObj = getDoctorDetails(appt.DoctorID);

                      return (
                        <div key={appt._id} style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease'
                        }}>
                          {/* Top Badge Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0284c7', background: 'rgba(2, 132, 199, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
                              {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Today'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0284c7', background: 'rgba(2, 132, 199, 0.2)', border: '1px solid rgba(2, 132, 199, 0.35)', padding: '3px 10px', borderRadius: '8px' }}>
                              In Progress
                            </span>
                          </div>

                          {/* Appointment Details */}
                          <div style={{ background: 'rgba(2, 132, 199, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(2, 132, 199, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800' }}>
                                PATIENT REG ID
                              </span>
                              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0284c7', fontFamily: 'var(--font-heading)' }}>
                                {patientObj?.PatientRegID || appt.PatientID}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Doctor Name:</span>
                              <strong style={{ color: 'var(--text-main)' }}>Dr. {doctorObj?.FullName || appt.DoctorID}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Room Number:</span>
                              <strong style={{ color: '#0284c7', background: 'rgba(2, 132, 199, 0.18)', padding: '2px 10px', borderRadius: '6px', fontSize: '0.86rem' }}>
                                Room {doctorObj?.RoomNumber || 'N/A'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                      {apptSearchQuery ? `No in-progress appointments found matching "${apptSearchQuery}".` : 'No in-progress appointments right now.'}
                    </div>
                  )}
                </div>
              </div>

              {/* 03. COMPLETED APPOINTMENTS COLUMN - COLOR GREEN */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '22px',
                padding: '22px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}>
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>Completed Appointments</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '600' }}>Get_All_Completed_Appointments</span>
                    </div>
                  </div>
                  <span style={{
                    background: 'rgba(16, 185, 129, 0.22)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.88rem',
                    fontWeight: '800'
                  }}>
                    {filterAppointments(completedAppointments).length}
                  </span>
                </div>

                {/* List of Completed Appointments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                  {isLoadingAppointments ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      Loading completed appointments...
                    </div>
                  ) : filterAppointments(completedAppointments).length > 0 ? (
                    filterAppointments(completedAppointments).map((appt) => {
                      const patientObj = getPatientDetails(appt.PatientID);
                      const doctorObj = getDoctorDetails(appt.DoctorID);

                      return (
                        <div key={appt._id} style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '18px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s ease'
                        }}>
                          {/* Top Badge Row */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
                              {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Today'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '8px' }}>
                              Completed
                            </span>
                          </div>

                          {/* Appointment Details */}
                          <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: '800' }}>
                                PATIENT REG ID
                              </span>
                              <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#10b981', fontFamily: 'var(--font-heading)' }}>
                                {patientObj?.PatientRegID || appt.PatientID}
                              </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Doctor Name:</span>
                              <strong style={{ color: 'var(--text-main)' }}>Dr. {doctorObj?.FullName || appt.DoctorID}</strong>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.94rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Room Number:</span>
                              <strong style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.18)', padding: '2px 10px', borderRadius: '6px', fontSize: '0.86rem' }}>
                                Room {doctorObj?.RoomNumber || 'N/A'}
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                      {apptSearchQuery ? `No completed appointments found matching "${apptSearchQuery}".` : 'No completed appointments recorded.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Billing & Payments Section (Exact same as Accountant Completed Bills) */}
        {activeTab === 'billing' && (
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
                const regId = getPatientRegIDForBill(pay).toLowerCase();
                const name = getPatientNameForBill(pay).toLowerCase();
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
                    const items = getPaymentItemsForBill(pay);
                    const patientName = getPatientNameForBill(pay);
                    const patientRegID = getPatientRegIDForBill(pay);

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

        {/* Settings Section */}
        {activeTab === 'settings' && (
          <div className="dash-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Header Toolbar */}
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} style={{ color: 'var(--teal-400)' }} />
                Account Settings & Profile Details
              </h3>

              <button
                onClick={fetchMyAdminDetails}
                disabled={isLoadingMyAdminDetails}
                className="dash-search-btn"
                style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                title="Refresh Profile Details"
              >
                <RefreshCw size={15} className={isLoadingMyAdminDetails ? 'spin-icon' : ''} />
                {isLoadingMyAdminDetails ? 'Refreshing...' : 'Refresh Details'}
              </button>
            </div>

            {myAdminDetailsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {myAdminDetailsError}
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
              {/* Profile Top Summary Banner */}
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
                  {getInitials(myAdminDetails?.FullName || user?.FullName || 'Administrator')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.FullName || user?.FullName || 'Administrator'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myAdminDetails?.Email || user?.Email || 'admin@apexhealth.org'}
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
                      Role: {myAdminDetails?.Role || 'Admin'}
                    </span>
                    <span style={{
                      background: myAdminDetails?.Approve ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: myAdminDetails?.Approve ? '#10b981' : '#f59e0b',
                      border: myAdminDetails?.Approve ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                      padding: '3px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}>
                      Status: {myAdminDetails?.Approve ? 'Approved ✅' : 'Pending Approval ⏳'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.FullName || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.Email || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--teal-400)' }}>
                    {myAdminDetails?.PhoneNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NIC Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.NICNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin ID</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.AdminID || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.Gender || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date of Birth</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.DateOfBirth ? myAdminDetails.DateOfBirth.split('T')[0] : 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.Department || 'Administration'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital Branch</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myAdminDetails?.HospitalBranch || 'Main Branch'}
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
                {/* 01. First Button: Update Phone Number */}
                <button
                  type="button"
                  onClick={() => {
                    setNewMyAdminPhone(myAdminDetails?.PhoneNumber || '');
                    setMyAdminPhoneError('');
                    setMyAdminPhoneSuccess('');
                    setShowMyAdminPhoneModal(true);
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

                {/* 02. Second Button: Update Password */}
                <button
                  type="button"
                  onClick={() => {
                    setMyAdminOldPassword('');
                    setMyAdminNewPassword('');
                    setMyAdminConfirmPassword('');
                    setShowMyAdminOldPassword(false);
                    setShowMyAdminNewPassword(false);
                    setShowMyAdminConfirmPassword(false);
                    setMyAdminPasswordError('');
                    setMyAdminPasswordSuccess('');
                    setShowMyAdminPasswordModal(true);
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

                {/* 03. Third Button: Delete Account */}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteAdminAccountPassword('');
                    setDeleteAdminAccountError('');
                    setShowDeleteAdminAccountModal(true);
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

        {/* TAB: MEDICINE STOCK */}
        {activeTab === 'medicine_stock' && (
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
      </main>

      {/* Edit Contact Number Modal */}
      {showEditModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', width: '90%', textAlign: 'left', padding: '36px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(2, 132, 199, 0.18)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pencil size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Edit Contact Number</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedPatient.FullName} ({selectedPatient.PatientRegID})</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {editError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateContactSubmit}>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label" htmlFor="editContactNum">New Contact Number (10 Digits)</label>
                <div className="input-field-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    id="editContactNum"
                    type="tel"
                    className="input-field"
                    placeholder="e.g. 0771234567"
                    maxLength={10}
                    value={editContactNumber}
                    onChange={(e) => setEditContactNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn-large"
                  style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && patientToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Patient Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete patient <strong>{patientToDelete.FullName}</strong> ({patientToDelete.PatientRegID})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Patient'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Modal Window */}
      {selectedDoctorModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedDoctorModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    License No: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedDoctorModal.MedicalLicenseNumber || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Doctor Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC / Passport No</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.NICPassportNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedDoctorModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Medical License No</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedDoctorModal.MedicalLicenseNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Specialization</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.Specialization || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Department</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.Department || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Room Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.RoomNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Years of Experience</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedDoctorModal.YearsOfExperience ?? 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Qualifications</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedDoctorModal.Qualifications) && selectedDoctorModal.Qualifications.length > 0
                    ? selectedDoctorModal.Qualifications.map(q => typeof q === 'object' ? q.Qualification : q).filter(Boolean).join(', ')
                    : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedDoctorModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>In-Hospital Availability</span>
                <strong style={{ fontSize: '0.98rem', color: selectedDoctorModal.InHospitalAvailability ? '#10b981' : 'var(--text-muted)' }}>
                  {selectedDoctorModal.InHospitalAvailability ? 'Available' : 'Unavailable'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Appointments</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {selectedDoctorModal.NoOfAppointments ?? 0} booked ({selectedDoctorModal.StopAppointments ? 'Stopped' : 'Active'})
                </strong>
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedDoctorModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleDoctorApproveStatus(selectedDoctorModal)}
                  disabled={isUpdatingDoctorStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingDoctorStatus ? 'Rejecting...' : 'Reject Doctor'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleDoctorApproveStatus(selectedDoctorModal)}
                  disabled={isUpdatingDoctorStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingDoctorStatus ? 'Approving...' : 'Approve Doctor'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenDoctorDeleteModal(selectedDoctorModal)}
                disabled={isDeletingDoctor}
              >
                <Trash2 size={18} />
                Delete Doctor
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedDoctorModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Doctor Confirmation Modal */}
      {showDoctorDeleteModal && doctorToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Doctor Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{doctorToDelete.FullName}</strong> (License: {doctorToDelete.MedicalLicenseNumber || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowDoctorDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteDoctor}
                disabled={isDeletingDoctor}
              >
                {isDeletingDoctor ? 'Deleting...' : 'Yes, Delete Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nurse Details Modal Window */}
      {selectedNurseModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HeartPulse size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedNurseModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    License No: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedNurseModal.NursingLicenseNumber || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNurseModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Nurse Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.NICNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedNurseModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Nursing License No</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedNurseModal.NursingLicenseNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Ward</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.AssignedWard || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Designation</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.Designation || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedNurseModal.EmployeeID || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Qualifications</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedNurseModal.Qualifications) && selectedNurseModal.Qualifications.length > 0
                    ? selectedNurseModal.Qualifications.map(q => typeof q === 'object' ? q.Qualification : q).filter(Boolean).join(', ')
                    : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedNurseModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>In-Hospital Availability</span>
                <strong style={{ fontSize: '0.98rem', color: selectedNurseModal.InHospitalAvailability ? '#10b981' : 'var(--text-muted)' }}>
                  {selectedNurseModal.InHospitalAvailability ? 'Available' : 'Unavailable'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Duty Status</span>
                <strong style={{ fontSize: '0.98rem', color: selectedNurseModal.InWork ? '#10b981' : 'var(--text-muted)' }}>
                  {selectedNurseModal.InWork ? 'On Duty' : 'Off Duty'}
                </strong>
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedNurseModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleNurseApproveStatus(selectedNurseModal)}
                  disabled={isUpdatingNurseStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingNurseStatus ? 'Rejecting...' : 'Reject Nurse'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleNurseApproveStatus(selectedNurseModal)}
                  disabled={isUpdatingNurseStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingNurseStatus ? 'Approving...' : 'Approve Nurse'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenNurseDeleteModal(selectedNurseModal)}
                disabled={isDeletingNurse}
              >
                <Trash2 size={18} />
                Delete Nurse
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedNurseModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Nurse Confirmation Modal */}
      {showNurseDeleteModal && nurseToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Nurse Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete nurse <strong>{nurseToDelete.FullName}</strong> (License: {nurseToDelete.NursingLicenseNumber || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowNurseDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteNurse}
                disabled={isDeletingNurse}
              >
                {isDeletingNurse ? 'Deleting...' : 'Yes, Delete Nurse'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Admin Details Modal Window */}
      {selectedAdminModal && (() => {
        const isCurrentLoggedInAdmin = user && (
          (selectedAdminModal._id && user._id && selectedAdminModal._id === user._id) ||
          (selectedAdminModal.Email && user.Email && selectedAdminModal.Email === user.Email) ||
          (selectedAdminModal.AdminID && user.AdminID && selectedAdminModal.AdminID === user.AdminID)
        );

        return (
          <div className="modal-overlay" style={{ zIndex: 1000 }}>
            <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedAdminModal.FullName}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      Admin ID: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedAdminModal.AdminID || 'N/A'}</span>
                      {isCurrentLoggedInAdmin && (
                        <span style={{ marginLeft: '8px', background: 'rgba(2, 132, 199, 0.2)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.35)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>
                          Currently Logged In
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAdminModal(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Admin Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.FullName || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedAdminModal.NICNumber || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedAdminModal.DateOfBirth)}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.Gender || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.PhoneNumber || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.Email || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.Address || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Admin ID</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedAdminModal.AdminID || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Department</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.Department || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Hospital Branch</span>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAdminModal.HospitalBranch || 'N/A'}</strong>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                  {selectedAdminModal.Approve ? (
                    <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Approved
                    </strong>
                  ) : (
                    <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <XCircle size={16} /> Pending / Rejected
                    </strong>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
                {!isCurrentLoggedInAdmin && (
                  <>
                    {selectedAdminModal.Approve ? (
                      <button
                        type="button"
                        className="submit-btn-large"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => handleToggleAdminApproveStatus(selectedAdminModal)}
                        disabled={isUpdatingAdminStatus}
                      >
                        <XCircle size={18} />
                        {isUpdatingAdminStatus ? 'Rejecting...' : 'Reject Admin'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="submit-btn-large"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => handleToggleAdminApproveStatus(selectedAdminModal)}
                        disabled={isUpdatingAdminStatus}
                      >
                        <CheckCircle2 size={18} />
                        {isUpdatingAdminStatus ? 'Approving...' : 'Approve Admin'}
                      </button>
                    )}

                    <button
                      type="button"
                      className="submit-btn-large"
                      style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      onClick={() => handleOpenAdminDeleteModal(selectedAdminModal)}
                      disabled={isDeletingAdmin}
                    >
                      <Trash2 size={18} />
                      Delete Admin
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setSelectedAdminModal(null)}
                  style={{ padding: '10px 20px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Delete Admin Confirmation Modal */}
      {showAdminDeleteModal && adminToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Admin Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete admin <strong>{adminToDelete.FullName}</strong> (Admin ID: {adminToDelete.AdminID || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowAdminDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteAdmin}
                disabled={isDeletingAdmin}
              >
                {isDeletingAdmin ? 'Deleting...' : 'Yes, Delete Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Receptionist Details Modal Window */}
      {selectedReceptionistModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedReceptionistModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Employee ID: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedReceptionistModal.EmployeeID || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceptionistModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Receptionist Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedReceptionistModal.NICNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedReceptionistModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedReceptionistModal.EmployeeID || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Desk Counter</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedReceptionistModal.AssignedDeskCounter || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Languages Spoken</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedReceptionistModal.Languages) && selectedReceptionistModal.Languages.length > 0
                    ? selectedReceptionistModal.Languages.map(l => typeof l === 'object' ? l.Language : l).filter(Boolean).join(', ')
                    : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedReceptionistModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedReceptionistModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleReceptionistApproveStatus(selectedReceptionistModal)}
                  disabled={isUpdatingReceptionistStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingReceptionistStatus ? 'Rejecting...' : 'Reject Receptionist'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleReceptionistApproveStatus(selectedReceptionistModal)}
                  disabled={isUpdatingReceptionistStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingReceptionistStatus ? 'Approving...' : 'Approve Receptionist'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenReceptionistDeleteModal(selectedReceptionistModal)}
                disabled={isDeletingReceptionist}
              >
                <Trash2 size={18} />
                Delete Receptionist
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedReceptionistModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Receptionist Confirmation Modal */}
      {showReceptionistDeleteModal && receptionistToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Receptionist Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete receptionist <strong>{receptionistToDelete.FullName}</strong> (ID: {receptionistToDelete.EmployeeID || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowReceptionistDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteReceptionist}
                disabled={isDeletingReceptionist}
              >
                {isDeletingReceptionist ? 'Deleting...' : 'Yes, Delete Receptionist'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pharmacist Details Modal Window */}
      {selectedPharmacistModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pill size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedPharmacistModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    License No: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedPharmacistModal.PharmacyLicenseNumber || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPharmacistModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Pharmacist Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedPharmacistModal.NICNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedPharmacistModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Pharmacy License No</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedPharmacistModal.PharmacyLicenseNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>License Expiry Date</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedPharmacistModal.LicenseExpiryDate)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Pharmacy</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.AssignedPharmacy || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedPharmacistModal.EmployeeID || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Qualifications</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedPharmacistModal.Qualifications) && selectedPharmacistModal.Qualifications.length > 0
                    ? selectedPharmacistModal.Qualifications.map(q => typeof q === 'object' ? q.Qualification : q).filter(Boolean).join(', ')
                    : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedPharmacistModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedPharmacistModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleTogglePharmacistApproveStatus(selectedPharmacistModal)}
                  disabled={isUpdatingPharmacistStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingPharmacistStatus ? 'Rejecting...' : 'Reject Pharmacist'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleTogglePharmacistApproveStatus(selectedPharmacistModal)}
                  disabled={isUpdatingPharmacistStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingPharmacistStatus ? 'Approving...' : 'Approve Pharmacist'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenPharmacistDeleteModal(selectedPharmacistModal)}
                disabled={isDeletingPharmacist}
              >
                <Trash2 size={18} />
                Delete Pharmacist
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedPharmacistModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Pharmacist Confirmation Modal */}
      {showPharmacistDeleteModal && pharmacistToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Pharmacist Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete pharmacist <strong>{pharmacistToDelete.FullName}</strong> (License: {pharmacistToDelete.PharmacyLicenseNumber || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowPharmacistDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeletePharmacist}
                disabled={isDeletingPharmacist}
              >
                {isDeletingPharmacist ? 'Deleting...' : 'Yes, Delete Pharmacist'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Accountant Details Modal Window */}
      {selectedAccountantModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedAccountantModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Employee ID: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedAccountantModal.EmployeeID || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccountantModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Accountant Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedAccountantModal.NICNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedAccountantModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedAccountantModal.EmployeeID || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Job Position</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.JobPosition || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Department</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedAccountantModal.Department || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Qualifications</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedAccountantModal.Qualifications) && selectedAccountantModal.Qualifications.length > 0
                    ? selectedAccountantModal.Qualifications.map(q => typeof q === 'object' ? q.Qualification : q).filter(Boolean).join(', ')
                    : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedAccountantModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedAccountantModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleAccountantApproveStatus(selectedAccountantModal)}
                  disabled={isUpdatingAccountantStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingAccountantStatus ? 'Rejecting...' : 'Reject Accountant'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleAccountantApproveStatus(selectedAccountantModal)}
                  disabled={isUpdatingAccountantStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingAccountantStatus ? 'Approving...' : 'Approve Accountant'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenAccountantDeleteModal(selectedAccountantModal)}
                disabled={isDeletingAccountant}
              >
                <Trash2 size={18} />
                Delete Accountant
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedAccountantModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Accountant Confirmation Modal */}
      {showAccountantDeleteModal && accountantToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Accountant Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete accountant <strong>{accountantToDelete.FullName}</strong> (ID: {accountantToDelete.EmployeeID || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowAccountantDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteAccountant}
                disabled={isDeletingAccountant}
              >
                {isDeletingAccountant ? 'Deleting...' : 'Yes, Delete Accountant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laboratory Staff Details Modal Window */}
      {selectedLabStaffModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '720px', width: '92%', textAlign: 'left', padding: '32px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(45, 212, 191, 0.18)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Microscope size={28} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedLabStaffModal.FullName}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    License No: <span style={{ color: 'var(--teal-400)', fontWeight: '800' }}>{selectedLabStaffModal.LaboratoryLicenseNumber || 'N/A'}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLabStaffModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Laboratory Staff Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Name</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.FullName || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>NIC Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.NICNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date of Birth</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{formatDateOnly(selectedLabStaffModal.DateOfBirth)}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Gender</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.Gender || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Phone Number</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.PhoneNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.Email || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.Address || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Laboratory License No</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--teal-400)' }}>{selectedLabStaffModal.LaboratoryLicenseNumber || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Employee ID</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.EmployeeID || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Lab Specialization</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.LabSpecialization || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Assigned Unit</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{selectedLabStaffModal.AssignedLaboratoryUnit || 'N/A'}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Qualifications</span>
                <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>
                  {Array.isArray(selectedLabStaffModal.Qualifications) && selectedLabStaffModal.Qualifications.length > 0
                    ? selectedLabStaffModal.Qualifications.map(q => typeof q === 'object' ? q.Qualification : q).filter(Boolean).join(', ')
                    : typeof selectedLabStaffModal.Qualifications === 'string'
                      ? selectedLabStaffModal.Qualifications
                      : 'N/A'}
                </strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Approval Status</span>
                {selectedLabStaffModal.Approve ? (
                  <strong style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> Approved
                  </strong>
                ) : (
                  <strong style={{ color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Pending / Rejected
                  </strong>
                )}
              </div>
            </div>

            {/* Modal Footer Actions: Approve/Reject, Delete, Close */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px', flexWrap: 'wrap' }}>
              {selectedLabStaffModal.Approve ? (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleLabStaffApproveStatus(selectedLabStaffModal)}
                  disabled={isUpdatingLabStaffStatus}
                >
                  <XCircle size={18} />
                  {isUpdatingLabStaffStatus ? 'Rejecting...' : 'Reject Lab Staff'}
                </button>
              ) : (
                <button
                  type="button"
                  className="submit-btn-large"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleToggleLabStaffApproveStatus(selectedLabStaffModal)}
                  disabled={isUpdatingLabStaffStatus}
                >
                  <CheckCircle2 size={18} />
                  {isUpdatingLabStaffStatus ? 'Approving...' : 'Approve Lab Staff'}
                </button>
              )}

              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '10px 22px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => handleOpenLabStaffDeleteModal(selectedLabStaffModal)}
                disabled={isDeletingLabStaff}
              >
                <Trash2 size={18} />
                Delete Lab Staff
              </button>

              <button
                type="button"
                className="back-btn"
                onClick={() => setSelectedLabStaffModal(null)}
                style={{ padding: '10px 20px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Lab Staff Confirmation Modal */}
      {showLabStaffDeleteModal && labStaffToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '480px', width: '90%', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Trash2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>Delete Laboratory Staff Record?</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete laboratory staff <strong>{labStaffToDelete.FullName}</strong> (License: {labStaffToDelete.LaboratoryLicenseNumber || 'N/A'})? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                onClick={() => setShowLabStaffDeleteModal(false)}
                style={{ padding: '12px 24px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn-large"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '12px 28px', fontSize: '0.95rem' }}
                onClick={handleConfirmDeleteLabStaff}
                disabled={isDeletingLabStaff}
              >
                {isDeletingLabStaff ? 'Deleting...' : 'Yes, Delete Lab Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Appointment Confirmation Popup Window */}
      {showDeleteApptModal && apptToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertCircle size={32} />
            </div>

            <h3 style={{ margin: '0 0 24px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Are you sure you want to delete this appointment?
            </h3>

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => {
                  setShowDeleteApptModal(false);
                  setApptToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingAppt}
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
                onClick={handleConfirmDeleteAppt}
              >
                {isDeletingAppt ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 01. UPDATE PHONE NUMBER MODAL */}
      {showMyAdminPhoneModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={20} style={{ color: 'var(--teal-400)' }} />
                Update Phone Number
              </h3>
              <button className="icon-btn" onClick={() => setShowMyAdminPhoneModal(false)}>
                <X size={20} />
              </button>
            </div>

            {myAdminPhoneError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {myAdminPhoneError}
              </div>
            )}

            {myAdminPhoneSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {myAdminPhoneSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateMyAdminPhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    value={newMyAdminPhone}
                    onChange={(e) => setNewMyAdminPhone(e.target.value.replace(/\D/g, ''))}
                    className="dash-search-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowMyAdminPhoneModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingMyAdminPhone}>
                  {isUpdatingMyAdminPhone ? 'Updating...' : 'Save Phone Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 02. UPDATE PASSWORD MODAL */}
      {showMyAdminPasswordModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} style={{ color: 'var(--teal-400)' }} />
                Update Password
              </h3>
              <button className="icon-btn" onClick={() => setShowMyAdminPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>

            {myAdminPasswordError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {myAdminPasswordError}
              </div>
            )}

            {myAdminPasswordSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {myAdminPasswordSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateMyAdminPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Old Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showMyAdminOldPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={myAdminOldPassword}
                    onChange={(e) => setMyAdminOldPassword(e.target.value)}
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
                    onClick={() => setShowMyAdminOldPassword(!showMyAdminOldPassword)}
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
                    title={showMyAdminOldPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showMyAdminOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  New Password (Min 6 Characters)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showMyAdminNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={myAdminNewPassword}
                    onChange={(e) => setMyAdminNewPassword(e.target.value)}
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
                    onClick={() => setShowMyAdminNewPassword(!showMyAdminNewPassword)}
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
                    title={showMyAdminNewPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showMyAdminNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showMyAdminConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={myAdminConfirmPassword}
                    onChange={(e) => setMyAdminConfirmPassword(e.target.value)}
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
                    onClick={() => setShowMyAdminConfirmPassword(!showMyAdminConfirmPassword)}
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
                    title={showMyAdminConfirmPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showMyAdminConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowMyAdminPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingMyAdminPassword}>
                  {isUpdatingMyAdminPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 03. DELETE ACCOUNT MODAL */}
      {showDeleteAdminAccountModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={20} />
                Delete Account Confirmation
              </h3>
              <button className="icon-btn" onClick={() => setShowDeleteAdminAccountModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', fontSize: '0.88rem' }}>
              <strong>Warning:</strong> Deleting your account will permanently remove your administrator credentials from the system.
            </div>

            {deleteAdminAccountError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {deleteAdminAccountError}
              </div>
            )}

            <form onSubmit={handleDeleteMyAdminAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Enter Password to Confirm Deletion
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showDeleteAdminPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={deleteAdminAccountPassword}
                    onChange={(e) => setDeleteAdminAccountPassword(e.target.value)}
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
                    onClick={() => setShowDeleteAdminPassword(!showDeleteAdminPassword)}
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
                    title={showDeleteAdminPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showDeleteAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowDeleteAdminAccountModal(false)}>
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
                  disabled={isDeletingAdminAccount}
                >
                  {isDeletingAdminAccount ? 'Deleting Account...' : 'Confirm Account Deletion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
