import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  HardHat,
  Building2,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Scale,
  Zap,
  Check,
  Home,
  ArrowLeft
} from 'lucide-react';
import { Button, Card, Badge } from '../components';
import { useAuth } from '../context/AuthContext';

export const AuthPortal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, verifyOtp, isLoading, authError } = useAuth();

  // Selected role tab: 'customer' | 'worker' | 'admin'
  const initialRole = searchParams.get('role') || 'customer';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  // Auth Mode: 'password' | 'otp'
  const [authMode, setAuthMode] = useState('password');

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Handle role switch
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLocalError('');
    setOtpSent(false);
    setIdentifier('');
    setPassword('');
  };

  const redirectUrl = searchParams.get('redirect');
  const isSessionExpired = searchParams.get('expired') === 'true';

    const navigateAfterAuth = (targetRole) => {
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else {
        if (targetRole === 'admin') navigate('/admin/dashboard');
        else if (targetRole === 'worker') navigate('/worker/dashboard');
        else navigate('/customer/home');
      }
    };

    const handleQuickDemoLogin = (role) => {
      const demoAccounts = {
        customer: { identifier: 'customer', password: 'password123', role: 'customer' },
        worker: { identifier: 'worker', password: 'password123', role: 'worker' },
        admin: { identifier: 'admin', password: 'password123', role: 'admin' }
      };
      const payload = demoAccounts[role] || demoAccounts.customer;
      performLogin(payload, role);
    };

    const performLogin = async (payload, targetRole) => {
      setLocalError('');
      const result = await login(payload);
      if (result.success) {
        setSuccessToast(`Signed in as ${result.user.name} (${targetRole.toUpperCase()}) • 7-day session active`);
        setTimeout(() => {
          navigateAfterAuth(targetRole);
        }, 600);
      } else {
        setLocalError(result.error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLocalError('');

      if (!identifier.trim()) {
        setLocalError('Please enter your phone number or email.');
        return;
      }

      if (authMode === 'password') {
        if (!password.trim()) {
          setLocalError('Please enter your password.');
          return;
        }
        await performLogin({ identifier, password, role: selectedRole }, selectedRole);
      } else {
        // OTP mode
        if (!otpSent) {
          setOtpSent(true);
          setOtp('8821'); // Pre-fill instant demo OTP for testing ease
          setSuccessToast(`OTP sent to ${identifier}. Use code: 8821`);
        } else {
          if (!otp.trim()) {
            setLocalError('Please enter the 4-digit OTP.');
            return;
          }
          const res = await verifyOtp({ phone: identifier, otp, role: selectedRole });
          if (res.success) {
            setSuccessToast(`Verified! Welcome ${res.user.name} • 7-day session active`);
            setTimeout(() => {
              navigateAfterAuth(selectedRole);
            }, 600);
          } else {
            setLocalError(res.error);
          }
        }
      }
    };

    const roles = [
      { id: 'customer', label: 'Customer', icon: User, tagline: 'Book Verified Helpers', color: 'var(--color-accent)' },
      { id: 'worker', label: 'Worker Member', icon: HardHat, tagline: 'Direct UPI Earnings', color: '#16A34A' },
      { id: 'admin', label: 'Cooperative Officer', icon: Building2, tagline: 'Ward 4 Operations', color: '#0284C7' }
    ];

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
      
      {/* 1. TOP BAR WITH HOMEPAGE BUTTON */}
      <div style={{ width: '100%', maxWidth: '520px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
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

        <Badge variant="active" style={{ fontSize: '11px' }}>
          Cooperative SSO Portal
        </Badge>
      </div>

      <div style={{ width: '100%', maxWidth: '520px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-black)',
              color: 'var(--color-white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
            }}>
              WH
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-black)', display: 'block', lineHeight: 1.1 }}>
                WorkHive
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                Direct Labour Cooperative
              </span>
            </div>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 'var(--space-sm) 0 4px', letterSpacing: '-0.01em' }}>
            Account Sign In
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Choose your role to access your live MongoDB dashboard
          </p>
        </div>

        {/* 2. INTERACTIVE 3-ROLE SELECTOR CARDS */}
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

        {/* 3. LOGIN MAIN CARD */}
        <Card padding="lg" style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.06)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          
          {/* 7-Day Session Expired Alert */}
          {isSessionExpired && (
            <div style={{
              background: '#FEF3C7',
              border: '1px solid #F59E0B',
              color: '#92400E',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 'var(--space-md)'
            }}>
              <AlertCircle size={18} color="#D97706" style={{ flexShrink: 0 }} />
              <span>Your 7-day session has expired. Please sign in again to renew your access.</span>
            </div>
          )}

          {/* Quick Demo Fill Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1.5px solid #FED7AA',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--color-accent)" />
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#9A3412' }}>
                1-Click Fast Login:
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              style={{
                background: 'var(--color-black)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              Sign In as {selectedRole.toUpperCase()} →
            </button>
          </div>

          {/* Success / Error Alerts */}
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
              
              {/* If not registered, provide 1-click register CTA button */}
              {((localError || authError || '').toLowerCase().includes('register') ||
                (localError || authError || '').toLowerCase().includes('not exist') ||
                (localError || authError || '').toLowerCase().includes('does not exist')) && (
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-start' }}>
                  <Link
                    to={`/register?role=${selectedRole}&phone=${encodeURIComponent(identifier)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'var(--color-danger)',
                      color: 'white',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(217,48,37,0.2)'
                    }}
                  >
                    📝 Register New {selectedRole.toUpperCase()} Account Now →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Auth Mode Tabs (Password vs SMS OTP) */}
          {selectedRole !== 'admin' && (
            <div style={{ display: 'flex', background: 'var(--color-bg)', padding: 3, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
              <button
                type="button"
                onClick={() => { setAuthMode('password'); setOtpSent(false); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: authMode === 'password' ? 'var(--color-white)' : 'transparent',
                  color: authMode === 'password' ? 'var(--color-black)' : 'var(--color-text-secondary)',
                  boxShadow: authMode === 'password' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp'); setOtpSent(false); }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: authMode === 'otp' ? 'var(--color-white)' : 'transparent',
                  color: authMode === 'otp' ? 'var(--color-black)' : 'var(--color-text-secondary)',
                  boxShadow: authMode === 'otp' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Mobile SMS OTP
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            
            {/* Identifier Input */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="auth-identifier">
                {selectedRole === 'admin' ? 'Official Cooperative Officer Email' : 'Mobile Number / Registered Email'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="auth-identifier"
                  type={selectedRole === 'admin' ? 'email' : 'text'}
                  className="ss-input"
                  style={{ paddingLeft: '40px' }}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@chennailabour.coop' : '+91 98401 23456'}
                  required
                />
                {selectedRole === 'admin' ? (
                  <Mail size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
                ) : (
                  <Phone size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
                )}
              </div>
            </div>

            {/* Password or OTP Input */}
            {authMode === 'password' ? (
              <div className="ss-form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="ss-label" htmlFor="auth-password" style={{ margin: 0 }}>Account Password</label>
                  <span className="text-secondary" style={{ fontSize: '11px' }}>PIN or Password</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    className="ss-input"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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
            ) : (
              otpSent && (
                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="auth-otp">Enter 4-Digit OTP Code (Demo: 8821)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="auth-otp"
                      type="text"
                      maxLength={6}
                      className="ss-input"
                      style={{ paddingLeft: '40px', letterSpacing: '4px', fontWeight: 'bold', fontSize: '20px' }}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="8821"
                      required
                    />
                    <KeyRound size={18} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 14, top: 15 }} />
                  </div>
                </div>
              )
            )}

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
              {isLoading
                ? 'Authenticating...'
                : authMode === 'otp' && !otpSent
                ? 'Send Verification OTP'
                : `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </Button>
          </form>

          {/* Registration Footer Link */}
          <div style={{
            textAlign: 'center',
            marginTop: 'var(--space-lg)',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--color-border)'
          }}>
            <p className="text-secondary" style={{ fontSize: '13px', margin: '0 0 6px' }}>
              New to Chennai Labour Cooperative?
            </p>
            <Link
              to={`/register?role=${selectedRole}`}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                textDecoration: 'none'
              }}
            >
              Create New {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account →
            </Link>
          </div>

        </Card>

        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-md)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={14} color="#16A34A" />
            <span>Govt. Registered #TN-CHE</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Scale size={14} color="var(--color-accent)" />
            <span>0% Middleman Margin</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPortal;
