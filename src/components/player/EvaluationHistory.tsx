"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Filter,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EvaluationHistoryProps {
  playerId: string;
}

const mockEvaluations = [
  // This Season Evaluations
  {
    id: "eval-1",
    campName: "Évaluation Saison Régulière",
    campDate: "2025-06-01",
    season: "This Season",
    type: "season",
    evaluatorCount: 4,
    criteria: [
      { name: "Patinage", score: 4.7, trend: "up" },
      { name: "Maniement", score: 4.5, trend: "up" },
      { name: "Tir", score: 4.2, trend: "up" },
      { name: "Vision du jeu", score: 4.8, trend: "up" },
      { name: "Physique", score: 4.3, trend: "stable" },
      { name: "Défense", score: 4.1, trend: "up" }
    ],
    overallScore: 4.4,
    comments: [
      "Performance exceptionnelle cette saison",
      "Leadership remarquable sur la glace",
      "Amélioration constante dans tous les aspects du jeu",
      "Candidat sérieux pour l'équipe elite"
    ]
  },
  {
    id: "eval-2", 
    campName: "Évaluation Mi-Saison",
    campDate: "2025-04-15",
    season: "This Season",
    type: "season",
    evaluatorCount: 3,
    criteria: [
      { name: "Patinage", score: 4.4, trend: "up" },
      { name: "Maniement", score: 4.2, trend: "stable" },
      { name: "Tir", score: 3.9, trend: "up" },
      { name: "Vision du jeu", score: 4.5, trend: "up" },
      { name: "Physique", score: 4.1, trend: "up" },
      { name: "Défense", score: 3.8, trend: "stable" }
    ],
    overallScore: 4.2,
    comments: [
      "Progression notable depuis le début de saison",
      "Excellent comportement en équipe",
      "Doit continuer à travailler le tir en puissance"
    ]
  },
  {
    id: "eval-3",
    campName: "Évaluation Début de Saison",
    campDate: "2025-02-10",
    season: "This Season", 
    type: "season",
    evaluatorCount: 3,
    criteria: [
      { name: "Patinage", score: 4.1, trend: "stable" },
      { name: "Maniement", score: 4.0, trend: "up" },
      { name: "Tir", score: 3.6, trend: "stable" },
      { name: "Vision du jeu", score: 4.2, trend: "up" },
      { name: "Physique", score: 3.9, trend: "up" },
      { name: "Défense", score: 3.7, trend: "up" }
    ],
    overallScore: 3.9,
    comments: [
      "Bon potentiel démontré",
      "S'adapte bien au niveau de jeu",
      "Recommandé pour suivi régulier"
    ]
  },
  // Previous Camp Evaluations
  {
    id: "eval-4",
    campName: "Camp M15 Excellence",
    campDate: "2025-03-10",
    season: "2024-25",
    type: "camp",
    evaluatorCount: 5,
    criteria: [
      { name: "Patinage", score: 4.5, trend: "up" },
      { name: "Maniement", score: 4.2, trend: "stable" },
      { name: "Tir", score: 3.8, trend: "up" },
      { name: "Vision du jeu", score: 4.6, trend: "up" },
      { name: "Physique", score: 4.0, trend: "down" }
    ],
    overallScore: 4.2,
    comments: [
      "Excellent travail d'équipe et leadership naturel",
      "Doit améliorer la précision du tir",
      "Très bonne progression depuis le dernier camp"
    ]
  },
  {
    id: "eval-5",
    campName: "Camp M15 Développement",
    campDate: "2025-01-15",
    season: "2024-25",
    type: "camp",
    evaluatorCount: 3,
    criteria: [
      { name: "Patinage", score: 4.2, trend: "stable" },
      { name: "Maniement", score: 4.1, trend: "up" },
      { name: "Tir", score: 3.5, trend: "stable" },
      { name: "Vision du jeu", score: 4.3, trend: "up" },
      { name: "Physique", score: 4.2, trend: "up" }
    ],
    overallScore: 4.1,
    comments: [
      "Bonne attitude et écoute des conseils",
      "Amélioration notable du jeu défensif"
    ]
  },
  {
    id: "eval-6",
    campName: "Camp M15 Technique",
    campDate: "2024-12-08",
    season: "2024-25",
    type: "camp",
    evaluatorCount: 4,
    criteria: [
      { name: "Patinage", score: 3.9, trend: "up" },
      { name: "Maniement", score: 3.8, trend: "stable" },
      { name: "Tir", score: 3.4, trend: "up" },
      { name: "Vision du jeu", score: 4.0, trend: "stable" },
      { name: "Physique", score: 3.8, trend: "up" }
    ],
    overallScore: 3.8,
    comments: [
      "Solides bases techniques",
      "Bon esprit compétitif",
      "Continue à progresser régulièrement"
    ]
  }
];

export function EvaluationHistory({ }: EvaluationHistoryProps) {
  const [selectedCamp, setSelectedCamp] = useState<string>("all");
  const [expandedEval, setExpandedEval] = useState<string | null>(null);

  const filteredEvaluations = mockEvaluations.filter(evaluation => {
    if (selectedCamp === "all") return true;
    if (selectedCamp === "this-season") return evaluation.season === "This Season";
    if (selectedCamp === "camps") return evaluation.type === "camp";
    if (selectedCamp === "m15") return evaluation.campName.includes("M15");
    if (selectedCamp === "m13") return evaluation.campName.includes("M13");
    return true;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Historique des évaluations</h2>
        <div className="flex gap-3">
          <Select value={selectedCamp} onValueChange={setSelectedCamp}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les camps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les évaluations</SelectItem>
              <SelectItem value="this-season">Cette saison</SelectItem>
              <SelectItem value="camps">Camps seulement</SelectItem>
              <SelectItem value="m15">M15 seulement</SelectItem>
              <SelectItem value="m13">M13 seulement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvaluations.map((evaluation, index) => (
          <motion.div
            key={evaluation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedEval(
                expandedEval === evaluation.id ? null : evaluation.id
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-900">{evaluation.campName}</h3>
                    {evaluation.season === "This Season" && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Cette saison
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Saison {evaluation.season}</span>
                    <span>•</span>
                    <span>{new Date(evaluation.campDate).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>{evaluation.evaluatorCount} évaluateurs</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{evaluation.overallScore}/5</div>
                  <div className="text-xs text-gray-500">Note globale</div>
                </div>
              </div>
            </div>

            {expandedEval === evaluation.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-200"
              >
                <div className="p-6 space-y-6">
                  {/* Criteria Scores */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Notes par critère</h4>
                    <div className="space-y-3">
                      {evaluation.criteria.map((criterion) => (
                        <div key={criterion.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 w-32">
                              {criterion.name}
                            </span>
                            {getTrendIcon(criterion.trend)}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-48 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full transition-all"
                                style={{ width: `${(criterion.score / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`font-medium ${getScoreColor(criterion.score)} w-12 text-right`}>
                              {criterion.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Commentaires des évaluateurs</h4>
                    <div className="space-y-2">
                      {evaluation.comments.map((comment, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline">
                      Télécharger PDF
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Voir le rapport détaillé
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white border border-gray-200 rounded-lg p-6"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Évolution des performances</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Graphique d&apos;évolution (à implémenter)</p>
        </div>
      </motion.div>
    </div>
  );
}