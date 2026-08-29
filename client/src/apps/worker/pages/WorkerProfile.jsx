import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  QrCode,
  Award,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components';
import { useWorker } from '../context/WorkerContext';
import { useAuth } from '../../../context/AuthContext';

export const WorkerProfile = () => {
  const navigate = useNavigate();
  const { worker, resetWorker } = useWorker();
  const { currentUser, logout } = useAuth();

  const displayName = worker.name || currentUser?.name || 'Worker Member';
  const displaySkill = worker.skill || currentUser?.skill || worker.skills?.join(', ') || 'General Services';
  const displayPhone = worker.phone || currentUser?.phone || '';
  const displayLocality = worker.locality || currentUser?.locality || 'Ward 4, Chennai';
  const displayExperience = worker.experience || '3 years';
  const displayRadius = worker.serviceRadius || '5 km';
  const displayLanguages = worker.languages?.join(', ') || 'Tamil, English';
  const displayUpi = worker.upiId || `${displayName.toLowerCase().replace(/\s+/g, '')}@okaxis`;

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'W';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', paddingBottom: 'var(--space-xl)' }}>
      
      {/* Profile Header Card */}
      <Card padding="md" style={{ textAlign: 'center' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-black)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 auto var(--space-xs)'
        }}>
          {initials}
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '4px 0 2px' }}>
          {displayName}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, color: worker.verificationStatus === 'verified' ? 'var(--color-success)' : 'var(--color-accent)', fontSize: '13px', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>{worker.verificationStatus === 'verified' ? '✓ Verified Cooperative Worker' : 'Pending Verification'}</span>
        </div>
        <p className="text-secondary" style={{ fontSize: '12px', marginTop: 2 }}>
          Chennai Labour Cooperative Society • {displayLocality}
        </p>

        <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
          <Button
            variant="outline"
            size="small"
            icon={Award}
            onClick={() => navigate('/worker/verification')}
          >
            View Verification Status
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => navigate('/worker/skills')}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Member Details */}
      <Card padding="md">
        <h2 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: 'var(--space-sm)' }}>
          Worker Profile & Credentials
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Primary Trade:</span>
            <span className="text-bold">{displaySkill}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Contact Phone:</span>
            <span className="text-bold">{displayPhone || 'Registered Mobile'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Trade Experience:</span>
            <span className="text-bold">{displayExperience}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Working Service Radius:</span>
            <span className="text-bold">{displayRadius}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-secondary">Languages Known:</span>
            <span className="text-bold">{displayLanguages}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
            <span className="text-secondary">Direct UPI Payout:</span>
            <span className="text-bold">{displayUpi}</span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <Button
          variant="outline"
          fullWidth
          icon={LogOut}
          onClick={() => {
            logout();
            navigate('/auth?role=worker');
          }}
        >
          Sign Out of Worker Portal
        </Button>
      </div>

    </div>
  );
};

export default WorkerProfile;
