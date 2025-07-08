
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization } from '@/types/election';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization | null) => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'organisation au démarrage
  useEffect(() => {
    const loadOrganization = () => {
      try {
        const orgData = localStorage.getItem('currentOrganization');
        if (orgData) {
          const org = JSON.parse(orgData);
          setCurrentOrganizationState(org);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'organisation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganization();
  }, []);

  // Fonction pour mettre à jour l'organisation
  const setCurrentOrganization = (org: Organization | null) => {
    setCurrentOrganizationState(org);
    if (org) {
      localStorage.setItem('currentOrganization', JSON.stringify(org));
    } else {
      localStorage.removeItem('currentOrganization');
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        setCurrentOrganization,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
