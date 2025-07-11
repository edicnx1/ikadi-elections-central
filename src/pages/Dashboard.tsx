
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  MapPin, 
  BarChart3,
  Clock,
  Building,
  Plus,
  Lightbulb
} from 'lucide-react';
import { Organization, FlexibleElection } from '@/types/election';
import { useOrganization } from '@/contexts/OrganizationContext';

const Dashboard = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeElection, setActiveElection] = useState<FlexibleElection | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    if (!currentOrganization) return;

    // Vérifier si c'est un nouvel utilisateur (organisation créée récemment)
    const orgCreationTime = new Date(currentOrganization.createdAt).getTime();
    const now = new Date().getTime();
    const timeDiff = now - orgCreationTime;
    const isRecent = timeDiff < 5 * 60 * 1000; // 5 minutes
    setIsNewUser(isRecent);

    // Récupérer l'élection active pour cette organisation
    const electionsData = localStorage.getItem('elections');
    if (electionsData) {
      const elections: FlexibleElection[] = JSON.parse(electionsData);
      const active = elections.find(e => e.organizationId === currentOrganization.id && e.isActive);
      setActiveElection(active || null);
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (!activeElection) return;

    const updateCountdown = () => {
      const now = new Date();
      const electionDate = new Date(activeElection.date);
      const diff = electionDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeElection]);

  // Données adaptées au contexte de l'organisation
  const dashboardData = {
    votersRegistered: {
      total: activeElection?.voters || 0,
      trend: "+2.3% sur 30 jours"
    },
    infrastructure: {
      centers: activeElection?.votingLocations?.length || 0,
      bureaux: activeElection?.votingLocations?.reduce((sum, loc) => sum + (loc.bureaux?.length || 0), 0) || 0,
      average: activeElection?.votingLocations?.length ? 
        ((activeElection.votingLocations.reduce((sum, loc) => sum + (loc.bureaux?.length || 0), 0)) / activeElection.votingLocations.length).toFixed(1) : "0"
    },
    pvsWaiting: {
      count: 37,
      status: "À valider"
    }
  };

  if (!currentOrganization) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune organisation sélectionnée</h2>
            <p className="text-gray-600">Veuillez sélectionner une organisation pour continuer</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Message de bienvenue pour nouveaux utilisateurs */}
        {isNewUser && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Bienvenue dans votre environnement électoral !
                  </h3>
                  <p className="text-blue-800 text-sm mb-3">
                    Votre organisation "<strong>{currentOrganization.name}</strong>" est maintenant configurée pour les{' '}
                    <strong>{currentOrganization.type === 'territorial' ? 'élections territoriales' : 'élections professionnelles'}</strong>.
                    L'application s'est automatiquement adaptée à votre contexte.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      ✓ Structure hiérarchique configurée
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      ✓ Interface adaptée au contexte
                    </Badge>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      ✓ Prêt pour créer des élections
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* En-tête Organisation - Proéminent */}
        <div className="gov-gradient rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                {currentOrganization.type === 'territorial' ? (
                  <Building className="w-8 h-8 text-white" />
                ) : (
                  <Users className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{currentOrganization.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {currentOrganization.type === 'territorial' ? 'Élections Territoriales' : 'Élections Professionnelles'}
                  </Badge>
                  <span className="text-blue-100 text-sm">
                    Créée le {new Date(currentOrganization.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {currentOrganization.description && (
                  <p className="text-blue-100 mt-2 max-w-2xl">{currentOrganization.description}</p>
                )}
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="hidden lg:flex flex-col space-y-2">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Élection
              </Button>
            </div>
          </div>
        </div>

        {/* Élection Active ou Invitation à Créer */}
        {activeElection ? (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-blue-900">{activeElection.title}</CardTitle>
                    <p className="text-blue-600 text-sm">
                      {new Date(activeElection.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {activeElection.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Compte à rebours */}
              <div className="flex items-center justify-center space-x-4 py-4">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold text-blue-600">{countdown.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-500">Jours</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-300">:</div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold text-blue-600">{countdown.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-500">Heures</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-300">:</div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-3 min-w-[70px]">
                    <div className="text-2xl font-bold text-blue-600">{countdown.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-500">Min</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12 border-dashed border-2">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune élection configurée
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre première élection pour <strong>{currentOrganization.name}</strong>
              </p>
              <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Créer une élection
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cartes de statistiques contextuelles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Électeurs */}
          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {currentOrganization.type === 'territorial' ? 'Électeurs Inscrits' : 'Employés Électeurs'}
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {dashboardData.votersRegistered.total.toLocaleString('fr-FR')}
              </div>
              <p className="text-xs text-green-600 font-medium flex items-center">
                <span className="mr-1">📈</span>
                {dashboardData.votersRegistered.trend}
              </p>
            </CardContent>
          </Card>

          {/* Lieux de Vote */}
          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {currentOrganization.type === 'territorial' ? 'Centres de Vote' : 'Lieux de Vote'}
              </CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {dashboardData.infrastructure.centers}
              </div>
              <p className="text-xs text-gray-500">
                {currentOrganization.type === 'territorial' ? 'Centres configurés' : 'Sites de vote'}
              </p>
            </CardContent>
          </Card>

          {/* Bureaux de Vote */}
          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bureaux de Vote
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                {dashboardData.infrastructure.bureaux}
              </div>
              <p className="text-xs text-gray-500">
                Moyenne: {dashboardData.infrastructure.average}/lieu
              </p>
            </CardContent>
          </Card>

          {/* PV en Attente */}
          <Card className="gov-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {currentOrganization.type === 'territorial' ? 'PV en Attente' : 'Feuilles en Attente'}
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">
                {dashboardData.pvsWaiting.count}
              </div>
              <p className="text-xs text-gray-500">
                {dashboardData.pvsWaiting.status}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Section contextuelle selon le type d'organisation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-gray">Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">
                    Organisation "{currentOrganization.name}" créée
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(currentOrganization.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">
                    {currentOrganization.type === 'territorial' ? 'Configuration territoriale initialisée' : 'Configuration professionnelle initialisée'}
                  </span>
                  <span className="text-xs text-gray-500">Il y a 1h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Utilisateur administrateur configuré</span>
                  <span className="text-xs text-gray-500">Il y a 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affichage conditionnel selon le type */}
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-gray">
                {currentOrganization.type === 'territorial' ? 'Configuration Territoriale' : 'Configuration Professionnelle'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentOrganization.type === 'territorial' ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Prêt pour élections territoriales</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Hiérarchie: Province → Ville → Arrondissement
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        ✓ Structure géographique configurée
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Prêt pour élections professionnelles</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Hiérarchie: Direction → Département → Service
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Structure organisationnelle configurée
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
