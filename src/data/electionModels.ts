
import { ElectionModel } from '@/types/election';

export const ELECTION_MODELS: ElectionModel[] = [
  {
    id: 'territorial',
    name: 'Élections Territoriales',
    type: 'territorial',
    description: 'Pour les élections nationales, régionales, municipales...',
    defaultHierarchy: {
      level1: 'Province',
      level2: 'Ville/Commune',
      level3: 'Arrondissement'
    },
    configFields: ['province', 'department', 'commune', 'arrondissement']
  },
  {
    id: 'professional',
    name: 'Élections Professionnelles',
    type: 'professional',
    description: 'Pour les élections CSE, délégués du personnel...',
    defaultHierarchy: {
      level1: 'Direction',
      level2: 'Département',
      level3: 'Service'
    },
    configFields: ['company', 'department', 'service']
  }
];

export const getModelById = (id: string): ElectionModel | undefined => {
  return ELECTION_MODELS.find(model => model.id === id);
};
