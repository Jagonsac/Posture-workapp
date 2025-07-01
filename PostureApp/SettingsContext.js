import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

const defaultSettings = {
  interval: 15,
  stretch: true,
  theme: 'system',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('settings').then(value => {
      if (value) setSettings(JSON.parse(value));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('settings', JSON.stringify(settings));
    }
  }, [settings, loaded]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {loaded && children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
