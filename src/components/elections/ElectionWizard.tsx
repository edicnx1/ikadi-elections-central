import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Star, Trash2, Edit } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  party: string;
  isOurCandidate: boolean;
  photo?: string;
}

interface ElectionWizardProps {
  onClose: () => void;
  onSubmit: (election: any) => void;
  organizationType?: 'territorial' | 'professional';
}

const ElectionWizard: React.FC<ElectionWizardProps> = ({ onClose, onSubmit, organizationType = 'territorial' }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1
    name: '',
    type: '',
    date: '',
    seatsAvailable: 1,
    budget: 0,
    voteGoal: 0,
    
    // Étape 2 - Dynamique selon le type d'organisation
    province: '',
    department: '',
    commune: '',
    arrondissement: '',
    // Pour les élections professionnelles
    company: '',
    direction: '',
    service: '',
    
    // Étape 3
    candidates: [] as Candidate[],
    
    // Étape 4
    totalCenters: 0,
    averageBureaux: 0,
    totalVoters: 0
  });

  const [currentCandidate, setCurrentCandidate] = useState({
    name: '',
    party: '',
    isOurCandidate: false
  });

  const steps = [
    'Informations Générales',
    organizationType === 'territorial' ? 'Circonscription Électorale' : 'Périmètre Professionnel',
    'Candidats',
    organizationType === 'territorial' ? 'Centres et Bureaux' : 'Lieux de Vote',
    'Récapitulatif'
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddCandidate = () => {
    if (currentCandidate.name && currentCandidate.party) {
      const newCandidates = [...formData.candidates];
      
      // Si c'est notre candidat, désélectionner les autres
      if (currentCandidate.isOurCandidate) {
        newCandidates.forEach(c => c.isOurCandidate = false);
      }
      
      const candidate: Candidate = {
        id: Date.now().toString(),
        name: currentCandidate.name,
        party: currentCandidate.party,
        isOurCandidate: currentCandidate.isOurCandidate
      };
      
      setFormData({ ...formData, candidates: [...newCandidates, candidate] });
      setCurrentCandidate({ name: '', party: '', isOurCandidate: false });
    }
  };

  const handleRemoveCandidate = (id: string) => {
    setFormData({
      ...formData,
      candidates: formData.candidates.filter(c => c.id !== id)
    });
  };

  const handleSubmit = () => {
    const election = {
      title: formData.name,
      date: formData.date,
      status: 'À venir',
      statusColor: 'blue',
      description: organizationType === 'territorial' 
        ? `Circonscription ${formData.commune}, ${formData.arrondissement}`
        : `${formData.company} - ${formData.direction}`,
      voters: formData.totalVoters,
      candidates: formData.candidates.length,
      centers: formData.totalCenters,
      bureaux: formData.totalCenters * formData.averageBureaux,
      location: organizationType === 'territorial'
        ? `${formData.commune}, ${formData.arrondissement}`
        : `${formData.company}`,
      type: formData.type,
      seatsAvailable: formData.seatsAvailable,
      budget: formData.budget,
      voteGoal: formData.voteGoal,
      // Données territoriales
      province: formData.province,
      department: formData.department,
      commune: formData.commune,
      arrondissement: formData.arrondissement,
      // Données professionnelles
      company: formData.company,
      direction: formData.direction,
      service: formData.service,
      candidatesList: formData.candidates,
      isActive: true,
      organizationType: organizationType
    };
    
    onSubmit(election);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== '' && 
               formData.type.trim() !== '' && 
               formData.date.trim() !== '';
      case 2:
        if (organizationType === 'territorial') {
          return formData.province.trim() !== '' && 
                 formData.commune.trim() !== '';
        } else {
          return formData.company.trim() !== '' && 
                 formData.direction.trim() !== '';
        }
      case 3:
        return true; // Candidats optionnels
      case 4:
        return formData.totalCenters > 0 && 
               formData.averageBureaux > 0 && 
               formData.totalVoters > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de l'élection</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={organizationType === 'territorial' 
                  ? "Ex: Législatives 2023 - Siège unique Moanda"
                  : "Ex: Élection CSE 2024 - Direction Générale"
                }
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type d'élection</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationType === 'territorial' ? (
                    <>
                      <SelectItem value="Législatives">Législatives</SelectItem>
                      <SelectItem value="Locales">Locales (Départementales / Municipales)</SelectItem>
                      <SelectItem value="Présidentielle">Présidentielle</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="CSE">CSE (Comité Social et Économique)</SelectItem>
                      <SelectItem value="Délégués du Personnel">Délégués du Personnel</SelectItem>
                      <SelectItem value="Représentants Syndicaux">Représentants Syndicaux</SelectItem>
                      <SelectItem value="Conseil d'Administration">Conseil d'Administration</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date du scrutin</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="seats">Siège(s) à pourvoir</Label>
              <Input
                id="seats"
                type="number"
                value={formData.seatsAvailable}
                onChange={(e) => setFormData({ ...formData, seatsAvailable: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="budget">Budget alloué à la campagne (FCFA)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="goal">Objectif de voix</Label>
              <Input
                id="goal"
                type="number"
                value={formData.voteGoal}
                onChange={(e) => setFormData({ ...formData, voteGoal: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
        );
        
      case 2:
        if (organizationType === 'territorial') {
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Estuaire">Estuaire</SelectItem>
                    <SelectItem value="Haut-Ogooué">Haut-Ogooué</SelectItem>
                    <SelectItem value="Moyen-Ogooué">Moyen-Ogooué</SelectItem>
                    <SelectItem value="Ngounié">Ngounié</SelectItem>
                    <SelectItem value="Nyanga">Nyanga</SelectItem>
                    <SelectItem value="Ogooué-Ivindo">Ogooué-Ivindo</SelectItem>
                    <SelectItem value="Ogooué-Lolo">Ogooué-Lolo</SelectItem>
                    <SelectItem value="Ogooué-Maritime">Ogooué-Maritime</SelectItem>
                    <SelectItem value="Woleu-Ntem">Woleu-Ntem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Ex: Lemboumbi-Leyou"
                />
              </div>
              
              <div>
                <Label htmlFor="commune">Commune / Canton / District</Label>
                <Input
                  id="commune"
                  value={formData.commune}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  placeholder="Ex: Commune de Moanda"
                />
              </div>
              
              <div>
                <Label htmlFor="arrondissement">Arrondissement / Siège</Label>
                <Input
                  id="arrondissement"
                  value={formData.arrondissement}
                  onChange={(e) => setFormData({ ...formData, arrondissement: e.target.value })}
                  placeholder="Ex: 1er Arrondissement"
                />
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Entreprise / Organisation</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ex: ACME Corporation"
                />
              </div>
              
              <div>
                <Label htmlFor="direction">Direction</Label>
                <Input
                  id="direction"
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  placeholder="Ex: Direction Générale"
                />
              </div>
              
              <div>
                <Label htmlFor="service">Service / Département</Label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  placeholder="Ex: Ressources Humaines"
                />
              </div>
            </div>
          );
        }
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-4">Ajouter un candidat</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidateName">Nom et Prénom(s)</Label>
                  <Input
                    id="candidateName"
                    value={currentCandidate.name}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })}
                    placeholder="Nom complet du candidat"
                  />
                </div>
                
                <div>
                  <Label htmlFor="candidateParty">
                    {organizationType === 'territorial' ? 'Parti politique / Appartenance' : 'Liste / Syndicat'}
                  </Label>
                  <Input
                    id="candidateParty"
                    value={currentCandidate.party}
                    onChange={(e) => setCurrentCandidate({ ...currentCandidate, party: e.target.value })}
                    placeholder={organizationType === 'territorial' ? 'Nom du parti' : 'Nom de la liste ou du syndicat'}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ourCandidate"
                  checked={currentCandidate.isOurCandidate}
                  onChange={(e) => setCurrentCandidate({ ...currentCandidate, isOurCandidate: e.target.checked })}
                />
                <Label htmlFor="ourCandidate">
                  {organizationType === 'territorial' ? "C'est notre candidat" : "C'est notre liste/candidat"}
                </Label>
              </div>
              
              <Button 
                onClick={handleAddCandidate} 
                className="mt-4"
                disabled={!currentCandidate.name || !currentCandidate.party}
              >
                + Ajouter ce candidat
              </Button>
            </div>
            
            {formData.candidates.length > 0 && (
              <div>
                <h4 className="font-semibold mb-4">Candidats ajoutés ({formData.candidates.length})</h4>
                <div className="space-y-2">
                  {formData.candidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{candidate.name}</span>
                            {candidate.isOurCandidate && (
                              <Badge className="bg-gov-blue text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Notre Candidat
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{candidate.party}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCandidate(candidate.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalCenters">
                {organizationType === 'territorial' 
                  ? 'Nombre total de Centres de Vote prévus'
                  : 'Nombre total de Lieux de Vote prévus'
                }
              </Label>
              <Input
                id="totalCenters"
                type="number"
                value={formData.totalCenters}
                onChange={(e) => setFormData({ ...formData, totalCenters: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 12"
                min="1"
              />
            </div>
            
            <div>
              <Label htmlFor="averageBureaux">
                {organizationType === 'territorial'
                  ? 'Nombre moyen de Bureaux de Vote par Centre'
                  : 'Nombre moyen de Postes de Vote par Lieu'
                }
              </Label>
              <Input
                id="averageBureaux"
                type="number"
                value={formData.averageBureaux}
                onChange={(e) => setFormData({ ...formData, averageBureaux: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 4"
                min="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ce chiffre est une estimation. Le détail pourra être ajusté plus tard.
              </p>
            </div>
            
            <div>
              <Label htmlFor="totalVoters">
                {organizationType === 'territorial'
                  ? "Nombre total d'Électeurs inscrits (estimation)"
                  : "Nombre total d'Employés électeurs (estimation)"
                }
              </Label>
              <Input
                id="totalVoters"
                type="number"
                value={formData.totalVoters}
                onChange={(e) => setFormData({ ...formData, totalVoters: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 15240"
                min="1"
              />
            </div>
            
            {formData.totalCenters > 0 && formData.averageBureaux > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Estimation automatique</h4>
                <p className="text-blue-800">
                  Total estimé de {organizationType === 'territorial' ? 'bureaux de vote' : 'postes de vote'} : <strong>{formData.totalCenters * formData.averageBureaux}</strong>
                </p>
              </div>
            )}
          </div>
        );
        
      case 5:
        const ourCandidate = formData.candidates.find(c => c.isOurCandidate);
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-lg mb-4">Récapitulatif de l'élection</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Nom :</span>
                    <p className="text-gray-700">{formData.name}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Type :</span>
                    <p className="text-gray-700">{formData.type}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Date :</span>
                    <p className="text-gray-700">
                      {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Non définie'}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">
                      {organizationType === 'territorial' ? 'Circonscription :' : 'Périmètre :'}
                    </span>
                    <p className="text-gray-700">
                      {organizationType === 'territorial' 
                        ? `${formData.province} ${formData.department ? `→ ${formData.department}` : ''} ${formData.commune ? `→ ${formData.commune}` : ''} ${formData.arrondissement ? `→ ${formData.arrondissement}` : ''}`
                        : `${formData.company} ${formData.direction ? `→ ${formData.direction}` : ''} ${formData.service ? `→ ${formData.service}` : ''}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Candidats :</span>
                    <p className="text-gray-700">
                      {formData.candidates.length} {ourCandidate && `(dont ${ourCandidate.name})`}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Structure :</span>
                    <p className="text-gray-700">
                      {formData.totalCenters} {organizationType === 'territorial' ? 'centres' : 'lieux'} de vote, ~{formData.totalCenters * formData.averageBureaux} {organizationType === 'territorial' ? 'bureaux' : 'postes'} de vote
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-medium">
                      {organizationType === 'territorial' ? 'Électeurs :' : 'Employés électeurs :'}
                    </span>
                    <p className="text-gray-700">~{formData.totalVoters.toLocaleString('fr-FR')}</p>
                  </div>
                  
                  {formData.budget > 0 && (
                    <div>
                      <span className="font-medium">Budget :</span>
                      <p className="text-gray-700">{formData.budget.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gov-gray">
              Configurer une nouvelle élection {organizationType === 'territorial' ? 'territoriale' : 'professionnelle'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">Étape {currentStep} sur 5 : {steps[currentStep - 1]}</p>
          </div>
          <Button variant="ghost" onClick={onClose} className="flex-shrink-0">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  index + 1 <= currentStep ? 'bg-gov-blue text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm hidden sm:inline ${
                  index + 1 <= currentStep ? 'text-gov-blue font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 mx-2 sm:mx-4 ${
                    index + 1 < currentStep ? 'bg-gov-blue' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content with fixed height and scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="min-h-[50vh]">
            {renderStep()}
          </div>
        </div>

        {/* Footer - Toujours visible en bas */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Précédent</span>
            <span className="sm:hidden">Préc.</span>
          </Button>
          
          <div className="flex space-x-2">
            {/* Bouton Suivant toujours visible */}
            {currentStep < 5 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gov-bg-primary hover:bg-gov-blue-dark"
                style={{ backgroundColor: '#1d4ed8' }}
                data-testid="next-button"
              >
                <span className="hidden sm:inline">Suivant</span>
                <span className="sm:hidden">Suiv.</span>
                <ChevronRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            )}
            
            {/* Bouton Créer pour la dernière étape */}
            {currentStep === 5 && (
              <Button
                onClick={handleSubmit}
                className="gov-bg-primary hover:bg-gov-blue-dark"
                style={{ backgroundColor: '#1d4ed8' }}
              >
                <span className="hidden sm:inline">Créer l'élection</span>
                <span className="sm:hidden">Créer</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionWizard;
