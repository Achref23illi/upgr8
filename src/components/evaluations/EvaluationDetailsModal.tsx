"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  Calendar, 
  Star, 
  TrendingUp, 
  TrendingDown,
  ClipboardCheck,
  Award,
  Target,
  MessageSquare,
  Printer,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Evaluation {
  id: string;
  playerName: string;
  playerId: string;
  playerTeam: string;
  playerNumber: number;
  playerPosition: string;
  evaluatorName: string;
  evaluationDate: string;
  evaluationType: string;
  category: string;
  overallRating: number;
  previousRating?: number;
  skills: {
    skating: number;
    shooting: number;
    passing: number;
    stickHandling: number;
    positioning: number;
    hockey_iq: number;
    compete: number;
    physicality: number;
  };
  previousSkills?: {
    skating: number;
    shooting: number;
    passing: number;
    stickHandling: number;
    positioning: number;
    hockey_iq: number;
    compete: number;
    physicality: number;
  };
  strengths: string;
  improvements: string;
  comments: string;
  recommendedLevel: string;
  nextSteps: string;
  status: "draft" | "completed" | "shared";
}

interface EvaluationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation;
}

const skillLabels = {
  skating: "Patinage",
  shooting: "Tir",
  passing: "Passes",
  stickHandling: "Maniement",
  positioning: "Positionnement",
  hockey_iq: "QI Hockey",
  compete: "Compétitivité",
  physicality: "Physique"
};

const getSkillColor = (value: number) => {
  if (value >= 8) return "text-green-600";
  if (value >= 6) return "text-yellow-600";
  if (value >= 4) return "text-orange-600";
  return "text-red-600";
};

const getProgressColor = (value: number) => {
  if (value >= 8) return "bg-green-500";
  if (value >= 6) return "bg-yellow-500";
  if (value >= 4) return "bg-orange-500";
  return "bg-red-500";
};

const getLevelLabel = (level: string) => {
  const levels: Record<string, string> = {
    recreational: "Récréatif",
    c: "C",
    cc: "CC",
    b: "B", 
    bb: "BB",
    a: "A",
    aa: "AA",
    aaa: "AAA",
    elite: "Elite"
  };
  return levels[level] || level;
};

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    seasonal: "Évaluation Saisonnière",
    tryout: "Essai/Tryout",
    progress: "Suivi de Progrès",
    special: "Évaluation Spéciale"
  };
  return types[type] || type;
};

export function EvaluationDetailsModal({ 
  isOpen, 
  onClose, 
  evaluation 
}: EvaluationDetailsModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log("Downloading evaluation as PDF...");
  };

  const handleShare = () => {
    // In a real app, this would open sharing options
    console.log("Sharing evaluation...");
  };

  const renderSkillComparison = (skill: keyof typeof evaluation.skills) => {
    const current = evaluation.skills[skill];
    const previous = evaluation.previousSkills?.[skill];
    const hasPrevious = previous !== undefined;
    const improvement = hasPrevious ? current - previous : 0;

    return (
      <div key={skill} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {skillLabels[skill]}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${getSkillColor(current)}`}>
              {current}/10
            </span>
            {hasPrevious && improvement !== 0 && (
              <div className={`flex items-center text-xs ${
                improvement > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {improvement > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span className="ml-1">{improvement > 0 ? '+' : ''}{improvement}</span>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <Progress 
            value={current * 10} 
            className={`h-2 ${getProgressColor(current)}`}
          />
          {hasPrevious && (
            <div 
              className="absolute top-0 h-full w-0.5 bg-gray-400"
              style={{ left: `${previous * 10}%` }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-red-800 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Évaluation de {evaluation.playerName}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {getTypeLabel(evaluation.evaluationType)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-white/60 text-sm">Date</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(evaluation.evaluationDate).toLocaleDateString('fr-CA')}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Évaluateur</p>
                    <p className="font-semibold flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {evaluation.evaluatorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Catégorie</p>
                    <p className="font-semibold">{evaluation.category}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Note Globale</p>
                    <p className="font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      {evaluation.overallRating}/10
                      {evaluation.previousRating && (
                        <span className={`text-sm ml-2 ${
                          evaluation.overallRating > evaluation.previousRating ? 'text-green-300' : 
                          evaluation.overallRating < evaluation.previousRating ? 'text-red-300' : 'text-white/60'
                        }`}>
                          ({evaluation.overallRating > evaluation.previousRating ? '+' : ''}
                          {(evaluation.overallRating - evaluation.previousRating).toFixed(1)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Badge className={`
                    ${evaluation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      evaluation.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {evaluation.status === 'completed' ? 'Complété' : 
                     evaluation.status === 'draft' ? 'Brouillon' : 'Partagé'}
                  </Badge>
                  <Badge className="bg-red-100 text-red-800">
                    #{evaluation.playerNumber} - {evaluation.playerPosition}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800">
                    {evaluation.playerTeam}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Skills Assessment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Évaluation des Compétences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(evaluation.skills).map((skill) => 
                      renderSkillComparison(skill as keyof typeof evaluation.skills)
                    )}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Forces Principales
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{evaluation.strengths}</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Points à Améliorer
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{evaluation.improvements}</p>
                  </div>
                </div>

                {/* Comments */}
                {evaluation.comments && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Commentaires Additionnels
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                      {evaluation.comments}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Recommandations
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Niveau Recommandé</p>
                      <p className="text-lg font-bold text-blue-900">
                        {getLevelLabel(evaluation.recommendedLevel)}
                      </p>
                    </div>

                    {evaluation.nextSteps && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Prochaines Étapes
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                          {evaluation.nextSteps}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
                <div className="flex justify-end">
                  <Button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}