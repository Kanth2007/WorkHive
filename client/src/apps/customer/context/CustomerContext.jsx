import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerContext = createContext();

const STORAGE_KEY_USER = 'sahakari_seva_customer_user';
const STORAGE_KEY_BOOKINGS = 'sahakari_seva_customer_bookings';

const initialUserState = {
  name: 'Priya Sundaram',
  contact: '+91 98401 23456',
  contactType: 'phone', // 'phone' | 'email'
  location: 'Adyar, Chennai',
  addressDetails: 'Flat 4B, Ceebros Heritage, 2nd Main Rd, Kasturba Nagar',
  userCategory: 'household', // 'household' | 'institution'
  isOnboarded: true
};


const initialBookings = [
  {
    id: 'BK-1042',
    service: 'Switchboard Repair & Line Check',
    worker: 'Ramesh Patil',
    workerId: 'ravi-kumar',
    rating: 4.8,
    date: 'Yesterday, 4:00 PM',
    status: 'completed',
    statusLabel: 'Completed',
    fee: '₹250 paid via UPI',
    address: 'Adyar, Chennai'
  },
  {
    id: 'BK-1041',
    service: 'Home Deep Cleaning',
    worker: 'Sunita Shinde',
    workerId: 'sunita-shinde',
    rating: 4.9,
    date: '25 Aug 2026, 10:30 AM',
    status: 'completed',
    statusLabel: 'Completed',
    fee: '₹350 paid via Cash',
    address: 'Adyar, Chennai'
  }
];

export const CustomerProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : initialUserState;
    } catch {
      return initialUserState;
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist customer user to localStorage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Could not persist bookings to localStorage', e);
    }
  }, [bookings]);

  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const completeOnboarding = (additionalData = {}) => {
    setUser((prev) => ({
      ...prev,
      ...additionalData,
      isOnboarded: true
    }));
  };

  const addBooking = (newBooking) => {
    setBookings((prev) => {
      // Remove any duplicate id if it already existed
      const filtered = prev.filter((b) => b.id !== newBooking.id);
      return [newBooking, ...filtered];
    });
  };

  const resetUser = () => {
    setUser(initialUserState);
    setBookings(initialBookings);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        user,
        updateUser,
        completeOnboarding,
        bookings,
        addBooking,
        resetUser
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    return {
      user: initialUserState,
      updateUser: () => {},
      completeOnboarding: () => {},
      bookings: initialBookings,
      addBooking: () => {},
      resetUser: () => {}
    };
  }
  return context;
};

export default CustomerContext;
