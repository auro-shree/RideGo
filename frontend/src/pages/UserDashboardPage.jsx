import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, CreditCard, ShieldCheck, FileText, Bell, LogOut, 
  CheckCircle, Clock, Heart, Key, Camera, Trash2, Edit, Save, X, 
  AlertCircle, Lock, Mail, Phone, MapPin, RefreshCw
} from 'lucide-react';
import { 
  getMyProfile, updateMyProfile, requestEmailChangeOtp, verifyEmailChangeOtp, 
  uploadProfileImage, deleteProfileImage, changePassword, MOCK_BOOKINGS 
} from '../services/api';

export default function UserDashboardPage({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [profile, setProfile] = useState({
    id: null,
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phoneNumber: '',
    profileImageUrl: null,
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emailVerified: false,
    phoneVerified: false
  });

  const [formData, setFormData] = useState({ ...profile });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // Change Email OTP Modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStep, setEmailStep] = useState('input'); // 'input' | 'verify'
  const [newEmail, setNewEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [emailModalError, setEmailModalError] = useState('');
  const [emailModalSuccess, setEmailModalSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  const [statusAlert, setStatusAlert] = useState(null); // { type: 'success' | 'error', message: '' }
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const parseUserProfile = (data) => {
    let dob = '';
    if (data.dateOfBirth) {
      if (Array.isArray(data.dateOfBirth) && data.dateOfBirth.length >= 3) {
        const y = data.dateOfBirth[0];
        const m = String(data.dateOfBirth[1]).padStart(2, '0');
        const d = String(data.dateOfBirth[2]).padStart(2, '0');
        dob = `${y}-${m}-${d}`;
      } else if (typeof data.dateOfBirth === 'string') {
        dob = data.dateOfBirth.includes('T') ? data.dateOfBirth.split('T')[0] : data.dateOfBirth;
      }
    }

    return {
      id: data.id || null,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      name: data.name || (data.firstName || data.lastName ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : ''),
      email: data.email || '',
      phoneNumber: data.phoneNumber || data.phone || '',
      profileImageUrl: data.profileImageUrl || null,
      dateOfBirth: dob,
      gender: data.gender || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      emergencyContactName: data.emergencyContactName || '',
      emergencyContactPhone: data.emergencyContactPhone || '',
      emailVerified: data.emailVerified || false,
      phoneVerified: data.phoneVerified || false,
      accountStatus: data.accountStatus || 'ACTIVE'
    };
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const data = await getMyProfile();
      const loadedProfile = parseUserProfile(data);
      setProfile(loadedProfile);
      setFormData(loadedProfile);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setProfileError('Unable to load your profile from server. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setStatusAlert({ type, message });
    setTimeout(() => setStatusAlert(null), 4500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (formData.firstName && !/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      showAlert('error', 'First name must contain only alphabetic characters.');
      return;
    }
    if (formData.lastName && !/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      showAlert('error', 'Last name must contain only alphabetic characters.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phoneNumber: formData.phoneNumber || '',
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        emergencyContactName: formData.emergencyContactName || '',
        emergencyContactPhone: formData.emergencyContactPhone || ''
      };
      const updated = await updateMyProfile(payload);
      const loadedProfile = parseUserProfile(updated);
      setProfile(loadedProfile);
      setFormData(loadedProfile);
      setIsEditingProfile(false);
      showAlert('success', 'Profile updated successfully.');
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ ...profile });
    setIsEditingProfile(false);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showAlert('error', 'Only JPG, PNG, and WEBP profile photos are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'File size exceeds 5MB limit.');
      return;
    }

    setSelectedPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleUploadPhotoSubmit = async () => {
    if (!selectedPhotoFile) return;
    setIsLoading(true);
    try {
      const updated = await uploadProfileImage(selectedPhotoFile);
      setProfile(prev => ({ ...prev, profileImageUrl: updated.profileImageUrl || photoPreview }));
      setSelectedPhotoFile(null);
      setPhotoPreview(null);
      showAlert('success', 'Profile photo updated successfully.');
    } catch (err) {
      showAlert('error', 'Failed to upload photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    setIsLoading(true);
    try {
      await deleteProfileImage();
      setProfile(prev => ({ ...prev, profileImageUrl: null }));
      setPhotoPreview(null);
      setSelectedPhotoFile(null);
      showAlert('success', 'Profile photo removed.');
    } catch (err) {
      showAlert('error', 'Failed to remove profile photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmailModal = () => {
    setEmailStep('input');
    setNewEmail('');
    setOtpCode('');
    setEmailModalError('');
    setEmailModalSuccess('');
    setResendCooldown(0);
    setShowEmailModal(true);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailModalError('');
    setEmailModalSuccess('');

    const targetEmail = newEmail.trim();

    if (!targetEmail || !/\S+@\S+\.\S+/.test(targetEmail)) {
      setEmailModalError('Please enter a valid email address.');
      return;
    }

    if (targetEmail.toLowerCase() === profile.email.toLowerCase()) {
      setEmailModalError('New email must be different from your current email.');
      return;
    }

    setIsLoading(true);
    try {
      await requestEmailChangeOtp(targetEmail);
      setEmailStep('verify');
      setResendCooldown(60);
      setEmailModalSuccess(`OTP sent successfully to ${targetEmail}`);
    } catch (err) {
      setEmailModalError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setEmailModalError('');
    setEmailModalSuccess('');

    const code = otpCode.trim();
    if (!code || !/^[0-9]{6}$/.test(code)) {
      setEmailModalError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await verifyEmailChangeOtp(newEmail.trim(), code);
      const loadedProfile = parseUserProfile(updatedUser);
      setProfile(loadedProfile);
      setFormData(loadedProfile);
      setShowEmailModal(false);
      showAlert('success', 'Email address updated and verified successfully.');
    } catch (err) {
      setEmailModalError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setEmailModalError('');
    setEmailModalSuccess('');
    setIsLoading(true);
    try {
      await requestEmailChangeOtp(newEmail.trim());
      setResendCooldown(60);
      setOtpCode('');
      setEmailModalSuccess(`A new 6-digit OTP has been sent to ${newEmail.trim()}`);
    } catch (err) {
      setEmailModalError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      showAlert('error', 'Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      showAlert('error', 'New password must be at least 8 characters long.');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/.test(newPassword)) {
      showAlert('error', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showAlert('success', 'Password changed successfully.');
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to change password. Verify your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-available';
      case 'ACTIVE': return 'badge-active';
      case 'COMPLETED': return 'badge-category';
      default: return 'badge-category';
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#F8FAFC', minHeight: '88vh' }}>
      <div className="container">
        {/* Toast Notification Alert */}
        {statusAlert && (
          <div style={{
            position: 'fixed',
            top: '85px',
            right: '20px',
            zIndex: 1100,
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            backgroundColor: statusAlert.type === 'success' ? '#10B981' : '#EF4444',
            color: '#FFFFFF'
          }}>
            {statusAlert.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {statusAlert.message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
          {/* Left Navigation Sidebar */}
          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            {/* Customer Profile Header */}
            <div style={{ textAlign: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative', width: '84px', height: '84px', margin: '0 auto 0.85rem' }}>
                {profile.profileImageUrl || photoPreview ? (
                  <img 
                    src={photoPreview || profile.profileImageUrl} 
                    alt="Profile Avatar" 
                    style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFB800' }}
                  />
                ) : (
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    backgroundColor: '#FFB800',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(255, 184, 0, 0.4)'
                  }}>
                    {(profile.firstName ? profile.firstName[0] : (profile.name ? profile.name[0] : 'U'))}
                  </div>
                )}
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#0F172A', marginBottom: '0.15rem' }}>
                {profile.name || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Rider Profile'}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.5rem' }}>{profile.email || 'No email attached'}</div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span className="badge badge-available">Verified Rider</span>
                <span className="badge badge-category">{profile.accountStatus || 'ACTIVE'}</span>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { id: 'profile', label: 'Profile Information', icon: User },
                { id: 'bookings', label: 'My Bookings', icon: Calendar },
                { id: 'rentals', label: 'Active Rentals', icon: Clock },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'documents', label: 'Documents & KYC', icon: FileText },
                { id: 'security', label: 'Security & Password', icon: Key }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? 'rgba(255, 184, 0, 0.15)' : 'transparent',
                      color: isActive ? '#000000' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={18} color={isActive ? '#D97706' : '#64748B'} />
                    {item.label}
                  </button>
                );
              })}

              <button 
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#EF4444',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  marginTop: '0.85rem'
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ minWidth: 0 }}>
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="card" style={{ padding: '1.75rem' }}>
                {profileLoading ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                    <RefreshCw size={28} className="spin-animation" style={{ marginBottom: '1rem', color: '#D97706' }} />
                    <p style={{ fontWeight: 600 }}>Loading profile from PostgreSQL database...</p>
                  </div>
                ) : profileError ? (
                  <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                    <AlertCircle size={36} color="#DC2626" style={{ marginBottom: '0.75rem' }} />
                    <h3 style={{ fontSize: '1.1rem', color: '#991B1B', marginBottom: '0.5rem' }}>Unable to load your profile. Please try again.</h3>
                    <button onClick={fetchProfile} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem', gap: '0.4rem' }}>
                      <RefreshCw size={14} /> Retry Loading Profile
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', color: '#0F172A' }}>Customer Profile</h2>
                        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Manage your personal details, contact preferences, and address</p>
                      </div>

                      {!isEditingProfile ? (
                        <button 
                          onClick={() => setIsEditingProfile(true)} 
                          className="btn btn-primary btn-sm"
                          style={{ gap: '0.4rem' }}
                        >
                          <Edit size={16} /> Edit Profile
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={handleCancelEdit} className="btn btn-secondary btn-sm">Cancel</button>
                          <button onClick={handleSaveProfile} disabled={isLoading} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                            <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Profile Photo Section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative' }}>
                        {photoPreview || profile.profileImageUrl ? (
                          <img 
                            src={photoPreview || profile.profileImageUrl} 
                            alt="Profile Preview" 
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFB800' }} 
                          />
                        ) : (
                          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#FFB800', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800 }}>
                            {(profile.firstName ? profile.firstName[0] : (profile.name ? profile.name[0] : 'U'))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.98rem', color: '#0F172A', marginBottom: '0.2rem' }}>Profile Photo</h4>
                        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.75rem' }}>PNG, JPG, or WEBP. Maximum file size 5MB.</p>

                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', gap: '0.35rem' }}>
                            <Camera size={14} /> Change Photo
                            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handlePhotoSelect} style={{ display: 'none' }} />
                          </label>

                          {selectedPhotoFile && (
                            <button onClick={handleUploadPhotoSubmit} disabled={isLoading} className="btn btn-primary btn-sm">
                              {isLoading ? 'Uploading...' : 'Upload Photo'}
                            </button>
                          )}

                          {profile.profileImageUrl && (
                            <button onClick={handleDeletePhoto} disabled={isLoading} className="btn btn-secondary btn-sm" style={{ color: '#EF4444', gap: '0.35rem' }}>
                              <Trash2 size={14} /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Personal Information Form */}
                    <form onSubmit={handleSaveProfile}>
                      <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1rem' }}>Personal Information</h3>
                      <div className="grid-2" style={{ marginBottom: '2rem' }}>
                        <div className="form-group">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            name="firstName" 
                            placeholder="Enter first name"
                            value={isEditingProfile ? formData.firstName : profile.firstName} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control" 
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            name="lastName" 
                            placeholder="Enter last name"
                            value={isEditingProfile ? formData.lastName : profile.lastName} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label className="form-label">Email Address</label>
                            <button type="button" onClick={handleOpenEmailModal} style={{ background: 'none', border: 'none', color: '#D97706', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                              Change Email
                            </button>
                          </div>
                          <input 
                            type="email" 
                            value={profile.email} 
                            readOnly 
                            className="form-control"
                            style={{ backgroundColor: '#F8FAFC' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: profile.emailVerified ? '#059669' : '#D97706', marginTop: '0.2rem', display: 'block' }}>
                            {profile.emailVerified ? '✓ Email Verified' : '⚠ Email Unverified'}
                          </span>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="text" 
                            name="phoneNumber" 
                            placeholder="Enter phone number"
                            value={isEditingProfile ? formData.phoneNumber : profile.phoneNumber} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            name="dateOfBirth" 
                            value={isEditingProfile ? formData.dateOfBirth : profile.dateOfBirth} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Gender</label>
                          {isEditingProfile ? (
                            <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className="form-control">
                              <option value="">Select gender</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          ) : (
                            <input 
                              type="text" 
                              value={
                                profile.gender === 'MALE' ? 'Male' :
                                profile.gender === 'FEMALE' ? 'Female' :
                                profile.gender === 'OTHER' ? 'Other' :
                                (profile.gender || '')
                              } 
                              placeholder="Not specified" 
                              readOnly 
                              className="form-control" 
                              style={{ backgroundColor: '#F8FAFC' }} 
                            />
                          )}
                        </div>
                      </div>

                      {/* Address Section */}
                      <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1rem' }}>Address Details</h3>
                      <div className="grid-4" style={{ marginBottom: '2rem' }}>
                        <div className="form-group">
                          <label className="form-label">Street Address</label>
                          <input 
                            type="text" 
                            name="address" 
                            placeholder="Enter street address"
                            value={isEditingProfile ? formData.address : profile.address} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input 
                            type="text" 
                            name="city" 
                            placeholder="Enter city"
                            value={isEditingProfile ? formData.city : profile.city} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">State</label>
                          <input 
                            type="text" 
                            name="state" 
                            placeholder="Enter state"
                            value={isEditingProfile ? formData.state : profile.state} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Postal Code</label>
                          <input 
                            type="text" 
                            name="postalCode" 
                            placeholder="Enter postal code"
                            value={isEditingProfile ? formData.postalCode : profile.postalCode} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '1rem' }}>Emergency Contact</h3>
                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Contact Name</label>
                          <input 
                            type="text" 
                            name="emergencyContactName" 
                            placeholder="Enter contact name"
                            value={isEditingProfile ? formData.emergencyContactName : profile.emergencyContactName} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Contact Phone</label>
                          <input 
                            type="text" 
                            name="emergencyContactPhone" 
                            placeholder="Enter contact phone"
                            value={isEditingProfile ? formData.emergencyContactPhone : profile.emergencyContactPhone} 
                            onChange={handleInputChange} 
                            readOnly={!isEditingProfile} 
                            className="form-control"
                            style={{ backgroundColor: !isEditingProfile ? '#F8FAFC' : '#FFFFFF' }}
                          />
                        </div>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* SECURITY / CHANGE PASSWORD TAB */}
            {activeTab === 'security' && (
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '0.35rem' }}>Security & Password</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.75rem' }}>Manage your password and security options</p>

                <form onSubmit={handleChangePasswordSubmit} style={{ maxWidth: '500px', width: '100%' }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.currentPassword} 
                      onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} 
                      className="form-control" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.newPassword} 
                      onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} 
                      className="form-control" 
                      required 
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem', display: 'block' }}>
                      At least 8 characters, with 1 uppercase, 1 lowercase, 1 number & 1 special character.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirmPassword} 
                      onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} 
                      className="form-control" 
                      required 
                    />
                  </div>

                  <button type="submit" disabled={isLoading} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '1.25rem' }}>My Bookings</h2>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                        <th style={{ padding: '0.75rem' }}>Booking ID</th>
                        <th style={{ padding: '0.75rem' }}>Bike</th>
                        <th style={{ padding: '0.75rem' }}>Dates</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_BOOKINGS.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0F172A' }}>#{b.id}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#0F172A', fontWeight: 600 }}>{b.bikeName}</td>
                          <td style={{ padding: '0.85rem 0.75rem', color: '#475569', fontSize: '0.85rem' }}>{b.fromDate} - {b.toDate}</td>
                          <td style={{ padding: '0.85rem 0.75rem' }}>
                            <span className={`badge ${getStatusBadgeClass(b.status)}`}>{b.status}</span>
                          </td>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: '#0F172A' }}>₹{b.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* OTHER TABS */}
            {['rentals', 'wishlist', 'payments', 'notifications', 'documents'].includes(activeTab) && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#0F172A', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                  {activeTab} Management
                </h3>
                <p style={{ color: '#64748B' }}>Your {activeTab} information is up to date.</p>
              </div>
            )}
          </div>
        </div>

        {/* Change Email Modal with OTP Verification */}
        {showEmailModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '440px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A' }}>
                  {emailStep === 'input' ? 'Change Email Address' : 'Verify OTP Code'}
                </h3>
                <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={20} />
                </button>
              </div>

              {emailModalError && (
                <div style={{ padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} color="#991B1B" />
                  {emailModalError}
                </div>
              )}

              {emailModalSuccess && (
                <div style={{ padding: '0.75rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', color: '#065F46', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="#065F46" />
                  {emailModalSuccess}
                </div>
              )}

              {emailStep === 'input' ? (
                <form onSubmit={handleSendOtp}>
                  <div className="form-group">
                    <label className="form-label">Current Email</label>
                    <input type="email" value={profile.email} readOnly className="form-control" style={{ backgroundColor: '#F8FAFC' }} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Email Address</label>
                    <input 
                      type="email" 
                      value={newEmail} 
                      onChange={e => { setNewEmail(e.target.value); setEmailModalError(''); }} 
                      placeholder="new.email@example.com" 
                      className="form-control" 
                      required 
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem', display: 'block' }}>
                      A 6-digit OTP verification code will be sent to your new email address.
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={() => setShowEmailModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
                    <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm">
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ marginBottom: '1rem', fontSize: '0.88rem', color: '#475569' }}>
                    Enter the 6-digit OTP verification code sent to: <strong style={{ color: '#0F172A' }}>{newEmail}</strong>
                  </div>

                  <div className="form-group">
                    <label className="form-label">OTP Verification Code</label>
                    <input 
                      type="text" 
                      maxLength={6} 
                      value={otpCode} 
                      onChange={e => { setOtpCode(e.target.value.replace(/\D/g, '')); setEmailModalError(''); }} 
                      placeholder="______" 
                      className="form-control" 
                      style={{ letterSpacing: '0.4rem', fontSize: '1.15rem', textAlign: 'center', fontWeight: 700 }} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                    <button 
                      type="button" 
                      onClick={handleResendOtp} 
                      disabled={resendCooldown > 0 || isLoading} 
                      style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? '#94A3B8' : '#D97706', fontSize: '0.85rem', fontWeight: 600, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' }}
                    >
                      {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setEmailStep('input')} className="btn btn-secondary btn-sm">Back</button>
                      <button type="submit" disabled={isLoading} className="btn btn-primary btn-sm">
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
