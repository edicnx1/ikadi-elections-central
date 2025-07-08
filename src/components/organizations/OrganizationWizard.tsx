
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Building, Users } from 'lucide-react';
import { ELECTION_MODELS } from '@/data/electionModels';

interface OrganizationWizardProps {
  onClose: () => void;
  onSubmit: (organization: any) => void;
}

const OrganizationWizard: React.FC<OrganizationWizardProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'territorial' | 'professional' | '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type) {
      onSubmit(formData);
    }
  };

  const handleTypeSelect = (type: 'territorial' | 'professional') => {
    setFormData({ ...formData, type });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gov-gray">Créer une Organisation</h2>
            <p className="text-gray-600">Configurez votre contexte électoral</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélection du type */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Type d'organisation</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ELECTION_MODELS.map((model) => (
                <Card 
                  key={model.id}
                  className={`cursor-pointer transition-all ${
                    formData.type === model.type 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeSelect(model.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        model.type === 'territorial' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {model.type === 'territorial' ? (
                          <Building className="w-6 h-6" />
                        ) : (
                          <Users className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{model.name}</h3>
                        <p className="text-sm text-gray-600">{model.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Nom de l'organisation */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'organisation</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Élections Législatives Gabon 2024, Élections CSE Entreprise SA..."
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez brièvement le contexte de cette organisation..."
              rows={3}
            />
          </div>

          {/* Aperçu de la hiérarchie */}
          {formData.type && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Hiérarchie qui sera utilisée :
              </h4>
              <div className="text-sm text-gray-600">
                {ELECTION_MODELS.find(m => m.type === formData.type)?.defaultHierarchy.level1} → {' '}
                {ELECTION_MODELS.find(m => m.type === formData.type)?.defaultHierarchy.level2} → {' '}
                {ELECTION_MODELS.find(m => m.type === formData.type)?.defaultHierarchy.level3}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cette hiérarchie pourra être personnalisée lors de la création des élections
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name || !formData.type}
              className="gov-bg-primary hover:bg-gov-blue-dark"
            >
              Créer l'organisation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationWizard;
