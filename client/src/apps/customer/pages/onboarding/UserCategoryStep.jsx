import React, { useState } from 'react';
import { Home, Building, ArrowRight, ArrowLeft, CheckCircle2, Check } from 'lucide-react';
import Button from '../../../../components/Button';
import Badge from '../../../../components/Badge';
import { useCustomer } from '../../context/CustomerContext';

export const UserCategoryStep = ({ onComplete, onBack }) => {
  const { user, completeOnboarding } = useCustomer();
  const [selectedCategory, setSelectedCategory] = useState(user.userCategory || 'household');

  const handleFinish = () => {
    completeOnboarding({ userCategory: selectedCategory });
    onComplete();
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
          Step 4 of 4: Account Type
        </Badge>
        
        <h2 style={{ fontSize: '26px', marginBottom: 'var(--space-xs)' }}>
          How will you use Sahakari Seva?
        </h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--space-xl)' }}>
          Pick the option that best describes your needs.
        </p>

        {/* Two Large Tappable Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          {/* Household Card */}
          <div
            className={`ss-choice-card ${selectedCategory === 'household' ? 'selected' : ''}`}
            onClick={() => setSelectedCategory('household')}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="ss-choice-card-icon">
                <Home size={26} strokeWidth={2.2} />
              </div>
              {selectedCategory === 'household' && (
                <Badge variant="active">Selected</Badge>
              )}
            </div>

            <div className="ss-choice-card-title">Household & Personal</div>
            <p className="ss-choice-card-desc">
              For home repairs, deep cleaning, plumbing, electrician visits, and elder care for you and your family.
            </p>
          </div>

          {/* Institution / Business Card */}
          <div
            className={`ss-choice-card ${selectedCategory === 'institution' ? 'selected' : ''}`}
            onClick={() => setSelectedCategory('institution')}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="ss-choice-card-icon">
                <Building size={26} strokeWidth={2.2} />
              </div>
              {selectedCategory === 'institution' && (
                <Badge variant="active">Selected</Badge>
              )}
            </div>

            <div className="ss-choice-card-title">Institution / Business</div>
            <p className="ss-choice-card-desc">
              For housing societies, clinics, small offices, shops, and institutions needing cooperative service contracts.
            </p>
          </div>

        </div>

      </div>

      <div style={{ marginTop: 'var(--space-xxl)' }}>
        <Button
          variant="primary"
          size="large"
          icon={CheckCircle2}
          iconPosition="right"
          fullWidth
          onClick={handleFinish}
        >
          Go to Home Screen
        </Button>
      </div>
    </div>
  );
};

export default UserCategoryStep;
