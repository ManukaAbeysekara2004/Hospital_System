import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  LogOut,
  Calendar,
  Clock,
  Sun,
  Moon,
  LayoutDashboard,
  Users,
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
  Activity,
  UserCheck,
  Plus,
  Minus,
  UserPlus,
  FileText,
  Pill,
  XCircle
} from 'lucide-react';

const TAB_TITLES = {
  dashboard: 'Dashboard Overview',
  patients: 'Patient Care',
  appointments: 'Complete Appointments',
  doctors: 'Medical Specialists',
  settings: 'Account Settings'
};

export default function DoctorDashboard({ user, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Doctor Settings State
  const [myDetails, setMyDetails] = useState(null);
  const [isLoadingMyDetails, setIsLoadingMyDetails] = useState(false);
  const [myDetailsError, setMyDetailsError] = useState('');

  // Data States
  const [allPatients, setAllPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Doctors Page States & Fetch (matching Receptionist Dashboard)
  const [doctorsList, setDoctorsList] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [doctorFetchError, setDoctorFetchError] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Logged-in Doctor Specific Appointments State (Get_All_Appointments_By_Doctor_ID)
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [isLoadingDoctorAppts, setIsLoadingDoctorAppts] = useState(false);
  const [doctorApptsError, setDoctorApptsError] = useState('');
  const [dashSearchQuery, setDashSearchQuery] = useState('');
  const [completeApptSearchQuery, setCompleteApptSearchQuery] = useState('');

  // Print Doctor Note Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);

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

  // Delete Appointment Confirmation Modal State
  const [selectedApptToDelete, setSelectedApptToDelete] = useState(null);
  const [isDeletingAppt, setIsDeletingAppt] = useState(false);
  const [deleteApptError, setDeleteApptError] = useState('');

  // Active Consultation State for Patient Care
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [treatmentNote, setTreatmentNote] = useState('');
  const [isStartingAppt, setIsStartingAppt] = useState(false);
  const [isCompletingAppt, setIsCompletingAppt] = useState(false);
  const [careError, setCareError] = useState('');

  // Nurse & Nurse Works State for Patient Care
  const [showAddNurseModal, setShowAddNurseModal] = useState(false);
  const [nursesList, setNursesList] = useState([]);
  const [isLoadingNurses, setIsLoadingNurses] = useState(false);
  const [nurseSearchQuery, setNurseSearchQuery] = useState('');
  const [nurseFetchError, setNurseFetchError] = useState('');

  const [assignedNurseWork, setAssignedNurseWork] = useState(null);
  const [newWorkText, setNewWorkText] = useState('');
  const [isAssigningNurse, setIsAssigningNurse] = useState(false);
  const [isAddingWork, setIsAddingWork] = useState(false);

  // Delete Work Item Confirmation Modal State
  const [selectedWorkToDelete, setSelectedWorkToDelete] = useState(null);
  const [isDeletingWork, setIsDeletingWork] = useState(false);
  const [deleteWorkError, setDeleteWorkError] = useState('');

  // Remove Nurse Assignment Confirmation Modal State
  const [showRemoveNurseModal, setShowRemoveNurseModal] = useState(false);
  const [isRemovingNurseWork, setIsRemovingNurseWork] = useState(false);
  const [removeNurseError, setRemoveNurseError] = useState('');

  // Lab Tests State for Patient Care
  const [requestedBloodTests, setRequestedBloodTests] = useState([]);
  const [requestedUrineTests, setRequestedUrineTests] = useState([]);
  const [isRequestingBloodTest, setIsRequestingBloodTest] = useState(false);
  const [isRequestingUrineTest, setIsRequestingUrineTest] = useState(false);
  const [isDeletingBloodTest, setIsDeletingBloodTest] = useState(false);
  const [isDeletingUrineTest, setIsDeletingUrineTest] = useState(false);

  // Medicine Bill State for Patient Care
  const [assignedMedicineBill, setAssignedMedicineBill] = useState(null);
  const [allMedicinesForBill, setAllMedicinesForBill] = useState([]);
  const [isLoadingMedicinesForBill, setIsLoadingMedicinesForBill] = useState(false);
  const [medBillSearchQuery, setMedBillSearchQuery] = useState('');
  const [draftBillMedicines, setDraftBillMedicines] = useState([]);
  const [selectedTabletForQty, setSelectedTabletForQty] = useState(null);
  const [isCreatingMedicineBill, setIsCreatingMedicineBill] = useState(false);
  const [isSubmittingMedicineBill, setIsSubmittingMedicineBill] = useState(false);
  const [isDeletingMedicineBill, setIsDeletingMedicineBill] = useState(false);
  const [isBillCompleted, setIsBillCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const doctorId = user?._id || user?.id || user?.existingDoctor?._id || myDetails?._id;

  const fetchMyDetails = async () => {
    if (!doctorId) return;
    setIsLoadingMyDetails(true);
    setMyDetailsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/details/${doctorId}`);
      const data = await response.json();
      if (response.ok) {
        const details = data.existingDoctor || data.doctorDetails || data.doctor;
        setMyDetails(details);
        setNewPhone(details?.PhoneNumber || '');
      } else {
        setMyDetailsError(data.message || 'Failed to load doctor details.');
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
      setMyDetailsError('Could not connect to backend server.');
    } finally {
      setIsLoadingMyDetails(false);
    }
  };

  // Fetch Doctor List (matching Receptionist Dashboard)
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

  // Fetch Patients List
  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient/get-all-patients');
      const data = await response.json();
      if (response.ok) {
        setAllPatients(data.allPatients || []);
      }
    } catch (e) {
      console.error('Error fetching patients:', e);
    }
  };

  // Fetch Appointments by Doctor ID (Get_All_Appointments_By_Doctor_ID)
  const fetchDoctorSpecificAppointments = async () => {
    if (!doctorId) return;
    setIsLoadingDoctorAppts(true);
    setDoctorApptsError('');
    try {
      const response = await fetch(`http://localhost:5000/api/appointment/get-all-appointments-by-doctor/${doctorId}`);
      const data = await response.json();
      if (response.ok) {
        const appts = Array.isArray(data.existingAppointment)
          ? data.existingAppointment
          : data.existingAppointment
            ? [data.existingAppointment]
            : [];
        setDoctorAppointments(appts);

        // Auto-restore in-progress consultation if active
        const inprog = appts.find(a => (a.AppointmentStatus || '').toLowerCase() === 'inprogress');
        if (inprog && !activeConsultation) {
          setActiveConsultation(inprog);
          setTreatmentNote(inprog.DoctorNote || '');
        }
      } else {
        setDoctorAppointments([]);
        setDoctorApptsError(data.message || 'No appointments found.');
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
      setDoctorApptsError('Could not connect to backend server.');
    } finally {
      setIsLoadingDoctorAppts(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAllDoctorDetails();
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorSpecificAppointments();
    }
  }, [doctorId, activeTab]);

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchMyDetails();
    } else if (activeTab === 'doctors') {
      fetchAllDoctorDetails();
    }
  }, [activeTab]);

  // Helpers to resolve patient and doctor details
  const getPatientDetails = (patientId) => {
    if (!patientId) return null;
    if (typeof patientId === 'object' && patientId.PatientRegID) return patientId;
    return allPatients.find(p => String(p._id) === String(patientId) || p.PatientID === patientId || p.PatientRegID === patientId) || null;
  };

  const getDoctorDetails = (docId) => {
    if (!docId) return null;
    if (typeof docId === 'object' && docId.FullName) return docId;
    return doctorsList.find(d => String(d._id) === String(docId)) || null;
  };

  // Delete Appointment Modal Open & Confirm Handlers (Delete_Appointment)
  const handleOpenDeleteApptModal = (appt) => {
    setSelectedApptToDelete(appt);
    setDeleteApptError('');
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
      console.error('Error deleting payment:', err);
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!selectedApptToDelete) return;
    setIsDeletingAppt(true);
    setDeleteApptError('');
    try {
      if (selectedApptToDelete.PatientID) {
        await deletePaymentForPatient(selectedApptToDelete.PatientID);
      }
      const response = await fetch(`http://localhost:5000/api/appointment/delete-appointment/${selectedApptToDelete._id}`, {
        method: 'DELETE'
      });
      const resData = await response.json();
      if (response.ok) {
        setIsDeletingAppt(false);
        setSelectedApptToDelete(null);
        fetchDoctorSpecificAppointments();
      } else {
        setIsDeletingAppt(false);
        setDeleteApptError(resData.message || 'Failed to delete appointment.');
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setIsDeletingAppt(false);
      setDeleteApptError('Could not connect to backend server to delete appointment.');
    }
  };

  // 01. Start Appointment Consultation (Update_Appointment_Status to "Inprogress")
  const handleStartAppointment = async (appt) => {
    setIsStartingAppt(true);
    try {
      const response = await fetch(`http://localhost:5000/api/appointment/update-appointment-status/${appt._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AppointmentStatus: 'Inprogress' })
      });
      const data = await response.json();
      if (response.ok) {
        const updatedAppt = { ...appt, AppointmentStatus: 'Inprogress' };
        setActiveConsultation(updatedAppt);
        setTreatmentNote(updatedAppt.DoctorNote || '');
        setActiveTab('patients');

        // Call create_Payment on Payment_Controller (Item 01 / Start Consultation)
        try {
          const patientId = typeof appt.PatientID === 'object' ? (appt.PatientID._id || appt.PatientID.PatientID) : appt.PatientID;
          await fetch('http://localhost:5000/api/payment/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PatientID: patientId })
          });
        } catch (e) {
          console.error('Error creating payment on start appointment:', e);
        }

        // Call add_Appointment_Fee on Payment_Controller (Item 03)
        try {
          const patientId = typeof appt.PatientID === 'object' ? (appt.PatientID._id || appt.PatientID.PatientID) : appt.PatientID;
          await fetch(`http://localhost:5000/api/payment/add-appointment-fee/${appt._id}/${patientId}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Error adding appointment fee to payment:', e);
        }

        fetchDoctorSpecificAppointments();
      } else {
        alert(data.message || 'Failed to start appointment consultation.');
      }
    } catch (err) {
      console.error('Error starting appointment:', err);
      alert('Could not connect to backend server to start consultation.');
    } finally {
      setIsStartingAppt(false);
    }
  };

  // 02. Complete Appointment Consultation (Update_Doctor_Notes & Update_Appointment_Status to "Completed")
  const handleCompleteAppointment = async () => {
    if (!activeConsultation) return;
    setIsCompletingAppt(true);
    setCareError('');
    try {
      // Step 1: Update Doctor Treatment Notes
      const notesRes = await fetch(`http://localhost:5000/api/appointment/update-doctor-notes/${activeConsultation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ DoctorNote: treatmentNote })
      });
      const notesData = await notesRes.json();
      if (!notesRes.ok) {
        setCareError(notesData.message || 'Failed to save treatment notes.');
        setIsCompletingAppt(false);
        return;
      }

      // Step 2: Update Status to Completed
      const statusRes = await fetch(`http://localhost:5000/api/appointment/update-appointment-status/${activeConsultation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AppointmentStatus: 'Completed' })
      });
      const statusData = await statusRes.json();
      if (statusRes.ok) {
        const patientObj = getPatientDetails(activeConsultation.PatientID);
        const docName = myDetails?.FullName || user?.FullName || 'Doctor';

        setPrintData({
          patientRegId: patientObj?.PatientRegID || activeConsultation.PatientID,
          patientName: patientObj?.FullName || 'N/A',
          doctorName: docName,
          doctorNote: treatmentNote,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isViewOnly: false
        });
        setShowPrintModal(true);

        // Call update_Appointment_PaidStatus_And_Full_Payment on Payment_Controller (Item 09)
        try {
          await fetch(`http://localhost:5000/api/payment/update-appointment-paidstatus-and-full-payment/${activeConsultation._id}/${activeConsultation.PatientID}`, {
            method: 'POST'
          });
        } catch (e) {
          console.error('Error updating appointment paid status & full payment:', e);
        }

        setActiveConsultation(null);
        setTreatmentNote('');
        setAssignedNurseWork(null);
        setNewWorkText('');
        fetchDoctorSpecificAppointments();
      } else {
        setCareError(statusData.message || 'Failed to update appointment status to Completed.');
      }
    } catch (err) {
      console.error('Error completing appointment:', err);
      setCareError('Could not connect to backend server.');
    } finally {
      setIsCompletingAppt(false);
    }
  };

  // Cancel Appointment Consultation (Update_Appointment_Status to "Pending")
  const [isCancelingAppt, setIsCancelingAppt] = useState(false);

  const handleCancelAppointment = async () => {
    if (!activeConsultation) return;
    setIsCancelingAppt(true);
    setCareError('');
    try {
      const response = await fetch(`http://localhost:5000/api/appointment/update-appointment-status/${activeConsultation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AppointmentStatus: 'Pending' })
      });
      const data = await response.json();
      if (response.ok) {
        setActiveConsultation(null);
        setTreatmentNote('');
        setAssignedNurseWork(null);
        setNewWorkText('');
        fetchDoctorSpecificAppointments();
      } else {
        setCareError(data.message || 'Failed to cancel appointment consultation.');
      }
    } catch (err) {
      console.error('Error canceling appointment consultation:', err);
      setCareError('Could not connect to backend server.');
    } finally {
      setIsCancelingAppt(false);
    }
  };

  // Delete Active Consultation Appointment (Delete_Appointment)
  const [isDeletingActiveAppt, setIsDeletingActiveAppt] = useState(false);

  const handleDeleteActiveAppointment = async () => {
    if (!activeConsultation) return;
    setIsDeletingActiveAppt(true);
    setCareError('');
    try {
      const response = await fetch(`http://localhost:5000/api/appointment/delete-appointment/${activeConsultation._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        if (activeConsultation.PatientID) {
          await deletePaymentForPatient(activeConsultation.PatientID);
        }
        setActiveConsultation(null);
        setTreatmentNote('');
        setAssignedNurseWork(null);
        setNewWorkText('');
        fetchDoctorSpecificAppointments();
      } else {
        setCareError(data.message || 'Failed to delete appointment.');
      }
    } catch (err) {
      console.error('Error deleting appointment consultation:', err);
      setCareError('Could not connect to backend server to delete appointment.');
    } finally {
      setIsDeletingActiveAppt(false);
    }
  };

  // Fetch All Nurse Details (Get_All_Nurse_Details)
  const fetchAllNurseDetails = async () => {
    setIsLoadingNurses(true);
    setNurseFetchError('');
    try {
      const response = await fetch('http://localhost:5000/api/nurse/get-all-nurse-details');
      const data = await response.json();
      if (response.ok && data.allNurse) {
        setNursesList(data.allNurse);
      } else {
        setNurseFetchError(data.message || 'Failed to fetch nurses list.');
      }
    } catch (err) {
      console.error('Error fetching nurses list:', err);
      setNurseFetchError('Could not connect to backend server.');
    } finally {
      setIsLoadingNurses(false);
    }
  };

  // Fetch Nurse Work By Patient ID (Get_Nurse_Work_By_Patient_ID)
  const fetchNurseWorkForPatient = async (patientId) => {
    if (!patientId) {
      setAssignedNurseWork(null);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/by-patient/${patientId}`);
      const data = await response.json();
      if (response.ok && data.nurse_work) {
        const worksList = Array.isArray(data.nurse_work) ? data.nurse_work : [data.nurse_work];
        const apptTime = activeConsultation?.createdAt ? new Date(activeConsultation.createdAt).getTime() - 120000 : 0;
        const activeWorks = worksList.filter(w => !w.CompleteStatus && (apptTime === 0 || new Date(w.createdAt || w.Date || 0).getTime() >= apptTime));
        if (activeWorks.length > 0) {
          const worksObj = activeWorks[activeWorks.length - 1];
          let nurseName = data.existingNurse?.FullName;
          const targetNurseID = worksObj.NurseID || (data.existingNurse?._id);

          if (!nurseName && targetNurseID) {
            const foundInList = nursesList.find(n => String(n._id) === String(targetNurseID));
            if (foundInList?.FullName) {
              nurseName = foundInList.FullName;
            } else {
              try {
                const nurseRes = await fetch(`http://localhost:5000/api/nurse/details/${targetNurseID}`);
                if (nurseRes.ok) {
                  const nurseData = await nurseRes.json();
                  const nObj = nurseData.existingNurse || nurseData.nurseDetails || nurseData.nurse;
                  if (nObj?.FullName) {
                    nurseName = nObj.FullName;
                  }
                }
              } catch (e) {
                console.error('Error fetching nurse details by ID:', e);
              }
            }
          }
          setAssignedNurseWork({ ...worksObj, nurseName: nurseName || 'Nurse' });
        } else {
          setAssignedNurseWork(null);
        }
      } else {
        setAssignedNurseWork(null);
      }
    } catch (err) {
      console.error('Error fetching nurse work for patient:', err);
      setAssignedNurseWork(null);
    }
  };

  // Fetch Blood Tests for Patient
  const fetchBloodTestsForPatient = async (patientId) => {
    if (!patientId) {
      setRequestedBloodTests([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/lab-test/get-blood-test-details-by-patient-id/${patientId}`);
      const data = await response.json();
      if (response.ok && data.Detailed_Blood_Test) {
        const list = Array.isArray(data.Detailed_Blood_Test) ? data.Detailed_Blood_Test : [data.Detailed_Blood_Test];
        const apptTime = activeConsultation?.createdAt ? new Date(activeConsultation.createdAt).getTime() - 120000 : 0;
        const activeTests = list.filter(bt => !bt.CompleteStatus && (apptTime === 0 || new Date(bt.createdAt || bt.Date || 0).getTime() >= apptTime));
        setRequestedBloodTests(activeTests);
      } else {
        setRequestedBloodTests([]);
      }
    } catch (err) {
      console.error('Error fetching blood tests for patient:', err);
      setRequestedBloodTests([]);
    }
  };

  // Fetch Urine Tests for Patient
  const fetchUrineTestsForPatient = async (patientId) => {
    if (!patientId) {
      setRequestedUrineTests([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/lab-test/get-urine-test-details-by-patient-id/${patientId}`);
      const data = await response.json();
      if (response.ok && data.Detailed_Urine_Test) {
        const list = Array.isArray(data.Detailed_Urine_Test) ? data.Detailed_Urine_Test : [data.Detailed_Urine_Test];
        const apptTime = activeConsultation?.createdAt ? new Date(activeConsultation.createdAt).getTime() - 120000 : 0;
        const activeTests = list.filter(ut => !ut.CompleteStatus && (apptTime === 0 || new Date(ut.createdAt || ut.Date || 0).getTime() >= apptTime));
        setRequestedUrineTests(activeTests);
      } else {
        setRequestedUrineTests([]);
      }
    } catch (err) {
      console.error('Error fetching urine tests for patient:', err);
      setRequestedUrineTests([]);
    }
  };

  // Fetch Medicine Bill For Patient
  const fetchMedicineBillForPatient = async (patientId) => {
    if (!patientId) {
      setAssignedMedicineBill(null);
      setDraftBillMedicines([]);
      setIsBillCompleted(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/get-medicine-bills-by-patient/${patientId}`);
      const data = await response.json();
      if (response.ok && data.getMedicineBillsByPatientID) {
        const bills = Array.isArray(data.getMedicineBillsByPatientID) ? data.getMedicineBillsByPatientID : [data.getMedicineBillsByPatientID];
        const apptTime = activeConsultation?.createdAt ? new Date(activeConsultation.createdAt).getTime() - 120000 : 0;
        const activeBill = bills.find(b => !b.CompleteStatus && !b.PaidStatus && (apptTime === 0 || new Date(b.createdAt || b.Date || 0).getTime() >= apptTime));
        if (activeBill) {
          setAssignedMedicineBill(activeBill);
          const hasAddedMeds = activeBill.Added_Medicines && activeBill.Added_Medicines.length > 0;
          setIsBillCompleted(hasAddedMeds);
          if (hasAddedMeds) {
            setDraftBillMedicines(activeBill.Added_Medicines.map(m => ({
              MedicineID: m.MedicineID,
              TabletName: m.MedicineName,
              Quantity: m.Quantity
            })));
          } else {
            setDraftBillMedicines([]);
          }
        } else {
          setAssignedMedicineBill(null);
          setDraftBillMedicines([]);
          setIsBillCompleted(false);
        }
      } else {
        setAssignedMedicineBill(null);
        setDraftBillMedicines([]);
        setIsBillCompleted(false);
      }
    } catch (err) {
      console.error('Error fetching medicine bill for patient:', err);
      setAssignedMedicineBill(null);
      setDraftBillMedicines([]);
      setIsBillCompleted(false);
    }
  };

  // Fetch All Medicines for Bill (get_All_Medicine_Details)
  const fetchAllMedicinesForBill = async () => {
    setIsLoadingMedicinesForBill(true);
    try {
      const response = await fetch('http://localhost:5000/api/medicine/get-all-medicine-details');
      const data = await response.json();
      if (response.ok) {
        setAllMedicinesForBill(data.getAllMedicine || data.allMedicine || data.medicines || []);
      }
    } catch (err) {
      console.error('Error fetching all medicines for bill:', err);
    } finally {
      setIsLoadingMedicinesForBill(false);
    }
  };

  // Create Medicine Bill (create_Medicine_Bill)
  const handleCreateMedicineBill = async () => {
    if (!activeConsultation?.PatientID || !doctorId) return;
    setIsCreatingMedicineBill(true);
    setCareError('');
    try {
      const response = await fetch(`http://localhost:5000/api/medicine/create-medicine-bill/${activeConsultation.PatientID}/${doctorId}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok && data.createMedicineBill) {
        setAssignedMedicineBill(data.createMedicineBill);
        setDraftBillMedicines([]);
        setIsBillCompleted(false);
        fetchAllMedicinesForBill();
      } else {
        setCareError(data.message || 'Failed to create medicine bill.');
      }
    } catch (err) {
      console.error('Error creating medicine bill:', err);
      setCareError('Could not connect to backend server to create medicine bill.');
    } finally {
      setIsCreatingMedicineBill(false);
    }
  };

  // Delete Medicine Bill (delete_Medicine_Bill & delete_Medicine_Fee)
  const handleDeleteMedicineBill = async () => {
    if (!assignedMedicineBill) return;
    setIsDeletingMedicineBill(true);
    setCareError('');
    try {
      // 1. Call delete_Medicine_Fee on Payment_Controller FIRST
      try {
        const patientId = typeof activeConsultation.PatientID === 'object'
          ? (activeConsultation.PatientID._id || activeConsultation.PatientID.PatientID)
          : activeConsultation.PatientID;

        const payRes = await fetch(`http://localhost:5000/api/payment/get-payment-details-by-patientid/${patientId}`);
        const payData = await payRes.json();
        const payObj = payData.data?.isPaymentExist || payData.isPaymentExist;

        if (payObj?._id) {
          await fetch(`http://localhost:5000/api/payment/delete-medicine-fee/${payObj._id}/${assignedMedicineBill._id}`, {
            method: 'DELETE'
          });
        }
      } catch (e) {
        console.error('Error deleting medicine fee from payment:', e);
      }

      // 2. Delete medicine bill document
      const response = await fetch(`http://localhost:5000/api/medicine/delete-medicine-bill/${assignedMedicineBill._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        setAssignedMedicineBill(null);
        setDraftBillMedicines([]);
        setIsBillCompleted(false);
      } else {
        setCareError(data.message || 'Failed to delete medicine bill.');
      }
    } catch (err) {
      console.error('Error deleting medicine bill:', err);
      setCareError('Could not connect to backend server to delete medicine bill.');
    } finally {
      setIsDeletingMedicineBill(false);
    }
  };

  // Add / Edit Draft Medicine in Bill
  const openTabletQuantityModal = (med) => {
    if (isBillCompleted || assignedMedicineBill?.CompleteStatus) return;
    const existing = draftBillMedicines.find(d => String(d.MedicineID) === String(med._id));
    setSelectedTabletForQty({
      medicine: med,
      quantity: existing ? existing.Quantity : 1
    });
  };

  const openEditDraftQuantityModal = (item) => {
    if (isBillCompleted || assignedMedicineBill?.CompleteStatus) return;
    const medObj = allMedicinesForBill.find(m => String(m._id) === String(item.MedicineID)) || { _id: item.MedicineID, TabletName: item.TabletName };
    setSelectedTabletForQty({
      medicine: medObj,
      quantity: item.Quantity
    });
  };

  const handleConfirmTabletQuantity = (e) => {
    e.preventDefault();
    if (!selectedTabletForQty || !selectedTabletForQty.medicine || isBillCompleted || assignedMedicineBill?.CompleteStatus) return;
    const med = selectedTabletForQty.medicine;
    const qty = Number(selectedTabletForQty.quantity);

    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity greater than 0.');
      return;
    }

    setDraftBillMedicines(prev => {
      const idx = prev.findIndex(d => String(d.MedicineID) === String(med._id));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], Quantity: qty };
        return updated;
      }
      return [...prev, { MedicineID: med._id, TabletName: med.TabletName, Quantity: qty }];
    });

    setSelectedTabletForQty(null);
  };

  const handleRemoveDraftMedicine = (medicineId) => {
    if (isBillCompleted || assignedMedicineBill?.CompleteStatus) return;
    setDraftBillMedicines(prev => prev.filter(d => String(d.MedicineID) !== String(medicineId)));
  };

  // Complete Prescribed Medicine Bill (add_Medicine_to_Bill & update_Complete_Status)
  const handleCompleteMedicineBill = async () => {
    if (!assignedMedicineBill || draftBillMedicines.length === 0 || isBillCompleted || assignedMedicineBill?.CompleteStatus) return;
    setIsSubmittingMedicineBill(true);
    setCareError('');
    try {
      // 1. Add each medicine to the bill using add_Medicine_to_Bill
      for (const item of draftBillMedicines) {
        await fetch(`http://localhost:5000/api/medicine/add-medicine-to-bill/${assignedMedicineBill._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            MedicineID: item.MedicineID,
            Quantity: Number(item.Quantity)
          })
        });
      }

      // 2. Refresh medicine bill data to ensure latest Total_Bill is saved in database
      await fetchMedicineBillForPatient(activeConsultation.PatientID);

      // 3. Call add_Medicine_Fee on Payment_Controller (Item 08 / Item 05) LAST
      try {
        const patientId = typeof activeConsultation.PatientID === 'object'
          ? (activeConsultation.PatientID._id || activeConsultation.PatientID.PatientID)
          : activeConsultation.PatientID;

        await fetch(`http://localhost:5000/api/payment/add-medicine-fee/${assignedMedicineBill._id}/${patientId}`, {
          method: 'POST'
        });
      } catch (e) {
        console.error('Error adding medicine fee to payment:', e);
      }

      // 4. Mark local UI bill as completed so button turns gray (#64748b) & disabled
      setIsBillCompleted(true);
    } catch (err) {
      console.error('Error completing medicine bill:', err);
      setCareError('Could not connect to backend server to submit medicine bill.');
    } finally {
      setIsSubmittingMedicineBill(false);
    }
  };

  useEffect(() => {
    if (activeConsultation?.PatientID) {
      fetchNurseWorkForPatient(activeConsultation.PatientID);
      fetchBloodTestsForPatient(activeConsultation.PatientID);
      fetchUrineTestsForPatient(activeConsultation.PatientID);
      fetchMedicineBillForPatient(activeConsultation.PatientID);
      fetchAllMedicinesForBill();
    } else {
      setAssignedNurseWork(null);
      setRequestedBloodTests([]);
      setRequestedUrineTests([]);
      setAssignedMedicineBill(null);
      setDraftBillMedicines([]);
    }
  }, [activeConsultation]);

  // Action Handlers for Requesting / Deleting Blood & Urine Tests
  const handleRequestBloodTest = async () => {
    if (!activeConsultation?.PatientID || !doctorId) return;
    setIsRequestingBloodTest(true);
    setCareError('');
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/request-blood-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: activeConsultation.PatientID,
          DoctorID: doctorId
        })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.data?._id) {
          // Call add_Blood_test_Fee on Payment_Controller (Item 04)
          try {
            await fetch(`http://localhost:5000/api/payment/add-blood-test-fee/${data.data._id}/${activeConsultation.PatientID}`, {
              method: 'POST'
            });
          } catch (e) {
            console.error('Error adding blood test fee to payment:', e);
          }
        }
        fetchBloodTestsForPatient(activeConsultation.PatientID);
      } else {
        setCareError(data.message || 'Failed to request blood test.');
      }
    } catch (err) {
      console.error('Error requesting blood test:', err);
      setCareError('Could not connect to backend server to request blood test.');
    } finally {
      setIsRequestingBloodTest(false);
    }
  };

  const handleDeleteBloodTest = async (bloodTestId) => {
    if (!bloodTestId) return;
    setIsDeletingBloodTest(true);
    setCareError('');
    try {
      // Call delete_Blood_test_Fee on Payment_Controller FIRST (Item 05)
      try {
        const payRes = await fetch(`http://localhost:5000/api/payment/get-payment-details-by-patientid/${activeConsultation.PatientID}`);
        const payData = await payRes.json();
        const payObj = payData.data?.isPaymentExist || payData.isPaymentExist;
        if (payObj?._id) {
          await fetch(`http://localhost:5000/api/payment/delete-blood-test-fee/${payObj._id}/${bloodTestId}`, {
            method: 'DELETE'
          });
        }
      } catch (e) {
        console.error('Error deleting blood test fee from payment:', e);
      }

      const response = await fetch(`http://localhost:5000/api/lab-test/delete-blood-test/${bloodTestId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        fetchBloodTestsForPatient(activeConsultation.PatientID);
      } else {
        setCareError(data.message || 'Failed to delete blood test request.');
      }
    } catch (err) {
      console.error('Error deleting blood test request:', err);
      setCareError('Could not connect to backend server to delete blood test request.');
    } finally {
      setIsDeletingBloodTest(false);
    }
  };

  const handleRequestUrineTest = async () => {
    if (!activeConsultation?.PatientID || !doctorId) return;
    setIsRequestingUrineTest(true);
    setCareError('');
    try {
      const response = await fetch('http://localhost:5000/api/lab-test/request-urine-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: activeConsultation.PatientID,
          DoctorID: doctorId
        })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.data?._id) {
          // Call add_Urine_test_Fee on Payment_Controller (Item 06)
          try {
            await fetch(`http://localhost:5000/api/payment/add-urine-test-fee/${data.data._id}/${activeConsultation.PatientID}`, {
              method: 'POST'
            });
          } catch (e) {
            console.error('Error adding urine test fee to payment:', e);
          }
        }
        fetchUrineTestsForPatient(activeConsultation.PatientID);
      } else {
        setCareError(data.message || 'Failed to request urine test.');
      }
    } catch (err) {
      console.error('Error requesting urine test:', err);
      setCareError('Could not connect to backend server to request urine test.');
    } finally {
      setIsRequestingUrineTest(false);
    }
  };

  const handleDeleteUrineTest = async (urineTestId) => {
    if (!urineTestId) return;
    setIsDeletingUrineTest(true);
    setCareError('');
    try {
      // Call delete_Urine_test_Fee on Payment_Controller FIRST (Item 07)
      try {
        const payRes = await fetch(`http://localhost:5000/api/payment/get-payment-details-by-patientid/${activeConsultation.PatientID}`);
        const payData = await payRes.json();
        const payObj = payData.data?.isPaymentExist || payData.isPaymentExist;
        if (payObj?._id) {
          await fetch(`http://localhost:5000/api/payment/delete-urine-test-fee/${payObj._id}/${urineTestId}`, {
            method: 'DELETE'
          });
        }
      } catch (e) {
        console.error('Error deleting urine test fee from payment:', e);
      }

      const response = await fetch(`http://localhost:5000/api/lab-test/delete-urine-test/${urineTestId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        fetchUrineTestsForPatient(activeConsultation.PatientID);
      } else {
        setCareError(data.message || 'Failed to delete urine test request.');
      }
    } catch (err) {
      console.error('Error deleting urine test request:', err);
      setCareError('Could not connect to backend server to delete urine test request.');
    } finally {
      setIsDeletingUrineTest(false);
    }
  };

  // Select Nurse & Create Nurse Works (Create_Nurse_Works)
  const handleSelectNurse = async (selectedNurse) => {
    if (!activeConsultation) return;
    setIsAssigningNurse(true);
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/create/${selectedNurse._id}/${activeConsultation.PatientID}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (response.ok) {
        setShowAddNurseModal(false);
        setAssignedNurseWork({ ...data.newNurseWorks, nurseName: selectedNurse.FullName });
        fetchAllNurseDetails();
      } else {
        alert(data.message || 'Failed to assign nurse.');
      }
    } catch (err) {
      console.error('Error assigning nurse:', err);
      alert('Could not connect to backend server to assign nurse.');
    } finally {
      setIsAssigningNurse(false);
    }
  };

  // Add New Work Item (Add_New_Work)
  const handleAddWorkItem = async (e) => {
    e.preventDefault();
    if (!assignedNurseWork || !newWorkText.trim()) return;
    setIsAddingWork(true);
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/add-work/${assignedNurseWork._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Work: newWorkText.trim() })
      });
      const data = await response.json();
      if (response.ok) {
        setNewWorkText('');
        const updated = data.existingNurseWork || data.nurseWork;
        setAssignedNurseWork(prev => ({ ...prev, Works: updated ? updated.Works : prev.Works }));
        if (activeConsultation?.PatientID) fetchNurseWorkForPatient(activeConsultation.PatientID);
      } else {
        alert(data.message || 'Failed to add work.');
      }
    } catch (err) {
      console.error('Error adding work:', err);
      alert('Could not connect to backend server to add work.');
    } finally {
      setIsAddingWork(false);
    }
  };

  // Open Delete Work Confirmation Modal
  const handleOpenDeleteWorkModal = (work) => {
    setSelectedWorkToDelete(work);
    setDeleteWorkError('');
  };

  // Confirm Delete Work Item (Delete_Work)
  const confirmDeleteWorkItem = async () => {
    if (!assignedNurseWork || !selectedWorkToDelete) return;
    setIsDeletingWork(true);
    setDeleteWorkError('');
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/delete-work/${assignedNurseWork._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ WorkID: selectedWorkToDelete._id })
      });
      const data = await response.json();
      if (response.ok) {
        setIsDeletingWork(false);
        setSelectedWorkToDelete(null);
        const updated = data.existingNurseWork || data.nurseWork;
        setAssignedNurseWork(prev => ({ ...prev, Works: updated ? updated.Works : prev.Works }));
        if (activeConsultation?.PatientID) fetchNurseWorkForPatient(activeConsultation.PatientID);
      } else {
        setIsDeletingWork(false);
        setDeleteWorkError(data.message || 'Failed to delete work instruction.');
      }
    } catch (err) {
      console.error('Error deleting work:', err);
      setIsDeletingWork(false);
      setDeleteWorkError('Could not connect to backend server to delete work instruction.');
    }
  };

  // Open Remove Nurse Assignment Confirmation Modal
  const handleOpenRemoveNurseModal = () => {
    setShowRemoveNurseModal(true);
    setRemoveNurseError('');
  };

  // Confirm Remove Nurse Assignment (Delete_Nurse_Work)
  const confirmRemoveNurseWork = async () => {
    if (!assignedNurseWork) return;
    setIsRemovingNurseWork(true);
    setRemoveNurseError('');
    try {
      const response = await fetch(`http://localhost:5000/api/nurse-works/delete/${assignedNurseWork._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        setIsRemovingNurseWork(false);
        setShowRemoveNurseModal(false);
        setAssignedNurseWork(null);
        setNewWorkText('');
        fetchAllNurseDetails();
      } else {
        setIsRemovingNurseWork(false);
        setRemoveNurseError(data.message || 'Failed to remove nurse assignment.');
      }
    } catch (err) {
      console.error('Error removing nurse assignment:', err);
      setIsRemovingNurseWork(false);
      setRemoveNurseError('Could not connect to backend server to remove nurse assignment.');
    }
  };

  // 01. Dashboard Pending Doctor Appointments (First come, first serve order)
  const pendingDoctorAppointments = doctorAppointments
    .filter(a => (a.AppointmentStatus || '').toLowerCase() === 'pending')
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || a.AppointmentDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.AppointmentDate || 0).getTime();
      if (timeA !== timeB) return timeA - timeB;
      return String(a._id || '').localeCompare(String(b._id || ''));
    });

  const filteredPendingDoctorAppts = pendingDoctorAppointments.filter(appt => {
    if (!dashSearchQuery.trim()) return true;
    const q = dashSearchQuery.toLowerCase().trim();
    const pObj = getPatientDetails(appt.PatientID);
    const regId = (pObj?.PatientRegID || appt.PatientID || '').toLowerCase();
    const nic = (pObj?.NICNumber || '').toLowerCase();
    const name = (pObj?.FullName || '').toLowerCase();
    return regId.includes(q) || nic.includes(q) || name.includes(q);
  });

  // 04. Completed Doctor Appointments
  const completedDoctorAppointments = doctorAppointments.filter(
    a => (a.AppointmentStatus || '').toLowerCase() === 'completed'
  );

  const filteredCompletedDoctorAppts = completedDoctorAppointments.filter(appt => {
    if (!completeApptSearchQuery.trim()) return true;
    const q = completeApptSearchQuery.toLowerCase().trim();
    const pObj = getPatientDetails(appt.PatientID);
    const regId = (pObj?.PatientRegID || appt.PatientID || '').toLowerCase();
    const nic = (pObj?.NICNumber || '').toLowerCase();
    const name = (pObj?.FullName || '').toLowerCase();
    return regId.includes(q) || nic.includes(q) || name.includes(q);
  });

  // Doctors sorting & filtering (identical to Receptionist Dashboard)
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogoutClick = async () => {
    if (doctorId) {
      try {
        await fetch(`http://localhost:5000/api/doctor/logout/${doctorId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        console.error('Error executing Doctor_Logout:', err);
      }
    }
    onLogout();
  };

  const handleUpdatePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');

    if (!doctorId) {
      setPhoneError('User session ID not found.');
      return;
    }

    if (!/^\d{10}$/.test(newPhone.trim())) {
      setPhoneError('Phone Number must contain exactly 10 digits.');
      return;
    }

    setIsUpdatingPhone(true);
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/update-phone-number/${doctorId}`, {
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

    if (!doctorId) {
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
      const response = await fetch(`http://localhost:5000/api/doctor/update-password/${doctorId}`, {
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

    if (!doctorId) {
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
      const response = await fetch(`http://localhost:5000/api/doctor/delete/${doctorId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctorId,
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
      console.error('Error deleting doctor account:', err);
      setIsDeleting(false);
      setDeleteError('Could not connect to backend server.');
    }
  };

  const filteredPatients = allPatients.filter(p =>
    (p.FullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.PatientRegID || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.ContactNumber || '').includes(searchQuery)
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
            Access Role: <strong style={{ color: '#ffffff', marginLeft: '4px' }}>Doctor</strong>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="dash-sidebar-nav">
            <button className={`dash-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button className={`dash-nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
              <Users size={18} />
              Patient Care
            </button>
            <button className={`dash-nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              <Calendar size={18} />
              Complete Appointments
            </button>
            <button className={`dash-nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
              <Stethoscope size={18} />
              Doctor
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
              {getInitials(myDetails?.FullName || user?.FullName || 'Doctor')}
            </div>
            <div className="dash-user-details">
              <h5>Dr. {myDetails?.FullName || user?.FullName || 'Doctor'}</h5>
              <p>{myDetails?.Email || user?.Email || 'doctor@apexhealth.org'}</p>
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
                Appointments & Internal Operations
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', flex: 1, padding: '0 20px' }}>
            <h3 className="dash-center-title">
              Doctor Management Dashboard
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
              DOCTOR DASHBOARD | Session Active
            </span>
            <h2>Welcome back, Dr. {myDetails?.FullName || user?.FullName || 'Doctor'}</h2>
            {activeTab === 'dashboard' && (
              <p>
                Apex Health International Hospital live clinical portal. Manage patient consultations, digital e-prescriptions, diagnostic orders, and ward rosters.
              </p>
            )}
          </div>

          <div className="dash-hero-right-badge">
            {TAB_TITLES[activeTab] || 'Dashboard'}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW (Pending Doctor Appointments List) */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Search Bar Toolbar (Matching Receptionist Dashboard) */}
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />
              <div className="dash-search-center-group" style={{ flex: 1, maxWidth: '640px' }}>
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search patient by Patient Reg ID or NIC Number..."
                    value={dashSearchQuery}
                    onChange={(e) => setDashSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                {dashSearchQuery && (
                  <button
                    onClick={() => setDashSearchQuery('')}
                    className="back-btn"
                    style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchDoctorSpecificAppointments}
                  disabled={isLoadingDoctorAppts}
                  className="dash-search-btn"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Refresh Appointments"
                >
                  <RefreshCw size={16} className={isLoadingDoctorAppts ? 'spin-icon' : ''} />
                  {isLoadingDoctorAppts ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="dash-toolbar-right-group" />
            </div>

            {doctorApptsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {doctorApptsError}
              </div>
            )}

            {/* Patient Details Table Format (Matching Receptionist Dashboard Patient Details) */}
            <div className="dash-patient-section">
              <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} style={{ color: 'var(--teal-400)' }} />
                  Available Pending Appointments
                </h3>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Showing {filteredPendingDoctorAppts.length} of {pendingDoctorAppointments.length} pending appointments (First come, first serve)
                </span>
              </div>

              <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Reg ID</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor FullName</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor RoomNumber</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Appointment Date</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Appointment Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendingDoctorAppts.length > 0 ? (
                      filteredPendingDoctorAppts.map((appt) => {
                        const patientObj = getPatientDetails(appt.PatientID);
                        const doctorObj = getDoctorDetails(appt.DoctorID);
                        const docName = myDetails?.FullName || user?.FullName || doctorObj?.FullName || 'Doctor';
                        const roomNum = myDetails?.RoomNumber || user?.RoomNumber || doctorObj?.RoomNumber || 'N/A';
                        const apptDateStr = appt.createdAt
                          ? new Date(appt.createdAt).toLocaleDateString()
                          : appt.AppointmentDate || 'Today';

                        return (
                          <tr key={appt._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                            <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>
                              {patientObj?.PatientRegID || appt.PatientID}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                              Dr. {docName}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                              Room {roomNum}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                              {apptDateStr}
                            </td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{
                                background: 'rgba(245, 158, 11, 0.18)',
                                color: '#f59e0b',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                padding: '4px 12px',
                                borderRadius: '14px',
                                fontSize: '0.8rem',
                                fontWeight: '800'
                              }}>
                                {appt.AppointmentStatus || 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <button
                                  className="dash-search-btn"
                                  disabled={isStartingAppt}
                                  onClick={() => handleStartAppointment(appt)}
                                  style={{
                                    padding: '7px 16px',
                                    fontSize: '0.86rem',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '800'
                                  }}
                                >
                                  {isStartingAppt ? 'Starting...' : 'Start'}
                                </button>
                                <button
                                  className="icon-btn"
                                  style={{
                                    width: '36px',
                                    height: '36px',
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
                                  title="Delete Appointment"
                                  onClick={() => handleOpenDeleteApptModal(appt)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {isLoadingDoctorAppts ? 'Loading pending appointments...' : dashSearchQuery ? `No pending appointments found matching "${dashSearchQuery}".` : 'No pending appointments available for this doctor.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATIENT CARE */}
        {activeTab === 'patients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {!activeConsultation ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '420px', background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--border-color)', padding: '40px', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(45, 212, 191, 0.12)', color: 'var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Users size={32} />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Empty</h3>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>No active patient consultation in progress. Click "Start" on a pending appointment in Dashboard.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {careError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '14px 18px', borderRadius: '14px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={20} />
                    {careError}
                  </div>
                )}

                {/* Patient Top Summary Banner Card */}
                {(() => {
                  const patientObj = getPatientDetails(activeConsultation.PatientID);
                  return (
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1.5px solid rgba(45, 212, 191, 0.4)',
                      borderRadius: '22px',
                      padding: '24px 28px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--teal-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            ACTIVE CONSULTATION IN PROGRESS
                          </span>
                          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.6rem', fontWeight: '900', color: 'var(--teal-400)' }}>
                            Patient Reg ID: {patientObj?.PatientRegID || activeConsultation.PatientID}
                          </h2>
                          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Patient Name: {patientObj?.FullName || 'N/A'}
                          </h3>
                        </div>

                        <span style={{
                          background: 'rgba(14, 165, 233, 0.18)',
                          color: '#0ea5e9',
                          border: '1px solid rgba(14, 165, 233, 0.4)',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontWeight: '800',
                          fontSize: '0.88rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Activity size={16} /> In-Progress
                        </span>
                      </div>

                      {/* Details Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>GENDER</span>
                          <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                            {patientObj?.Gender || 'N/A'}
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>CONTACT NUMBER</span>
                          <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                            {patientObj?.ContactNumber || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* 4 Action Buttons Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                        <button
                          type="button"
                          disabled={!!assignedNurseWork}
                          onClick={() => {
                            fetchAllNurseDetails();
                            setShowAddNurseModal(true);
                          }}
                          style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            fontSize: '0.88rem',
                            cursor: assignedNurseWork ? 'not-allowed' : 'pointer',
                            background: assignedNurseWork ? '#64748b' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                            color: '#ffffff',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: assignedNurseWork ? 0.65 : 1,
                            boxShadow: assignedNurseWork ? 'none' : '0 4px 12px rgba(13, 148, 136, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <UserPlus size={16} />
                          {assignedNurseWork ? 'Nurse Assigned' : 'Add Nurse'}
                        </button>

                        {/* 01. Add Medicine Button (Works like Add Nurse, turns gray when bill created) */}
                        {(() => {
                          const hasBill = !!assignedMedicineBill;
                          return (
                            <button
                              type="button"
                              disabled={hasBill || isCreatingMedicineBill}
                              onClick={handleCreateMedicineBill}
                              style={{
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '0.88rem',
                                cursor: (hasBill || isCreatingMedicineBill) ? 'not-allowed' : 'pointer',
                                background: hasBill ? '#64748b' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                                color: '#ffffff',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: hasBill ? 0.65 : 1,
                                boxShadow: hasBill ? 'none' : '0 4px 12px rgba(13, 148, 136, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Pill size={16} />
                              {isCreatingMedicineBill ? 'Creating...' : hasBill ? 'Medicine Bill Created' : 'Add Medicine'}
                            </button>
                          );
                        })()}

                        {(() => {
                          const hasBloodTest = requestedBloodTests && requestedBloodTests.length > 0;
                          return (
                            <button
                              type="button"
                              disabled={hasBloodTest || isRequestingBloodTest}
                              onClick={handleRequestBloodTest}
                              style={{
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '0.88rem',
                                cursor: (hasBloodTest || isRequestingBloodTest) ? 'not-allowed' : 'pointer',
                                background: hasBloodTest ? '#64748b' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                                color: '#ffffff',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: hasBloodTest ? 0.65 : 1,
                                boxShadow: hasBloodTest ? 'none' : '0 4px 12px rgba(13, 148, 136, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Activity size={16} />
                              {isRequestingBloodTest ? 'Requesting...' : hasBloodTest ? 'Blood Test Requested' : 'Req Blood Test'}
                            </button>
                          );
                        })()}

                        {(() => {
                          const hasUrineTest = requestedUrineTests && requestedUrineTests.length > 0;
                          return (
                            <button
                              type="button"
                              disabled={hasUrineTest || isRequestingUrineTest}
                              onClick={handleRequestUrineTest}
                              style={{
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '0.88rem',
                                cursor: (hasUrineTest || isRequestingUrineTest) ? 'not-allowed' : 'pointer',
                                background: hasUrineTest ? '#64748b' : 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                                color: '#ffffff',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: hasUrineTest ? 0.65 : 1,
                                boxShadow: hasUrineTest ? 'none' : '0 4px 12px rgba(13, 148, 136, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Activity size={16} />
                              {isRequestingUrineTest ? 'Requesting...' : hasUrineTest ? 'Urine Test Requested' : 'Req Urine Test'}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })()}

                {/* Assigned Nurse & Nurse Works Section (Top of Complete Button) */}
                {assignedNurseWork && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    borderRadius: '22px',
                    padding: '24px 28px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(45, 212, 191, 0.18)', color: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <UserCheck size={20} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ASSIGNED NURSE</span>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Nurse: {assignedNurseWork.nurseName || 'Assigned Nurse'}
                          </h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenRemoveNurseModal}
                        disabled={isRemovingNurseWork}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={15} />
                        {isRemovingNurseWork ? 'Removing...' : 'Remove Nurse Assignment'}
                      </button>
                    </div>

                    {/* Add Nurse Work Input Field & Plus (+) Button */}
                    <form onSubmit={handleAddWorkItem} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="dash-search-input-wrapper" style={{ flex: 1, height: '46px' }}>
                        <Plus size={18} className="dash-search-icon" />
                        <input
                          type="text"
                          placeholder="Enter nurse work instruction (e.g., Check Blood Pressure, Give Medication)..."
                          value={newWorkText}
                          onChange={(e) => setNewWorkText(e.target.value)}
                          className="dash-search-input"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isAddingWork || !newWorkText.trim()}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: newWorkText.trim() ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: newWorkText.trim() ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: newWorkText.trim() ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                        }}
                        title="Add Work Instruction"
                      >
                        <Plus size={22} />
                      </button>
                    </form>

                    {/* List of Added Nurse Works with (-) Delete Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ASSIGNED WORK INSTRUCTIONS ({assignedNurseWork.Works?.length || 0})
                      </span>

                      {assignedNurseWork.Works && assignedNurseWork.Works.length > 0 ? (
                        assignedNurseWork.Works.map((w, index) => (
                          <div
                            key={w._id || index}
                            style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '12px',
                              padding: '12px 16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800' }}>
                                #{index + 1}
                              </span>
                              <span style={{ fontSize: '0.94rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                {w.Work}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenDeleteWorkModal(w)}
                              disabled={isDeletingWork}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                              title="Delete Work Item"
                            >
                              <Minus size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                          No work instructions added yet. Type a work instruction above and click "+".
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 02 & 03. Prescribed Medicine Bill Box (2 Parts: Left = All Tablets + Search, Right = Added Tablets + Complete & Remove Button) */}
                {assignedMedicineBill && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    borderRadius: '22px',
                    padding: '26px 30px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}>
                    {/* Box Top Header with Remove Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(13, 148, 136, 0.18)', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Pill size={24} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRESCRIBED MEDICINE BILL</span>
                          {/* 01. Show only "Medicine Bill" */}
                          <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Medicine Bill
                          </h4>
                        </div>
                      </div>

                      {/* 03. Remove Medicine Bill Button calling delete_Medicine_Bill */}
                      {assignedMedicineBill && (
                        <button
                          type="button"
                          onClick={handleDeleteMedicineBill}
                          disabled={isDeletingMedicineBill}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            fontWeight: '800',
                            fontSize: '0.92rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Trash2 size={16} />
                          {isDeletingMedicineBill ? 'Removing...' : 'Remove Medicine Bill'}
                        </button>
                      )}
                    </div>

                    {/* 02. Box 2 Parts Container */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '22px' }}>
                      
                      {/* Left Part: All Tablets using get_All_Medicine_Details & Top Search Bar */}
                      <div style={{
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '18px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        opacity: (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 0.6 : 1,
                        pointerEvents: (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 'none' : 'auto'
                      }}>
                        <h5 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Pill size={18} style={{ color: 'var(--teal-400)' }} />
                          All Available Tablets
                        </h5>

                        {/* Top Search Bar */}
                        <div className="dash-search-input-wrapper" style={{ height: '44px' }}>
                          <Search size={18} className="dash-search-icon" />
                          <input
                            type="text"
                            placeholder="Search tablet by name..."
                            value={medBillSearchQuery}
                            onChange={(e) => setMedBillSearchQuery(e.target.value)}
                            className="dash-search-input"
                            style={{ fontSize: '0.96rem' }}
                            disabled={isBillCompleted || assignedMedicineBill.CompleteStatus}
                          />
                          {medBillSearchQuery && (
                            <button type="button" onClick={() => setMedBillSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 8px' }}>
                              <X size={16} />
                            </button>
                          )}
                        </div>

                        {/* List of Tablets */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                          {isLoadingMedicinesForBill ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading tablets...</div>
                          ) : (() => {
                            const filtered = allMedicinesForBill.filter(m => (m.TabletName || '').toLowerCase().includes(medBillSearchQuery.toLowerCase()));
                            if (filtered.length === 0) {
                              return (
                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                  {medBillSearchQuery ? `No tablets matching "${medBillSearchQuery}"` : 'No tablets available in inventory.'}
                                </div>
                              );
                            }
                            return filtered.map(med => {
                              const isAdded = draftBillMedicines.some(d => String(d.MedicineID) === String(med._id));
                              return (
                                <div
                                  key={med._id}
                                  onClick={() => openTabletQuantityModal(med)}
                                  style={{
                                    background: isAdded ? 'rgba(13, 148, 136, 0.16)' : 'var(--bg-input)',
                                    border: isAdded ? '1.5px solid rgba(13, 148, 136, 0.45)' : '1px solid var(--border-color)',
                                    borderRadius: '14px',
                                    padding: '12px 18px',
                                    display: 'flex',
                                    justify: 'space-between',
                                    alignItems: 'center',
                                    cursor: (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                  }}
                                  title={!(isBillCompleted || assignedMedicineBill.CompleteStatus) ? "Click to enter quantity" : "Bill completed"}
                                >
                                  {/* 04. Big Tablet Name */}
                                  <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                    {med.TabletName}
                                  </span>
                                  <span style={{ fontSize: '0.9rem', color: 'var(--teal-400)', background: 'rgba(13, 148, 136, 0.18)', padding: '4px 12px', borderRadius: '8px', fontWeight: '800' }}>
                                    {isAdded ? 'Added ✓' : '+ Select'}
                                  </span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Right Part: Selected Medicines + Complete Button */}
                      <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          <h5 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} style={{ color: 'var(--teal-400)' }} />
                            Selected Prescribed Tablets ({draftBillMedicines.length})
                          </h5>

                          {/* List of Added Medicines on Right Side */}
                          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                            {draftBillMedicines.length === 0 ? (
                              <div style={{ padding: '36px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', border: '1px dashed var(--border-color)', borderRadius: '14px' }}>
                                No tablets selected yet. Click on a tablet from the left list to specify quantity.
                              </div>
                            ) : (
                              draftBillMedicines.map((item, idx) => (
                                <div
                                  key={item.MedicineID || idx}
                                  style={{
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '14px',
                                    padding: '12px 18px',
                                    display: 'flex',
                                    justify: 'space-between',
                                    alignItems: 'center',
                                    gap: '14px'
                                  }}
                                >
                                  {/* 04. Big Tablet Name & Big Qty */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                                    <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                                      {item.TabletName}
                                    </span>
                                    {/* Big Clickable Quantity Badge */}
                                    <span
                                      onClick={() => openEditDraftQuantityModal(item)}
                                      style={{
                                        background: 'rgba(13, 148, 136, 0.22)',
                                        color: 'var(--teal-400)',
                                        border: '1.5px solid rgba(13, 148, 136, 0.4)',
                                        padding: '4px 14px',
                                        borderRadius: '10px',
                                        fontSize: '1.05rem',
                                        fontWeight: '800',
                                        cursor: (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 'default' : 'pointer'
                                      }}
                                      title={!(isBillCompleted || assignedMedicineBill.CompleteStatus) ? "Click to change quantity" : ""}
                                    >
                                      Qty: {item.Quantity}
                                    </span>
                                  </div>

                                  {/* 04. "-" Button at far right corner */}
                                  {!isBillCompleted && !assignedMedicineBill.CompleteStatus && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDraftMedicine(item.MedicineID)}
                                      style={{
                                        marginLeft: 'auto',
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '10px',
                                        background: 'rgba(239, 68, 68, 0.15)',
                                        color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.35)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0
                                      }}
                                      title="Remove tablet"
                                    >
                                      <Minus size={18} />
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* 02. "Complete" Button at bottom right calling add_Medicine_to_Bill */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                          <button
                            type="button"
                            onClick={handleCompleteMedicineBill}
                            disabled={isSubmittingMedicineBill || draftBillMedicines.length === 0 || isBillCompleted || !!assignedMedicineBill.CompleteStatus}
                            style={{
                              padding: '12px 26px',
                              borderRadius: '14px',
                              fontWeight: '800',
                              fontSize: '1rem',
                              background: (isBillCompleted || assignedMedicineBill.CompleteStatus) 
                                ? '#64748b' 
                                : (draftBillMedicines.length > 0 && !isSubmittingMedicineBill) 
                                  ? 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)' 
                                  : 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                              border: 'none',
                              cursor: (draftBillMedicines.length > 0 && !isSubmittingMedicineBill && !isBillCompleted && !assignedMedicineBill.CompleteStatus) ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              opacity: (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 0.75 : 1,
                              boxShadow: (draftBillMedicines.length > 0 && !isBillCompleted && !assignedMedicineBill.CompleteStatus) ? '0 4px 14px rgba(13, 148, 136, 0.35)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <CheckCircle2 size={20} />
                            {isSubmittingMedicineBill ? 'Submitting...' : (isBillCompleted || assignedMedicineBill.CompleteStatus) ? 'Completed ✓' : 'Complete'}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Request Blood test Section */}
                {requestedBloodTests && requestedBloodTests.length > 0 && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    borderRadius: '22px',
                    padding: '24px 28px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.18)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Activity size={20} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DIAGNOSTIC TEST</span>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Request Blood test ({requestedBloodTests.length})
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {requestedBloodTests.map((bt, index) => (
                        <div
                          key={bt._id || index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', padding: '3px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '800' }}>
                              #{index + 1}
                            </span>
                            <div>
                              <div style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                Blood Test Request
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Status: <strong style={{ color: bt.CompleteStatus ? '#10b981' : '#f59e0b' }}>{bt.CompleteStatus ? 'Completed' : 'Pending Lab Processing'}</strong>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteBloodTest(bt._id)}
                            disabled={isDeletingBloodTest}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '10px',
                              fontWeight: '800',
                              fontSize: '0.84rem',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            title="Remove Blood Test Request"
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Urine Test Section */}
                {requestedUrineTests && requestedUrineTests.length > 0 && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    borderRadius: '22px',
                    padding: '24px 28px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Activity size={20} />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--teal-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DIAGNOSTIC TEST</span>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            Request Urine Test ({requestedUrineTests.length})
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {requestedUrineTests.map((ut, index) => (
                        <div
                          key={ut._id || index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '3px 10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '800' }}>
                              #{index + 1}
                            </span>
                            <div>
                              <div style={{ fontSize: '0.96rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                Urine Test Request
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                Status: <strong style={{ color: ut.CompleteStatus ? '#10b981' : '#f59e0b' }}>{ut.CompleteStatus ? 'Completed' : 'Pending Lab Processing'}</strong>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteUrineTest(ut._id)}
                            disabled={isDeletingUrineTest}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '10px',
                              fontWeight: '800',
                              fontSize: '0.84rem',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            title="Remove Urine Test Request"
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Notes Box & Complete Action Section */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '22px',
                  padding: '24px 28px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope size={20} style={{ color: 'var(--teal-400)' }} />
                    Treatment Notes
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      Enter Clinical Diagnosis & Treatment Plan Notes
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Type patient symptoms, diagnosis, prescribed medication, and medical treatment instructions here..."
                      value={treatmentNote}
                      onChange={(e) => setTreatmentNote(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-input)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: '14px',
                        padding: '14px 18px',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '10px' }}>
                    {/* Left Spacer to balance center flex alignment */}
                    <div style={{ flex: 1 }} />

                    {/* Center: Complete Button */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        disabled={isCompletingAppt || isCancelingAppt || isDeletingActiveAppt}
                        onClick={handleCompleteAppointment}
                        style={{
                          padding: '12px 36px',
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
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        {isCompletingAppt ? 'Completing...' : 'Complete'}
                      </button>
                    </div>

                    {/* Right Corner: Cancel & Delete Buttons */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      {/* Cancel Button */}
                      <button
                        type="button"
                        disabled={isCancelingAppt || isCompletingAppt || isDeletingActiveAppt}
                        onClick={handleCancelAppointment}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: '800',
                          fontSize: '0.95rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <XCircle size={18} />
                        {isCancelingAppt ? 'Canceling...' : 'Cancel'}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        disabled={isDeletingActiveAppt || isCompletingAppt || isCancelingAppt}
                        onClick={handleDeleteActiveAppointment}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: '800',
                          fontSize: '0.95rem',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={18} />
                        {isDeletingActiveAppt ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCTOR PAGE (Identical to Receptionist Dashboard Doctor Page) */}
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
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
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
        )}

        {/* TAB 4: COMPLETE APPOINTMENTS PAGE (Completed Doctor Appointments) */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {/* Search Bar Toolbar */}
            <div className="dash-search-toolbar">
              <div className="dash-toolbar-left-space" />
              <div className="dash-search-center-group" style={{ flex: 1, maxWidth: '640px' }}>
                <div className="dash-search-input-wrapper">
                  <Search size={18} className="dash-search-icon" />
                  <input
                    type="text"
                    placeholder="Search completed appointments by Patient Reg ID or NIC Number..."
                    value={completeApptSearchQuery}
                    onChange={(e) => setCompleteApptSearchQuery(e.target.value)}
                    className="dash-search-input"
                  />
                </div>
                {completeApptSearchQuery && (
                  <button
                    onClick={() => setCompleteApptSearchQuery('')}
                    className="back-btn"
                    style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchDoctorSpecificAppointments}
                  disabled={isLoadingDoctorAppts}
                  className="dash-search-btn"
                  style={{ padding: '10px 20px', fontSize: '0.9rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Refresh Appointments"
                >
                  <RefreshCw size={16} className={isLoadingDoctorAppts ? 'spin-icon' : ''} />
                  {isLoadingDoctorAppts ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="dash-toolbar-right-group" />
            </div>

            {doctorApptsError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                {doctorApptsError}
              </div>
            )}

            {/* Completed Appointments Table */}
            <div className="dash-patient-section">
              <div className="dash-patient-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} style={{ color: '#10b981' }} />
                  Doctor Completed Appointments
                </h3>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Showing {filteredCompletedDoctorAppts.length} of {completedDoctorAppointments.length} completed appointments
                </span>
              </div>

              <div className="dash-table-container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', overflowY: 'auto', boxShadow: 'var(--shadow-card)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Patient Reg ID</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor FullName</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Doctor RoomNumber</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Appointment Date</th>
                      <th style={{ padding: '16px 20px', fontWeight: '800' }}>Appointment Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '800' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompletedDoctorAppts.length > 0 ? (
                      filteredCompletedDoctorAppts.map((appt) => {
                        const patientObj = getPatientDetails(appt.PatientID);
                        const doctorObj = getDoctorDetails(appt.DoctorID);
                        const docName = myDetails?.FullName || user?.FullName || doctorObj?.FullName || 'Doctor';
                        const roomNum = myDetails?.RoomNumber || user?.RoomNumber || doctorObj?.RoomNumber || 'N/A';
                        const apptDateStr = appt.createdAt
                          ? new Date(appt.createdAt).toLocaleDateString()
                          : appt.AppointmentDate || 'Today';

                        return (
                          <tr key={appt._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                            <td style={{ padding: '16px 20px', fontWeight: '800', color: 'var(--teal-400)', fontSize: '1.02rem' }}>
                              {patientObj?.PatientRegID || appt.PatientID}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                              Dr. {docName}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-main)', fontSize: '1.02rem' }}>
                              Room {roomNum}
                            </td>
                            <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                              {apptDateStr}
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
                            <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                              <button
                                className="dash-search-btn"
                                onClick={() => {
                                  const patientObj = getPatientDetails(appt.PatientID);
                                  const doctorObj = getDoctorDetails(appt.DoctorID);
                                  const docName = myDetails?.FullName || user?.FullName || doctorObj?.FullName || 'Doctor';
                                  const apptDateStr = appt.createdAt
                                    ? new Date(appt.createdAt).toLocaleDateString()
                                    : appt.AppointmentDate || 'Today';
                                  const apptTimeStr = appt.createdAt
                                    ? new Date(appt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : '';

                                  setPrintData({
                                    patientRegId: patientObj?.PatientRegID || appt.PatientID,
                                    patientName: patientObj?.FullName || 'N/A',
                                    doctorName: docName,
                                    doctorNote: appt.DoctorNote || '',
                                    date: apptDateStr,
                                    time: apptTimeStr,
                                    isViewOnly: true
                                  });
                                  setShowPrintModal(true);
                                }}
                                style={{
                                  padding: '7px 16px',
                                  fontSize: '0.86rem',
                                  borderRadius: '10px',
                                  background: 'rgba(2, 132, 199, 0.18)',
                                  color: '#0284c7',
                                  border: '1px solid rgba(2, 132, 199, 0.35)',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  fontWeight: '800'
                                }}
                              >
                                <Eye size={16} />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {isLoadingDoctorAppts ? 'Loading completed appointments...' : completeApptSearchQuery ? `No completed appointments found matching "${completeApptSearchQuery}".` : 'No completed appointments recorded for this doctor.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                  {getInitials(myDetails?.FullName || user?.FullName || 'Doctor')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Dr. {myDetails?.FullName || user?.FullName || 'Doctor'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--teal-400)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={15} />
                      {myDetails?.Email || user?.Email || 'doctor@apexhealth.org'}
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
                      Role: Doctor
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
                    Dr. {myDetails?.FullName || 'N/A'}
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor Reg Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.DoctorRegistrationNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialization</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.DoctorSpecialization || 'General Medicine'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {myDetails?.Gender || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Room Number</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    Room {myDetails?.RoomNumber || 'N/A'}
                  </h4>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consultation Fee</span>
                  <h4 style={{ margin: '6px 0 0 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--teal-400)' }}>
                    LKR {myDetails?.OPDConsultationFee || '0'}
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
              <strong>Warning:</strong> Deleting your account will permanently remove your doctor credentials from the system.
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

      {/* 04. Delete Appointment Confirmation Modal Window (Identical to Receptionist Dashboard) */}
      {selectedApptToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
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
                {getPatientDetails(selectedApptToDelete.PatientID)?.FullName || 'Patient ID: ' + selectedApptToDelete.PatientID}
              </strong>{' '}
              (<span style={{ color: 'var(--teal-400)', fontWeight: '700' }}>{getPatientDetails(selectedApptToDelete.PatientID)?.PatientRegID || selectedApptToDelete.PatientID}</span>) assigned to{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                Dr. {myDetails?.FullName || user?.FullName || getDoctorDetails(selectedApptToDelete.DoctorID)?.FullName || 'Doctor'}
              </strong>?
            </p>

            {deleteApptError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {deleteApptError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setSelectedApptToDelete(null)}
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
                onClick={confirmDeleteAppointment}
              >
                {isDeletingAppt ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 05. Add Nurse Modal Window */}
      {showAddNurseModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '640px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={22} style={{ color: 'var(--teal-400)' }} />
                Select Nurse for Patient Care
              </h3>
              <button className="icon-btn" onClick={() => setShowAddNurseModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Search Nurse Bar */}
            <div className="dash-search-toolbar" style={{ marginBottom: '16px' }}>
              <div className="dash-search-input-wrapper" style={{ flex: 1 }}>
                <Search size={18} className="dash-search-icon" />
                <input
                  type="text"
                  placeholder="Search nurse by Full Name..."
                  value={nurseSearchQuery}
                  onChange={(e) => setNurseSearchQuery(e.target.value)}
                  className="dash-search-input"
                />
              </div>
              {nurseSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNurseSearchQuery('')}
                  className="back-btn"
                  style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              )}
            </div>

            {nurseFetchError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {nurseFetchError}
              </div>
            )}

            {/* List / Grid of Available Nurses */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {(() => {
                const availableNurses = nursesList.filter(n =>
                  n.InHospitalAvailability === true &&
                  n.InWork === false &&
                  (nurseSearchQuery.trim() ? (n.FullName || '').toLowerCase().includes(nurseSearchQuery.toLowerCase().trim()) : true)
                );

                if (isLoadingNurses) {
                  return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading available nurses...</div>;
                }

                if (availableNurses.length === 0) {
                  return (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      {nurseSearchQuery ? `No nurse matches found for "${nurseSearchQuery}".` : 'No available nurses in hospital currently (InHospitalAvailability = true & InWork = false).'}
                    </div>
                  );
                }

                return availableNurses.map((n) => (
                  <div
                    key={n._id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: 'var(--shadow-card)'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        Nurse {n.FullName}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: '800' }}>
                          In-Hospital Available
                        </span>
                        <span style={{ background: 'rgba(14, 165, 233, 0.18)', color: '#0ea5e9', border: '1px solid rgba(14, 165, 233, 0.4)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: '800' }}>
                          InWork: False
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAssigningNurse}
                      onClick={() => handleSelectNurse(n)}
                      className="dash-search-btn"
                      style={{ padding: '8px 20px', fontSize: '0.88rem', borderRadius: '10px', fontWeight: '800' }}
                    >
                      {isAssigningNurse ? 'Selecting...' : 'Select'}
                    </button>
                  </div>
                ));
              })()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <button type="button" className="back-btn" onClick={() => setShowAddNurseModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 06. Remove Nurse Assignment Confirmation Modal */}
      {showRemoveNurseModal && assignedNurseWork && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '22px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Remove Nurse Assignment?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to remove nurse assignment for{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                Nurse {assignedNurseWork.nurseName || 'Assigned Nurse'}
              </strong>{' '}
              and delete all associated work instructions for this patient?
            </p>

            {removeNurseError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {removeNurseError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setShowRemoveNurseModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRemovingNurseWork}
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
                onClick={confirmRemoveNurseWork}
              >
                {isRemovingNurseWork ? 'Removing...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 07. Delete Work Item Confirmation Modal */}
      {selectedWorkToDelete && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center', padding: '36px', borderRadius: '22px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Trash2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: '800' }}>
              Delete Work Instruction?
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              Are you sure you want to delete work instruction{' '}
              <strong style={{ color: 'var(--text-main)' }}>
                "{selectedWorkToDelete.Work}"
              </strong>?
            </p>

            {deleteWorkError && (
              <div className="error-banner" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
                <AlertCircle size={16} />
                {deleteWorkError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="back-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.95rem', justifyContent: 'center' }}
                onClick={() => setSelectedWorkToDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeletingWork}
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
                onClick={confirmDeleteWorkItem}
              >
                {isDeletingWork ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 08. Print Doctor Note / Appointment Ticket Modal (Identical to Receptionist Dashboard Print Window) */}
      {showPrintModal && printData && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '560px', width: '92%', textAlign: 'center', padding: '36px', borderRadius: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.18)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {printData.isViewOnly ? 'Appointment Doctor Note' : 'Consultation Complete'}
                </h3>
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
                Doctor Consultation Record
              </h2>

              {/* Patient PatientRegID (Big, Center and Top) */}
              <div style={{ background: 'rgba(45, 212, 191, 0.12)', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '16px', padding: '18px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  PATIENT REG ID
                </span>
                <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--teal-400)', letterSpacing: '0.05em', margin: '4px 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                  {printData.patientRegId}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {printData.patientName}
                </div>
              </div>

              {/* Doctor Name */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '800' }}>
                  ATTENDING DOCTOR
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                  Dr. {printData.doctorName}
                </div>
              </div>

              {/* Doctor Note Section */}
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-400)', fontWeight: '800', display: 'block', marginBottom: '8px' }}>
                  DOCTOR NOTE / CLINICAL DIAGNOSIS
                </span>
                <div style={{ fontSize: '0.96rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.6', background: 'rgba(0, 0, 0, 0.15)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  {printData.doctorNote || 'No doctor note recorded.'}
                </div>
              </div>

              {/* Date & Time Footer info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', fontSize: '0.86rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                <span>Date: <strong style={{ color: 'var(--text-main)' }}>{printData.date}</strong></span>
                {printData.time && <span>Time: <strong style={{ color: 'var(--text-main)' }}>{printData.time}</strong></span>}
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
                Print Note
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Tablet Quantity Modal */}
      {selectedTabletForQty && (
        <div className="modal-overlay" style={{ zIndex: 1150 }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={18} style={{ color: 'var(--teal-400)' }} />
                Enter Tablet Quantity
              </h4>
              <button type="button" className="icon-btn" onClick={() => setSelectedTabletForQty(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: 'rgba(13, 148, 136, 0.12)', border: '1px solid rgba(13, 148, 136, 0.3)', color: 'var(--teal-400)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', fontSize: '0.88rem' }}>
              <strong>Tablet Name:</strong> {selectedTabletForQty.medicine.TabletName}
            </div>

            <form onSubmit={handleConfirmTabletQuantity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  Quantity Needed
                </label>
                <input
                  type="number"
                  min="1"
                  value={selectedTabletForQty.quantity}
                  onChange={(e) => setSelectedTabletForQty({ ...selectedTabletForQty, quantity: e.target.value })}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    width: '100%'
                  }}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="button" className="back-btn" onClick={() => setSelectedTabletForQty(null)}>
                  Cancel
                </button>
                <button type="submit" className="dash-search-btn" style={{ padding: '8px 18px', fontSize: '0.88rem', borderRadius: '10px' }}>
                  Confirm & Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
