"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText,
  FileSpreadsheet,
  Database,
  CheckCircle,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  campData: {
    id: string;
    name: string;
    totalPlayers: number;
    totalEvaluators: number;
    totalEvaluations: number;
  };
}

interface ExportOption {
  id: string;
  name: string;
  description: string;
  format: string;
  icon: React.ComponentType<{ className?: string }>;
  size: string;
  includes: string[];
}

const exportOptions: ExportOption[] = [
  {
    id: "evaluations_csv",
    name: "Évaluations détaillées",
    description: "Toutes les évaluations avec notes et commentaires",
    format: "CSV",
    icon: FileSpreadsheet,
    size: "~2.5 MB",
    includes: ["Données des joueurs", "Notes par critère", "Commentaires", "Timestamps"]
  },
  {
    id: "players_pdf",
    name: "Rapport des joueurs",
    description: "Rapport formaté avec profils et statistiques",
    format: "PDF",
    icon: FileText,
    size: "~1.8 MB",
    includes: ["Profils joueurs", "Notes moyennes", "Graphiques", "Analyse IA"]
  },
  {
    id: "evaluators_csv",
    name: "Données des évaluateurs",
    description: "Performance et assignations des évaluateurs",
    format: "CSV",
    icon: Users,
    size: "~150 KB",
    includes: ["Liste évaluateurs", "Assignations", "Performance", "Temps d'évaluation"]
  },
  {
    id: "analytics_json",
    name: "Données analytiques",
    description: "Données brutes pour analyse approfondie",
    format: "JSON",
    icon: BarChart3,
    size: "~800 KB",
    includes: ["Métriques complètes", "Tendances", "Corrélations", "Métadonnées"]
  },
  {
    id: "complete_zip",
    name: "Export complet",
    description: "Tous les formats dans une archive ZIP",
    format: "ZIP",
    icon: Database,
    size: "~5.2 MB",
    includes: ["Tous les exports ci-dessus", "Images", "Logos", "Configuration"]
  }
];

export function ExportDataModal({ isOpen, onClose, campData }: ExportDataModalProps) {
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<Record<string, boolean>>({});

  const toggleExport = (exportId: string) => {
    setSelectedExports(prev => 
      prev.includes(exportId) 
        ? prev.filter(id => id !== exportId)
        : [...prev, exportId]
    );
  };

  const handleExport = async () => {
    if (selectedExports.length === 0) return;

    setIsExporting(true);
    setExportProgress({});

    for (const exportId of selectedExports) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExportProgress(prev => ({ ...prev, [exportId]: true }));
      
      // Simulate file download
      const option = exportOptions.find(opt => opt.id === exportId);
      if (option) {
        const filename = `${campData.name.replace(/\s+/g, '_')}_${exportId}.${option.format.toLowerCase()}`;
        // Create a mock download
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Mock ${option.name} data for ${campData.name}`)}`;
        link.download = filename;
        link.click();
      }
    }

    setTimeout(() => {
      setIsExporting(false);
      setSelectedExports([]);
      setExportProgress({});
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Exporter les données</h2>
              <p className="text-sm text-gray-600 mt-1">
                Camp: {campData.name} • {campData.totalPlayers} joueurs • {campData.totalEvaluations} évaluations
              </p>
            </div>
            <button 
              onClick={onClose} 
              disabled={isExporting}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <span className="text-4xl leading-none block w-8 h-8 flex items-center justify-center">×</span>
            </button>
          </div>

          {/* Export Options */}
          <div className="p-6">
            <div className="space-y-4">
              {exportOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedExports.includes(option.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isExporting && toggleExport(option.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <option.icon className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{option.name}</h3>
                          <Badge variant="outline">{option.format}</Badge>
                          <span className="text-xs text-gray-500">{option.size}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {option.includes.map(item => (
                            <Badge key={item} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExporting && exportProgress[option.id] && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {isExporting && selectedExports.includes(option.id) && !exportProgress[option.id] && (
                        <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                      )}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedExports.includes(option.id)
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedExports.includes(option.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Actions rapides</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExports(exportOptions.map(opt => opt.id))}
                  disabled={isExporting}
                >
                  Tout sélectionner
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExports([])}
                  disabled={isExporting}
                >
                  Tout désélectionner
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExports(['evaluations_csv', 'players_pdf'])}
                  disabled={isExporting}
                >
                  Sélection recommandée
                </Button>
              </div>
            </div>

            {/* Summary */}
            {selectedExports.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <h4 className="font-medium text-blue-900 mb-2">Résumé de l&apos;export</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Fichiers sélectionnés</p>
                    <p className="font-medium text-blue-900">{selectedExports.length}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Taille estimée</p>
                    <p className="font-medium text-blue-900">
                      {selectedExports.includes('complete_zip') ? '~5.2 MB' : '~3.1 MB'}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600">Temps estimé</p>
                    <p className="font-medium text-blue-900">~{selectedExports.length * 2} secondes</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Format(s)</p>
                    <p className="font-medium text-blue-900">
                      {[...new Set(exportOptions.filter(opt => selectedExports.includes(opt.id)).map(opt => opt.format))].join(', ')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {selectedExports.length === 0 
                ? "Sélectionnez au moins un format d&apos;export"
                : `${selectedExports.length} format(s) sélectionné(s)`
              }
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={isExporting}>
                Annuler
              </Button>
              <Button 
                onClick={handleExport} 
                disabled={selectedExports.length === 0 || isExporting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Export en cours...
                  </>
                ) : (
                  <>
                    Exporter ({selectedExports.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}