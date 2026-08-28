import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStep from './WelcomeStep';
import SignUpStep from './SignUpStep';
import LocationStep from './LocationStep';
import UserCategoryStep from './UserCategoryStep';

export const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = () => {
    navigate('/customer/home');
  };

  return (
    <div className="mobile-device-frame" style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Subtle Progress Bar (steps 2 to 4) */}
      {currentStep > 1 && (
        <div style={{
          width: '100%',
          height: 4,
          background: 'var(--color-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            height: '100%',
            background: 'var(--color-accent)',
            width: `${((currentStep - 1) / 3) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
      {currentStep === 2 && <SignUpStep onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <LocationStep onNext={handleNext} onBack={handleBack} />}
      {currentStep === 4 && <UserCategoryStep onComplete={handleComplete} onBack={handleBack} />}
    </div>
  );
};

export default OnboardingFlow;
