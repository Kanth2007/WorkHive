import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  KeyRound,
  User,
  MapPin,
  Globe,
  Wrench,
  FileCheck2,
  Upload,
  CreditCard,
  QrCode,
  Banknote,
  HeartHandshake,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Trash2,
  Sparkles,
  Zap,
  Building2
} from 'lucide-react';
import { Button, Card, Badge } from '../../../../components';
import { useWorker } from '../../context/WorkerContext';

export const WorkerRegistrationFlow = () => {
  const navigate = useNavigate();
  const { worker, updateWorker, completeRegistration } = useWorker();

  // Step 1 to 7
  const [step, setStep] = useState(1);

  // STEP 1: LOGIN STATE
  const [phone, setPhone] = useState(worker.phone || '9822011223');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputsRef = useRef([]);

  // STEP 2: PERSONAL DETAILS
  const [name, setName] = useState(worker.name || 'Ramesh Patil');
  const [address, setAddress] = useState(worker.address || 'Flat 12, Ward 4, Kasturba Nagar, Adyar, Chennai');
  const [serviceRadius, setServiceRadius] = useState(worker.serviceRadius || '5 km');
  const [languages, setLanguages] = useState(worker.languages || ['Tamil', 'English']);

  // STEP 3: SKILLS & EXPERIENCE
  const [skills, setSkills] = useState(worker.skills || ['Electrical']);
  const [experience, setExperience] = useState(worker.experience || '7');

  // STEP 4: DOCUMENTS
  const [idUploaded, setIdUploaded] = useState(true);
  const [certUploaded, setCertUploaded] = useState(true);

  // STEP 5: PAYOUT DETAILS
  const [payoutType, setPayoutType] = useState(worker.payoutType || 'upi');
  const [upiId, setUpiId] = useState(worker.upiId || 'ramesh.patil@okhdfcbank');
  const [accountNumber, setAccountNumber] = useState(worker.bankDetails?.accountNumber || '918273645521');
  const [ifsc, setIfsc] = useState(worker.bankDetails?.ifsc || 'HDFC0001824');
  const [bankName, setBankName] = useState(worker.bankDetails?.bankName || 'HDFC Bank Adyar');

  // STEP 6: NOMINEE DETAILS
  const [nomineeName, setNomineeName] = useState(worker.nominee?.name || 'Sunita Patil');
  const [nomineeRelation, setNomineeRelation] = useState(worker.nominee?.relation || 'Spouse');
  const [nomineePayout, setNomineePayout] = useState(worker.nominee?.payout || 'sunita.patil@okaxis');

  // Available Data Arrays
  const languageOptions = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Marathi'];
  const radiusOptions = [
    { id: '2 km', label: '2 km (Local Ward)' },
    { id: '5 km', label: '5 km (Recommended)' },
    { id: '10 km', label: '10 km (Extended)' },
    { id: '15 km', label: '15 km (Whole City)' }
  ];

  const skillOptions = [
    { id: 'Electrical', label: '⚡ Electrical' },
    { id: 'Plumbing', label: '🔧 Plumbing' },
    { id: 'Carpentry', label: '🪚 Carpentry' },
    { id: 'Painting', label: '🎨 Painting' },
    { id: 'Cleaning', label: '🧹 Cleaning' },
    { id: 'Caregiving', label: '👩‍⚕️ Caregiving' },
    { id: 'Driving', label: '🚗 Driving' },
    { id: 'Gardening', label: '🌱 Gardening' },
    { id: 'Domestic Help', label: '🏠 Domestic Help' },
    { id: 'Technician', label: '🔧 Technician' }
  ];

  const relationshipOptions = ['Spouse', 'Parent', 'Child', 'Sibling'];

  // OTP Box handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-forward
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto advance when 4 digits filled
    if (index === 3 && value) {
      setTimeout(() => {
        setStep(2);
      }, 300);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const toggleLanguage = (lang) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleNext = () => {
    if (step < 7) {
      if (step === 6) {
        // Finalize registration state in context
        completeRegistration({
          phone,
          name,
          address,
          serviceRadius,
          languages,
          skills,
          experience: `${experience} years`,
          idDocument: 'aadhaar_card_front_back.pdf',
          certDocument: 'iti_electrical_trade_cert.pdf',
          payoutType,
          upiId,
          bankDetails: { accountNumber, ifsc, bankName },
          nominee: {
            name: nomineeName,
            relation: nomineeRelation,
            payout: nomineePayout
          }
        });
      }
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate('/styleguide');
    }
  };

  return (
    <div className="mobile-device-frame" style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP WIZARD PROGRESS BAR (STEP 1 OF 7) */}
      <div style={{
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-md) var(--space-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={handleBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              cursor: 'pointer'
            }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-black)' }}>
              Step {step} of 7
            </span>
            <div className="text-secondary" style={{ fontSize: '11px' }}>
              {step === 1 && 'Worker Login & OTP'}
              {step === 2 && 'Personal Details'}
              {step === 3 && 'Skills & Experience'}
              {step === 4 && 'Identity & Certifications'}
              {step === 5 && 'Payout Bank / UPI'}
              {step === 6 && 'Insurance Nominee'}
              {step === 7 && 'Application Submitted'}
            </div>
          </div>

          <Badge variant="active" style={{ fontSize: '11px' }}>
            Coop Partner
          </Badge>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: 5,
          background: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'var(--color-accent)',
            width: `${(step / 7) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* 2. STEP CONTENT AREA */}
      <main style={{ flex: 1, padding: 'var(--space-lg)', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <div>
          {/* STEP 1: WORKER LOGIN (PHONE + OTP) */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Worker Partner Login</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Enter your mobile number to sign in or register with your local cooperative.
                </p>
              </div>

              <Card padding="md">
                <div className="ss-form-group">
                  <label className="ss-label" htmlFor="worker-phone">Mobile Number</label>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <div style={{
                      padding: '12px var(--space-md)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 'bold',
                      fontSize: '15px'
                    }}>
                      +91
                    </div>
                    <input
                      id="worker-phone"
                      type="tel"
                      className="ss-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10 digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <Button
                    variant="primary"
                    fullWidth
                    icon={Phone}
                    onClick={() => {
                      setOtpSent(true);
                      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
                    }}
                  >
                    Send OTP SMS
                  </Button>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="ss-label" style={{ margin: 0 }}>Enter 4-Digit OTP</label>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                        ✓ OTP Sent to +91 {phone}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', margin: 'var(--space-sm) 0' }}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          style={{
                            width: 52,
                            height: 56,
                            textAlign: 'center',
                            fontSize: '22px',
                            fontWeight: 'bold',
                            borderRadius: 'var(--radius-sm)',
                            border: `2px solid ${digit ? 'var(--color-accent)' : 'var(--color-border)'}`,
                            background: 'var(--color-white)',
                            outline: 'none'
                          }}
                        />
                      ))}
                    </div>

                    <p className="text-secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                      Simulated OTP: Enter any 4 numbers (e.g. 1 2 3 4) to advance.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Personal Details</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Tell us your name, neighborhood, and spoken languages.
                </p>
              </div>

              <Card padding="md">
                <div className="ss-form-group">
                  <label className="ss-label" htmlFor="worker-name">Full Name</label>
                  <input
                    id="worker-name"
                    type="text"
                    className="ss-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                  />
                </div>

                <div className="ss-form-group">
                  <label className="ss-label" htmlFor="worker-addr">Residential Address</label>
                  <textarea
                    id="worker-addr"
                    className="ss-input"
                    style={{ minHeight: '75px', padding: '10px', resize: 'vertical' }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat/House no, street, ward, city"
                  />
                </div>

                <div className="ss-form-group">
                  <label className="ss-label">Service Working Radius</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
                    {radiusOptions.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setServiceRadius(r.id)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: serviceRadius === r.id ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                          border: `1.5px solid ${serviceRadius === r.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: serviceRadius === r.id ? 'var(--color-accent)' : 'var(--color-black)',
                          cursor: 'pointer'
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 0 }}>
                  <label className="ss-label" style={{ display: 'block', marginBottom: '6px' }}>
                    Languages Spoken (Multi-select)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {languageOptions.map((lang) => {
                      const isSelected = languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: isSelected ? 'var(--color-black)' : 'var(--color-bg)',
                            color: isSelected ? 'white' : 'var(--color-black)',
                            border: '1px solid var(--color-border)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? `✓ ${lang}` : `+ ${lang}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 3: SKILLS & EXPERIENCE */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Skills & Experience</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Select the trade categories you are qualified to work in.
                </p>
              </div>

              <Card padding="md">
                <label className="ss-label" style={{ display: 'block', marginBottom: '8px' }}>
                  Select Primary & Secondary Skills
                </label>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-md)'
                }}>
                  {skillOptions.map((sk) => {
                    const isSelected = skills.includes(sk.id);
                    return (
                      <button
                        key={sk.id}
                        type="button"
                        onClick={() => toggleSkill(sk.id)}
                        style={{
                          padding: '12px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                          border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: isSelected ? 'var(--color-accent)' : 'var(--color-black)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {sk.label}
                      </button>
                    );
                  })}
                </div>

                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="worker-exp">Years of Experience in this Trade</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <input
                      id="worker-exp"
                      type="number"
                      className="ss-input"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      min={1}
                      max={40}
                      style={{ width: '100px', fontSize: '18px', fontWeight: 'bold' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Years of Professional Work</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* STEP 4: DOCUMENTS (ID & CERTIFICATIONS) */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Verification Documents</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Upload government ID and trade certification for cooperative background verification.
                </p>
              </div>

              {/* ID Proof Card */}
              <Card padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>1. Government ID Proof</h3>
                    <p className="text-secondary" style={{ fontSize: '12px' }}>Aadhaar Card, Voter ID, or Driving License</p>
                  </div>
                  {idUploaded && <Badge variant="success">Attached</Badge>}
                </div>

                <div style={{
                  border: '1.5px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  background: idUploaded ? 'var(--color-success-bg)' : 'var(--color-bg)'
                }}>
                  {idUploaded ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 600, fontSize: '13px' }}>
                        <FileCheck2 size={18} />
                        <span>aadhaar_card_front_back.pdf</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIdUploaded(false)}
                        style={{ color: 'var(--color-danger)', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="small"
                      icon={Upload}
                      onClick={() => setIdUploaded(true)}
                    >
                      + Upload Aadhaar / Voter ID
                    </Button>
                  )}
                </div>
              </Card>

              {/* Trade Certificate Card */}
              <Card padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>2. Trade Certification / ITI</h3>
                    <p className="text-secondary" style={{ fontSize: '12px' }}>Govt. ITI Certificate, Trade Diploma, or Society Safety Clearance</p>
                  </div>
                  {certUploaded && <Badge variant="success">Attached</Badge>}
                </div>

                <div style={{
                  border: '1.5px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  background: certUploaded ? 'var(--color-success-bg)' : 'var(--color-bg)'
                }}>
                  {certUploaded ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontWeight: 600, fontSize: '13px' }}>
                        <FileCheck2 size={18} />
                        <span>iti_electrical_trade_cert.pdf</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCertUploaded(false)}
                        style={{ color: 'var(--color-danger)', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="small"
                      icon={Upload}
                      onClick={() => setCertUploaded(true)}
                    >
                      + Upload Skill Certificate
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* STEP 5: PAYOUT DETAILS */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Payout Information</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Where should your daily 100% earnings and cooperative incentives be disbursed?
                </p>
              </div>

              <Card padding="md">
                {/* Payout Toggle */}
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                  <button
                    type="button"
                    onClick={() => setPayoutType('upi')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: payoutType === 'upi' ? 'var(--color-black)' : 'var(--color-bg)',
                      color: payoutType === 'upi' ? 'white' : 'var(--color-black)',
                      fontWeight: 'bold',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    UPI ID (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutType('bank')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: payoutType === 'bank' ? 'var(--color-black)' : 'var(--color-bg)',
                      color: payoutType === 'bank' ? 'white' : 'var(--color-black)',
                      fontWeight: 'bold',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  >
                    Bank Account
                  </button>
                </div>

                {payoutType === 'upi' ? (
                  <div className="ss-form-group" style={{ marginBottom: 0 }}>
                    <label className="ss-label" htmlFor="worker-upi">Enter Personal UPI ID (VPA)</label>
                    <input
                      id="worker-upi"
                      type="text"
                      className="ss-input"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or name@okhdfcbank"
                    />
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                      ✓ Payouts are transferred immediately after job completion.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div className="ss-form-group" style={{ marginBottom: 0 }}>
                      <label className="ss-label" htmlFor="bank-acc">Bank Account Number</label>
                      <input
                        id="bank-acc"
                        type="text"
                        className="ss-input"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="e.g. 918273645521"
                      />
                    </div>
                    <div className="ss-form-group" style={{ marginBottom: 0 }}>
                      <label className="ss-label" htmlFor="bank-ifsc">IFSC Code</label>
                      <input
                        id="bank-ifsc"
                        type="text"
                        className="ss-input"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0001824"
                      />
                    </div>
                    <div className="ss-form-group" style={{ marginBottom: 0 }}>
                      <label className="ss-label" htmlFor="bank-name">Bank & Branch Name</label>
                      <input
                        id="bank-name"
                        type="text"
                        className="ss-input"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank Adyar Branch"
                      />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* STEP 6: INSURANCE NOMINEE DETAILS */}
          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Insurance Nominee</h1>
                <p className="text-secondary" style={{ fontSize: '14px' }}>
                  Cooperative member accident & healthcare insurance scheme details.
                </p>
              </div>

              {/* Plain Language Reassurance Card */}
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #22C55E',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                display: 'flex',
                gap: 'var(--space-sm)',
                alignItems: 'flex-start'
              }}>
                <ShieldCheck size={22} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#15803D' }}>
                    ₹5,00,000 Cooperative On-Duty Insurance
                  </div>
                  <p style={{ fontSize: '13px', color: '#333333', margin: '2px 0 0' }}>
                    This person receives your insurance and medical welfare benefit if something happens to you on duty.
                  </p>
                </div>
              </div>

              <Card padding="md">
                <div className="ss-form-group">
                  <label className="ss-label" htmlFor="nominee-name">Nominee Full Name</label>
                  <input
                    id="nominee-name"
                    type="text"
                    className="ss-input"
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    placeholder="e.g. Sunita Patil"
                  />
                </div>

                <div className="ss-form-group">
                  <label className="ss-label">Relationship with You</label>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    {relationshipOptions.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setNomineeRelation(rel)}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-sm)',
                          background: nomineeRelation === rel ? 'var(--color-black)' : 'var(--color-bg)',
                          color: nomineeRelation === rel ? 'white' : 'var(--color-black)',
                          border: '1px solid var(--color-border)',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ss-form-group" style={{ marginBottom: 0 }}>
                  <label className="ss-label" htmlFor="nominee-payout">Nominee Bank Account / UPI ID</label>
                  <input
                    id="nominee-payout"
                    type="text"
                    className="ss-input"
                    value={nomineePayout}
                    onChange={(e) => setNomineePayout(e.target.value)}
                    placeholder="e.g. sunita.patil@okaxis"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* STEP 7: SUBMITTED SCREEN */}
          {step === 7 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: '20px 0' }}>
              
              {/* Illustration Badge */}
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <ShieldCheck size={48} strokeWidth={2.2} />
              </div>

              <div>
                <Badge variant="active" style={{ marginBottom: '8px' }}>
                  Application Under Review
                </Badge>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 8px' }}>
                  Your application has been submitted for verification!
                </h1>
                <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                  The <strong>Chennai Labour Cooperative Society (Ward 4)</strong> is reviewing your ID documents and trade credentials.
                </p>
              </div>

              <Card padding="md" style={{ textAlign: 'left', background: 'var(--color-white)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Applicant Name:</span>
                    <span className="text-bold">{name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Registered Trade:</span>
                    <span className="text-bold">{skills.join(', ')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Status:</span>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>⏳ Pending Verification</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Estimated Approval:</span>
                    <span className="text-bold">Within 12–24 Hours</span>
                  </div>
                </div>
              </Card>

              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                💡 You can explore the worker dashboard while verification is in progress.
              </div>

            </div>
          )}
        </div>

        {/* 3. BOTTOM CTA BUTTON */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          {step < 7 ? (
            <Button
              variant="primary"
              size="large"
              icon={ArrowRight}
              iconPosition="right"
              fullWidth
              onClick={handleNext}
              disabled={step === 1 && !otpSent}
            >
              {step === 1 && 'Continue to Personal Details'}
              {step === 2 && 'Continue to Skills & Trade'}
              {step === 3 && 'Continue to Documents'}
              {step === 4 && 'Continue to Payout Info'}
              {step === 5 && 'Continue to Insurance Nominee'}
              {step === 6 && 'Submit Application for Review'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="large"
              icon={Building2}
              fullWidth
              onClick={() => navigate('/worker')}
            >
              Go to Dashboard
            </Button>
          )}
        </div>

      </main>

    </div>
  );
};

export default WorkerRegistrationFlow;
