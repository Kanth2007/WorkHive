import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher = ({ className = '' }) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          fontWeight: 'bold',
          color: 'var(--color-black)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        title="Switch Interface Language"
        aria-label="Switch Language"
      >
        <Globe size={15} color="var(--color-black)" />
        <span>{currentLang.code.toUpperCase()}</span>
        <ChevronDown size={13} color="var(--color-text-secondary)" />
      </button>

      {/* Language Selection Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '6px',
          background: 'var(--color-white)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '170px',
          zIndex: 10000,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{ padding: '6px 12px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
            Choose Language
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #F0F0F0',
                    fontSize: '12px',
                    fontWeight: isSelected ? 'bold' : 500,
                    color: isSelected ? 'var(--color-accent)' : 'var(--color-black)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {isSelected && <Check size={14} color="var(--color-accent)" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
