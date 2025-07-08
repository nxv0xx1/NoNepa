"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuditState, CustomAppliance } from '@/lib/types';
import config from '@/data/admin-config.json';

const AUDIT_STEPS = ['location', 'appliances', 'backup-duration', 'summary', 'recommendations', 'contact'];

const defaultState: AuditState = {
  appliances: Object.keys(config.defaultWattages).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  customAppliances: [],
  location: '',
  backupHours: 0,
};

interface AuditContextType {
  audit: AuditState;
  setAppliances: (appliance: string, quantity: number) => void;
  addCustomAppliance: (appliance: Omit<CustomAppliance, 'id'>) => void;
  updateCustomAppliance: (id: string, updates: Partial<CustomAppliance>) => void;
  removeCustomAppliance: (id: string) => void;
  setLocation: (location: string) => void;
  setBackupHours: (hours: number) => void;
  resetAudit: () => void;
  getStepProgress: (currentStep: string) => number;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [audit, setAudit] = useState<AuditState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedAudit = localStorage.getItem('nonepa-audit');
      if (storedAudit) {
        const parsedAudit = JSON.parse(storedAudit);
        // Basic validation to ensure stored data isn't stale/malformed
        if (parsedAudit.appliances && Object.keys(parsedAudit.appliances).length === Object.keys(config.defaultWattages).length) {
            setAudit(parsedAudit);
        } else {
            localStorage.removeItem('nonepa-audit');
            setAudit(defaultState);
        }
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      setAudit(defaultState);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('nonepa-audit', JSON.stringify(audit));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
    }
  }, [audit, isInitialized]);

  const setAppliances = (appliance: string, quantity: number) => {
    setAudit(prev => ({ ...prev, appliances: { ...prev.appliances, [appliance]: Math.max(0, quantity) } }));
  };
  
  const addCustomAppliance = (appliance: Omit<CustomAppliance, 'id'>) => {
    const newAppliance = { ...appliance, id: new Date().toISOString() };
    setAudit(prev => ({ ...prev, customAppliances: [...prev.customAppliances, newAppliance] }));
  };

  const updateCustomAppliance = (id: string, updates: Partial<CustomAppliance>) => {
    setAudit(prev => ({
        ...prev,
        customAppliances: prev.customAppliances.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const removeCustomAppliance = (id: string) => {
    setAudit(prev => ({ ...prev, customAppliances: prev.customAppliances.filter(a => a.id !== id) }));
  };

  const setLocation = (location: string) => {
    setAudit(prev => ({ ...prev, location }));
  };

  const setBackupHours = (hours: number) => {
    setAudit(prev => ({ ...prev, backupHours: hours }));
  };

  const resetAudit = () => {
    localStorage.removeItem('nonepa-audit');
    setAudit(defaultState);
  };

  const getStepProgress = (currentStep: string) => {
    const stepIndex = AUDIT_STEPS.indexOf(currentStep);
    if (stepIndex === -1) return 0;
    return ((stepIndex + 1) / AUDIT_STEPS.length) * 100;
  };

  const value = {
    audit,
    setAppliances,
    addCustomAppliance,
    updateCustomAppliance,
    removeCustomAppliance,
    setLocation,
    setBackupHours,
    resetAudit,
    getStepProgress,
  };

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};
