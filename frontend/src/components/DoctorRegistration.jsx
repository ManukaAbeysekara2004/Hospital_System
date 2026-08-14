import React, { useState } from 'react';
import {
  User,
  Calendar,
  Phone,
  IdCard,
  MapPin,
  Award,
  Stethoscope,
  Briefcase,
  Building2,
  DoorOpen,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  FileCheck,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export default function DoctorRegistration({ onBackToRoles, onBackToLogin }) {
  const [step, setStep] = useState(1); // 1: Personal Info, 2: Professional Info, 3: Account Setup
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [registeredDoctor, setRegisteredDoctor] = useState(null);

  // Stage 1: Personal Information
  const [fullName, setFullName] = useState('');
  const [dobYear, setDobYear] = useState('1985');
  const [dobMonth, setDobMonth] = useState('01');
  const [dobDay, setDobDay] = useState('15');
  const [gender, setGender] = useState('Male');
  const [nicPassportNumber, setNicPassportNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Stage 2: Professional Information
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [qualInput, setQualInput] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [department, setDepartment] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

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

  // Qualification Add & Delete
  const handleAddQualification = (e) => {
    if (e) e.preventDefault();
    if (qualInput.trim() && !qualifications.includes(qualInput.trim())) {
      setQualifications([...qualifications, qualInput.trim()]);
      setQualInput('');
    }
  };

  const handleKeyDownQualification = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddQualification();
    }
  };

  const handleRemoveQualification = (qualToRemove) => {
    setQualifications(qualifications.filter(q => q !== qualToRemove));
  };

  // --- STAGE 1 VALIDATION ---
  const handleNextStep1 = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!nicPassportNumber.trim()) {
      setErrorMessage('Please enter your NIC / Passport number.');
      return;
    }
    // PhoneNumber must contain exactly 10 digits
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

    if (!medicalLicenseNumber.trim()) {
      setErrorMessage('Please enter your Medical License Number.');
      return;
    }
    if (!specialization.trim()) {
      setErrorMessage('Please enter your Specialization.');
      return;
    }

    let currentQuals = [...qualifications];
    if (qualInput.trim() && !currentQuals.includes(qualInput.trim())) {
      currentQuals.push(qualInput.trim());
      setQualifications(currentQuals);
      setQualInput('');
    }

    if (currentQuals.length === 0) {
      setErrorMessage('Please add at least one Qualification.');
      return;
    }
    if (!yearsOfExperience || isNaN(yearsOfExperience) || parseInt(yearsOfExperience, 10) < 0) {
      setErrorMessage('Please enter a valid number of Years of Experience.');
      return;
    }
    if (!department.trim()) {
      setErrorMessage('Please enter your Department.');
      return;
    }
    if (!roomNumber.trim()) {
      setErrorMessage('Please enter your assigned Room Number.');
      return;
    }

    setStep(3);
  };

  // --- STAGE 3 SUBMISSION & FINAL VALIDATION ---
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check email ends with @gmail.com
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@gmail.com')) {
      setErrorMessage('Email address must end with @gmail.com (e.g. doctor@gmail.com).');
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

    // Validate Password === confirmPassword
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    // Assemble DateOfBirth as year-month-date
    const assembledDOB = `${dobYear}-${dobMonth}-${dobDay}`;

    // Format Qualifications as [{ Qualification: 'MBBS' }] for Mongoose schema compatibility
    const formattedQuals = qualifications.map(q => {
      if (typeof q === 'string') return { Qualification: q };
      return q;
    });

    // Payload to send to Doctor_Registration in backend
    const doctorData = {
      FullName: fullName.trim(),
      DateOfBirth: assembledDOB,
      Gender: gender,
      NICPassportNumber: nicPassportNumber.trim(),
      PhoneNumber: phoneNumber.trim(),
      Address: address.trim(),
      MedicalLicenseNumber: medicalLicenseNumber.trim(),
      Specialization: specialization.trim(),
      Qualifications: formattedQuals,
      YearsOfExperience: parseInt(yearsOfExperience, 10) || 0,
      Department: department.trim(),
      RoomNumber: roomNumber.trim(),
      Email: trimmedEmail,
      Password: password
    };

    setIsLoading(true);

    try {
      // Call backend API Doctor_Registration
      const response = await fetch('http://localhost:5000/api/doctor/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
      });

      const resData = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setRegisteredDoctor(doctorData);
        setSuccessModal(true);
      } else {
        setIsLoading(false);
        setErrorMessage(resData.message || resData.error || 'Doctor registration failed. Please check your inputs.');
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
            <div className="role-heading-badge">
              <Stethoscope size={20} />
              Create Doctor Account
            </div>

            {/* Stage Subheaders */}
            <h2 className="auth-title" style={{ marginTop: '8px' }}>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Professional Information'}
              {step === 3 && 'Account Setup'}
            </h2>
            <p className="auth-subtitle">
              {step === 1 && 'Provide your personal details & contact information as an authorized physician.'}
              {step === 2 && 'Specify your medical qualifications, specialization, department, & room number.'}
              {step === 3 && 'Setup your official hospital email (@gmail.com) & secure password.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="error-banner animate-fade-in" style={{ marginBottom: '20px' }}>
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          {/* ========================================================= */}
          {/* STAGE 1 FORM: PERSONAL INFORMATION */}
          {/* ========================================================= */}
          {step === 1 && (
            <form className="auth-form animate-fade-in" onSubmit={handleNextStep1}>
              {/* Full Name */}
              <div className="input-group">
                <label className="input-label" htmlFor="fullName">Full Name</label>
                <div className="input-field-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    id="fullName"
                    type="text"
                    className="input-field"
                    placeholder="e.g. Dr. Alexander Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Date of Birth: 3 separate inputs (Year, Month, Date) */}
              <div className="input-group">
                <label className="input-label">
                  Date Of Birth <span style={{ fontSize: '0.8rem', color: 'var(--teal-400)' }}>(Formed as YYYY-MM-DD: {dobYear}-{dobMonth}-{dobDay})</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {/* Year Input */}
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

                  {/* Month Input */}
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

                  {/* Date Input */}
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

              {/* Gender & NIC/Passport */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="gender">Gender</label>
                  <div className="input-field-wrapper">
                    <select
                      id="gender"
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
                  <label className="input-label" htmlFor="nic">NIC / Passport Number</label>
                  <div className="input-field-wrapper">
                    <IdCard className="input-icon" size={18} />
                    <input
                      id="nic"
                      type="text"
                      className="input-field"
                      placeholder="e.g. 198512345678"
                      value={nicPassportNumber}
                      onChange={(e) => setNicPassportNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number & Address */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="phone">Phone Number (Must be 10 digits)</label>
                  <div className="input-field-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input
                      id="phone"
                      type="tel"
                      className="input-field"
                      placeholder="e.g. 0771234567"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="address">Address</label>
                  <div className="input-field-wrapper">
                    <MapPin className="input-icon" size={18} />
                    <input
                      id="address"
                      type="text"
                      className="input-field"
                      placeholder="e.g. No. 45, Hospital Road, Colombo"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Next Button for Stage 1 */}
              <button
                type="submit"
                className="submit-btn-large"
                style={{ marginTop: '14px' }}
              >
                Next to Professional Information
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* ========================================================= */}
          {/* STAGE 2 FORM: PROFESSIONAL INFORMATION */}
          {/* ========================================================= */}
          {step === 2 && (
            <form className="auth-form animate-fade-in" onSubmit={handleNextStep2}>
              {/* Medical License & Specialization */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="license">Medical License Number</label>
                  <div className="input-field-wrapper">
                    <Award className="input-icon" size={18} />
                    <input
                      id="license"
                      type="text"
                      className="input-field"
                      placeholder="e.g. SLMC-88402"
                      value={medicalLicenseNumber}
                      onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="spec">Specialization</label>
                  <div className="input-field-wrapper">
                    <Stethoscope className="input-icon" size={18} />
                    <input
                      id="spec"
                      type="text"
                      className="input-field"
                      placeholder="e.g. Cardiology & Vascular Care"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Qualifications Input */}
              <div className="input-group">
                <label className="input-label">Qualifications (Add multiple qualifications)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="input-field-wrapper" style={{ flex: 1 }}>
                    <Award className="input-icon" size={18} />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Type a qualification (e.g. MBBS, MD, FRCS) and click Add or press Enter"
                      value={qualInput}
                      onChange={(e) => setQualInput(e.target.value)}
                      onKeyDown={handleKeyDownQualification}
                    />
                  </div>
                  <button
                    type="button"
                    className="add-qual-btn"
                    onClick={handleAddQualification}
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                {/* Added Qualifications Tags Display */}
                <div className="qual-tags-container" style={{ marginTop: '8px', minHeight: '32px' }}>
                  {qualifications.length === 0 ? (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No qualifications added yet. Type a qualification above and click Add.
                    </span>
                  ) : (
                    qualifications.map((q, idx) => (
                      <span key={idx} className="qual-tag">
                        {q}
                        <button
                          type="button"
                          className="remove-qual-btn"
                          onClick={() => handleRemoveQualification(q)}
                          title="Remove qualification"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Years of Experience & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="exp">Years Of Experience</label>
                  <div className="input-field-wrapper">
                    <Briefcase className="input-icon" size={18} />
                    <input
                      id="exp"
                      type="number"
                      min="0"
                      className="input-field"
                      placeholder="e.g. 10"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="dept">Department</label>
                  <div className="input-field-wrapper">
                    <Building2 className="input-icon" size={18} />
                    <input
                      id="dept"
                      type="text"
                      className="input-field"
                      placeholder="e.g. Cardiology Ward A"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Room Number */}
              <div className="input-group">
                <label className="input-label" htmlFor="room">Room Number</label>
                <div className="input-field-wrapper">
                  <DoorOpen className="input-icon" size={18} />
                  <input
                    id="room"
                    type="text"
                    className="input-field"
                    placeholder="e.g. Room 204"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                  style={{ width: '60%' }}
                >
                  Next to Account Setup
                  <ArrowRight size={20} />
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* STAGE 3 FORM: ACCOUNT SETUP */}
          {/* ========================================================= */}
          {step === 3 && (
            <form className="auth-form animate-fade-in" onSubmit={handleFinalSubmit}>
              {/* Email (Validated to end with @gmail.com) */}
              <div className="input-group">
                <label className="input-label" htmlFor="docEmail">
                  Email Address <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>(Must end with @gmail.com)</span>
                </label>
                <div className="input-field-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="docEmail"
                    type="email"
                    className="input-field"
                    placeholder="e.g. dr.vance@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="input-group">
                  <label className="input-label" htmlFor="pwd">Password</label>
                  <div className="input-field-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="pwd"
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
                  <label className="input-label" htmlFor="cpwd">Confirm Password</label>
                  <div className="input-field-wrapper">
                    <FileCheck className="input-icon" size={18} />
                    <input
                      id="cpwd"
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

              {/* Summary Preview Box */}
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--teal-400)' }} />
                  Summary Verification
                </div>
                <div>• Name: <strong style={{ color: 'var(--text-main)' }}>{fullName || 'N/A'}</strong> ({gender})</div>
                <div>• DOB: <strong style={{ color: 'var(--text-main)' }}>{dobYear}-{dobMonth}-{dobDay}</strong> | Phone: <strong style={{ color: 'var(--text-main)' }}>{phoneNumber || 'N/A'}</strong></div>
                <div>• Specialization: <strong style={{ color: 'var(--primary-500)' }}>{specialization || 'N/A'}</strong> | Dept: <strong style={{ color: 'var(--text-main)' }}>{department || 'N/A'}</strong></div>
                <div>• License: <strong style={{ color: 'var(--text-main)' }}>{medicalLicenseNumber || 'N/A'}</strong> | Room: <strong style={{ color: 'var(--text-main)' }}>{roomNumber || 'N/A'}</strong></div>
              </div>

              {/* Action Buttons */}
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
                  style={{ width: '65%' }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}></div>
                      Registering Doctor...
                    </>
                  ) : (
                    <>
                      Create Doctor Account
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
            <ShieldCheck size={16} style={{ color: '#10b981' }} />
            Medical Staff Data Registration
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

      {/* SUCCESS MODAL AFTER DOCTOR REGISTRATION */}
      {successModal && registeredDoctor && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              <CheckCircle2 size={44} style={{ color: '#10b981' }} />
            </div>
            <h3 style={{ color: '#10b981', textAlign: 'center' }}>
              Account created successfully.
            </h3>
            <p>
              Doctor <strong>{registeredDoctor.FullName}</strong> has been registered in the system under <strong>{registeredDoctor.Department}</strong>.
            </p>

            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.88rem', textAlign: 'left', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: '4px' }}>• License No: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{registeredDoctor.MedicalLicenseNumber}</span></div>
              <div style={{ marginBottom: '4px' }}>• DOB: <span style={{ color: 'var(--text-main)' }}>{registeredDoctor.DateOfBirth}</span></div>
              <div style={{ marginBottom: '4px' }}>• Phone (10 digits): <span style={{ color: 'var(--text-main)' }}>{registeredDoctor.PhoneNumber}</span></div>
              <div style={{ marginBottom: '4px' }}>• Specialization: <span style={{ color: 'var(--primary-500)', fontWeight: 'bold' }}>{registeredDoctor.Specialization}</span></div>
              <div style={{ marginBottom: '4px' }}>• Email (@gmail.com): <span style={{ color: '#10b981', fontWeight: 'bold' }}>{registeredDoctor.Email}</span></div>
              <div>• Assigned Room: <span style={{ color: 'var(--text-main)' }}>{registeredDoctor.RoomNumber}</span></div>
            </div>

            <button
              className="modal-action-btn"
              onClick={onBackToLogin}
            >
              Go to Doctor Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
