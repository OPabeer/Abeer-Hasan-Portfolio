import React, { createContext, useContext, useState, useEffect } from 'react';
import { DATA } from '../constants';
import { PortfolioData } from '../types';

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  resetData: () => void;
  isAdmin: boolean;
  login: (password: string) => boolean;
  changePassword: (newPassword: string) => void;
  logout: () => void;
  isDashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(DATA);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDashboardOpen, setDashboardOpen] = useState(false);

  useEffect(() => {
    // Load data from "Database" (LocalStorage)
    const savedData = localStorage.getItem('portfolio_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with default to ensure new fields (like theme) in schema don't break old data
        // Deep merge logic simplified: spread top level
        setData((prev) => ({
             ...prev,
             ...parsed,
             // Ensure nested objects that might be new are present if missing in saved data
             theme: parsed.theme || prev.theme 
        }));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }

    // Check session
    const session = localStorage.getItem('admin_session');
    if (session === 'true') setIsAdmin(true);
  }, []);

  // Apply Theme Effect
  useEffect(() => {
    if (data.theme) {
      document.documentElement.style.setProperty('--color-primary', data.theme.primary);
      document.documentElement.style.setProperty('--color-secondary', data.theme.secondary);
    }
  }, [data.theme]);

  const updateData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('portfolio_data', JSON.stringify(newData));
  };

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all data to default? This cannot be undone.")) {
      setData(DATA);
      localStorage.removeItem('portfolio_data');
    }
  };

  const login = (password: string) => {
    // Check against stored password or default
    const storedPassword = localStorage.getItem('portfolio_password') || 'admin123';
    
    if (password === storedPassword) {
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const changePassword = (newPassword: string) => {
    localStorage.setItem('portfolio_password', newPassword);
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
  };

  const openDashboard = () => setDashboardOpen(true);
  const closeDashboard = () => setDashboardOpen(false);

  return (
    <PortfolioContext.Provider value={{ 
      data, 
      updateData, 
      resetData, 
      isAdmin, 
      login, 
      changePassword,
      logout,
      isDashboardOpen,
      openDashboard,
      closeDashboard
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return context;
};