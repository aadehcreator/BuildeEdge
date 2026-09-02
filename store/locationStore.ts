'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Serviceable pincodes for Gwalior
export const SERVICEABLE_PINCODES = [
  '474001', '474002', '474003', '474004', '474005',
  '474006', '474007', '474008', '474009', '474010',
  '474011', '474012', '474020', '474021',
];

interface LocationState {
  pincode: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  isServiceable: boolean;
  showPincodeModal: boolean;
  setPincode: (pincode: string) => void;
  setLocation: (pincode: string, city: string, lat?: number, lng?: number) => void;
  openPincodeModal: () => void;
  closePincodeModal: () => void;
  checkServiceability: (pincode: string) => boolean;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      pincode: null,
      city: null,
      lat: null,
      lng: null,
      isServiceable: false,
      showPincodeModal: false,

      checkServiceability: (pincode: string) => {
        return SERVICEABLE_PINCODES.includes(pincode);
      },

      setPincode: (pincode: string) => {
        const isServiceable = SERVICEABLE_PINCODES.includes(pincode);
        set({ pincode, isServiceable, showPincodeModal: false });
      },

      setLocation: (pincode, city, lat, lng) => {
        const isServiceable = SERVICEABLE_PINCODES.includes(pincode);
        set({ pincode, city, lat: lat ?? null, lng: lng ?? null, isServiceable, showPincodeModal: false });
      },

      openPincodeModal: () => set({ showPincodeModal: true }),
      closePincodeModal: () => set({ showPincodeModal: false }),
    }),
    {
      name: 'buildedge-location',
      partialize: (state) => ({ pincode: state.pincode, city: state.city, lat: state.lat, lng: state.lng }),
    }
  )
);
