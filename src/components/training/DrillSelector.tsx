"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Target, 
  Zap, 
  Shield, 
  RotateCcw, 
  Users,
  Clock,
  Play,
  Search,
  //Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import type { TrainingDrill } from "@/app/dashboard/trainings/page";


interface DrillSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDrill: (drill: TrainingDrill) => void;
  currentDrill?: TrainingDrill | null;
}

// Comprehensive drill database
const drillDatabase: TrainingDrill[] = [
  {
    id: "skating-1",
    name: "Tour de Patinoire",
    type: "skating",
    duration: 10,
    description: "Échauffement de base avec tour de patinoire en patinage avant et arrière",
    minPlayers: 6,
    maxPlayers: 20,
    positions: [
      { id: "start-1", x: 10, y: 50, type: "player", required: false },
      { id: "start-2", x: 15, y: 50, type: "player", required: false },
      { id: "start-3", x: 20, y: 50, type: "player", required: false },
      { id: "cone-1", x: 25, y: 25, type: "cone", required: true },
      { id: "cone-2", x: 75, y: 25, type: "cone", required: true },
      { id: "cone-3", x: 75, y: 75, type: "cone", required: true },
      { id: "cone-4", x: 25, y: 75, type: "cone", required: true },
    ],
    instructions: [
      "Alignez les joueurs sur la ligne de but",
      "Premier tour: patinage avant uniquement",
      "Deuxième tour: alternance avant/arrière aux cônes",
      "Maintenir un rythme constant"
    ],
    icon: RotateCcw,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: "shooting-1",
    name: "Tir de Précision",
    type: "shooting",
    duration: 15,
    description: "Exercice de tir sur cibles spécifiques pour améliorer la précision",
    minPlayers: 8,
    maxPlayers: 16,
    positions: [
      { id: "shooter-1", x: 40, y: 60, type: "player", position: "C", required: true },
      { id: "shooter-2", x: 40, y: 70, type: "player", position: "LW", required: true },
      { id: "shooter-3", x: 40, y: 80, type: "player", position: "RW", required: true },
      { id: "puck-1", x: 45, y: 60, type: "puck", required: true },
      { id: "puck-2", x: 45, y: 70, type: "puck", required: true },
      { id: "puck-3", x: 45, y: 80, type: "puck", required: true },
      { id: "target-1", x: 90, y: 45, type: "goal", required: true },
      { id: "target-2", x: 90, y: 55, type: "goal", required: true },
    ],
    instructions: [
      "Positionnez les rondelles devant chaque tireur",
      "Visez les coins supérieurs du filet",
      "Rotation après chaque tir",
      "Récupérez les rondelles pour le prochain groupe"
    ],
    icon: Target,
    color: "bg-green-100 text-green-800"
  },
  {
    id: "powerplay-1",
    name: "Avantage Numérique 5v4",
    type: "powerplay",
    duration: 20,
    description: "Formation et circulation en avantage numérique",
    minPlayers: 9,
    maxPlayers: 12,
    positions: [
      { id: "pp-c", x: 70, y: 50, type: "player", position: "C", required: true },
      { id: "pp-lw", x: 60, y: 40, type: "player", position: "LW", required: true },
      { id: "pp-rw", x: 60, y: 60, type: "player", position: "RW", required: true },
      { id: "pp-d1", x: 50, y: 35, type: "player", position: "D", required: true },
      { id: "pp-d2", x: 50, y: 65, type: "player", position: "D", required: true },
      { id: "pk-d1", x: 80, y: 45, type: "player", position: "D", required: true },
      { id: "pk-d2", x: 80, y: 55, type: "player", position: "D", required: true },
      { id: "pk-c", x: 75, y: 50, type: "player", position: "C", required: true },
      { id: "pk-lw", x: 65, y: 35, type: "player", position: "LW", required: true },
      { id: "goal-pp", x: 95, y: 50, type: "goal", required: true },
    ],
    instructions: [
      "Formation umbrella classique",
      "Circulation de la rondelle en triangle",
      "Rechercher l'ouverture pour tirer",
      "Défenseurs inférieurs: options de passes"
    ],
    icon: Zap,
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    id: "defensive-1",
    name: "Couverture Défensive",
    type: "defensive",
    duration: 15,
    description: "Techniques de positionnement défensif et vérifications corporelles",
    minPlayers: 10,
    maxPlayers: 16,
    positions: [
      { id: "def-d1", x: 30, y: 40, type: "player", position: "D", required: true },
      { id: "def-d2", x: 30, y: 60, type: "player", position: "D", required: true },
      { id: "def-c", x: 25, y: 50, type: "player", position: "C", required: true },
      { id: "att-c", x: 45, y: 50, type: "player", position: "C", required: true },
      { id: "att-lw", x: 40, y: 40, type: "player", position: "LW", required: true },
      { id: "att-rw", x: 40, y: 60, type: "player", position: "RW", required: true },
      { id: "cone-1", x: 35, y: 30, type: "cone", required: true },
      { id: "cone-2", x: 35, y: 70, type: "cone", required: true },
    ],
    instructions: [
      "Défenseurs: restez entre l'attaquant et le but",
      "Communication constante entre partenaires",
      "Forcer l'attaquant vers l'extérieur",
      "Timing pour les mises en échec"
    ],
    icon: Shield,
    color: "bg-red-100 text-red-800"
  },
  {
    id: "passing-1",
    name: "Passes en Triangle",
    type: "passing",
    duration: 12,
    description: "Exercice de passes courtes et longues en formation triangulaire",
    minPlayers: 9,
    maxPlayers: 15,
    positions: [
      { id: "pass-1", x: 30, y: 30, type: "player", required: true },
      { id: "pass-2", x: 50, y: 50, type: "player", required: true },
      { id: "pass-3", x: 30, y: 70, type: "player", required: true },
      { id: "pass-4", x: 70, y: 30, type: "player", required: true },
      { id: "pass-5", x: 70, y: 70, type: "player", required: true },
      { id: "cone-t1", x: 30, y: 50, type: "cone", required: true },
      { id: "cone-t2", x: 50, y: 30, type: "cone", required: true },
      { id: "cone-t3", x: 50, y: 70, type: "cone", required: true },
    ],
    instructions: [
      "Passes précises sur la palette",
      "Réception en mouvement",
      "Rotation dans le sens horaire",
      "Augmenter progressivement la vitesse"
    ],
    icon: Users,
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: "scrimmage-1", 
    name: "Match Simulé 3v3",
    type: "scrimmage",
    duration: 25,
    description: "Petit match pour appliquer les techniques dans un contexte de jeu",
    minPlayers: 8,
    maxPlayers: 12,
    positions: [
      { id: "team1-c", x: 35, y: 50, type: "player", position: "C", required: true },
      { id: "team1-lw", x: 30, y: 40, type: "player", position: "LW", required: true },
      { id: "team1-rw", x: 30, y: 60, type: "player", position: "RW", required: true },
      { id: "team1-g", x: 5, y: 50, type: "player", position: "G", required: true },
      { id: "team2-c", x: 65, y: 50, type: "player", position: "C", required: true },
      { id: "team2-lw", x: 70, y: 40, type: "player", position: "LW", required: true },
      { id: "team2-rw", x: 70, y: 60, type: "player", position: "RW", required: true },
      { id: "team2-g", x: 95, y: 50, type: "player", position: "G", required: true },
    ],
    instructions: [
      "Équipes de 3 joueurs + gardien",
      "Mise en application des techniques",
      "Rotation toutes les 3 minutes",
      "Focus sur le jeu de position"
    ],
    icon: Users,
    color: "bg-orange-100 text-orange-800"
  }
];

export function DrillSelector({ isOpen, onClose, onSelectDrill, currentDrill }: DrillSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const [filteredDrills, setFilteredDrills] = React.useState(drillDatabase);

  // Filter drills
  React.useEffect(() => {
    let filtered = drillDatabase;

    if (searchTerm) {
      filtered = filtered.filter(drill =>
        drill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drill.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(drill => drill.type === selectedType);
    }

    setFilteredDrills(filtered);
  }, [searchTerm, selectedType]);

  const drillTypes = [
    { value: "skating", label: "Patinage" },
    { value: "shooting", label: "Tir" },
    { value: "passing", label: "Passes" },
    { value: "defensive", label: "Défensif" },
    { value: "powerplay", label: "Avantage Numérique" },
    { value: "penalty_kill", label: "Infériorité" },
    { value: "scrimmage", label: "Match Simulé" }
  ];

  const handleDrillSelect = (drill: TrainingDrill) => {
    onSelectDrill(drill);
    onClose();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("");
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
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Sélectionner un Exercice
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Filtres</h3>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Effacer
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <DynamicInput
                      type="text"
                      placeholder="Rechercher un exercice..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <DynamicSelect
                    placeholder="Type d'exercice"
                    value={selectedType}
                    onValueChange={setSelectedType}
                    options={drillTypes}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  {filteredDrills.length} exercice{filteredDrills.length !== 1 ? 's' : ''} trouvé{filteredDrills.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Drill List */}
              <div className="flex-1 overflow-y-auto p-6 max-h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDrills.map((drill) => {
                    const IconComponent = drill.icon;
                    const isSelected = currentDrill?.id === drill.id;
                    
                    return (
                      <motion.div
                        key={drill.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleDrillSelect(drill)}
                      >
                        {/* Drill Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${drill.color}`}>
                              {IconComponent && <IconComponent className="w-5 h-5" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{drill.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {drillTypes.find(t => t.value === drill.type)?.label}
                              </Badge>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Actuel
                            </Badge>
                          )}
                        </div>

                        {/* Drill Info */}
                        <p className="text-sm text-gray-600 mb-3">
                          {drill.description}
                        </p>

                        {/* Drill Details */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{drill.duration} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{drill.minPlayers}-{drill.maxPlayers}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDrillSelect(drill);
                            }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Démarrer
                          </Button>
                        </div>

                        {/* Instructions Preview */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 font-medium mb-1">Instructions:</p>
                          <div className="text-xs text-gray-600 space-y-1">
                            {drill.instructions.slice(0, 2).map((instruction, index) => (
                              <p key={index}>• {instruction}</p>
                            ))}
                            {drill.instructions.length > 2 && (
                              <p className="text-blue-600">+ {drill.instructions.length - 2} autres...</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {filteredDrills.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun exercice trouvé
                    </h3>
                    <p className="text-gray-600">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}