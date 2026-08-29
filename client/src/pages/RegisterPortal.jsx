import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  HardHat,
  Building2,
  Lock,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck2,
  Eye,
  EyeOff,
  Scale,
  Check,
  Award,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Button, Card, Badge } from '../components';
import { useAuth } from '../context/AuthContext';

export const RegisterPortal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isLoading, authError } = useAuth();

  const initialRole = searchParams.get('role') || 'customer';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Common Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locality, setLocality] = useState('Ward 4, Adyar, Chennai');
  const [showPassword, setShowPassword] = useState(false);

  // Role-Specific Fields
  // Customer:
  const [userCategory, setUserCategory] = useState('household'); // 'household' | 'institution'

  // Worker:
  const [skill, setSkill] = useState('Electrician');
  const [experience, setExperience] = useState('3 years');

  // Admin / Officer:
  const [societyId, setSocietyId] = useState('TN-CHE-2024-88402');
  const [designation, setDesignation] = useState('Ward Operations Officer');

  const [localError, setLocalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setLocalError('Please enter a valid phone number.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setLocalError('Password must be at least 4 characters.');
      return;
    }

    const payload = {
      name,
      phone,
      email: email.trim() ? email.trim() : `${phone.replace(/\D/g, '')}@workhive.local`,
      password,
      role: selectedRole,
      locality,
      userCategory,
      skill: selectedRole === 'worker' ? skill : '',
      experience: selectedRole === 'worker' ? experience : '',
      societyId: selectedRole === 'admin' ? societyId : 'TN-CHE-2024-88402'
    };

    const res = await register(payload);
    if (res.success) {
      setSuccessToast(`Account created successfully as ${selectedRole.toUpperCase()}!`);
      setTimeout(() => {
        if (selectedRole === 'admin') navigate('/admin/dashboard');
        else if (selectedRole === 'worker') navigate('/worker/verification');
        else navigate('/customer/home');
      }, 700);
    } else {
      setLocalError(res.error);
    }
  };

  const roles = [
    { id: 'customer', label: 'Customer', icon: User, tagline: 'Book Verified Helpers' },
    { id: 'worker', label: 'Worker Member', icon: HardHat, tagline: 'Direct UPI Earnings' },
    { id: 'admin', label: 'Cooperative Officer', icon: Building2, tagline: 'Ward 4 Operations' }
  ];

  const rolePerks = {
    customer: ['Standardized fair rates', 'Verified trade certified workers', '12-min Emergency SOS', 'Direct UPI invoicing'],
    worker: ['95% direct take-home pay', '₹5 Lakhs health insurance', 'Cooperative Welfare Fund', '1-Worker 1-Vote democratic rights'],
    admin: ['Ward 4 node administration', 'Fleet map dispatching', 'Grievance arbitration desk', 'Statutory audited ledger']
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, rgba(255, 106, 0, 0.09) 0%, #F5F5F5 65%)',
      padding: 'var(--space-md)'
    }}>
      
      {/* 1. TOP NAVBAR / BACK TO HOMEPAGE */}
      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-black)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            textDecoration: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={16} color="var(--color-accent)" />
          <span>Homepage</span>
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: '560px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 52,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img src="/logo.png" alt="WorkHive Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--color-black)', display: 'block', lineHeight: 1.1 }}>
                WorkHive
              </span>
            </div>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 'var(--space-sm) 0 4px', letterSpacing: '-0.01em' }}>
            Create New Account
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Join Chennai Labour Society for direct, fair services
          </p>
        </div>

        {/* 2. ROLE SELECTOR TABS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginBottom: 'var(--space-md)'
        }}>
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isSelected ? 'var(--color-white)' : '#FAFAFA',
                  color: isSelected ? 'var(--color-black)' : 'var(--color-text-secondary)',
                  boxShadow: isSelected ? '0 4px 14px rgba(255, 106, 0, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isSelected ? 'rgba(255, 106, 0, 0.12)' : 'var(--color-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                }}>
                  <Icon size={18} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: isSelected ? 800 : 600 }}>
                  {r.label}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.8, textAlign: 'center', lineHeight: 1.1 }}>
                  {r.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. REGISTRATION MAIN CARD */}
        <Card padding="lg" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          
          {/* Dynamic Role Perks Banner */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 'var(--space-md)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              Included {selectedRole.toUpperCase()} Cooperative Benefits:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
              {rolePerks[selectedRole].map((perk, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontWeight: 600, color: 'var(--color-black)' }}>
                  <Check size={12} color="#16A34A" strokeWidth={2.5} />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {successToast && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #22C55E',
              color: '#15803D',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 'var(--space-md)'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successToast}</span>
            </div>
          )}

          {(localError || authError) && (
            <div style={{
              background: 'var(--color-danger-bg)',
              border: '1.5px solid var(--color-danger)',
              color: 'var(--color-danger)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: 'var(--space-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{localError || authError}</span>
              </div>

              {/* If account already exists, provide 1-click Sign In CTA */}
              {((localError || authError || '').toLowerCase().includes('already exists') ||
                (localError || authError || '').toLowerCase().includes('sign in')) && (
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-start' }}>
                  <Link
                    to={`/login?role=${selectedRole}&identifier=${encodeURIComponent(phone)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'var(--color-black)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    🔑 Sign In with Existing {selectedRole.toUpperCase()} Account →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            
            {/* Full Name */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-name"
                  type="text"
                  className="ss-input"
                  style={{ paddingLeft: '40px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={selectedRole === 'worker' ? 'e.g. Ramesh Patil' : 'e.g. Priya Sundaram'}
                  required
                />
                <User size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
              </div>
            </div>

            {/* Mobile Number & Email Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
              <div className="ss-form-group" style={{ marginBottom: 0 }}>
                <label className="ss-label" htmlFor="reg-phone">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="ss-input"
                    style={{ paddingLeft: '34px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401..."
                    required
                  />
                  <Phone size={14} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 10, top: 15 }} />
                </div>
              </div>

              <div className="ss-form-group" style={{ marginBottom: 0 }}>
                <label className="ss-label" htmlFor="reg-email">Email (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-email"
                    type="email"
                    className="ss-input"
                    style={{ paddingLeft: '34px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                  />
                  <Mail size={14} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 10, top: 15 }} />
                </div>
              </div>
            </div>

            {/* Role-Specific Inputs */}
            {selectedRole === 'customer' && (
              <div className="ss-form-group" style={{ marginBottom: 0 }}>
                <label className="ss-label">Account Membership Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)' }}>
                  <button
                    type="button"
                    onClick={() => setUserCategory('household')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${userCategory === 'household' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: userCategory === 'household' ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏡 Household Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserCategory('institution')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${userCategory === 'institution' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      background: userCategory === 'institution' ? 'var(--color-accent-subtle)' : 'var(--color-white)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏢 Office / Society
                  </button>
                </div>
              </div>
            )}

            {selectedRole === 'worker' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 'var(--space-sm)' }}>
                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="reg-skill">Primary Trade Skill</label>
                  <select
                    id="reg-skill"
                    className="ss-input"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                  >
                    <option value="Electrician">Electrician & Wiring</option>
                    <option value="Plumber">Plumbing & Water Systems</option>
                    <option value="Carpenter">Carpentry & Woodwork</option>
                    <option value="Painter">Painting & Wall Decor</option>
                    <option value="Cleaner">Deep Home Cleaning</option>
                    <option value="Caregiver">Elderly & Patient Care</option>
                    <option value="Technician">Appliance Technician</option>
                    <option value="Driver">Professional Driver</option>
                  </select>
                </div>

                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="reg-exp">Experience</label>
                  <input
                    id="reg-exp"
                    type="text"
                    className="ss-input"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5 yrs"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="reg-society">Society Node Code</label>
                  <input
                    id="reg-society"
                    type="text"
                    className="ss-input"
                    value={societyId}
                    onChange={(e) => setSocietyId(e.target.value)}
                    placeholder="TN-CHE-2024-88402"
                    required
                  />
                </div>
                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="reg-desig">Designation</label>
                  <input
                    id="reg-desig"
                    type="text"
                    className="ss-input"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Ward Ops Officer"
                  />
                </div>
              </div>
            )}

            {/* Locality */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="reg-locality">Ward / Locality in Chennai</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-locality"
                  type="text"
                  className="ss-input"
                  style={{ paddingLeft: '40px' }}
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="Ward 4, Adyar, Chennai"
                  required
                />
                <MapPin size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
              </div>
            </div>

            {/* Password */}
            <div className="ss-form-group" style={{ marginBottom: 'var(--space-xs)' }}>
              <label className="ss-label" htmlFor="reg-password">Create Account Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ss-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 4 characters"
                  required
                />
                <Lock size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: 15, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} color="var(--color-text-secondary)" /> : <Eye size={18} color="var(--color-text-secondary)" />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              icon={ArrowRight}
              iconPosition="right"
              fullWidth
              disabled={isLoading}
              style={{ marginTop: 'var(--space-xs)' }}
            >
              {isLoading ? 'Creating Account in MongoDB...' : `Complete ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Registration`}
            </Button>
          </form>

          {/* Sign In Footer Link */}
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--space-md)',
            paddingTop: 'var(--space-sm)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 6px' }}>
              Already registered with WorkHive?
            </p>
            <Link
              to={`/login?role=${selectedRole}`}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-black)',
                textDecoration: 'underline'
              }}
            >
              ← Sign In to Existing Account
            </Link>
          </div>

        </Card>

        {/* Trust Note */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            🔒 Governed under Tamil Nadu Cooperative Societies Act • 0% Middleman Margin
          </span>
        </div>

      </div>
    </div>
  );
};

export default RegisterPortal;
