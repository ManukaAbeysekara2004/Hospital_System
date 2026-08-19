import React, { useState } from 'react';
import {
  User,
  Calendar,
  Phone,
  IdCard,
  MapPin,
  Pill,
  Building,
  Plus,
  X,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Eye,
  EyeOff,
  Award
} from 'lucide-react';

export default function PharmacistRegistration({ onBackToRoles, onBackToLogin }) {
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Professional Info, 3: Account Setup
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [registeredPharmacist, setRegisteredPharmacist] = useState(null);

  // Stage 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [dobYear, setDobYear] = useState('1992');
  const [dobMonth, setDobMonth] = useState('01');
  const [dobDay, setDobDay] = useState('01');
  const [gender, setGender] = useState('Male');
  const [nicNumber, setNicNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Stage 2: Professional Information
  const [pharmacyLicenseNumber, setPharmacyLicenseNumber] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [qualificationsList, setQualificationsList] = useState([]);
  const [qualificationInput, setQualificationInput] = useState('');
  const [assignedPharmacy, setAssignedPharmacy] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');

  // Stage 3: Account Setup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper arrays for DOB dropdowns
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => (currentYear - 18 - i).toString());
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

  const handleAddQualification = () => {
    if (qualificationInput.trim() && !qualificationsList.includes(qualificationInput.trim())) {
      setQualificationsList([...qualificationsList, qualificationInput.trim()]);
      setQualificationInput('');
    }
  };

  const handleRemoveQualification = (index) => {
    setQualificationsList(qualificationsList.filter((_, i) => i !== index));
  };

  // --- STAGE 1 VALIDATION ---
  const handleNextStep1 = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!nicNumber.trim()) {
      setErrorMessage('Please enter your NIC number.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber.trim())) {
      setErrorMessage('Phone Number must contain exactly 10 numeric digits.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please enter your address.');
      return;
    }

    setStep(2);
  };

  // --- STAGE 2 VALIDATION ---
  const handleNextStep2 = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pharmacyLicenseNumber.trim()) {
      setErrorMessage('Please enter your Pharmacy License Number.');
      return;
    }
    if (!employeeID.trim()) {
      setErrorMessage('Please enter your Employee ID.');
      return;
    }
    if (!assignedPharmacy.trim()) {
      setErrorMessage('Please enter your Assigned Pharmacy Unit.');
      return;
    }
    if (qualificationsList.length === 0) {
      setErrorMessage('Please add at least one professional qualification.');
      return;
    }
    if (!licenseExpiryDate) {
      setErrorMessage('Please select your License Expiry Date.');
      return;
    }

    setStep(3);
  };

  // --- STAGE 3 SUBMISSION & FINAL VALIDATION ---
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@gmail.com')) {
      setErrorMessage('Email address must end with @gmail.com (e.g. pharmacist@gmail.com).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    const assembledDOB = `${dobYear}-${dobMonth}-${dobDay}`;
    const formattedQualifications = qualificationsList.map(q => ({ Qualification: q }));

    const pharmacistData = {
      FullName: fullName.trim(),
      DateOfBirth: assembledDOB,
      Gender: gender,
      NICNumber: nicNumber.trim(),
      PhoneNumber: phoneNumber.trim(),
      Address: address.trim(),
      PharmacyLicenseNumber: pharmacyLicenseNumber.trim(),
      EmployeeID: employeeID.trim(),
      Qualifications: formattedQualifications,
      AssignedPharmacy: assignedPharmacy.trim(),
      LicenseExpiryDate: licenseExpiryDate,
      Email: trimmedEmail,
      Password: password
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/pharmacist/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pharmacistData)
      });

      const resData = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setRegisteredPharmacist(pharmacistData);
        setSuccessModal(true);
      } else {
        setIsLoading(false);
        setErrorMessage(resData.message || resData.error || 'Pharmacist registration failed. Please check your inputs.');
      }
    } catch (err) {
      console.error('Backend API fetch error:', err);
      setIsLoading(false);
      setErrorMessage('Could not connect to backend server. Please ensure Node.js server on port 5000 is running.');
    }
  };

  return (
    <div className="login-card animate-fade-in" style={{ gridTemplateColumns: '1fr', maxWidth: '980px' }}>
      <div className="auth-side" style={{ padding: '36px 48px' }}>
        <div>
          {/* Back Navigation Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button
              type="button"
              className="back-btn"
              onClick={step === 1 ? onBackToRoles : () => setStep(step - 1)}
            >
              <ArrowLeft size={18} />
              {step === 1 ? 'Back to Roles' : `Back to Stage ${step - 1}`}
            </button>

            {/* Stepper Progress Bar */}
            <div className="stepper-pills">
              <span className={`step-pill ${step >= 1 ? 'active' : ''}`}>1. Personal</span>
              <span className="step-line"></span>
              <span className={`step-pill ${step >= 2 ? 'active' : ''}`}>2. Professional</span>
              <span className="step-line"></span>
              <span className={`step-pill ${step >= 3 ? 'active' : ''}`}>3. Account</span>
            </div>
          </div>

          {/* Header Titles */}
          <div className="auth-header" style={{ marginBottom: '24px' }}>
            <div className="role-heading-badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7' }}>
              <Pill size={20} />
              Create Pharmacist Account
            </div>

            {/* Stage Subheaders */}
            <h2 className="auth-title" style={{ marginTop: '8px' }}>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Professional Information'}
              {step === 3 && 'Account Setup'}
            </h2>
            <p className="auth-subtitle">
              {step === 1 && 'Provide your personal details & contact information as hospital pharmacist.'}
              {step === 2 && 'Specify your Pharmacy License Number, qualifications, & assigned pharmacy unit.'}
              {step === 3 && 'Setup your official hospital email (@gmail.com) & secure pharmacist password.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="error-banner animate-fade-in" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          {/* STAGE 1 FORM: PERSONAL INFORMATION */}
          {step === 1 && (
            <form className="auth-form animate-fade-in" onSubmit={handleNextStep1}>
              <div className="input-group">
                <label className="input-label" htmlFor="pharmFullName">Full Name</label>
                <div className="input-field-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="pharmFullName"
                    type="text"
                    className="input-field"
                    placeholder="e.g. Pharm. David Miller"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">
                  Date Of Birth <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)' }}>(Formed as YYYY-MM-DD: {dobYear}-{dobMonth}-{dobDay})</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="input-field-wrapper">
                    <Calendar className="input-icon" size={18} />
                    <select
                      className="input-field"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y} (Year)</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-field-wrapper">
                    <select
                      className="input-field"
                      style={{ paddingLeft: '14px' }}
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                    >
                      {months.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-field-wrapper">
                    <select
                      className="input-field"
                      style={{ paddingLeft: '14px' }}
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                    >
                      {days.map(d => (
                        <option key={d} value={d}>{d} (Day)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="pharmGender">Gender</label>
                  <div className="input-field-wrapper">
                    <select
                      id="pharmGender"
                      className="input-field"
                      style={{ paddingLeft: '16px' }}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="pharmNIC">NIC Number</label>
                  <div className="input-field-wrapper">
                    <IdCard className="input-icon" size={18} />
                    <input
                      id="pharmNIC"
                      type="text"
                      className="input-field"
                      placeholder="e.g. 199212349876"
                      value={nicNumber}
                      onChange={(e) => setNicNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="pharmPhone">Phone Number (Must be 10 digits)</label>
                  <div className="input-field-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input
                      id="pharmPhone"
                      type="tel"
                      className="input-field"
                      placeholder="e.g. 0774455667"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="pharmAddress">Address</label>
                  <div className="input-field-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <input
                      id="pharmAddress"
                      type="text"
                      className="input-field"
                      placeholder="e.g. No 12, Pharmacy Way, Kandy"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn-large"
                style={{ marginTop: '14px', background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--teal-600) 100%)' }}
              >
                Next to Professional Information
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* STAGE 2 FORM: PROFESSIONAL INFORMATION */}
          {step === 2 && (
            <form className="auth-form animate-fade-in" onSubmit={handleNextStep2}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="pharmLicNo">Pharmacy License Number</label>
                  <div className="input-field-wrapper">
                    <Award className="input-icon" size={18} />
                    <input
                      id="pharmLicNo"
                      type="text"
                      className="input-field"
                      placeholder="e.g. PH-LCN-7721"
                      value={pharmacyLicenseNumber}
                      onChange={(e) => setPharmacyLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="pharmEmpID">Employee ID</label>
                  <div className="input-field-wrapper">
                    <Building className="input-icon" size={18} />
                    <input
                      id="pharmEmpID"
                      type="text"
                      className="input-field"
                      placeholder="e.g. PHM-201"
                      value={employeeID}
                      onChange={(e) => setEmployeeID(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="assignedPharm">Assigned Pharmacy Unit</label>
                  <div className="input-field-wrapper">
                    <Building className="input-icon" size={18} />
                    <input
                      id="assignedPharm"
                      type="text"
                      className="input-field"
                      placeholder="e.g. Main Outpatient Pharmacy"
                      value={assignedPharmacy}
                      onChange={(e) => setAssignedPharmacy(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="pharmExpiry">License Expiry Date</label>
                  <div
                    className="input-field-wrapper"
                    onClick={(e) => {
                      const dateInput = e.currentTarget.querySelector('input[type="date"]');
                      if (dateInput && dateInput.showPicker) {
                        try {
                          dateInput.showPicker();
                        } catch (err) {}
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Calendar className="input-icon" size={18} style={{ color: '#0284c7', opacity: 1, zIndex: 2 }} />
                    <input
                      id="pharmExpiry"
                      type="date"
                      className="input-field"
                      style={{ cursor: 'pointer' }}
                      value={licenseExpiryDate}
                      onChange={(e) => setLicenseExpiryDate(e.target.value)}
                      onClick={(e) => {
                        if (e.target.showPicker) {
                          try {
                            e.target.showPicker();
                          } catch (err) {}
                        }
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Qualifications Tag Input */}
              <div className="input-group">
                <label className="input-label">Qualifications (Multiple allowed)</label>
                <div className="input-field-wrapper">
                  <Award className="input-icon" size={18} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingRight: '120px' }}
                    placeholder="Type qualification & click Add"
                    value={qualificationInput}
                    onChange={(e) => setQualificationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddQualification();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="add-qual-btn"
                    style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', background: '#0284c7' }}
                    onClick={handleAddQualification}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="qual-tags-container">
                  {qualificationsList.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                      No qualifications added yet. Type a qualification above and click Add.
                    </div>
                  ) : (
                    qualificationsList.map((qual, idx) => (
                      <span key={idx} className="qual-tag" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', borderColor: 'rgba(2, 132, 199, 0.35)' }}>
                        {qual}
                        <button
                          type="button"
                          className="remove-qual-btn"
                          onClick={() => handleRemoveQualification(idx)}
                          title="Remove qualification"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="back-btn"
                  style={{ width: '40%', justifyContent: 'center' }}
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="submit-btn-large"
                  style={{ width: '60%', background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--teal-600) 100%)' }}
                >
                  Next to Account Setup
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          )}

          {/* STAGE 3 FORM: ACCOUNT SETUP */}
          {step === 3 && (
            <form className="auth-form animate-fade-in" onSubmit={handleFinalSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="pharmEmail">
                  Email Address <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>(Must end with @gmail.com)</span>
                </label>
                <div className="input-field-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="pharmEmail"
                    type="email"
                    className="input-field"
                    placeholder="e.g. david.miller@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="pharmPwd">Password</label>
                  <div className="input-field-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="pharmPwd"
                      type={showPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Enter strong password"
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
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="pharmCpwd">Confirm Password</label>
                  <div className="input-field-wrapper">
                    <FileCheck className="input-icon" size={18} />
                    <input
                      id="pharmCpwd"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input-field"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} style={{ color: '#0284c7' }} />
                  Summary Verification
                </div>
                <div>• Name: <strong style={{ color: 'var(--text-main)' }}>{fullName || 'N/A'}</strong> ({gender})</div>
                <div>• DOB: <strong style={{ color: 'var(--text-main)' }}>{dobYear}-{dobMonth}-{dobDay}</strong> | Phone: <strong style={{ color: 'var(--text-main)' }}>{phoneNumber || 'N/A'}</strong></div>
                <div>• License: <strong style={{ color: '#0284c7' }}>{pharmacyLicenseNumber || 'N/A'}</strong> | Emp ID: <strong style={{ color: 'var(--text-main)' }}>{employeeID || 'N/A'}</strong></div>
                <div>• Unit: <strong style={{ color: 'var(--text-main)' }}>{assignedPharmacy || 'N/A'}</strong></div>
                <div>• Qualifications: <strong style={{ color: 'var(--text-main)' }}>{qualificationsList.length > 0 ? qualificationsList.join(', ') : 'None added'}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="back-btn"
                  style={{ width: '35%', justifyContent: 'center' }}
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  type="submit"
                  className="submit-btn-large"
                  style={{ width: '65%', background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--teal-600) 100%)' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}></div>
                      Registering Pharmacist...
                    </>
                  ) : (
                    <>
                      Create Pharmacist Account
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="auth-footer">
          <div className="compliance-tag">
            <Pill size={16} style={{ color: '#10b981' }} />
            Pharmacist Registration
          </div>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'var(--primary-500)', cursor: 'pointer', fontWeight: '600' }}
            onClick={onBackToLogin}
          >
            Already have an account? Login here
          </button>
        </div>
      </div>

      {/* SUCCESS MODAL AFTER PHARMACIST REGISTRATION */}
      {successModal && registeredPharmacist && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              <CheckCircle2 size={44} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ color: '#10b981', textAlign: 'center' }}>
              Pharmacist Account Created Successfully
            </h3>
            <p>
              Pharmacist <strong>{registeredPharmacist.FullName}</strong> has been registered under <strong>{registeredPharmacist.AssignedPharmacy}</strong>.
            </p>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.88rem', textAlign: 'left', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '4px' }}>• License No: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{registeredPharmacist.PharmacyLicenseNumber}</span></div>
              <div style={{ marginBottom: '4px' }}>• Phone: <span style={{ color: 'var(--text-main)' }}>{registeredPharmacist.PhoneNumber}</span></div>
              <div style={{ marginBottom: '4px' }}>• Email: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{registeredPharmacist.Email}</span></div>
            </div>

            <button
              className="modal-action-btn"
              style={{ background: 'linear-gradient(135deg, var(--primary-500) 0%, var(--teal-600) 100%)' }}
              onClick={onBackToLogin}
            >
              Go to Pharmacist Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
