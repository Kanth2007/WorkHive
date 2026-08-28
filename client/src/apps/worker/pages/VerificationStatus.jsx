import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileCheck2,
  Award,
  Building2,
  QrCode,
  ArrowRight,
  PhoneCall,
  MapPin,
  RefreshCw,
  Sliders,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';

export const VerificationStatus = () => {
  const navigate = useNavigate();
  const { worker, updateWorker } = useWorker();

  // State: 'all_verified' (default) | 'id_pending' | 'cert_pending' | 'both_pending'
  const [demoState, setDemoState] = useState('all_verified');

  const isIdVerified = demoState === 'all_verified' || demoState === 'cert_pending';
  const isCertVerified = demoState === 'all_verified' || demoState === 'id_pending';
  const isFullyVerified = isIdVerified && isCertVerified;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* 1. DEV / DEMO CONTROLLER TOOLBAR */}
      <div style={{
        background: 'var(--color-bg)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
            🛠️ PROTOTYPE VERIFICATION SIMULATOR
          </span>
          <span style={{ fontSize: '11px', color: isFullyVerified ? 'var(--color-success)' : 'var(--color-accent)', fontWeight: 'bold' }}>
            {isFullyVerified ? '🟢 Fully Verified' : '⏳ Review in Progress'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'all_verified', label: '✓ Both Verified (Default)' },
            { id: 'cert_pending', label: '⏳ Cert Pending' },
            { id: 'id_pending', label: '⏳ ID Pending' },
            { id: 'both_pending', label: '⏳ Both Pending' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setDemoState(mode.id)}
              style={{
                flex: 1,
                minWidth: '110px',
                padding: '4px 6px',
                borderRadius: '4px',
                background: demoState === mode.id ? 'var(--color-black)' : 'var(--color-white)',
                color: demoState === mode.id ? 'white' : 'var(--color-black)',
                border: `1px solid ${demoState === mode.id ? 'var(--color-black)' : 'var(--color-border)'}`,
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TOP HEADER */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 2px' }}>
          Verification Status
        </h1>
        <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
          Official trade registration with Chennai Labour Cooperative Society
        </p>
      </div>

      {/* 3. TWO CLEAR STATUS ROWS (IDENTITY & SKILL CERTIFICATE) */}
      <Card padding="md">
        <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Credential Verification Checklist
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Row 1: Identity */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <span style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: isIdVerified ? '#00E676' : '#9E9E9E',
                boxShadow: isIdVerified ? '0 0 0 3px rgba(0, 230, 118, 0.25)' : 'none'
              }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  Government Identity (Aadhaar / Voter ID)
                </div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  {isIdVerified ? 'Verified • Background check cleared' : 'Under Review by Ward Officer'}
                </div>
              </div>
            </div>

            <Badge variant={isIdVerified ? 'success' : 'neutral'}>
              {isIdVerified ? '✓ Verified' : '⏳ Pending'}
            </Badge>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-border)' }} />

          {/* Row 2: Skill Certificate */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <span style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: isCertVerified ? '#00E676' : '#9E9E9E',
                boxShadow: isCertVerified ? '0 0 0 3px rgba(0, 230, 118, 0.25)' : 'none'
              }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  Skill & Trade Certificate (Govt. ITI / Diploma)
                </div>
                <div className="text-secondary" style={{ fontSize: '12px' }}>
                  {isCertVerified ? 'Verified • Safety assessment passed' : 'Under Review by Trade Examiner'}
                </div>
              </div>
            </div>

            <Badge variant={isCertVerified ? 'success' : 'neutral'}>
              {isCertVerified ? '✓ Verified' : '⏳ Pending'}
            </Badge>
          </div>

        </div>
      </Card>

      {/* 4. IF BOTH VERIFIED: LARGE "✓ VERIFIED COOPERATIVE WORKER" BADGE/CERTIFICATE CARD */}
      {isFullyVerified ? (
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FFF9 100%)',
          border: '2px solid #22C55E',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Watermark Logo */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            opacity: 0.05,
            fontSize: '140px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            स
          </div>

          {/* Certificate Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-success-bg)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={30} strokeWidth={2.5} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  OFFICIAL COOPERATIVE ACCREDITATION
                </span>
                <h2 style={{ fontSize: '19px', fontWeight: 'bold', margin: '2px 0 0', color: 'var(--color-black)' }}>
                  ✓ Verified Cooperative Worker
                </h2>
              </div>
            </div>

            <Badge variant="success" style={{ padding: '3px 8px' }}>
              ACTIVE
            </Badge>
          </div>

          {/* Worker Certificate Details */}
          <div style={{
            background: 'var(--color-white)',
            border: '1px solid #E0E0E0',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Accredited Member:</span>
              <span className="text-bold">{worker.name || 'Ramesh Patil'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Trade Category:</span>
              <span className="text-bold">{worker.skills?.[0] || 'Electrical & Wiring Specialist'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Cooperative Society ID:</span>
              <span className="text-bold">#CLC-EL-402 (Ward 4)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Affiliated Cooperative:</span>
              <span className="text-bold">Chennai Labour Cooperative</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Validity Period:</span>
              <span className="text-bold">Aug 2026 – Aug 2028 (2 Years)</span>
            </div>
          </div>

          {/* Certificate Footer Perks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)', fontSize: '12px' }}>
            <div style={{ background: '#F0FDF4', padding: '6px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 4, color: '#166534', fontWeight: 600 }}>
              <Check size={14} />
              <span>₹5L On-Duty Insurance Active</span>
            </div>
            <div style={{ background: '#F0FDF4', padding: '6px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 4, color: '#166534', fontWeight: 600 }}>
              <Check size={14} />
              <span>Priority Smart Match</span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/worker')}
          >
            Open Live Job Dashboard
          </Button>

        </div>
      ) : (
        /* 5. IF ANY ITEM IS PENDING: PLAIN-LANGUAGE NOTICE */
        <Card padding="lg" style={{ background: '#FFFDF9', border: '1.5px solid var(--color-accent)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={24} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', margin: 0 }}>
                  Verification in Review
                </h3>
                <Badge variant="active">1-2 Days</Badge>
              </div>

              {/* Exact plain-language note requested */}
              <p style={{ fontSize: '14px', color: '#333333', margin: '8px 0 6px', lineHeight: 1.4 }}>
                <strong>Your cooperative office is reviewing this. This usually takes 1-2 days.</strong>
              </p>

              <p className="text-secondary" style={{ fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Our Ward 4 verification officer is cross-checking your credentials against the state vocational registry. Once complete, your profile will immediately activate for customer matching.
              </p>

              <div style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                marginTop: 'var(--space-md)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span className="text-secondary">Ward Cooperative Contact:</span>
                <span className="text-bold">+91 044-2491-0842</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 6. COOPERATIVE LOCAL OFFICE DETAILS */}
      <Card padding="md">
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={22} color="var(--color-black)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Chennai Labour Cooperative Society
            </div>
            <div className="text-secondary" style={{ fontSize: '12px' }}>
              Ward 4 Community Centre, 1st Cross Street, Adyar, Chennai - 600020
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default VerificationStatus;
