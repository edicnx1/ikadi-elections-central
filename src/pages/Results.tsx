
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  ChevronDown,
  FileText,
  CheckCircle,
  Users,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileCheck,
  Upload
} from 'lucide-react';
import DataEntrySection from '@/components/results/DataEntrySection';
import ValidationSection from '@/components/results/ValidationSection';
import PublishSection from '@/components/results/PublishSection';
import ConsolidationSection from '@/components/results/ConsolidationSection';

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

const Results = () => {
  const [activeTab, setActiveTab] = useState('entry');
  const [selectedElection, setSelectedElection] = useState('');
  const [availableElections, setAvailableElections] = useState<Election[]>([]);
  const [currentElection, setCurrentElection] = useState<Election | null>(null);

  // Charger les élections depuis localStorage
  useEffect(() => {
    const savedElections = localStorage.getItem('elections');
    if (savedElections) {
      const elections: Election[] = JSON.parse(savedElections);
      setAvailableElections(elections);
      
      // Trouver l'élection active
      const activeElection = elections.find(e => e.isActive);
      if (activeElection) {
        setCurrentElection(activeElection);
        setSelectedElection(activeElection.id.toString());
      } else if (elections.length > 0) {
        // Si aucune élection n'est marquée comme active, prendre la première
        setCurrentElection(elections[0]);
        setSelectedElection(elections[0].id.toString());
      }
    }
  }, []);

  // Mettre à jour l'élection courante quand la sélection change
  useEffect(() => {
    if (selectedElection && availableElections.length > 0) {
      const election = availableElections.find(e => e.id.toString() === selectedElection);
      if (election) {
        setCurrentElection(election);
      }
    }
  }, [selectedElection, availableElections]);

  // Mock data pour les statistiques globales (basées sur l'élection courante)
  const globalStats = currentElection ? {
    tauxSaisie: 85,
    bureauxSaisis: Math.floor(currentElection.bureaux * 0.85),
    totalBureaux: currentElection.bureaux,
    voixNotreCanidat: Math.floor(currentElection.voteGoal || 0 * 0.6),
    ecartDeuxieme: 1150,
    anomaliesDetectees: 3,
    pvsEnAttente: Math.floor(currentElection.bureaux * 0.15),
    electionInfo: currentElection
  } : {
    tauxSaisie: 0,
    bureauxSaisis: 0,
    totalBureaux: 0,
    voixNotreCanidat: 0,
    ecartDeuxieme: 0,
    anomaliesDetectees: 0,
    pvsEnAttente: 0,
    electionInfo: null
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* En-tête avec sélecteur d'élection */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gov-gray">Résultats</h1>
          
          {/* Sélecteur d'élection */}
          <Card className="gov-card bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Élection active :
                </label>
                {availableElections.length > 0 ? (
                  <Select value={selectedElection} onValueChange={setSelectedElection}>
                    <SelectTrigger className="w-80 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableElections.map((election) => (
                        <SelectItem key={election.id} value={election.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span>{election.title}</span>
                            {election.isActive && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-500 italic">Aucune élection configurée. Veuillez d'abord configurer une élection dans l'onglet Élections.</p>
                )}
              </div>
              
              {/* Informations sur l'élection courante */}
              {currentElection && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="text-gray-900">{currentElection.type}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Date:</span>
                      <p className="text-gray-900">
                        {new Date(currentElection.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Candidats:</span>
                      <p className="text-gray-900">{currentElection.candidates}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Circonscription:</span>
                      <p className="text-gray-900">{currentElection.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets */}
        {currentElection ? (
          <Card className="gov-card">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="entry" 
                      className="flex items-center justify-center space-x-2 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Saisir les résultats</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="validation" 
                      className="flex items-center justify-center space-x-2 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Valider les résultats</span>
                      {globalStats.pvsEnAttente > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {globalStats.pvsEnAttente}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="consolidation" 
                      className="flex items-center justify-center space-x-2 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Centralisation</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="publish" 
                      className="flex items-center justify-center space-x-2 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Publier les résultats</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="entry" className="space-y-6 mt-0">
                    <DataEntrySection stats={globalStats} />
                  </TabsContent>

                  <TabsContent value="validation" className="space-y-6 mt-0">
                    <ValidationSection pendingCount={globalStats.pvsEnAttente} />
                  </TabsContent>

                  <TabsContent value="consolidation" className="space-y-6 mt-0">
                    <ConsolidationSection />
                  </TabsContent>

                  <TabsContent value="publish" className="space-y-6 mt-0">
                    <PublishSection />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="gov-card">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
                <h3 className="text-xl font-semibold text-gray-900">Aucune élection configurée</h3>
                <p className="text-gray-600">
                  Vous devez d'abord configurer une élection dans l'onglet "Élections" avant de pouvoir saisir des résultats.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Results;
