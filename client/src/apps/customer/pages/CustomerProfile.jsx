import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Phone,
  Mail,
  RotateCcw,
  ShieldCheck,
  HeartHandshake,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  Clock,
  Check,
  ShieldAlert,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { authAPI, complaintsAPI } from '../../../services/api';

export const CustomerProfile = () => {
  const { user, updateUser, resetUser } = useCustomer();
  const { currentUser, getRoleSession, saveRoleSession, logout } = useAuth();
  const customerSession = getRoleSession('customer') || (currentUser?.role === 'customer' ? currentUser : null);
  const navigate = useNavigate();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customerSession?.name || currentUser?.name || user.name || 'Customer');
  const [phone, setPhone] = useState(customerSession?.phone || currentUser?.phone || user.contact || '');
  const [location, setLocation] = useState(customerSession?.locality || currentUser?.locality || user.location || 'Ward 4, Adyar, Chennai');
  const [userCategory, setUserCategory] = useState(customerSession?.userCategory || currentUser?.userCategory || user.userCategory || 'household');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Complaint Box Form State
  const [complaintCategory, setComplaintCategory] = useState('Service Quality & Incomplete Work');
  const [complaintAgainst, setComplaintAgainst] = useState('Ravi Kumar (Plumber)');
  const [complaintBookingId, setComplaintBookingId] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintSuccessMsg, setComplaintSuccessMsg] = useState('');
  const [complaintErrorMsg, setComplaintErrorMsg] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(true);

  // Complaints History
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  useEffect(() => {
    const active = customerSession || currentUser;
    if (active) {
      if (active.name) setName(active.name);
      if (active.phone) setPhone(active.phone);
      if (active.locality) setLocation(active.locality);
      if (active.userCategory) setUserCategory(active.userCategory);
    }
  }, [customerSession, currentUser]);

  // Load complaints filed by this customer
  const fetchMyComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const res = await complaintsAPI.getAll();
      if (res.success && Array.isArray(res.data)) {
        const activeName = (name || customerSession?.name || currentUser?.name || '').toLowerCase();
        const activePhone = (phone || customerSession?.phone || currentUser?.phone || '').trim();

        // Match by complainant name, phone, or show customer-role grievances
        const filtered = res.data.filter(c => {
          if (!c.complainant) return false;
          const cName = c.complainant.toLowerCase();
          const cPhone = (c.complainantPhone || '').trim();
          return (
            (activeName && (cName.includes(activeName) || activeName.includes(cName))) ||
            (activePhone && cPhone === activePhone) ||
            c.complainantRole === 'Customer'
          );
        });
        setMyComplaints(filtered);
      }
    } catch (err) {
      console.warn('Could not load customer complaints:', err.message);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, [name, phone]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setToastMessage('');

    const targetUserId = customerSession?.userId || currentUser?.userId || user?.userId;
    const targetPhone = phone || customerSession?.phone || currentUser?.phone;

    try {
      const res = await authAPI.updateProfile({
        userId: targetUserId,
        phone: targetPhone,
        name: name.trim(),
        locality: location.trim(),
        userCategory
      });

      if (res.success && res.data) {
        updateUser({ name: res.data.name, contact: res.data.phone, location: res.data.locality, userCategory: res.data.userCategory });
        saveRoleSession({
          ...(customerSession || currentUser || {}),
          name: res.data.name,
          phone: res.data.phone,
          locality: res.data.locality,
          userCategory: res.data.userCategory,
          role: 'customer'
        });
        setName(res.data.name);
        setToastMessage('✓ Profile successfully updated and saved in MongoDB!');
        setIsEditing(false);
      } else {
        updateUser({ name: name.trim(), contact: phone, location, userCategory });
        saveRoleSession({
          ...(customerSession || currentUser || {}),
          name: name.trim(),
          phone,
          locality: location,
          userCategory,
          role: 'customer'
        });
        setToastMessage('✓ Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      console.warn('Backend update warning, saving locally:', err.message);
      updateUser({ name: name.trim(), contact: phone, location, userCategory });
      saveRoleSession({
        ...(customerSession || currentUser || {}),
        name: name.trim(),
        phone,
        locality: location,
        userCategory,
        role: 'customer'
      });
      setToastMessage('✓ Profile updated successfully!');
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  // Submit Complaint to MongoDB /api/complaints
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintDescription.trim()) {
      setComplaintErrorMsg('Please write the details of your complaint.');
      return;
    }

    setSubmittingComplaint(true);
    setComplaintErrorMsg('');
    setComplaintSuccessMsg('');

    try {
      const payload = {
        complainant: name || 'Customer Member',
        complainantRole: 'Customer',
        complainantPhone: phone || '+91 98401 00000',
        against: complaintAgainst.trim() || 'Assigned Worker',
        category: complaintCategory,
        description: complaintDescription.trim(),
        bookingId: complaintBookingId.trim() || ''
      };

      const res = await complaintsAPI.create(payload);
      if (res.success && res.data) {
        setComplaintSuccessMsg(`✓ Grievance filed successfully (ID: ${res.data.complaintId || 'GRV-NEW'}). It is now visible to the Ward 4 Cooperative Admin for prompt resolution.`);
        setComplaintDescription('');
        setComplaintBookingId('');
        fetchMyComplaints();
      } else {
        setComplaintSuccessMsg('✓ Grievance submitted successfully! The cooperative admin will review your report.');
        setComplaintDescription('');
        fetchMyComplaints();
      }
    } catch (err) {
      console.error('Error submitting grievance:', err);
      setComplaintErrorMsg('Failed to submit grievance. Please verify your connection and try again.');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login?role=customer');
  };

  const handleReset = () => {
    resetUser();
    navigate('/customer/onboarding');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>My Account</h1>
          <p className="text-secondary" style={{ fontSize: '13px' }}>Customer profile, membership preferences & grievance desk</p>
        </div>
        <Button
          variant={isEditing ? 'secondary' : 'outline'}
          size="small"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {toastMessage && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #22C55E',
          color: '#15803D',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger)',
          color: 'var(--color-danger)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. USER PROFILE CARD */}
      <Card padding="md">
        {!isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'var(--color-accent)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold'
            }}>
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0 }}>{name}</h2>
              <div className="text-secondary" style={{ fontSize: '13px' }}>
                {phone}
              </div>
              <div style={{ marginTop: 4, display: 'flex', gap: 6 }}>
                <Badge variant="active">
                  {userCategory === 'institution' ? 'Institution / Society' : 'Household Member'}
                </Badge>
                <Badge variant="success">Verified Member</Badge>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="cust-name">Full Name</label>
              <input
                id="cust-name"
                type="text"
                className="ss-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="cust-phone">Phone Number</label>
              <input
                id="cust-phone"
                type="text"
                className="ss-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="cust-loc">Locality / Ward</label>
              <input
                id="cust-loc"
                type="text"
                className="ss-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              icon={Save}
              disabled={saving}
              style={{ marginTop: 4 }}
            >
              {saving ? 'Saving to Database...' : 'Save Profile Changes'}
            </Button>
          </form>
        )}
      </Card>

      {/* 2. COMPLAINT & GRIEVANCE BOX (DIRECTLY VISIBLE TO ADMIN) */}
      <Card padding="md" style={{ border: '1.5px solid #FDBA74', background: '#FFFDFB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: '#FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EA580C'
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                Cooperative Complaint & Grievance Box
              </h2>
              <div className="text-secondary" style={{ fontSize: '11px' }}>
                Audited & resolved directly by Ward 4 Cooperative Admin officers
              </div>
            </div>
          </div>
          <Badge variant="warning">Admin Monitored</Badge>
        </div>

        <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 var(--space-md)', lineHeight: 1.4 }}>
          If you experienced poor service, delayed arrival, overcharging, or behavioral issues, submit your complaint below. All submissions are logged into the cooperative audit ledger and reviewed by the administrative arbitration desk.
        </p>

        {complaintSuccessMsg && (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #22C55E',
            color: '#15803D',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginBottom: 'var(--space-sm)'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{complaintSuccessMsg}</span>
          </div>
        )}

        {complaintErrorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            color: '#B91C1C',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginBottom: 'var(--space-sm)'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{complaintErrorMsg}</span>
          </div>
        )}

        {/* Complaint Submission Form */}
        <form onSubmit={handleSubmitComplaint} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-sm)' }}>
            
            {/* Category Dropdown */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="complaint-cat" style={{ fontSize: '12px' }}>
                Complaint Category *
              </label>
              <select
                id="complaint-cat"
                className="ss-select"
                value={complaintCategory}
                onChange={(e) => setComplaintCategory(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 10px' }}
              >
                <option value="Service Quality & Incomplete Work">Service Quality & Incomplete Work</option>
                <option value="Worker Conduct & Late Arrival">Worker Conduct & Late Arrival</option>
                <option value="Billing & Fair Price Dispute">Billing & Fair Price Dispute</option>
                <option value="Emergency SOS Dispatch Delay">Emergency SOS Dispatch Delay</option>
                <option value="Safety Gear & Tool Issue">Safety Gear & Tool Issue</option>
                <option value="Other Cooperative Issue">Other Cooperative Issue</option>
              </select>
            </div>

            {/* Concerned Worker / Service */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="complaint-against" style={{ fontSize: '12px' }}>
                Worker / Trade Concerned *
              </label>
              <input
                id="complaint-against"
                type="text"
                className="ss-input"
                placeholder="e.g. Ravi Kumar (Plumber) or General Service"
                value={complaintAgainst}
                onChange={(e) => setComplaintAgainst(e.target.value)}
                required
                style={{ fontSize: '13px', padding: '8px 10px' }}
              />
            </div>

            {/* Optional Booking ID */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="complaint-bkid" style={{ fontSize: '12px' }}>
                Booking Reference ID (Optional)
              </label>
              <input
                id="complaint-bkid"
                type="text"
                className="ss-input"
                placeholder="e.g. BK-1048"
                value={complaintBookingId}
                onChange={(e) => setComplaintBookingId(e.target.value)}
                style={{ fontSize: '13px', padding: '8px 10px' }}
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="ss-form-group" style={{ marginBottom: 0 }}>
            <label className="ss-label" htmlFor="complaint-desc" style={{ fontSize: '12px' }}>
              Detailed Description of the Problem *
            </label>
            <textarea
              id="complaint-desc"
              className="ss-textarea"
              rows={3}
              placeholder="Explain the incident clearly so the cooperative admin officers can investigate with the worker and issue necessary resolutions..."
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              required
              style={{ fontSize: '13px', padding: '8px 10px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span className="text-secondary" style={{ fontSize: '11px' }}>
              🔒 Sent to Admin Grievance Desk in real-time
            </span>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              icon={Send}
              disabled={submittingComplaint}
              style={{ background: '#EA580C', borderColor: '#EA580C' }}
            >
              {submittingComplaint ? 'Submitting to Admin...' : 'Submit Complaint to Admin 🚨'}
            </Button>
          </div>
        </form>

        {/* Previous Filed Complaints Log */}
        <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
              My Filed Complaints ({myComplaints.length})
            </span>
            <button
              type="button"
              onClick={fetchMyComplaints}
              style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
            >
              Refresh Status ↻
            </button>
          </div>

          {loadingComplaints ? (
            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#6B7280' }}>
              <Loader2 size={16} className="spinner" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} />
              Loading complaints...
            </div>
          ) : myComplaints.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#9CA3AF', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
              No grievances filed yet. Your submissions will appear here with live resolution status from the admin.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myComplaints.map((c) => {
                const isResolved = c.status === 'Resolved';
                const isInvestigating = c.status === 'Investigating';

                return (
                  <div
                    key={c.complaintId || c._id}
                    style={{
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                            {c.category}
                          </span>
                          <Badge
                            variant={isResolved ? 'success' : isInvestigating ? 'active' : 'warning'}
                            style={{ fontSize: '10px' }}
                          >
                            {c.status || 'Open'}
                          </Badge>
                        </div>
                        <div className="text-secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                          ID: <strong>{c.complaintId}</strong> • Filed on: {c.date || 'Recently'} • Against: <strong>{c.against}</strong>
                          {c.bookingId && ` • Ref: ${c.bookingId}`}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#374151', margin: '6px 0 0', lineHeight: 1.4 }}>
                      "{c.description}"
                    </p>

                    {/* Admin Resolution Note if resolved */}
                    {c.resolutionNotes && (
                      <div style={{
                        marginTop: 8,
                        padding: '6px 10px',
                        background: '#F0FDF4',
                        borderLeft: '3px solid #22C55E',
                        borderRadius: '0 4px 4px 0',
                        fontSize: '11px',
                        color: '#15803D'
                      }}>
                        <strong>Admin Resolution Note:</strong> {c.resolutionNotes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </Card>

      {/* 3. ADDRESS & SOCIETY WARD INFO */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
          <span className="text-bold" style={{ fontSize: '14px' }}>Registered Location</span>
          <Badge variant="neutral">Ward 4 Node</Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px' }}>
          <MapPin size={16} color="var(--color-accent)" />
          <span>{location}</span>
        </div>

        <div className="text-secondary" style={{ fontSize: '12px', marginTop: 6 }}>
          Cooperative Jurisdiction: Chennai Labour Cooperative Society • Ward 4
        </div>
      </Card>

      {/* 4. ACTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-xs)' }}>
        <Button
          variant="outline"
          icon={RotateCcw}
          fullWidth
          onClick={handleReset}
        >
          Re-test Customer Onboarding Flow
        </Button>
        <Button
          variant="danger"
          icon={LogOut}
          fullWidth
          onClick={handleLogout}
        >
          Sign Out of Account
        </Button>
      </div>

    </div>
  );
};

export default CustomerProfile;
