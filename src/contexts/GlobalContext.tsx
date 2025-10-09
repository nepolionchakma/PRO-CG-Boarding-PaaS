import React from 'react';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
interface GlobalContextProviderProps {
  children: ReactNode;
}
interface GlobalContex {
  handleHydrate: () => Promise<void>;
  hydrated: boolean;
  // setHydrated: (value: boolean) => void;
  userColorScheme: string;
}
const GlobalContex = createContext({} as GlobalContex);
export function useGlobalContext() {
  return useContext(GlobalContex);
}
export function GlobalContextProvider({children}: GlobalContextProviderProps) {
  const [hydrated, setHydrated] = useState(false);
  const userColorScheme = 'auto';

  const handleHydrate = async () => {
    try {
      setHydrated(true);
      // await hydrate();
      // await delay(500);
      // await BootSplash.hide({fade: true});
    } catch (error) {
      setHydrated(false);
    }
  };

  useEffect(() => {
    (async () => {
      // await BootSplash.hide({ fade: true });
      setHydrated(true);
    })();
  }, []);

  const value = {
    hydrated,
    handleHydrate,
    //setHydrated
    userColorScheme,
  };
  return (
    <GlobalContex.Provider value={value}>{children}</GlobalContex.Provider>
  );
}
