"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Square,
  Target, 
  ChevronRight,
  FileText,
  BarChart3,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Training drill types
export interface TrainingDrill {
  id: string;
  name: string;
  type: "skating" | "shooting" | "passing" | "defensive" | "powerplay" | "scrimmage";
  duration: number;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  instructions: string[];
  positions?: DrillPosition[];
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

// Position interface pour les exercices
export interface DrillPosition {
  id: string;
  x: number;
  y: number;
  type: "player" | "cone" | "puck" | "goal";
  position?: string;
  required: boolean;
}

// Player interface for training
export interface TrainingPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  present: boolean;
}

// Training session state
export interface TrainingSession {
  id: string;
  name: string;
  date: Date;
  duration: number;
  currentDrill?: TrainingDrill;
  isRunning: boolean;
  elapsedTime: number;
  completedDrills: string[];
  notes: string;
}

// Historique des exercices
interface DrillHistory {
  id: string;
  drillName: string;
  completedAt: Date;
  duration: number;
  participantCount: number;
}

// Mock drills data
const mockDrills: TrainingDrill[] = [
  {
    id: "drill-1",
    name: "Échauffement général",
    type: "skating",
    duration: 10,
    description: "Tour de patinoire avec étirements",
    minPlayers: 6,
    maxPlayers: 20,
    instructions: ["Patinage léger", "Étirements dynamiques", "Passes simples"]
  },
  {
    id: "drill-2", 
    name: "Tir au but",
    type: "shooting",
    duration: 15,
    description: "Exercice de précision au tir",
    minPlayers: 8,
    maxPlayers: 16,
    instructions: ["Positionnement", "Technique de tir", "Suivi de la rondelle"]
  },
  {
    id: "drill-3",
    name: "Jeu de puissance",
    type: "powerplay", 
    duration: 20,
    description: "Formation 5v4 offensive",
    minPlayers: 9,
    maxPlayers: 12,
    instructions: ["Formation umbrella", "Circulation rapide", "Recherche d'ouvertures"]
  },
  {
    id: "drill-4",
    name: "Passes croisées",
    type: "passing",
    duration: 12,
    description: "Exercice de passes en mouvement",
    minPlayers: 6,
    maxPlayers: 14,
    instructions: ["Formation en triangle", "Passes précises", "Déplacement constant"]
  },
  {
    id: "drill-5",
    name: "Défense en zone",
    type: "defensive",
    duration: 18,
    description: "Positionnement défensif",
    minPlayers: 8,
    maxPlayers: 12,
    instructions: ["Couverture de zone", "Communication", "Transitions rapides"]
  },
  {
    id: "drill-6",
    name: "Match 3v3",
    type: "scrimmage",
    duration: 25,
    description: "Petit match d'application",
    minPlayers: 6,
    maxPlayers: 12,
    instructions: ["Jeu libre", "Application des techniques", "Fair-play"]
  }
];

export default function TrainingsPage() {
  const [currentSession, setCurrentSession] = React.useState<TrainingSession>({
    id: "session-1",
    name: "Entraînement U15 AAA",
    date: new Date(),
    duration: 90,
    isRunning: false,
    elapsedTime: 0,
    completedDrills: [],
    notes: ""
  });

  const [availablePlayers] = React.useState<TrainingPlayer[]>([
    { id: "p1", name: "Emma Gagnon", number: 31, position: "G", present: true },
    { id: "p2", name: "Marc Tremblay", number: 24, position: "LW", present: true },
    { id: "p3", name: "Sophie Lavoie", number: 7, position: "D", present: true },
    { id: "p4", name: "Thomas Roy", number: 15, position: "RW", present: false },
    { id: "p5", name: "Gabriel Morin", number: 12, position: "C", present: true },
    { id: "p6", name: "Maya Boucher", number: 19, position: "LW", present: true },
    { id: "p7", name: "Nathan Côté", number: 5, position: "D", present: true },
    { id: "p8", name: "Camille Gagnon", number: 22, position: "RW", present: true },
    { id: "p9", name: "Simon Pelletier", number: 3, position: "D", present: false },
    { id: "p10", name: "Jade Fortin", number: 17, position: "C", present: true }
  ]);

  const [selectedDrill, setSelectedDrill] = React.useState<TrainingDrill | null>(null);
  const [drillHistory, setDrillHistory] = React.useState<DrillHistory[]>([]);
  const [showNotes, setShowNotes] = React.useState(false);

  // Timer en temps réel
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession.isRunning) {
      interval = setInterval(() => {
        setCurrentSession(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession.isRunning]);

  const presentPlayers = availablePlayers.filter(p => p.present);
  const absentPlayers = availablePlayers.filter(p => !p.present);

  const handleStartDrill = (drill: TrainingDrill) => {
    setCurrentSession(prev => ({
      ...prev,
      currentDrill: drill,
      isRunning: true,
      elapsedTime: 0
    }));
    setSelectedDrill(drill);
  };

  const handleStopTraining = () => {
    if (currentSession.currentDrill) {
      // Ajouter à l'historique
      const newHistory: DrillHistory = {
        id: Date.now().toString(),
        drillName: currentSession.currentDrill.name,
        completedAt: new Date(),
        duration: currentSession.elapsedTime,
        participantCount: presentPlayers.length
      };
      setDrillHistory(prev => [...prev, newHistory]);
      
      // Marquer comme complété
      setCurrentSession(prev => ({
        ...prev,
        completedDrills: [...prev.completedDrills, currentSession.currentDrill!.id]
      }));
    }

    setCurrentSession(prev => ({
      ...prev,
      isRunning: false,
      currentDrill: undefined
    }));
    setSelectedDrill(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: TrainingDrill['type']) => {
    switch (type) {
      case 'skating': return 'bg-blue-100 text-blue-800';
      case 'shooting': return 'bg-red-100 text-red-800';
      case 'passing': return 'bg-green-100 text-green-800';
      case 'defensive': return 'bg-orange-100 text-orange-800';
      case 'powerplay': return 'bg-purple-100 text-purple-800';
      case 'scrimmage': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sessionStats = {
    totalTime: Math.floor(drillHistory.reduce((acc, drill) => acc + drill.duration, 0) / 60),
    completedDrills: drillHistory.length,
    averageParticipation: drillHistory.length > 0 
      ? Math.round(drillHistory.reduce((acc, drill) => acc + drill.participantCount, 0) / drillHistory.length)
      : 0
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header compact avec statistiques */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentSession.name}</h1>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-CA', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{formatTime(currentSession.elapsedTime)}</div>
              <div className="text-sm text-gray-500">Temps actuel</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{sessionStats.completedDrills}</div>
              <div className="text-sm text-gray-500">Exercices</div>
            </div>
            
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{presentPlayers.length}</div>
              <div className="text-sm text-gray-500">Présents</div>
            </div>
            
            <Badge variant={currentSession.isRunning ? "default" : "secondary"} className="text-sm px-3 py-1">
              {currentSession.isRunning ? "En cours" : "Arrêté"}
            </Badge>
          </div>
        </div>
        
        {currentSession.currentDrill && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-center">
            <span className="text-base font-medium text-red-800">
              Exercice actuel: {currentSession.currentDrill.name}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Exercices disponibles - plus large */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">Exercices disponibles</h3>
          </div>
          <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
            {mockDrills.map((drill) => (
              <motion.div
                key={drill.id}
                onClick={() => setSelectedDrill(drill)}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedDrill?.id === drill.id 
                    ? 'border-red-200 bg-red-50' 
                    : currentSession.completedDrills.includes(drill.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-medium text-gray-900 truncate">{drill.name}</h4>
                      {currentSession.completedDrills.includes(drill.id) && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-1">
                      <Badge className={`${getTypeColor(drill.type)} text-sm py-1`}>
                        {drill.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{drill.duration} min</span>
                      <span className="text-sm text-gray-500">{drill.minPlayers}-{drill.maxPlayers} joueurs</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Détails exercice actuel */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">Détails</h3>
          </div>
          <div className="p-4">
            {selectedDrill ? (
              <div className="space-y-3">
                <div>
                  <h4 className="text-base font-medium text-gray-900">{selectedDrill.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedDrill.description}</p>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h5>
                  <ul className="space-y-1">
                    {selectedDrill.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-3">
                  {currentSession.isRunning ? (
                    <Button 
                      onClick={handleStopTraining}
                      size="sm" 
                      variant="outline"
                      className="h-8 text-sm flex-1"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Arrêter
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleStartDrill(selectedDrill)}
                      size="sm"
                      className="h-8 text-sm bg-red-600 hover:bg-red-700 flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Démarrer
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sélectionnez un exercice</p>
              </div>
            )}
          </div>
        </div>

        {/* Joueurs présents */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Présents</h3>
              <Badge variant="outline" className="text-sm">{presentPlayers.length}</Badge>
            </div>
          </div>
          <div className="p-3 space-y-1 max-h-80 overflow-y-auto">
            {presentPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {player.number}
                  </div>
                  <span className="text-sm text-gray-900">{player.name}</span>
                </div>
                <Badge variant="outline" className="text-sm px-2 py-1">{player.position}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Historique et notes */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Historique</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotes(!showNotes)}
                className="h-7 text-sm px-3"
              >
                <FileText className="w-4 h-4 mr-1" />
                {showNotes ? 'Historique' : 'Notes'}
              </Button>
            </div>
          </div>
          <div className="p-3">
            {showNotes ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Notes:</label>
                <textarea
                  value={currentSession.notes}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observations, points à améliorer..."
                  className="w-full h-28 text-sm p-3 border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {drillHistory.length > 0 ? (
                  drillHistory.map((drill) => (
                    <div key={drill.id} className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{drill.drillName}</div>
                          <div className="text-sm text-gray-500">
                            {drill.completedAt.toLocaleTimeString('fr-CA', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} • {Math.floor(drill.duration / 60)} min
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{drill.participantCount}j</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BarChart3 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Aucun exercice</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Joueurs absents - compact */}
      {absentPlayers.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Joueurs absents</h3>
              <Badge variant="outline" className="text-sm text-red-600">{absentPlayers.length}</Badge>
            </div>
          </div>
          <div className="p-3">
            <div className="flex flex-wrap gap-2">
              {absentPlayers.map((player) => (
                <div key={player.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded text-sm">
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {player.number}
                  </div>
                  <span className="text-gray-700">{player.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}