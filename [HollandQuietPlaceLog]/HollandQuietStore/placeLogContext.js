import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';

export const StoreContext = createContext(undefined);

export const useStorage = () => {
  return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);

  const loadRecords = async () => {
    const stored = await AsyncStorage.getItem('visitRecords');
    if (stored) setRecords(JSON.parse(stored));
  };

  const deleteRecord = async id => {
    const filtered = records.filter(r => r.id !== id);
    setRecords(filtered);
    await AsyncStorage.setItem('visitRecords', JSON.stringify(filtered));
  };

  const loadUserProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('user profile error', error);
    }
  };

  const contextValue = {
    records,
    loadRecords,
    deleteRecord,
    loadUserProfile,
    profile,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
