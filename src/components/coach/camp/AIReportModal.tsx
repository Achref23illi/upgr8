"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campData: {
    id: string;
    name: string;
    totalPlayers: number;
    evaluatedPlayers: number;
  };
  onGenerate: (reports: PlayerReport[]) => Promise<void>;
}

interface PlayerReport {
  playerId: string;
  playerName: string;
  playerNumber: number;
  status: 'pending' | 'generating' | 'completed' | 'error';
  progress: number;
  reportData?: {
    strengths: string[];
    areasForImprovement: string[];
    overallScore: number;
    recommendation: string;
  };
}

const mockPlayers = [
  { id: "p1", name: "Alexandre Dubois", number: 17, hasEvaluations: true },
  { id: "p2", name: "Maxime Tremblay", number: 9, hasEvaluations: true },
  { id: "p3", name: "Gabriel Roy", number: 4, hasEvaluations: false },
  { id: "p4", name: "Samuel Gagné", number: 31, hasEvaluations: true },
  { id: "p5", name: "Thomas Bergeron", number: 22, hasEvaluations: true },
  { id: "p6", name: "Émile Lavoie", number: 8, hasEvaluations: false },
];

export function AIReportModal({ isOpen, onClose, campData, onGenerate }: AIReportModalProps) {
  const [reports, setReports] = useState<PlayerReport[]>(
    mockPlayers.map(player => ({
      playerId: player.id,
      playerName: player.name,
      playerNumber: player.number,
      status: player.hasEvaluations ? 'pending' : 'error',
      progress: 0
    }))
  );
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerating, setCurrentGenerating] = useState<string | null>(null);

  const eligiblePlayers = reports.filter(r => r.status !== 'error');
  const completedReports = reports.filter(r => r.status === 'completed');

  const generateAllReports = async () => {
    setIsGenerating(true);
    
    for (const report of eligiblePlayers) {
      if (report.status === 'completed') continue;
      
      setCurrentGenerating(report.playerId);
      setReports(prev => prev.map(r => 
        r.playerId === report.playerId 
          ? { ...r, status: 'generating', progress: 0 }
          : r
      ));

      // Simulate AI generation with progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setReports(prev => prev.map(r => 
          r.playerId === report.playerId 
            ? { ...r, progress }
            : r
        ));
      }

      // Generate mock report data
      const mockReportData = {
        strengths: ["Excellente vision du jeu", "Tir précis", "Leadership naturel"],
        areasForImprovement: ["Vitesse de patinage", "Jeu défensif"],
        overallScore: 4.2,
        recommendation: "Joueur prometteur avec un fort potentiel offensif"
      };

      setReports(prev => prev.map(r => 
        r.playerId === report.playerId 
          ? { ...r, status: 'completed', progress: 100, reportData: mockReportData }
          : r
      ));
    }

    setCurrentGenerating(null);
    setIsGenerating(false);
    
    const completedReportsData = reports.filter(r => r.status === 'completed');
    await onGenerate(completedReportsData);
  };

  const generateSingleReport = async (playerId: string) => {
    setReports(prev => prev.map(r => 
      r.playerId === playerId 
        ? { ...r, status: 'generating', progress: 0 }
        : r
    ));

    for (let progress = 0; progress <= 100; progress += 25) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setReports(prev => prev.map(r => 
        r.playerId === playerId 
          ? { ...r, progress }
          : r
      ));
    }

    const mockReportData = {
      strengths: ["Excellente vision du jeu", "Tir précis", "Leadership naturel"],
      areasForImprovement: ["Vitesse de patinage", "Jeu défensif"],
      overallScore: 4.2,
      recommendation: "Joueur prometteur avec un fort potentiel offensif"
    };

    setReports(prev => prev.map(r => 
      r.playerId === playerId 
        ? { ...r, status: 'completed', progress: 100, reportData: mockReportData }
        : r
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generating':
        return <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>;
      case 'generating':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case 'error':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Pas d&apos;évaluations</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
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
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Génération de rapports IA</h2>
                <p className="text-sm text-gray-600">
                  Camp: {campData.name} • {eligiblePlayers.length} joueurs éligibles
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              disabled={isGenerating}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <span className="text-4xl leading-none block w-8 h-8 flex items-center justify-center">×</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{campData.totalPlayers}</div>
                <div className="text-sm text-gray-600">Total joueurs</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{eligiblePlayers.length}</div>
                <div className="text-sm text-gray-600">Éligibles</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedReports.length}</div>
                <div className="text-sm text-gray-600">Complétés</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === 'error').length}</div>
                <div className="text-sm text-gray-600">Sans évaluations</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Actions de génération</h3>
                <p className="text-sm text-gray-600">
                  Les rapports sont générés automatiquement basés sur les évaluations complètes
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => generateAllReports()}
                  disabled={isGenerating || eligiblePlayers.length === 0}
                >
                  Générer tout ({eligiblePlayers.length})
                </Button>
                <Button
                  onClick={() => generateAllReports()}
                  disabled={isGenerating || eligiblePlayers.length === 0}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Démarrer l&apos;IA
                </Button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="p-6">
            <div className="space-y-3">
              {reports.map((report, index) => (
                <motion.div
                  key={report.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-lg p-4 ${
                    currentGenerating === report.playerId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{report.playerNumber}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-gray-900">{report.playerName}</h4>
                          {getStatusBadge(report.status)}
                        </div>
                        
                        {report.status === 'generating' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Génération en cours...</span>
                              <span className="font-medium">{report.progress}%</span>
                            </div>
                            <Progress value={report.progress} className="h-2" />
                          </div>
                        )}
                        
                        {report.status === 'completed' && report.reportData && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-gray-600">Score global</p>
                              <p className="font-medium text-lg">{report.reportData.overallScore}/5</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Forces identifiées</p>
                              <p className="font-medium">{report.reportData.strengths.length} points</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Axes d&apos;amélioration</p>
                              <p className="font-medium">{report.reportData.areasForImprovement.length} points</p>
                            </div>
                          </div>
                        )}
                        
                        {report.status === 'error' && (
                          <p className="text-sm text-red-600 mt-1">
                            Aucune évaluation complète disponible pour ce joueur
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateSingleReport(report.playerId)}
                            disabled={isGenerating}
                          >
                            Générer
                          </Button>
                        )}
                        {report.status === 'completed' && (
                          <>
                            <Button size="sm" variant="outline">
                              Aperçu
                            </Button>
                            <Button size="sm" variant="outline">
                              PDF
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {completedReports.length > 0 && (
                <span className="text-green-600 font-medium">
                  {completedReports.length} rapport(s) généré(s) avec succès
                </span>
              )}
              {isGenerating && (
                <span className="text-blue-600 font-medium">
                  Génération en cours...
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                {isGenerating ? 'Fermer après génération' : 'Fermer'}
              </Button>
              {completedReports.length > 0 && (
                <Button className="bg-green-600 hover:bg-green-700">
                  Télécharger tout ({completedReports.length})
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}