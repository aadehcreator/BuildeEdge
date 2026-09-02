'use client';
import { useLocationStore, SERVICEABLE_PINCODES } from '@/store/locationStore';
import { useEffect } from 'react';

export function useLocation() {
  const {
    pincode, city, isServiceable, showPincodeModal,
    setPincode, openPincodeModal, closePincodeModal,
  } = useLocationStore();

  // Show modal on first visit if no pincode set
  useEffect(() => {
    if (!pincode) openPincodeModal();
  }, [pincode, openPincodeModal]);

  const validatePincode = (pin: string): { valid: boolean; serviceable: boolean } => {
    const valid = /^\d{6}$/.test(pin);
    const serviceable = SERVICEABLE_PINCODES.includes(pin);
    return { valid, serviceable };
  };

  return { pincode, city, isServiceable, showPincodeModal, setPincode, closePincodeModal, openPincodeModal, validatePincode };
}
