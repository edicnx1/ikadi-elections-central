
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  MapPin, 
  BarChart3,
  Clock,
  Building
} from 'lucide-react';
import { Organization, FlexibleElection } from '@/types/election';

const Dashboard = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [activeElection, setActiveElection] = useState<FlexibleElection | null>(null);

  useEffect(() => {
    // Récupérer l'organisation courante
    const orgData = localStorage.getItem('currentOrganization');
    if (orgData) {
      setCurrentOrganization(JSON.parse(orgData));
    }

    // Récupérer l'élection active
    const electionsData = localStorage.getItem('elections');
    if (electionsData) {
      const elections: FlexibleElection[] = JSON.parse(electionsData);
      const active = elections.find(e => e.isActive);
      setActiveElection(active || null);
    }
  }, []);

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

  // Données par défaut si pas d'élection active
  const dashboardData = {
    votersRegistered: {
      total: activeElection?.voters || 0,
      trend: "+2.3% sur 30 jours"
    },
    infrastructure: {
      centers: activeElection?.votingLocations.length || 0,
      bureaux: activeElection?.votingLocations.reduce((sum, loc) => sum + loc.bureaux.length, 0) || 0,
      average: activeElection?.votingLocations.length ? 
        (activeElection.votingLocations.reduce((sum, loc) => sum + loc.bureaux.length, 0) / activeElection.votingLocations.length).toFixed(1) : 0
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
        {/* Organization Header */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {currentOrganization.type === 'territorial' ? (
                <Building className="w-6 h-6 text-blue-600" />
              ) : (
                <Users className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{currentOrganization.name}</h2>
              <Badge variant={currentOrganization.type === 'territorial' ? 'default' : 'secondary'}>
                {currentOrganization.type === 'territorial' ? 'Élections Territoriales' : 'Élections Professionnelles'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Election Banner */}
        {activeElection ? (
          <div className="gov-gradient rounded-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-100">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Élection Active</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  {activeElection.title}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {new Date(activeElection.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <Badge variant="secondary" className="bg-white text-gov-blue font-medium">
                  {activeElection.status}
                </Badge>
              </div>
              
              {/* Countdown Display */}
              <div className="flex items-center space-x-2 text-white">
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{countdown.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-100">Jours</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{countdown.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-100">Heures</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-100">Min</div>
                  </div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-blue-100">Sec</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune élection active
              </h3>
              <p className="text-gray-600 mb-6">
                Configurez votre première élection pour commencer
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Adaptées au contexte */}
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

        {/* Contenu conditionnel selon le type d'organisation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-gray">Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">
                    {currentOrganization.type === 'territorial' ? 'Nouveau centre ajouté' : 'Nouveau lieu de vote ajouté'}
                  </span>
                  <span className="text-xs text-gray-500">Il y a 2h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">
                    {currentOrganization.type === 'territorial' ? 'PV validé - Centre Nord' : 'Feuille validée - Siège Social'}
                  </span>
                  <span className="text-xs text-gray-500">Il y a 4h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Utilisateur créé</span>
                  <span className="text-xs text-gray-500">Il y a 6h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affichage conditionnel : Carte géographique OU Répartition par département */}
          <Card className="gov-card">
            <CardHeader>
              <CardTitle className="text-gov-gray">
                {currentOrganization.type === 'territorial' ? 'Couverture Géographique' : 'Répartition par Département'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentOrganization.type === 'territorial' ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Couverture territoriale</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activeElection ? `${activeElection.hierarchy.level1} > ${activeElection.hierarchy.level2}` : 'Configurez une élection'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Répartition des électeurs</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activeElection ? `Structure: ${activeElection.hierarchy.level1} > ${activeElection.hierarchy.level2}` : 'Configurez une élection'}
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
