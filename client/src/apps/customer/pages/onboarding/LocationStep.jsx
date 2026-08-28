import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, ArrowLeft, Check, Sparkles, Building2 } from 'lucide-react';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';
import { useCustomer } from '../../context/CustomerContext';

export const LocationStep = ({ onNext, onBack }) => {
  const { user, updateUser } = useCustomer();

  const [locationName, setLocationName] = useState(user.location || '');
  const [addressDetails, setAddressDetails] = useState(user.addressDetails || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSuccess, setDetectedSuccess] = useState(!!user.location);

  const handleAutoDetect = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      setLocationName('Adyar, Chennai');
      setDetectedSuccess(true);
    }, 650);
  };

  const handleContinue = () => {
    updateUser({
      location: locationName.trim() || 'Adyar, Chennai',
      addressDetails: addressDetails.trim()
    });
    onNext();
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
        <button
          type="button"
          onClick={onBack}
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

        <Badge variant="active" style={{ marginBottom: 'var(--space-sm)' }}>
          Step 3: Service Area
        </Badge>
        
        <h2 style={{ fontSize: '26px', marginBottom: 'var(--space-xs)' }}>
          Where do you need service?
        </h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--space-lg)' }}>
          We will connect you with cooperative workers closest to your home.
        </p>

        {/* Auto Detect Button Card */}
        <div style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)',
          textAlign: 'center'
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--color-bg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-sm)'
          }}>
            <Navigation size={22} color="var(--color-accent)" />
          </div>

          <h3 style={{ fontSize: '18px', marginBottom: 4 }}>Fastest Option</h3>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: 'var(--space-md)' }}>
            Find the cooperative society active in your neighborhood automatically.
          </p>

          <Button
            variant={detectedSuccess ? 'outline' : 'primary'}
            icon={detectedSuccess ? Check : Navigation}
            onClick={handleAutoDetect}
            disabled={isDetecting}
            fullWidth
          >
            {isDetecting ? 'Detecting your area...' : detectedSuccess ? 'Detected: Adyar, Chennai' : 'Auto-detect my location'}
          </Button>

          {detectedSuccess && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 'var(--space-sm)',
              color: 'var(--color-success)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              <Check size={16} />
              <span>Connected to Adyar Cooperative Ward</span>
            </div>
          )}
        </div>

        {/* Manual Address Fallback */}
        <div style={{ marginTop: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
            <span className="text-bold" style={{ fontSize: '15px' }}>Or enter manually:</span>
          </div>

          <div className="ss-form-group">
            <label className="ss-label" htmlFor="loc-area">Area or Neighborhood</label>
            <div className="ss-input-wrapper">
              <span className="ss-input-icon"><MapPin size={20} /></span>
              <input
                id="loc-area"
                type="text"
                className="ss-input ss-input-with-icon"
                placeholder="e.g. Adyar, Besant Nagar, T. Nagar"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  setDetectedSuccess(false);
                }}
              />
            </div>
          </div>

          <div className="ss-form-group">
            <label className="ss-label" htmlFor="loc-details">House / Flat / Street (Optional)</label>
            <div className="ss-input-wrapper">
              <span className="ss-input-icon"><Building2 size={20} /></span>
              <input
                id="loc-details"
                type="text"
                className="ss-input ss-input-with-icon"
                placeholder="e.g. Flat 3B, Sunshine Apartments"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
              />
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Button
          variant="primary"
          size="large"
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          disabled={!locationName && !detectedSuccess}
          onClick={handleContinue}
        >
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;
