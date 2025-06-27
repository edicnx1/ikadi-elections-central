
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  Download, 
  Eye, 
  TrendingUp,
  MapPin,
  Users,
  PieChart,
  FileSpreadsheet,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

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

interface ConsolidationSectionProps {
  currentElection?: Election | null;
}

const ConsolidationSection = ({ currentElection }: ConsolidationSectionProps) => {
  const [selectedLevel, setSelectedLevel] = useState('province');
  const [selectedRegion, setSelectedRegion] = useState(currentElection?.province || 'Province');
  const [viewMode, setViewMode] = useState('overview');

  // Données consolidées basées sur l'élection réelle
  const consolidatedResults = currentElection ? {
    global: {
      totalVotants: Math.floor(currentElection.voters * 0.677), // 67.7% de participation
      totalInscrits: currentElection.voters,
      tauxParticipation: 67.7,
      bulletinsNuls: Math.floor(currentElection.voters * 0.025), // 2.5% de bulletins nuls
      suffragesExprimes: Math.floor(currentElection.voters * 0.652), // 65.2% de suffrages exprimés
      centresTermines: Math.floor(currentElection.centers * 0.93), // 93% des centres terminés
      totalCentres: currentElection.centers
    },
    candidates: currentElection.candidatesList ? currentElection.candidatesList.map((candidate, index) => {
      // Répartition simulée des voix basée sur l'index
      const basePercentage = index === 0 ? 42.8 : (index === 1 ? 35.7 : 21.5 / (currentElection.candidatesList!.length - 2));
      const votes = Math.floor((currentElection.voters * 0.652) * (basePercentage / 100));
      return {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        votes: votes,
        percentage: basePercentage,
        color: index === 0 ? '#3B82F6' : (index === 1 ? '#10B981' : '#F59E0B')
      };
    }) : []
  } : {
    global: {
      totalVotants: 0,
      totalInscrits: 0,
      tauxParticipation: 0,
      bulletinsNuls: 0,
      suffragesExprimes: 0,
      centresTermines: 0,
      totalCentres: 0
    },
    candidates: []
  };

  const geographicResults = currentElection ? [
    {
      region: `${currentElection.commune} - Zone 1`,
      inscrits: Math.floor(currentElection.voters * 0.4),
      votants: Math.floor(currentElection.voters * 0.4 * 0.691),
      participation: 69.1,
      candidateResults: consolidatedResults.candidates.slice(0, 3).map(candidate => ({
        candidate: candidate.name.split(' ')[0],
        votes: Math.floor(candidate.votes * 0.4),
        percentage: candidate.percentage
      }))
    },
    {
      region: `${currentElection.commune} - Zone 2`,
      inscrits: Math.floor(currentElection.voters * 0.35),
      votants: Math.floor(currentElection.voters * 0.35 * 0.668),
      participation: 66.8,
      candidateResults: consolidatedResults.candidates.slice(0, 3).map(candidate => ({
        candidate: candidate.name.split(' ')[0],
        votes: Math.floor(candidate.votes * 0.35),
        percentage: candidate.percentage
      }))
    },
    {
      region: `${currentElection.commune} - Zone 3`,
      inscrits: Math.floor(currentElection.voters * 0.25),
      votants: Math.floor(currentElection.voters * 0.25 * 0.676),
      participation: 67.6,
      candidateResults: consolidatedResults.candidates.slice(0, 3).map(candidate => ({
        candidate: candidate.name.split(' ')[0],
        votes: Math.floor(candidate.votes * 0.25),
        percentage: candidate.percentage
      }))
    }
  ] : [];

  const barChartData = consolidatedResults.candidates.map(candidate => ({
    name: candidate.name.split(' ')[0],
    votes: candidate.votes,
    percentage: candidate.percentage
  }));

  const pieChartData = consolidatedResults.candidates.map(candidate => ({
    name: candidate.name.split(' ')[0],
    value: candidate.percentage,
    color: candidate.color
  }));

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting results in ${format} format for election: ${currentElection?.title}`);
  };

  if (!currentElection) {
    return (
      <Card className="gov-card">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Aucune élection active</h3>
            <p className="text-gray-600">
              Veuillez sélectionner une élection active pour voir les résultats consolidés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec informations de l'élection */}
      <Card className="gov-card bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-gov-gray">
            Consolidation - {currentElection.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Type d'élection:</span>
              <p className="text-gray-900">{currentElection.type}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Circonscription:</span>
              <p className="text-gray-900">{currentElection.location}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Centres de vote:</span>
              <p className="text-gray-900">{currentElection.centers}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Bureaux de vote:</span>
              <p className="text-gray-900">{currentElection.bureaux}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles et filtres */}
      <Card className="gov-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gov-gray">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Consolidation et Publication des Résultats</span>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {consolidatedResults.global.centresTermines}/{consolidatedResults.global.totalCentres} centres complétés
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Niveau géographique:</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="province">Province</SelectItem>
                  <SelectItem value="ville">Ville</SelectItem>
                  <SelectItem value="centre">Centre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Région:</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={currentElection.province}>{currentElection.province}</SelectItem>
                  <SelectItem value={currentElection.commune}>{currentElection.commune}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Vue:</label>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Vue d'ensemble</SelectItem>
                  <SelectItem value="detailed">Détaillée</SelectItem>
                  <SelectItem value="geographic">Géographique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gov-card border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participation</p>
                <p className="text-2xl font-bold text-blue-600">
                  {consolidatedResults.global.tauxParticipation}%
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={consolidatedResults.global.tauxParticipation} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {consolidatedResults.global.totalVotants.toLocaleString()} / {consolidatedResults.global.totalInscrits.toLocaleString()} électeurs
            </p>
          </CardContent>
        </Card>

        <Card className="gov-card border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidat en tête</p>
                <p className="text-lg font-bold text-green-600">
                  {consolidatedResults.candidates[0]?.name.split(' ')[0] || 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            {consolidatedResults.candidates[0] && (
              <>
                <p className="text-sm text-gray-600 mt-1">
                  {consolidatedResults.candidates[0].votes.toLocaleString()} voix
                </p>
                <p className="text-xs text-gray-500">
                  {consolidatedResults.candidates[0].percentage}% des suffrages
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="gov-card border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suffrages Exprimés</p>
                <p className="text-2xl font-bold text-purple-600">
                  {consolidatedResults.global.suffragesExprimes.toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {consolidatedResults.global.bulletinsNuls.toLocaleString()} bulletins nuls
            </p>
          </CardContent>
        </Card>

        <Card className="gov-card border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((consolidatedResults.global.centresTermines / consolidatedResults.global.totalCentres) * 100)}%
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
            <Progress 
              value={(consolidatedResults.global.centresTermines / consolidatedResults.global.totalCentres) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-gray-500 mt-1">
              {consolidatedResults.global.centresTermines}/{consolidatedResults.global.totalCentres} centres
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualisations des données */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en barres */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gov-gray">
              <BarChart3 className="w-5 h-5" />
              <span>Résultats par Candidat</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} voix`,
                    'Votes'
                  ]}
                />
                <Bar dataKey="votes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique circulaire */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gov-gray">
              <PieChart className="w-5 h-5" />
              <span>Répartition des Suffrages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Pourcentage']}
                />
                <RechartsPieChart data={pieChartData}>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {consolidatedResults.candidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: candidate.color }}
                    ></div>
                    <span className="text-sm font-medium">{candidate.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{candidate.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résultats détaillés par région */}
      {viewMode === 'geographic' && (
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gov-gray">
              <MapPin className="w-5 h-5" />
              <span>Résultats Géographiques Détaillés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {geographicResults.map((region, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{region.region}</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {region.participation}% participation
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Statistiques</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Électeurs inscrits:</span>
                          <span className="font-medium">{region.inscrits.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Votants:</span>
                          <span className="font-medium">{region.votants.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taux de participation:</span>
                          <span className="font-medium">{region.participation}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Résultats par candidat</h4>
                      <div className="space-y-2">
                        {region.candidateResults.map((result, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{result.candidate}</span>
                            <div className="text-right">
                              <div className="font-medium">{result.votes.toLocaleString()} voix</div>
                              <div className="text-gray-500">{result.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section d'export */}
      <Card className="gov-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gov-gray">
            <Download className="w-5 h-5" />
            <span>Export des Rapports Officiels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => handleExport('pdf')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exporter en PDF
            </Button>
            
            <Button
              onClick={() => handleExport('excel')}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exporter en Excel
            </Button>
            
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exporter en CSV
            </Button>
            
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Prévisualiser le Rapport
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Export Sécurisé</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Tous les exports de rapports officiels sont tracés et nécessitent une authentification renforcée. 
                  Les documents générés incluent un horodatage et une signature électronique.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidationSection;
