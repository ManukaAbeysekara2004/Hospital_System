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
  Trash2,
  RefreshCw,
  Lock,
  Key,
  Mail,
  Eye,
  EyeOff
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

const TAB_TITLES = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  doctors: 'Doctors',
  settings: 'Settings'
};

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

  // Active Navigation Tab State ('dashboard' | 'appointments')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Menu Appointment Page States
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [inprogressAppointments, setInprogressAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');
  const [apptSearchQuery, setApptSearchQuery] = useState('');

  // Menu Doctor Page States & Fetch (using Get_All_Doctor_Details endpoint)
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

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

  // 03. Sorting Rule: InHospitalAvailability true first (sorted by NoOfAppointments asc), InHospitalAvailability false last (sorted by NoOfAppointments asc)
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

      // InHospitalAvailability true first, false last
      if (availA && !availB) return -1;
      if (!availA && availB) return 1;

      // Sort by NoOfAppointments ascending (smallest first)
      const countA = typeof a.NoOfAppointments === 'number' ? a.NoOfAppointments : 0;
      const countB = typeof b.NoOfAppointments === 'number' ? b.NoOfAppointments : 0;
      return countA - countB;
    });

  // Delete Appointment Confirmation Modal State
  const [showDeleteApptModal, setShowDeleteApptModal] = useState(false);
  const [apptToDelete, setApptToDelete] = useState(null);
  const [isDeletingAppt, setIsDeletingAppt] = useState(false);

  // Settings & Receptionist Profile State (Get_Receptionist_Details)
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

  // 02. First Button: Update Phone Number Modal State
  const [showMyPhoneModal, setShowMyPhoneModal] = useState(false);
  const [newMyPhone, setNewMyPhone] = useState('');
  const [myPhoneError, setMyPhoneError] = useState('');
  const [myPhoneSuccess, setMyPhoneSuccess] = useState('');
  const [isUpdatingMyPhone, setIsUpdatingMyPhone] = useState(false);

  // 03. Second Button: Update Password Modal State & Visibility Toggles
  const [showMyPasswordModal, setShowMyPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [myPasswordError, setMyPasswordError] = useState('');
  const [myPasswordSuccess, setMyPasswordSuccess] = useState('');
  const [isUpdatingMyPassword, setIsUpdatingMyPassword] = useState(false);

  // 04. Third Button: Delete Account Modal State
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 01. Fetch Receptionist Details using Get_Receptionist_Details endpoint
  const fetchMyReceptionistDetails = async () => {
    const recId = user?._id || user?.id || user?.receptionistDetails?._id;
    if (!recId) return;

    setIsLoadingMyDetails(true);
    setMyDetailsError('');

    try {
      const response = await fetch(`http://localhost:5000/api/receptionist/details/${recId}`);
      const data = await response.json();
      if (response.ok && data.receptionistDetails) {
        setMyDetails(data.receptionistDetails);
        setNewMyPhone(data.receptionistDetails.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load receptionist details.');
      }
    } catch (err) {
      console.error('Error fetching receptionist details:', err);
      setMyDetailsError('Could not connect to backend server to load profile.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  // 02. Update Phone Number Submit Handler (calls Update_Phone_Number)
  const handleUpdateMyPhoneSubmit = async (e) => {
    e.preventDefault();
    setMyPhoneError('');
    setMyPhoneSuccess('');

    const recId = user?._id || user?.id || user?.receptionistDetails?._id;
    if (!recId) {
      setMyPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newMyPhone.trim())) {
      setMyPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingMyPhone(true);

    try {
      const response = await fetch(`http://localhost:5000/api/receptionist/update-phone/${recId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ PhoneNumber: newMyPhone.trim() })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsUpdatingMyPhone(false);
        setMyPhoneSuccess('Phone Number updated successfully!');
        setTimeout(() => {
          setShowMyPhoneModal(false);
          setMyPhoneSuccess('');
        }, 1200);
        fetchMyReceptionistDetails();
      } else {
        setIsUpdatingMyPhone(false);
        setMyPhoneError(resData.message || 'Failed to update phone number.');
      }
    } catch (err) {
      console.error('Error updating phone number:', err);
      setIsUpdatingMyPhone(false);
      setMyPhoneError('Could not connect to backend server.');
    }
  };

  // 03. Update Password Submit Handler (calls Update_Password)
  const handleUpdateMyPasswordSubmit = async (e) => {
    e.preventDefault();
    setMyPasswordError('');
    setMyPasswordSuccess('');

    const recId = user?._id || user?.id || user?.receptionistDetails?._id;
    if (!recId) {
      setMyPasswordError('User session ID not found.');
      return;
    }

    if (!oldPassword) {
      setMyPasswordError('Please enter your Old Password.');
      return;
    }

    if (newPassword.length < 6) {
      setMyPasswordError('New Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMyPasswordError('New Password and Confirm New Password do not match.');
      return;
    }

    setIsUpdatingMyPassword(true);

    try {
      const response = await fetch(`http://localhost:5000/api/receptionist/update-password/${recId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          OldPassword: oldPassword,
          NewPassword: newPassword
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsUpdatingMyPassword(false);
        setMyPasswordSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowMyPasswordModal(false);
          setMyPasswordSuccess('');
        }, 1200);
      } else {
        setIsUpdatingMyPassword(false);
        setMyPasswordError(resData.message || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setIsUpdatingMyPassword(false);
      setMyPasswordError('Could not connect to backend server.');
    }
  };

  // 04. Delete Receptionist Submit Handler (calls Delete_Receptionist)
  const handleDeleteMyAccountSubmit = async (e) => {
    e.preventDefault();
    setDeleteAccountError('');

    const recId = user?._id || user?.id || user?.receptionistDetails?._id;
    if (!recId) {
      setDeleteAccountError('User session ID not found.');
      return;
    }

    if (!deleteAccountPassword) {
      setDeleteAccountError('Please enter your Password to confirm deletion.');
      return;
    }

    setIsDeletingAccount(true);

    try {
      const response = await fetch(`http://localhost:5000/api/receptionist/delete/${recId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receptionistId: recId,
          Password: deleteAccountPassword
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setIsDeletingAccount(false);
        setShowDeleteAccountModal(false);
        onLogout();
      } else {
        setIsDeletingAccount(false);
        setDeleteAccountError(resData.message || 'Failed to delete account. Incorrect password.');
      }
    } catch (err) {
      console.error('Error deleting receptionist account:', err);
      setIsDeletingAccount(false);
      setDeleteAccountError('Could not connect to backend server.');
    }
  };

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
      // Call create_Payment on Payment_Controller (Item 01)
      try {
        await fetch('http://localhost:5000/api/payment/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ PatientID: patientId })
        });
      } catch (e) {
        console.error('Error creating payment:', e);
      }

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
        fetchAllAppointments();
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

  // Fetch All Appointment Categories in Parallel (Get_All_Pending_Appointments, Get_All_Inprogress_Appointments, Get_All_Completed_Appointments)
  const fetchAllAppointments = async () => {
    setIsLoadingAppointments(true);
    setAppointmentsError('');
    try {
      const [pendingRes, inprogressRes, completedRes, doctorsRes, patientsRes] = await Promise.all([
        fetch('http://localhost:5000/api/appointment/get-all-pending-appointments'),
        fetch('http://localhost:5000/api/appointment/get-all-inprogress-appointments'),
        fetch('http://localhost:5000/api/appointment/get-all-completed-appointments'),
        fetch('http://localhost:5000/api/doctor/get-all-doctor-details'),
        fetch('http://localhost:5000/api/patient/get-all-patients')
      ]);

      const pendingData = await pendingRes.json();
      const inprogressData = await inprogressRes.json();
      const completedData = await completedRes.json();
      const doctorsData = doctorsRes.ok ? await doctorsRes.json() : null;
      const patientsData = patientsRes.ok ? await patientsRes.json() : null;

      if (doctorsData?.allDoctor) {
        setDoctorsList(doctorsData.allDoctor);
      }
      if (patientsData?.allPatients) {
        const sortedPatients = (patientsData.allPatients || []).sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return (b.PatientRegID || '').localeCompare(a.PatientRegID || '');
        });
        setPatients(sortedPatients);
      }

      if (pendingRes.ok) {
        setPendingAppointments(pendingData.allPendingAppointments || []);
      } else {
        setAppointmentsError(pendingData.message || 'Failed to fetch pending appointments.');
      }

      if (inprogressRes.ok) {
        setInprogressAppointments(inprogressData.allInprogressAppointments || []);
      }

      if (completedRes.ok) {
        setCompletedAppointments(completedData.allCompletedAppointments || []);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointmentsError('Could not connect to backend server to load appointments.');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAllAppointments();
    fetchAllDoctorDetails();
  }, []);

  // Helper to resolve Patient details by ID or object
  const getPatientDetails = (patientId) => {
    if (!patientId) return null;
    if (typeof patientId === 'object' && patientId.PatientRegID) return patientId;
    return patients.find(p => p._id === patientId || p.PatientRegID === patientId) || null;
  };

  // Helper to resolve Doctor details by ID or object
  const getDoctorDetails = (doctorId) => {
    if (!doctorId) return null;
    if (typeof doctorId === 'object' && doctorId.FullName) return doctorId;
    return doctorsList.find(d => d._id === doctorId) || null;
  };

  // Open Delete Appointment Modal
  const handleOpenDeleteApptModal = (appt) => {
    setApptToDelete(appt);
    setShowDeleteApptModal(true);
  };

  // Helper to delete payment model when appointment is deleted (Item 02)
  const deletePaymentForPatient = async (patientId) => {
    if (!patientId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/payment/get-payment-details-by-patientid/${patientId}`);
      const data = await res.json();
      const payObj = data.data?.isPaymentExist || data.isPaymentExist;
      if (payObj && payObj._id) {
        await fetch(`http://localhost:5000/api/payment/delete-payment/${payObj._id}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Error deleting payment for patient:', err);
    }
  };

  // Confirm and Execute Delete_Appointment Call
  const handleConfirmDeleteAppt = async () => {
    if (!apptToDelete) return;
    setIsDeletingAppt(true);

    try {
      if (apptToDelete.PatientID) {
        await deletePaymentForPatient(apptToDelete.PatientID);
      }
      const response = await fetch(`http://localhost:5000/api/appointment/delete-appointment/${apptToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingAppt(false);
        setShowDeleteApptModal(false);
        setApptToDelete(null);
        fetchAllAppointments();
        fetchPatients();
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

  // Filter Appointments by Search Query (matching PatientRegID or Patient FullName)
  const filterAppointments = (apptList) => {
    if (!apptSearchQuery.trim()) return apptList;
    const q = apptSearchQuery.toLowerCase().trim();
    return apptList.filter((appt) => {
      const patientObj = getPatientDetails(appt.PatientID);
      const regId = (patientObj?.PatientRegID || appt.PatientID || '').toLowerCase();
      const patientName = (patientObj?.FullName || '').toLowerCase();
      return regId.includes(q) || patientName.includes(q);
    });
  };

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
            <button
              className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('appointments');
                fetchAllAppointments();
              }}
            >
              <Calendar size={18} />
              Appointments
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('doctors');
                fetchAllDoctorDetails();
              }}
            >
              <Stethoscope size={18} />
              Doctors
            </button>
            <button
              className={`dash-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('settings');
                fetchMyReceptionistDetails();
              }}
            >
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
            {activeTab === 'dashboard' && (
              <p>
                Apex Health International Hospital live operations overview. Manage patient registrations, appointment booking, and desk support operations.
              </p>
            )}
          </div>

          {/* Right Active Page Title Badge */}
          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {activeTab === 'appointments' ? (
          /* ========================================================= */
          /* MENU APPOINTMENT PAGE - 3 PARALLEL SECTIONS & SEARCH BAR */
          /* ========================================================= */
          <div className="dash-appointments-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Appointment Page Header & Search Toolbar */}
            {/* Centered Search Bar & Refresh Toolbar */}
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
                  onClick={fetchAllAppointments}
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

            {appointmentsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} />
                {appointmentsError}
              </div>
            )}

            {/* Requirement 01: 3 Parallel Columns (Pending, Inprogress, Completed) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              alignItems: 'start'
            }}>

              {/* 01. PENDING APPOINTMENTS COLUMN - COLOR YELLOW (Get_All_Pending_Appointments) */}
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
                          {/* Top Badge Row - Date badge yellow */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
                              {appt.createdAt ? new Date(appt.createdAt).toLocaleDateString() : 'Today'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 10px', borderRadius: '8px' }}>
                              Pending
                            </span>
                          </div>

                          {/* Appointment Details: ONLY Patient Reg ID, Doctor Name, Room Number */}
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
                              title="Delete Appointment (Delete_Appointment)"
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

              {/* 02. INPROGRESS APPOINTMENTS COLUMN - COLOR BLUE (Get_All_Inprogress_Appointments) */}
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

                          {/* Appointment Details: ONLY Patient Reg ID, Doctor Name, Room Number */}
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

              {/* 03. COMPLETED APPOINTMENTS COLUMN (Get_All_Completed_Appointments) */}
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

                          {/* Appointment Details: ONLY Patient Reg ID, Doctor Name, Room Number */}
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
                      {apptSearchQuery ? `No completed appointments found matching "${apptSearchQuery}".` : 'No completed appointments recorded yet.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'doctors' ? (
          /* ========================================================= */
          /* MENU DOCTOR PAGE - 4 BOXES PER ROW & SORTED DOCTORS       */
          /* ========================================================= */
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

            {/* Doctors Grid - 4 Boxes Per Line */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              paddingBottom: '20px'
            }}>
              {filteredAndSortedDoctors.length > 0 ? (
                filteredAndSortedDoctors.map((doc) => {
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
                })
              ) : (
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
                  {isLoadingDoctors ? 'Loading doctor details...' : doctorSearchQuery ? `No doctor matches found for "${doctorSearchQuery}".` : 'No doctor records found.'}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          /* ========================================================= */
          /* MENU SETTINGS PAGE - RECEPTIONIST DETAILS & 3 BUTTONS      */
          /* ========================================================= */
          <div className="dash-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Header Toolbar */}
            <div className="dash-search-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} style={{ color: 'var(--teal-400)' }} />
                Account Settings & Profile Details
              </h3>

              <button
                onClick={fetchMyReceptionistDetails}
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
                  {getInitials(myDetails?.FullName || user?.FullName || 'Receptionist')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.FullName || user?.FullName || 'Receptionist'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'receptionist@apexhealth.org'}
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
                      Role: {myDetails?.Role || 'Receptionist'}
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
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>NIC / Passport Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.NICNumber || myDetails?.NICPassportNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee ID</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.EmployeeID || 'N/A'}
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Department || 'Reception / Desk Support'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Languages</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {Array.isArray(myDetails?.Languages)
                      ? myDetails.Languages.map(l => (typeof l === 'object' && l?.Language ? l.Language : l)).filter(Boolean).join(', ') || 'N/A'
                      : (myDetails?.Languages || 'N/A')}
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
                {/* 02. First Button: Update Phone Number */}
                <button
                  type="button"
                  onClick={() => {
                    setNewMyPhone(myDetails?.PhoneNumber || '');
                    setMyPhoneError('');
                    setMyPhoneSuccess('');
                    setShowMyPhoneModal(true);
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

                {/* 03. Second Button: Update Password */}
                <button
                  type="button"
                  onClick={() => {
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setShowOldPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                    setMyPasswordError('');
                    setMyPasswordSuccess('');
                    setShowMyPasswordModal(true);
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

                {/* 04. Third Button: Delete Account */}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteAccountPassword('');
                    setDeleteAccountError('');
                    setShowDeleteAccountModal(true);
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
        ) : (
          /* ========================================================= */
          /* MAIN PATIENT DETAILS TABLE DASHBOARD VIEW                 */
          /* ========================================================= */
          <>
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
          </>
        )}
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

      {/* Delete Appointment Confirmation Modal Window */}
      {showDeleteApptModal && apptToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '22px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Delete Pending Appointment?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete this pending appointment for{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                {getPatientDetails(apptToDelete.PatientID)?.FullName || 'Patient ID: ' + apptToDelete.PatientID}
              </strong>{' '}
              (<span style={{ color: 'var(--teal-400)', fontWeight: '700' }}>{getPatientDetails(apptToDelete.PatientID)?.PatientRegID || apptToDelete.PatientID}</span>) assigned to{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                Dr. {getDoctorDetails(apptToDelete.DoctorID)?.FullName || apptToDelete.DoctorID}
              </strong>?
            </p>

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
      {showMyPhoneModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={20} style={{ color: 'var(--teal-400)' }} />
                Update Phone Number
              </h3>
              <button className="icon-btn" onClick={() => setShowMyPhoneModal(false)}>
                <X size={20} />
              </button>
            </div>

            {myPhoneError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {myPhoneError}
              </div>
            )}

            {myPhoneSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {myPhoneSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateMyPhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    value={newMyPhone}
                    onChange={(e) => setNewMyPhone(e.target.value.replace(/\D/g, ''))}
                    className="dash-search-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowMyPhoneModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingMyPhone}>
                  {isUpdatingMyPhone ? 'Updating...' : 'Save Phone Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 02. UPDATE PASSWORD MODAL */}
      {showMyPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} style={{ color: 'var(--teal-400)' }} />
                Update Password
              </h3>
              <button className="icon-btn" onClick={() => setShowMyPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>

            {myPasswordError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {myPasswordError}
              </div>
            )}

            {myPasswordSuccess && (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                {myPasswordSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateMyPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Old Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
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
                    onClick={() => setShowOldPassword(!showOldPassword)}
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
                    title={showOldPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  New Password (Min 6 Characters)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
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
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    title={showNewPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowMyPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" disabled={isUpdatingMyPassword}>
                  {isUpdatingMyPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 03. DELETE ACCOUNT MODAL */}
      {showDeleteAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={20} />
                Delete Account Confirmation
              </h3>
              <button className="icon-btn" onClick={() => setShowDeleteAccountModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '18px', fontSize: '0.88rem' }}>
              <strong>Warning:</strong> Deleting your account will permanently remove your receptionist credentials from the system.
            </div>

            {deleteAccountError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {deleteAccountError}
              </div>
            )}

            <form onSubmit={handleDeleteMyAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Enter Password to Confirm Deletion
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={deleteAccountPassword}
                    onChange={(e) => setDeleteAccountPassword(e.target.value)}
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
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
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
                    title={showDeletePassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showDeletePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="back-btn" onClick={() => setShowDeleteAccountModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


