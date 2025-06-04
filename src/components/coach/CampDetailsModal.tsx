"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camp } from "@/types/coach";

interface CampDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  camp: Camp;
}

export function CampDetailsModal({ isOpen, onClose, camp }: CampDetailsModalProps) {
  if (!isOpen) return null;

  const getDuration = () => {
    const start = new Date(camp.startDate);
    const end = new Date(camp.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} jours`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{camp.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline">{camp.level}</Badge>
              <Badge className={camp.isActive ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}>
                {camp.isActive ? 'Actif' : 'Terminé'}
              </Badge>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <span className="text-4xl leading-none block w-8 h-8 flex items-center justify-center">×</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Lieu</div>
                <p className="text-gray-900">{camp.location}</p>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Dates</div>
                <p className="text-gray-900">
                  {new Date(camp.startDate).toLocaleDateString('fr-CA')} - {new Date(camp.endDate).toLocaleDateString('fr-CA')}
                </p>
                <p className="text-sm text-gray-600">{getDuration()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">
                  Groupes ({camp.groups.length})
                </div>
                <div className="space-y-2">
                  {camp.groups.map(group => (
                    <div key={group.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm text-gray-900">{group.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Statistiques</div>
                <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span>Joueurs inscrits:</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Évaluateurs assignés:</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Évaluations complétées:</span>
                    <span className="font-medium">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Créé le {new Date(camp.createdAt).toLocaleDateString('fr-CA')}</div>
              <div>Modifié le {new Date(camp.updatedAt).toLocaleDateString('fr-CA')}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline">
              Gérer les joueurs
            </Button>
            <Button variant="outline">
              Gérer les évaluateurs
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Tableau de bord →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}