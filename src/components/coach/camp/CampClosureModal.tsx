"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Archive,
  CheckCircle,
  AlertTriangle,
  Brain,
  Users,
  BarChart3,
  Download,
  Clock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CampClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  campData: {
    id: string;
    name: string;
    totalPlayers: number;
    evaluatedPlayers: number;
    totalEvaluators: number;
    completedEvaluations: number;
    pendingEvaluations: number;
  };
  onArchive: () => Promise<void>;
}

interface ClosureStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error' | 'warning';
  isRequired: boolean;
  icon: React.ComponentType<{ className?: string }>;
  estimatedTime: string;
  details?: string[];
}

export function CampClosureModal({ isOpen, onClose, campData, onArchive }: CampClosureModalProps) {
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<ClosureStep[]>([
    {
      id: "validation",
      name: "Validation des données",
      description: "Vérification de la complétude des évaluations",
      status: campData.pendingEvaluations === 0 ? 'completed' : 'warning',
      isRequired: true,
      icon: Shield,
      estimatedTime: "1 min",
      details: [
        `${campData.evaluatedPlayers}/${campData.totalPlayers} joueurs évalués`,
        `${campData.completedEvaluations} évaluations complétées`,
        campData.pendingEvaluations > 0 ? `${campData.pendingEvaluations} évaluations en attente` : "Toutes les évaluations complétées"
      ]
    },
    {
      id: "ai_reports",
      name: "Génération des rapports IA",
      description: "Création automatique des rapports individuels",
      status: 'pending',
      isRequired: false,
      icon: Brain,
      estimatedTime: "3-5 min",
      details: [
        `${campData.evaluatedPlayers} rapports à générer`,
        "Analyse des forces et faiblesses",
        "Recommandations personnalisées",
        "Export PDF automatique"
      ]
    },
    {
      id: "stats_compilation",
      name: "Compilation des statistiques",
      description: "Génération des statistiques globales du camp",
      status: 'pending',
      isRequired: true,
      icon: BarChart3,
      estimatedTime: "2 min",
      details: [
        "Moyennes par critère d'évaluation",
        "Performance des évaluateurs",
        "Tendances et insights",
        "Rapports comparatifs"
      ]
    },
    {
      id: "export_data",
      name: "Export des données",
      description: "Sauvegarde complète de toutes les données",
      status: 'pending',
      isRequired: true,
      icon: Download,
      estimatedTime: "2 min",
      details: [
        "Export CSV des évaluations",
        "Rapports PDF individuels",
        "Données analytiques JSON",
        "Archive ZIP complète"
      ]
    },
    {
      id: "player_history",
      name: "Mise à jour des historiques",
      description: "Sauvegarde dans l'historique des joueurs",
      status: 'pending',
      isRequired: true,
      icon: Users,
      estimatedTime: "1 min",
      details: [
        "Ajout aux profils joueurs",
        "Mise à jour des progressions",
        "Archivage des performances",
        "Notifications aux parents"
      ]
    },
    {
      id: "final_archive",
      name: "Archivage final",
      description: "Clôture définitive et archivage du camp",
      status: 'pending',
      isRequired: true,
      icon: Archive,
      estimatedTime: "1 min",
      details: [
        "Verrouillage des modifications",
        "Archivage des données",
        "Notification aux participants",
        "Finalisation du statut"
      ]
    }
  ]);

  const canProceed = steps.filter(s => s.isRequired).every(s => s.status === 'completed' || s.status === 'warning');
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const totalSteps = steps.length;

  const executeStep = async (stepId: string) => {
    setCurrentStep(stepId);
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, status: 'in_progress' } : s
    ));

    // Simulate step execution
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, status: 'completed' } : s
    ));
    setCurrentStep(null);
  };

  const executeAllSteps = async () => {
    setIsProcessing(true);
    
    const pendingSteps = steps.filter(s => s.status === 'pending' || s.status === 'warning');
    
    for (const step of pendingSteps) {
      await executeStep(step.id);
    }
    
    setIsProcessing(false);
  };

  const handleFinalArchive = async () => {
    if (!canProceed) return;
    
    await executeAllSteps();
    await onArchive();
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, isRequired: boolean) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'error':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Erreur</Badge>;
      case 'warning':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            {isRequired ? 'Attention' : 'Optionnel'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {isRequired ? 'Requis' : 'Optionnel'}
          </Badge>
        );
    }
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Archive className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Clôture du camp</h2>
                <p className="text-sm text-gray-600">
                  {campData.name} • Finalisation et archivage
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <span className="text-4xl leading-none block w-8 h-8 flex items-center justify-center">×</span>
            </button>
          </div>

          {/* Progress Overview */}
          <div className="p-6 border-b border-gray-200">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progression globale</span>
                <span className="text-sm text-gray-600">{completedSteps}/{totalSteps} étapes</span>
              </div>
              <Progress value={(completedSteps / totalSteps) * 100} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{campData.totalPlayers}</div>
                <div className="text-xs text-gray-600">Joueurs totaux</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{campData.evaluatedPlayers}</div>
                <div className="text-xs text-gray-600">Joueurs évalués</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">{campData.completedEvaluations}</div>
                <div className="text-xs text-gray-600">Évaluations</div>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          {campData.pendingEvaluations > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900 mb-1">Attention</h4>
                    <p className="text-sm text-orange-800 mb-2">
                      Il reste {campData.pendingEvaluations} évaluations en attente. 
                      Vous pouvez procéder à la clôture, mais certains rapports seront incomplets.
                    </p>
                    <ul className="text-sm text-orange-700 list-disc list-inside">
                      <li>Les joueurs non évalués n&apos;auront pas de rapport IA</li>
                      <li>Les statistiques seront basées sur les données disponibles</li>
                      <li>Possibilité de compléter les évaluations plus tard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    currentStep === step.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <step.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{step.name}</h3>
                          {getStatusBadge(step.status, step.isRequired)}
                          <span className="text-xs text-gray-500">~{step.estimatedTime}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                        
                        {step.details && (
                          <ul className="text-xs text-gray-500 space-y-1">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      {step.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => executeStep(step.id)}
                          disabled={isProcessing}
                        >
                          Exécuter
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Actions rapides</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={executeAllSteps}
                  disabled={isProcessing || completedSteps === totalSteps}
                >
                  Exécuter toutes les étapes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => executeStep('ai_reports')}
                  disabled={isProcessing || steps.find(s => s.id === 'ai_reports')?.status === 'completed'}
                >
                  Générer rapports IA uniquement
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {isProcessing && (
                <span className="text-blue-600 font-medium">
                  Traitement en cours...
                </span>
              )}
              {!canProceed && (
                <span className="text-orange-600 font-medium">
                  Certaines étapes requises ne sont pas complétées
                </span>
              )}
              {canProceed && !isProcessing && (
                <span className="text-green-600 font-medium">
                  Prêt pour l&apos;archivage final
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Annuler
              </Button>
              <Button 
                onClick={handleFinalArchive}
                disabled={!canProceed || isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Finaliser et archiver
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