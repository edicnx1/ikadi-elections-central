
// Types pour le système d'élection flexible et abstrait

export interface OrganizationHierarchy {
  level1: string; // Province/Direction
  level2: string; // Ville/Département  
  level3: string; // Arrondissement/Service
}

export interface ElectionModel {
  id: string;
  name: string;
  type: 'territorial' | 'professional';
  description: string;
  defaultHierarchy: OrganizationHierarchy;
  configFields: string[];
}

export interface ElectoralCollege {
  id: string;
  name: string;
  description?: string;
}

export interface VotingLocation {
  id: string;
  name: string;
  hierarchy: {
    level1: string;
    level2: string;
    level3?: string;
  };
  bureaux: VotingBureau[];
}

export interface VotingBureau {
  id: string;
  name: string;
  capacity: number;
  location: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'territorial' | 'professional';
  description?: string;
  userId: string;
  createdAt: string;
}

export interface FlexibleElection {
  id: number;
  title: string;
  date: string;
  status: string;
  statusColor: string;
  description: string;
  
  // Informations du modèle
  model: ElectionModel;
  organizationId: string;
  
  // Hiérarchie configurée
  hierarchy: OrganizationHierarchy;
  
  // Collèges électoraux (pour les élections professionnelles)
  colleges?: ElectoralCollege[];
  
  // Données flexibles
  voters: number;
  candidates: number;
  votingLocations: VotingLocation[];
  
  // Métadonnées
  type: string;
  seatsAvailable: number;
  budget?: number;
  voteGoal?: number;
  
  // Configuration spécifique au modèle
  territorialConfig?: {
    province: string;
    department: string;
    commune: string;
    arrondissement: string;
  };
  
  professionalConfig?: {
    company: string;
    department: string;
    service: string;
  };
  
  candidatesList?: Array<{
    id: string;
    name: string;
    party: string;
    college?: string; // Pour les élections professionnelles
  }>;
  
  isActive?: boolean;
}
