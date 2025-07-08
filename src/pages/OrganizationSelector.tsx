
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building, Users, Calendar } from 'lucide-react';
import { Organization } from '@/types/election';
import { useOrganization } from '@/contexts/OrganizationContext';
import OrganizationWizard from '@/components/organizations/OrganizationWizard';
import { useNavigate } from 'react-router-dom';

const OrganizationSelector = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { setCurrentOrganization } = useOrganization();
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrganizations = localStorage.getItem('organizations');
    if (savedOrganizations) {
      const orgs = JSON.parse(savedOrganizations);
      setOrganizations(orgs);
      
      // Si une seule organisation, rediriger automatiquement
      if (orgs.length === 1) {
        setCurrentOrganization(orgs[0]);
        navigate('/dashboard');
      }
    }
  }, [navigate, setCurrentOrganization]);

  const handleSelectOrganization = (org: Organization) => {
    setCurrentOrganization(org);
    navigate('/dashboard');
  };

  const handleCreateOrganization = (orgData: any) => {
    const newOrg: Organization = {
      id: Date.now().toString(),
      name: orgData.name,
      type: orgData.type,
      description: orgData.description,
      userId: 'current-user', // À remplacer par l'ID utilisateur réel
      createdAt: new Date().toISOString()
    };
    
    const updatedOrgs = [...organizations, newOrg];
    setOrganizations(updatedOrgs);
    localStorage.setItem('organizations', JSON.stringify(updatedOrgs));
    setShowWizard(false);
    
    // Sélectionner automatiquement la nouvelle organisation
    handleSelectOrganization(newOrg);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gov-gray">Mes Organisations</h1>
          <p className="text-gray-600">
            Sélectionnez l'organisation pour laquelle vous souhaitez gérer les élections
          </p>
        </div>

        {organizations.length === 0 ? (
          <Card className="gov-card text-center py-12">
            <CardContent>
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune organisation configurée
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre première organisation pour commencer à gérer vos élections
              </p>
              <Button 
                onClick={() => setShowWizard(true)}
                className="gov-bg-primary hover:bg-gov-blue-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer ma première organisation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gov-gray">
                Choisissez votre organisation
              </h2>
              <Button 
                onClick={() => setShowWizard(true)}
                className="gov-bg-primary hover:bg-gov-blue-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle organisation
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card 
                  key={org.id}
                  className="gov-card hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSelectOrganization(org)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {org.type === 'territorial' ? (
                            <Building className="w-6 h-6 text-blue-600" />
                          ) : (
                            <Users className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{org.name}</CardTitle>
                          <Badge 
                            variant={org.type === 'territorial' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {org.type === 'territorial' ? 'Territorial' : 'Professionnel'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {org.description && (
                      <p className="text-gray-600 text-sm mb-4">{org.description}</p>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Créée le {new Date(org.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {showWizard && (
          <OrganizationWizard
            onClose={() => setShowWizard(false)}
            onSubmit={handleCreateOrganization}
          />
        )}
      </div>
    </Layout>
  );
};

export default OrganizationSelector;
