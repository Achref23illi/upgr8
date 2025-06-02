"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Star,
  TrendingUp,
  FileText,
  //Award,
  //Target,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { AddEvaluationModal } from "@/components/evaluations/AddEvaluationModal";
import { EvaluationDetailsModal } from "@/components/evaluations/EvaluationDetailsModal";

// Evaluation interface
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

// Mock players data for the form
const mockPlayers = [
  { id: "p1", name: "Alex Tremblay", team: "Titans U15 AAA" },
  { id: "p2", name: "Emma Gagnon", team: "Lions Novice A" },
  { id: "p3", name: "Maxime Roy", team: "Eagles Midget Elite" },
  { id: "p4", name: "Sophie Bouchard", team: "Wolves Bantam AA" },
  { id: "p5", name: "Lucas Gauthier", team: "Panthers Pee-Wee A" },
  { id: "p6", name: "Camille Morin", team: "Sharks Atome BB" },
  { id: "p7", name: "Nathan Lavoie", team: "Titans U15 AAA" },
  { id: "p8", name: "Léa Fortin", team: "Lions Novice A" }
];

// Generate mock evaluations - using deterministic values to avoid hydration errors
const generateMockEvaluations = (): Evaluation[] => {
  const evaluations: Evaluation[] = [];
  const evaluators = ["Marc Leclerc", "Julie Bergeron", "Pierre Dubois", "Marie Tremblay"];
  const types = ["seasonal", "tryout", "progress", "special"];
  const categories = ["U7", "U9", "U11", "U13", "U15", "U18", "Junior", "Senior"];
  const levels = ["recreational", "c", "cc", "b", "bb", "a", "aa", "aaa", "elite"];
  const positions = ["G", "D", "C", "LW", "RW"];
  const statuses: ("draft" | "completed" | "shared")[] = ["draft", "completed", "shared"];

  // Use deterministic values based on index
  for (let i = 0; i < 50; i++) {
    const player = mockPlayers[i % mockPlayers.length];
    const evaluationType = types[i % types.length];
    const hasPrevious = i % 3 === 0;
    
    const generateSkills = (seed: number) => ({
      skating: 5 + (seed % 5),
      shooting: 5 + ((seed + 1) % 5),
      passing: 5 + ((seed + 2) % 5),
      stickHandling: 5 + ((seed + 3) % 5),
      positioning: 5 + ((seed + 4) % 5),
      hockey_iq: 5 + ((seed + 5) % 5),
      compete: 5 + ((seed + 6) % 5),
      physicality: 5 + ((seed + 7) % 5)
    });

    const currentSkills = generateSkills(i);
    const previousSkills = hasPrevious ? generateSkills(i + 10) : undefined;

    const currentRating = Math.round(
      Object.values(currentSkills).reduce((a, b) => a + b, 0) / 
      Object.keys(currentSkills).length * 10
    ) / 10;

    const previousRating = previousSkills ? Math.round(
      Object.values(previousSkills).reduce((a, b) => a + b, 0) / 
      Object.keys(previousSkills).length * 10
    ) / 10 : undefined;

    evaluations.push({
      id: `eval-${i}`,
      playerName: player.name,
      playerId: player.id,
      playerTeam: player.team,
      playerNumber: 1 + (i % 99),
      playerPosition: positions[i % positions.length],
      evaluatorName: evaluators[i % evaluators.length],
      evaluationDate: `2024-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      evaluationType,
      category: categories[i % categories.length],
      overallRating: currentRating,
      previousRating,
      skills: currentSkills,
      previousSkills,
      strengths: "Excellent patinage et vision du jeu. Très bon sens du positionnement défensif.",
      improvements: "Travailler sur la précision des tirs et la force physique.",
      comments: "Joueur prometteur avec une excellente éthique de travail.",
      recommendedLevel: levels[i % levels.length],
      nextSteps: "Continuer à développer les habiletés offensives. Programme de musculation recommandé.",
      status: statuses[i % statuses.length]
    });
  }

  return evaluations.sort((a, b) => 
    new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime()
  );
};

const getTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    seasonal: "Saisonnière",
    tryout: "Essai",
    progress: "Progrès",
    special: "Spéciale"
  };
  return types[type] || type;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "seasonal": return "bg-blue-100 text-blue-800";
    case "tryout": return "bg-purple-100 text-purple-800";
    case "progress": return "bg-green-100 text-green-800";
    case "special": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return CheckCircle;
    case "draft": return Clock;
    case "shared": return FileText;
    default: return AlertCircle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "text-green-600";
    case "draft": return "text-gray-600";
    case "shared": return "text-blue-600";
    default: return "text-gray-600";
  }
};

/**
 * Evaluations Page
 * 
 * Displays all evaluations with filtering and ability to add new evaluations.
 */
export default function EvaluationsPage() {
  const [allEvaluations] = React.useState<Evaluation[]>(generateMockEvaluations());
  const [filteredEvaluations, setFilteredEvaluations] = React.useState<Evaluation[]>(allEvaluations);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = React.useState<Evaluation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");
  const [dateRange, setDateRange] = React.useState("all");

  // Get unique values for filters
  const types = [
    { value: "seasonal", label: "Saisonnière" },
    { value: "tryout", label: "Essai" },
    { value: "progress", label: "Progrès" },
    { value: "special", label: "Spéciale" }
  ];
  
  const categories = ["U7", "U9", "U11", "U13", "U15", "U18", "Junior", "Senior"];
  const statuses = [
    { value: "draft", label: "Brouillon" },
    { value: "completed", label: "Complété" },
    { value: "shared", label: "Partagé" }
  ];

  const dateRanges = [
    { value: "all", label: "Toutes les dates" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "quarter", label: "Ce trimestre" },
    { value: "year", label: "Cette année" }
  ];

  // Apply filters
  React.useEffect(() => {
    let filtered = allEvaluations;

    if (searchTerm) {
      filtered = filtered.filter(evaluation => 
        evaluation.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.playerTeam.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(evaluation => evaluation.evaluationType === selectedType);
    }

    if (selectedCategory) {
      filtered = filtered.filter(evaluation => evaluation.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(evaluation => evaluation.status === selectedStatus);
    }

    if (dateRange !== "all") {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(evaluation => 
        new Date(evaluation.evaluationDate) >= startDate
      );
    }

    setFilteredEvaluations(filtered);
  }, [searchTerm, selectedType, selectedCategory, selectedStatus, dateRange, allEvaluations]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleEvaluationClick = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsDetailsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedCategory("");
    setSelectedStatus("");
    setDateRange("all");
  };

  // Calculate statistics
  const stats = {
    total: allEvaluations.length,
    completed: allEvaluations.filter(e => e.status === "completed").length,
    draft: allEvaluations.filter(e => e.status === "draft").length,
    shared: allEvaluations.filter(e => e.status === "shared").length,
    avgRating: allEvaluations.reduce((sum, e) => sum + e.overallRating, 0) / allEvaluations.length || 0,
    improving: allEvaluations.filter(e => 
      e.previousRating && e.overallRating > e.previousRating
    ).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Évaluations</h1>
          <p className="text-gray-600 mt-2">
            Évaluez les performances et suivez les progrès des joueurs
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Évaluation
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClipboardCheck className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Complétées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Partagées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shared}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Note Moy.</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En Progrès</p>
              <p className="text-2xl font-bold text-gray-900">{stats.improving}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtres
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600"
          >
            Effacer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <DynamicInput
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DynamicSelect
            placeholder="Type"
            value={selectedType}
            onValueChange={setSelectedType}
            options={types}
          />

          <DynamicSelect
            placeholder="Catégorie"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />

          <DynamicSelect
            placeholder="Statut"
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            options={statuses}
          />

          <DynamicSelect
            placeholder="Période"
            value={dateRange}
            onValueChange={setDateRange}
            options={dateRanges}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredEvaluations.length} évaluation{filteredEvaluations.length !== 1 ? 's' : ''} trouvée{filteredEvaluations.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Evaluations List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredEvaluations.map((evaluation) => {
          const StatusIcon = getStatusIcon(evaluation.status);
          const ratingChange = evaluation.previousRating ? 
            evaluation.overallRating - evaluation.previousRating : 0;
          
          return (
            <motion.div
              key={evaluation.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleEvaluationClick(evaluation)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-red-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {evaluation.playerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {evaluation.playerTeam} • #{evaluation.playerNumber} {evaluation.playerPosition}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`h-5 w-5 ${getStatusColor(evaluation.status)}`} />
                    <Badge className={getTypeColor(evaluation.evaluationType)}>
                      {getTypeLabel(evaluation.evaluationType)}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      {evaluation.category}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {new Date(evaluation.evaluationDate).toLocaleDateString('fr-CA')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Évaluateur</p>
                    <p className="font-semibold">{evaluation.evaluatorName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Note Globale</p>
                    <div className="flex items-center space-x-2">
                      <Star className={`h-4 w-4 ${
                        evaluation.overallRating >= 8 ? 'text-yellow-500' : 
                        evaluation.overallRating >= 6 ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                      <span className="font-semibold">{evaluation.overallRating}/10</span>
                      {ratingChange !== 0 && (
                        <span className={`text-sm ${
                          ratingChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({ratingChange > 0 ? '+' : ''}{ratingChange.toFixed(1)})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Niveau Recommandé</p>
                    <p className="font-semibold uppercase">{evaluation.recommendedLevel}</p>
                  </div>
                </div>

                {evaluation.strengths && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-semibold">Forces:</span> {evaluation.strengths}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredEvaluations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <ClipboardCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune évaluation trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos filtres ou créez une nouvelle évaluation.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Évaluation
          </Button>
        </motion.div>
      )}

      {/* Add Evaluation Modal */}
      <AddEvaluationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEvaluation={(evaluation) => {
          // Handle adding evaluation logic here
          console.log("Adding evaluation:", evaluation);
          setIsAddModalOpen(false);
        }}
        players={mockPlayers}
      />

      {/* Evaluation Details Modal */}
      {selectedEvaluation && (
        <EvaluationDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedEvaluation(null);
          }}
          evaluation={selectedEvaluation}
        />
      )}
    </div>
  );
}