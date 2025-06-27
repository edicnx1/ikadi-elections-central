import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Building,
  Eye,
  ArrowRight,
  Plus
} from 'lucide-react';
import ElectionWizard from '@/components/elections/ElectionWizard';
import ElectionDetailView from '@/components/elections/ElectionDetailView';

interface Election {
  id: number;
  title: string;
  date: string;
  status: string;
  statusColor: string;
  description: string;
  voters: number;
  candidates: number;
  centers: number;
  bureaux: number;
  location: string;
  type: string;
  seatsAvailable: number;
  budget?: number;
  voteGoal?: number;
  province: string;
  department: string;
  commune: string;
  arrondissement: string;
  candidatesList?: Array<{
    id: string;
    name: string;
    party: string;
    isOurCandidate: boolean;
  }>;
  isActive?: boolean;
}

const ElectionManagement = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [elections, setElections] = useState<Election[]>([]);

  // Charger les élections depuis localStorage au montage du composant
  useEffect(() => {
    const savedElections = localStorage.getItem('elections');
    if (savedElections) {
      setElections(JSON.parse(savedElections));
    }
    // Suppression des élections de démonstration par défaut
  }, []);

  // Sauvegarder les élections dans localStorage à chaque modification
  useEffect(() => {
    if (elections.length > 0) {
      localStorage.setItem('elections', JSON.stringify(elections));
    }
  }, [elections]);

  const getStatusVariant = (color: string) => {
    switch (color) {
      case 'blue': return 'default';
      case 'green': return 'secondary';
      case 'gray': return 'outline';
      default: return 'default';
    }
  };

  const getElectionStatus = (date: string) => {
    const today = new Date();
    const electionDate = new Date(date);
    
    if (today < electionDate) {
      const diffTime = electionDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: 'À venir', color: 'blue', countdown: `J-${diffDays}` };
    } else if (today.toDateString() === electionDate.toDateString()) {
      return { status: 'En cours', color: 'green', countdown: null };
    } else {
      return { status: 'Terminée', color: 'gray', countdown: null };
    }
  };

  const handleElectionClick = (election: Election) => {
    setSelectedElection(election);
  };

  const handleAddElection = (newElectionData: any) => {
    // Désactiver toutes les autres élections
    const updatedElections = elections.map(e => ({ ...e, isActive: false }));
    
    const election: Election = {
      ...newElectionData,
      id: Date.now(), // Utiliser timestamp pour un ID unique
      isActive: true, // La nouvelle élection devient active
      candidatesList: newElectionData.candidates || []
    };
    
    const newElections = [...updatedElections, election];
    setElections(newElections);
    setShowWizard(false);
  };

  const handleSetActiveElection = (electionId: number) => {
    const updatedElections = elections.map(e => ({
      ...e,
      isActive: e.id === electionId
    }));
    setElections(updatedElections);
  };

  if (selectedElection) {
    return (
      <ElectionDetailView
        election={selectedElection}
        onBack={() => setSelectedElection(null)}
      />
    );
  }

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-gray">ÉLECTIONS</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Point central de toute la logistique électorale
            </p>
          </div>
          <Button 
            className="gov-bg-primary hover:bg-gov-blue-dark w-full sm:w-auto"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Configurer une nouvelle élection</span>
            <span className="sm:hidden">Nouvelle élection</span>
          </Button>
        </div>

        {elections.length === 0 ? (
          <Card className="gov-card">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <Calendar className="w-16 h-16 text-blue-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900">Aucune élection configurée</h3>
                <p className="text-gray-600">
                  Commencez par configurer votre première élection pour gérer les résultats et la logistique électorale.
                </p>
                <Button 
                  className="gov-bg-primary hover:bg-gov-blue-dark"
                  onClick={() => setShowWizard(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Configurer une élection
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Elections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {elections.map((election) => {
                const statusInfo = getElectionStatus(election.date);
                return (
                  <Card 
                    key={election.id} 
                    className={`gov-card hover:shadow-md transition-shadow cursor-pointer ${
                      election.isActive ? 'border-green-500 border-2' : ''
                    }`}
                    onClick={() => handleElectionClick(election)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gov-gray line-clamp-2">
                          {election.title}
                          {election.isActive && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              Élection Active
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <Badge variant={getStatusVariant(statusInfo.color)} className="text-xs">
                            {statusInfo.status}
                          </Badge>
                          {statusInfo.countdown && (
                            <span className="text-xs text-gray-500 font-medium">
                              {statusInfo.countdown}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{election.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Date */}
                        <div className="flex items-center space-x-2 text-xs sm:text-sm">
                          <Calendar className="w-4 h-4 text-gov-blue flex-shrink-0" />
                          <span className="font-medium truncate">
                            {new Date(election.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                          <div className="text-center">
                            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mx-auto mb-1" />
                            <div className="text-sm sm:text-lg font-bold text-gray-900">
                              {election.voters.toLocaleString('fr-FR')}
                            </div>
                            <div className="text-xs text-gray-500">Électeurs</div>
                          </div>
                          <div className="text-center">
                            <Users className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 mx-auto mb-1" />
                            <div className="text-sm sm:text-lg font-bold text-gray-900">
                              {election.candidates}
                            </div>
                            <div className="text-xs text-gray-500">Candidats</div>
                          </div>
                          <div className="text-center">
                            <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500 mx-auto mb-1" />
                            <div className="text-sm sm:text-lg font-bold text-gray-900">
                              {election.centers}
                            </div>
                            <div className="text-xs text-gray-500">Centres</div>
                          </div>
                          <div className="text-center">
                            <Building className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 mx-auto mb-1" />
                            <div className="text-sm sm:text-lg font-bold text-gray-900">
                              {election.bureaux}
                            </div>
                            <div className="text-xs text-gray-500">Bureaux</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleElectionClick(election);
                            }}
                          >
                            <Eye className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Détails</span>
                            <span className="sm:hidden">Voir</span>
                          </Button>
                          
                          {!election.isActive && (
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetActiveElection(election.id);
                              }}
                            >
                              Activer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Card className="gov-card border-l-4 border-l-blue-500">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900">{elections.length}</div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">Élections Totales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card border-l-4 border-l-green-500">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900">
                        {elections.filter(e => getElectionStatus(e.date).status === 'En cours').length}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">En Cours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card border-l-4 border-l-purple-500">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900">
                        {elections.reduce((sum, e) => sum + e.voters, 0).toLocaleString('fr-FR')}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">Total Électeurs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gov-card border-l-4 border-l-orange-500">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-base sm:text-lg font-bold text-gray-900">
                        {elections.reduce((sum, e) => sum + e.centers, 0)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 truncate">Total Centres</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Election Configuration Wizard */}
        {showWizard && (
          <ElectionWizard
            onClose={() => setShowWizard(false)}
            onSubmit={handleAddElection}
          />
        )}
      </div>
    </Layout>
  );
};

export default ElectionManagement;
