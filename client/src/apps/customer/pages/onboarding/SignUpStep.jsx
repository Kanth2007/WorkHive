import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, User, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';
import { useCustomer } from '../../context/CustomerContext';

export const SignUpStep = ({ onNext, onBack }) => {
  const { user, updateUser } = useCustomer();

  const [mode, setMode] = useState(user.contactType || 'phone'); // 'phone' | 'email'
  const [name, setName] = useState(user.name || '');
  const [contact, setContact] = useState(user.contact || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  const otpInputs = useRef([]);

  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg(mode === 'phone' ? 'Please enter your mobile number' : 'Please enter your email address');
      return;
    }

    setErrorMsg('');
    updateUser({ name: name.trim(), contact: contact.trim(), contactType: mode });
    setOtpSent(true);
  };

  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto advance focus to next input
    if (digit && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }

    // If all 4 boxes filled, auto advance!
    const fullOtp = newOtp.join('');
    if (fullOtp.length === 4) {
      setTimeout(() => {
        onNext();
      }, 350);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'space-between',
      padding: 'var(--space-lg) var(--space-md)'
    }}>
      <div>
        {/* Back navigation button */}
        <button
          type="button"
          onClick={() => (otpSent ? setOtpSent(false) : onBack())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 'var(--space-md)',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {!otpSent ? (
          <div>
            <h2 style={{ fontSize: '26px', marginBottom: 'var(--space-xs)' }}>
              Create your account
            </h2>
            <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              Enter your details so cooperative workers can reach you.
            </p>

            {/* Name input */}
            <div className="ss-form-group">
              <label className="ss-label" htmlFor="user-name">Your Full Name</label>
              <div className="ss-input-wrapper">
                <span className="ss-input-icon"><User size={20} /></span>
                <input
                  id="user-name"
                  type="text"
                  className="ss-input ss-input-with-icon"
                  placeholder="e.g. Anand Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Contact Type Toggle */}
            <div className="ss-form-group">
              <label className="ss-label">Sign up using</label>
              <div className="ss-toggle-group">
                <button
                  type="button"
                  className={`ss-toggle-btn ${mode === 'phone' ? 'active' : ''}`}
                  onClick={() => { setMode('phone'); setContact(''); }}
                >
                  <Phone size={16} />
                  <span>Mobile Number</span>
                </button>
                <button
                  type="button"
                  className={`ss-toggle-btn ${mode === 'email' ? 'active' : ''}`}
                  onClick={() => { setMode('email'); setContact(''); }}
                >
                  <Mail size={16} />
                  <span>Email Address</span>
                </button>
              </div>
            </div>

            {/* Contact Input */}
            <div className="ss-form-group">
              <label className="ss-label" htmlFor="contact-input">
                {mode === 'phone' ? 'Mobile Number (10 digits)' : 'Email Address'}
              </label>
              <div className="ss-input-wrapper">
                <span className="ss-input-icon">
                  {mode === 'phone' ? <Phone size={20} /> : <Mail size={20} />}
                </span>
                <input
                  id="contact-input"
                  type={mode === 'phone' ? 'tel' : 'email'}
                  className="ss-input ss-input-with-icon"
                  placeholder={mode === 'phone' ? 'e.g. 98220 12345' : 'e.g. anand@gmail.com'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--color-danger)', fontSize: '14px', marginTop: 'var(--space-xs)' }}>
                {errorMsg}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Badge variant="active" style={{ marginBottom: 'var(--space-sm)' }}>
              Step 2: Verification
            </Badge>
            <h2 style={{ fontSize: '26px', marginBottom: 'var(--space-xs)' }}>
              Enter 4-digit code
            </h2>
            <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
              We sent a temporary passcode to <strong style={{ color: 'var(--color-black)' }}>{contact}</strong>.
            </p>

            {/* 4 Box OTP Input */}
            <div className="ss-otp-grid">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`ss-otp-box ${otp[index] ? 'filled' : ''}`}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Reassuring helper notice */}
            <div style={{
              background: '#FFF9F2',
              border: '1px solid rgba(255, 106, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              textAlign: 'center',
              margin: 'var(--space-lg) 0'
            }}>
              <div style={{ fontWeight: 'bold', color: 'var(--color-accent)', fontSize: '14px' }}>
                Prototype Hackathon Mode
              </div>
              <p className="text-secondary" style={{ fontSize: '13px', marginTop: 2 }}>
                Type any 4 digits (e.g. <strong>1 2 3 4</strong>) to instantly auto-advance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer action */}
      <div style={{ marginTop: 'var(--space-xl)' }}>
        {!otpSent ? (
          <Button
            variant="primary"
            size="large"
            icon={KeyRound}
            fullWidth
            onClick={handleSendOtp}
          >
            Send Verification Code
          </Button>
        ) : (
          <Button
            variant="primary"
            size="large"
            icon={CheckCircle2}
            fullWidth
            disabled={otp.join('').length < 4}
            onClick={onNext}
          >
            Verify & Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignUpStep;
