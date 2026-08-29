import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useAuth } from '../../../context/AuthContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, authError } = useAuth();

  const redirectUrl = searchParams.get('redirect');
  const isSessionExpired = searchParams.get('expired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setLocalError('Please enter a valid official cooperative email address.');
      return;
    }

    if (!password.trim() || password.length < 4) {
      setLocalError('Please enter your administrator password.');
      return;
    }

    const res = await login({ identifier: email, password, role: 'admin' });
    if (res.success) {
      setSuccessToast(`Welcome back, ${res.user.name}! (7-day admin session active)`);
      setTimeout(() => {
        if (redirectUrl) {
          navigate(decodeURIComponent(redirectUrl));
        } else {
          navigate('/admin/dashboard');
        }
      }, 600);
    } else {
      setLocalError(res.error);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@chennailabour.coop');
    setPassword('cooperative2026');
    setLocalError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 'var(--space-md)'
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-black)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-xs)'
          }}>
            <Building2 size={30} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 2px' }}>
            Sahakari Seva Admin
          </h1>
          <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
            Chennai Labour Cooperative Society • Ward Operations Portal
          </p>
        </div>

        <Card padding="lg" style={{ boxShadow: 'var(--shadow-md)' }}>
          
          {/* Quick Demo Fill Bar */}
          <div style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--color-accent)" />
              <span style={{ fontSize: '12px', fontWeight: 600 }}>Demo Admin Credentials:</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              style={{
                background: 'var(--color-black)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Fill Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Cooperative Officer Sign In
              </h2>
              <Badge variant="active" style={{ fontSize: '11px' }}>
                Ward 4 Node
              </Badge>
            </div>

            {isSessionExpired && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                color: '#92400E',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0 }} />
                <span>Your 7-day administrator session has expired. Please sign in again.</span>
              </div>
            )}

            {successToast && (
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
                <span>{successToast}</span>
              </div>
            )}

            {(localError || authError) && (
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
                <span>{localError || authError}</span>
              </div>
            )}

            {/* Email Field with Validation */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="admin-email">Official Cooperative Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  className="ss-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chennailabour.coop"
                  required
                />
                <Mail size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 14 }} />
              </div>
            </div>

            {/* Password Field */}
            <div className="ss-form-group" style={{ marginBottom: 0 }}>
              <label className="ss-label" htmlFor="admin-password">Administrator Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="ss-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <Lock size={16} color="var(--color-text-secondary)" style={{ position: 'absolute', left: 12, top: 14 }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 14, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} color="var(--color-text-secondary)" /> : <Eye size={16} color="var(--color-text-secondary)" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              icon={ArrowRight}
              iconPosition="right"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating in MongoDB...' : 'Log In to Dashboard'}
            </Button>

            {/* Register New Admin Node Link */}
            <div style={{
              textAlign: 'center',
              paddingTop: 'var(--space-sm)',
              borderTop: '1px solid var(--color-border)'
            }}>
              <span className="text-secondary" style={{ fontSize: '12px' }}>New Ward Coordinator? </span>
              <Link to="/register?role=admin" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)' }}>
                Register New Node Coordinator →
              </Link>
            </div>

          </form>
        </Card>

        {/* Multi-role Switcher Link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
          <Link to="/login?role=customer" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            👤 Customer Sign In
          </Link>
          <span style={{ color: 'var(--color-border)' }}>•</span>
          <Link to="/login?role=worker" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            👷 Worker Sign In
          </Link>
          <span style={{ color: 'var(--color-border)' }}>•</span>
          <Link to="/" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Prototype Hub
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
