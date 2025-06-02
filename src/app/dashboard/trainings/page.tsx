"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  //Pause, 
  //Square, 
  //Plus, 
  //Settings, 
  //Users, 
  //Clock, 
  Target, 
  //Zap,
  //Shield,
  RotateCcw,
  //Save,
  //Download,
  //Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
//import { Badge } from "@/components/ui/badge";
//import { DynamicSelect } from "@/components/ui/dynamic-select";
import { HockeyRink } from "@/components/training/HockeyRink";
import { PlayerRoster } from "@/components/training/PlayerRoster";
import { DrillSelector } from "@/components/training/DrillSelector";
import { TrainingControls } from "@/components/training/TrainingControls";
import { TrainingTimer } from "@/components/training/TrainingTimer";

// Training drill types
export interface TrainingDrill {
  id: string;
  name: string;
  type: "skating" | "shooting" | "passing" | "defensive" | "powerplay" | "penalty_kill" | "scrimmage";
  duration: number; // in minutes
  description: string;
  minPlayers: number;
  maxPlayers: number;
  positions: {
    id: string;
    x: number; // percentage from left
    y: number; // percentage from top
    type: "player" | "cone" | "puck" | "goal";
    position?: string; // G, D, C, LW, RW
    required: boolean;
  }[];
  instructions: string[];
  icon: React.ElementType;
  color: string;
}

// Player interface for training
export interface TrainingPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  team: string;
  teamColor: string;
  energy: number; // 0-100
  currentX?: number;
  currentY?: number;
  assigned: boolean;
}

// Training session state
export interface TrainingSession {
  id: string;
  name: string;
  team: string;
  date: Date;
  duration: number;
  currentDrill?: TrainingDrill;
  playerPositions: Record<string, { x: number; y: number; positionId?: string }>;
  drillQueue: TrainingDrill[];
  isRunning: boolean;
  elapsedTime: number;
}

/**
 * Advanced Training Page
 * 
 * Features an interactive hockey rink where coaches can drag players
 * to different positions and set up various training drills.
 */
export default function TrainingsPage() {
  // Session state
  const [currentSession, setCurrentSession] = React.useState<TrainingSession>({
    id: "session-1",
    name: "Entraînement Titans U15 AAA",
    team: "Titans U15 AAA",
    date: new Date(),
    duration: 90, // 90 minutes
    playerPositions: {},
    drillQueue: [],
    isRunning: false,
    elapsedTime: 0
  });

  // UI state
  const [selectedDrill, setSelectedDrill] = React.useState<TrainingDrill | null>(null);
  const [availablePlayers, setAvailablePlayers] = React.useState<TrainingPlayer[]>([]);
  const [draggedPlayer, setDraggedPlayer] = React.useState<TrainingPlayer | null>(null);
  const [showDrillSelector, setShowDrillSelector] = React.useState(false);
  const [rinkDimensions, setRinkDimensions] = React.useState({ width: 800, height: 400 });
  const [isDemoMode, setIsDemoMode] = React.useState(false);
  const [demoStep, setDemoStep] = React.useState(0);

  // Load available players (mock data)
  React.useEffect(() => {
    const mockPlayers: TrainingPlayer[] = [
      { id: "p1", name: "Alex Bouchard", number: 91, position: "C", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 100, assigned: false },
      { id: "p2", name: "Emma Gagnon", number: 31, position: "G", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 95, assigned: false },
      { id: "p3", name: "Marc Tremblay", number: 24, position: "LW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 90, assigned: false },
      { id: "p4", name: "Sophie Lavoie", number: 7, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 85, assigned: false },
      { id: "p5", name: "Thomas Roy", number: 15, position: "RW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 100, assigned: false },
      { id: "p6", name: "Léa Dubois", number: 8, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 80, assigned: false },
      { id: "p7", name: "Gabriel Morin", number: 12, position: "C", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 95, assigned: false },
      { id: "p8", name: "Maya Boucher", number: 19, position: "LW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 90, assigned: false },
      { id: "p9", name: "Nathan Côté", number: 5, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 100, assigned: false },
      { id: "p10", name: "Camille Gagnon", number: 22, position: "RW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 85, assigned: false },
      { id: "p11", name: "Simon Pelletier", number: 3, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 90, assigned: false },
      { id: "p12", name: "Jade Fortin", number: 17, position: "C", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 95, assigned: false },
      { id: "p13", name: "Lucas Bergeron", number: 9, position: "LW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 100, assigned: false },
      { id: "p14", name: "Océane Girard", number: 11, position: "RW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 80, assigned: false },
      { id: "p15", name: "Benjamin Leblanc", number: 4, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 90, assigned: false },
      { id: "p16", name: "Clara Simard", number: 18, position: "LW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 85, assigned: false },
      { id: "p17", name: "Raphaël Caron", number: 6, position: "D", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 95, assigned: false },
      { id: "p18", name: "Amélie Poirier", number: 13, position: "RW", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 100, assigned: false },
      { id: "p19", name: "Antoine Dufour", number: 16, position: "C", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 90, assigned: false },
      { id: "p20", name: "Zoé Thibault", number: 20, position: "G", team: "Titans U15 AAA", teamColor: "bg-red-800", energy: 95, assigned: false },
    ];
    setAvailablePlayers(mockPlayers);
  }, []);

  // Handle player drag and drop
  const handlePlayerDrop = React.useCallback((playerId: string, x: number, y: number, positionId?: string) => {
    setCurrentSession(prev => ({
      ...prev,
      playerPositions: {
        ...prev.playerPositions,
        [playerId]: { x, y, positionId }
      }
    }));

    // Update player assignment status
    setAvailablePlayers(prev =>
      prev.map(player =>
        player.id === playerId
          ? { ...player, assigned: true, currentX: x, currentY: y }
          : player
      )
    );
  }, []);

  // Remove player from rink
  const handleRemovePlayer = React.useCallback((playerId: string) => {
    setCurrentSession(prev => ({
      ...prev,
      playerPositions: Object.fromEntries(
        Object.entries(prev.playerPositions).filter(([id]) => id !== playerId)
      )
    }));

    setAvailablePlayers(prev =>
      prev.map(player =>
        player.id === playerId
          ? { ...player, assigned: false, currentX: undefined, currentY: undefined }
          : player
      )
    );
  }, []);

  // Start drill
  const handleStartDrill = React.useCallback((drill: TrainingDrill) => {
    setCurrentSession(prev => ({
      ...prev,
      currentDrill: drill,
      isRunning: true,
      elapsedTime: 0
    }));
    setSelectedDrill(drill);
  }, []);

  // Stop training
  const handleStopTraining = React.useCallback(() => {
    setCurrentSession(prev => ({
      ...prev,
      isRunning: false,
      currentDrill: undefined
    }));
    setSelectedDrill(null);
  }, []);

  // Clear all players from rink
  const handleClearRink = React.useCallback(() => {
    setCurrentSession(prev => ({
      ...prev,
      playerPositions: {}
    }));
    setAvailablePlayers(prev =>
      prev.map(player => ({
        ...player,
        assigned: false,
        currentX: undefined,
        currentY: undefined
      }))
    );
  }, []);

  // Auto-position players for drill
  const handleAutoPosition = React.useCallback(() => {
    if (!selectedDrill) return;

    const availableUnassigned = availablePlayers.filter(p => !p.assigned);
    const newPositions: Record<string, { x: number; y: number; positionId?: string }> = {};
    
    selectedDrill.positions.forEach((pos, index) => {
      if (pos.type === "player" && availableUnassigned[index]) {
        const player = availableUnassigned[index];
        newPositions[player.id] = {
          x: pos.x,
          y: pos.y,
          positionId: pos.id
        };
      }
    });

    setCurrentSession(prev => ({
      ...prev,
      playerPositions: { ...prev.playerPositions, ...newPositions }
    }));

    // Update player assignments
    Object.keys(newPositions).forEach(playerId => {
      setAvailablePlayers(prev =>
        prev.map(player =>
          player.id === playerId
            ? { 
                ...player, 
                assigned: true, 
                currentX: newPositions[playerId].x,
                currentY: newPositions[playerId].y
              }
            : player
        )
      );
    });
  }, [selectedDrill, availablePlayers]);

  // Demo mode functionality
  const startDemo = React.useCallback(() => {
    setIsDemoMode(true);
    setDemoStep(0);
    
    // Select a drill for demo
    const demoDrill: TrainingDrill = {
      id: "demo-skating",
      name: "Démonstration - Exercice de Patinage",
      type: "skating",
      duration: 5,
      description: "Démonstration automatique d'un exercice de patinage",
      minPlayers: 6,
      maxPlayers: 8,
      positions: [
        { id: "demo-1", x: 20, y: 30, type: "player", position: "C", required: true },
        { id: "demo-2", x: 20, y: 50, type: "player", position: "LW", required: true },
        { id: "demo-3", x: 20, y: 70, type: "player", position: "RW", required: true },
        { id: "demo-4", x: 50, y: 40, type: "cone", required: true },
        { id: "demo-5", x: 50, y: 60, type: "cone", required: true },
        { id: "demo-6", x: 80, y: 50, type: "cone", required: true },
      ],
      instructions: [
        "Les joueurs partent de la ligne de but",
        "Contourner les cônes en slalom",
        "Terminer avec un tir au but"
      ],
      icon: RotateCcw,
      color: "bg-blue-100 text-blue-800"
    };
    
    setSelectedDrill(demoDrill);
    
    // Clear rink first
    handleClearRink();
    
    // Auto-position players with delay
    setTimeout(() => {
      const demoPlayers = availablePlayers.slice(0, 6);
      const newPositions: Record<string, { x: number; y: number; positionId?: string }> = {};
      
      demoDrill.positions.forEach((pos, index) => {
        if (pos.type === "player" && demoPlayers[index]) {
          newPositions[demoPlayers[index].id] = {
            x: pos.x,
            y: pos.y,
            positionId: pos.id
          };
        }
      });
      
      setCurrentSession(prev => ({
        ...prev,
        playerPositions: newPositions,
        currentDrill: demoDrill
      }));
      
      // Update player assignments
      setAvailablePlayers(prev =>
        prev.map((player, index) =>
          index < 6
            ? { ...player, assigned: true, currentX: demoDrill.positions[index].x, currentY: demoDrill.positions[index].y }
            : player
        )
      );
      
      // Start the drill after positioning
      setTimeout(() => {
        setCurrentSession(prev => ({
          ...prev,
          isRunning: true,
          elapsedTime: 0
        }));
        setDemoStep(1);
      }, 1500);
    }, 500);
  }, [availablePlayers, handleClearRink]);

  // Animate players during demo
  React.useEffect(() => {
    if (!isDemoMode || !currentSession.isRunning || demoStep === 0) return;

    const animationInterval = setInterval(() => {
      setCurrentSession(prev => ({
        ...prev,
        playerPositions: Object.fromEntries(
          Object.entries(prev.playerPositions).map(([playerId, pos]) => {
            const player = availablePlayers.find(p => p.id === playerId);
            if (!player) return [playerId, pos];

            // Move players along a path
            let newX = pos.x;
            let newY = pos.y;

            if (demoStep === 1) {
              // Move towards first cone
              newX = Math.min(pos.x + 2, 50);
            } else if (demoStep === 2) {
              // Move around cones
              newX = Math.min(pos.x + 1.5, 80);
              newY = pos.y + Math.sin((newX - 50) * 0.2) * 5;
            } else if (demoStep === 3) {
              // Move towards goal
              newX = Math.min(pos.x + 2, 90);
              newY = pos.y + (50 - pos.y) * 0.05;
            }

            return [playerId, { ...pos, x: newX, y: newY }];
          })
        )
      }));

      // Update demo step
      setDemoStep(prev => {
        if (prev === 1 && currentSession.playerPositions[Object.keys(currentSession.playerPositions)[0]]?.x >= 48) {
          return 2;
        } else if (prev === 2 && currentSession.playerPositions[Object.keys(currentSession.playerPositions)[0]]?.x >= 78) {
          return 3;
        } else if (prev === 3 && currentSession.playerPositions[Object.keys(currentSession.playerPositions)[0]]?.x >= 88) {
          // End demo
          setIsDemoMode(false);
          handleStopTraining();
          return 0;
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(animationInterval);
  }, [isDemoMode, demoStep, currentSession.isRunning, currentSession.playerPositions, availablePlayers, handleStopTraining]);

  const assignedPlayers = availablePlayers.filter(p => p.assigned);
  const unassignedPlayers = availablePlayers.filter(p => !p.assigned);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entraînements</h1>
          <p className="text-gray-600 mt-1">
            {currentSession.name} • {assignedPlayers.length} joueurs sur la glace
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <TrainingTimer
            isRunning={currentSession.isRunning}
            elapsedTime={currentSession.elapsedTime}
            totalDuration={selectedDrill?.duration || 0}
          />
          
          <Button
            variant="outline"
            onClick={() => setShowDrillSelector(true)}
            className="flex items-center space-x-2"
          >
            <Target className="h-4 w-4" />
            <span>Exercices</span>
          </Button>

          <Button
            onClick={startDemo}
            disabled={isDemoMode || currentSession.isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Démo</span>
          </Button>
        </div>
      </motion.div>

      {/* Training Controls */}
      <TrainingControls
        session={currentSession}
        selectedDrill={selectedDrill}
        onStartDrill={handleStartDrill}
        onStopTraining={handleStopTraining}
        onClearRink={handleClearRink}
        onAutoPosition={handleAutoPosition}
        assignedPlayersCount={assignedPlayers.length}
        isDemoMode={isDemoMode}
      />

      {/* Main Training Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-4 min-h-0">
        {/* Player Roster */}
        <div className="lg:col-span-2">
          <PlayerRoster
            players={unassignedPlayers}
            onPlayerDragStart={setDraggedPlayer}
            onPlayerDragEnd={() => setDraggedPlayer(null)}
          />
        </div>

        {/* Hockey Rink */}
        <div className="lg:col-span-5">
          <HockeyRink
            session={currentSession}
            selectedDrill={selectedDrill}
            players={availablePlayers}
            draggedPlayer={draggedPlayer}
            onPlayerDrop={handlePlayerDrop}
            onPlayerRemove={handleRemovePlayer}
            dimensions={rinkDimensions}
            onDimensionsChange={setRinkDimensions}
          />
        </div>
      </div>

      {/* Drill Selector Modal */}
      <DrillSelector
        isOpen={showDrillSelector}
        onClose={() => setShowDrillSelector(false)}
        onSelectDrill={(drill) => {
          setSelectedDrill(drill);
          setShowDrillSelector(false);
        }}
        currentDrill={selectedDrill}
      />
    </div>
  );
}