import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Phone, Mail, RotateCcw, ShieldCheck, HeartHandshake, LogOut, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useCustomer } from '../context/CustomerContext';
import { useAuth } from '../../../context/AuthContext';
import { authAPI } from '../../../services/api';

export const CustomerProfile = () => {
  const { user, updateUser, resetUser } = useCustomer();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || user.name || 'Priya Sundaram');
  const [phone, setPhone] = useState(currentUser?.phone || user.contact || '+91 98401 23456');
  const [location, setLocation] = useState(currentUser?.locality || user.location || 'Adyar, Chennai');
  const [userCategory, setUserCategory] = useState(currentUser?.userCategory || user.userCategory || 'household');
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setLocation(currentUser.locality || 'Adyar, Chennai');
      setUserCategory(currentUser.userCategory || 'household');
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setToastMessage('');

    try {
      const res = await authAPI.updateProfile({
        userId: currentUser?.userId,
        phone,
        name,
        locality: location,
        userCategory
      });

      if (res.success) {
        updateUser({ name, contact: phone, location, userCategory });
        setToastMessage('✓ Profile successfully updated and saved in MongoDB!');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating customer profile:', err);
      setErrorMessage('Failed to save profile to database.');
    } finally {
      setSaving(false);
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
          <p className="text-secondary" style={{ fontSize: '13px' }}>Customer profile and membership preferences</p>
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

      {/* User Card */}
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

      {/* Address & Society Ward Info */}
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

      {/* Actions */}
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
