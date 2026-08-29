import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { bookingsAPI } from '../../../services/api';

const CustomerContext = createContext();

const STORAGE_KEY_BOOKINGS_PREFIX = 'sahakari_seva_customer_bookings_';

export const CustomerProvider = ({ children }) => {
  const { currentUser, getRoleSession } = useAuth();
  const customerSession = getRoleSession('customer') || (currentUser?.role === 'customer' ? currentUser : null);

  const [user, setUser] = useState(() => {
    if (customerSession) {
      return {
        userId: customerSession.userId,
        name: customerSession.name || 'Customer Member',
        contact: customerSession.phone || '',
        email: customerSession.email || '',
        contactType: 'phone',
        location: customerSession.locality || 'Adyar, Chennai',
        addressDetails: customerSession.locality || 'Adyar, Chennai',
        userCategory: customerSession.userCategory || 'household',
        isOnboarded: true
      };
    }
    return {
      userId: '',
      name: '',
      contact: '',
      email: '',
      contactType: 'phone',
      location: 'Ward 4, Chennai',
      addressDetails: '',
      userCategory: 'household',
      isOnboarded: false
    };
  });

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Sync user state when customer session changes (different user logs in)
  useEffect(() => {
    if (customerSession) {
      setUser({
        userId: customerSession.userId,
        name: customerSession.name || 'Customer Member',
        contact: customerSession.phone || '',
        email: customerSession.email || '',
        contactType: 'phone',
        location: customerSession.locality || 'Adyar, Chennai',
        addressDetails: customerSession.locality || 'Adyar, Chennai',
        userCategory: customerSession.userCategory || 'household',
        isOnboarded: true
      });
    }
  }, [customerSession]);

  // Fetch live bookings for the specific logged-in customer from MongoDB
  const fetchCustomerBookings = useCallback(async () => {
    if (!user.contact && !customerSession?.phone) return;
    const phoneToQuery = user.contact || customerSession?.phone;

    try {
      setLoadingBookings(true);
      const res = await bookingsAPI.getAll({ customerPhone: phoneToQuery });
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(b => ({
          id: b.bookingId || b._id,
          bookingId: b.bookingId || b._id,
          service: b.serviceCategory || b.serviceDetails,
          serviceCategory: b.serviceCategory,
          serviceDetails: b.serviceDetails,
          worker: b.workerName,
          workerId: b.workerId,
          rating: b.rating || 0,
          date: b.dateString || 'Today',
          status: b.status || 'pending',
          statusLabel: (b.status || 'pending').toUpperCase().replace('_', ' '),
          fee: `₹${b.amount} paid via ${b.paymentMethod ? b.paymentMethod.toUpperCase() : 'UPI'}`,
          amount: b.amount,
          address: b.customerAddress,
          arrivalPin: b.arrivalPin
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.warn('Could not fetch customer bookings from MongoDB:', err.message);
    } finally {
      setLoadingBookings(false);
    }
  }, [user.contact, customerSession?.phone]);

  useEffect(() => {
    fetchCustomerBookings();
  }, [fetchCustomerBookings]);

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

  const addBooking = async (newBooking) => {
    // Add locally for instant UI update
    setBookings((prev) => {
      const filtered = prev.filter((b) => b.id !== newBooking.id && b.bookingId !== newBooking.bookingId);
      return [newBooking, ...filtered];
    });

    // Also persist directly to MongoDB Atlas
    try {
      await bookingsAPI.create({
        bookingId: newBooking.id || newBooking.bookingId,
        customerName: user.name,
        customerPhone: user.contact,
        customerAddress: user.addressDetails || user.location,
        serviceCategory: newBooking.serviceCategory || newBooking.service || 'General Service',
        serviceDetails: newBooking.serviceDetails || newBooking.service || 'Service request',
        workerId: newBooking.workerId || 'ravi-kumar',
        workerName: newBooking.worker || newBooking.workerName || 'Ravi Kumar',
        amount: Number(newBooking.amount || newBooking.fee?.replace(/[^0-9]/g, '')) || 450,
        isEmergency: Boolean(newBooking.isEmergency)
      });
      // Refresh to ensure sync
      fetchCustomerBookings();
    } catch (err) {
      console.error('Error saving booking to MongoDB:', err);
    }
  };

  const resetUser = () => {
    setUser({
      name: '',
      contact: '',
      location: 'Adyar, Chennai',
      addressDetails: '',
      userCategory: 'household',
      isOnboarded: false
    });
    setBookings([]);
  };

  return (
    <CustomerContext.Provider
      value={{
        user,
        updateUser,
        completeOnboarding,
        bookings,
        addBooking,
        fetchCustomerBookings,
        loadingBookings,
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
    throw new Error('useCustomer must be used within CustomerProvider');
  }
  return context;
};

export default CustomerContext;
