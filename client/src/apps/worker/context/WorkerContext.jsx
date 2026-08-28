import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkerContext = createContext();

const STORAGE_KEY_WORKER = 'sahakari_seva_worker_data';

const initialWorkerState = {
  phone: '',
  name: 'Ramesh Patil',
  address: 'Ward 4, Adyar, Chennai',
  serviceRadius: '5 km',
  languages: ['Tamil', 'English'],
  skills: ['Electrical'],
  experience: '7 years',
  idDocument: 'aadhaar_card_front_back.pdf',
  certDocument: 'iti_electrical_trade_cert.pdf',
  payoutType: 'upi', // 'upi' | 'bank'
  upiId: 'ramesh.patil@okhdfcbank',
  bankDetails: {
    accountNumber: '918273645521',
    ifsc: 'HDFC0001824',
    bankName: 'HDFC Bank Adyar'
  },
  nominee: {
    name: 'Sunita Patil',
    relation: 'Spouse',
    payout: 'sunita.patil@okaxis'
  },
  isRegistered: false,
  verificationStatus: 'pending', // 'pending' | 'verified' | 'rejected'
  isOnline: true
};

export const WorkerProvider = ({ children }) => {
  const [worker, setWorker] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKER);
      return saved ? JSON.parse(saved) : initialWorkerState;
    } catch {
      return initialWorkerState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKER, JSON.stringify(worker));
    } catch (e) {
      console.warn('Could not persist worker state to localStorage', e);
    }
  }, [worker]);

  const updateWorker = (fields) => {
    setWorker((prev) => ({ ...prev, ...fields }));
  };

  const completeRegistration = (data = {}) => {
    setWorker((prev) => ({
      ...prev,
      ...data,
      isRegistered: true,
      verificationStatus: 'pending'
    }));
  };

  const toggleVerification = () => {
    setWorker((prev) => ({
      ...prev,
      verificationStatus: prev.verificationStatus === 'verified' ? 'pending' : 'verified'
    }));
  };

  const toggleAvailability = () => {
    setWorker((prev) => ({
      ...prev,
      isOnline: !prev.isOnline
    }));
  };

  const resetWorker = () => {
    setWorker(initialWorkerState);
    try {
      localStorage.removeItem(STORAGE_KEY_WORKER);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <WorkerContext.Provider
      value={{
        worker,
        updateWorker,
        completeRegistration,
        toggleVerification,
        toggleAvailability,
        resetWorker
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    return {
      worker: initialWorkerState,
      updateWorker: () => {},
      completeRegistration: () => {},
      toggleVerification: () => {},
      toggleAvailability: () => {},
      resetWorker: () => {}
    };
  }
  return context;
};

export default WorkerContext;
