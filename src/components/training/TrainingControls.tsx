"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  //Pause, 
  Square, 
  RotateCcw, 
  Users2, 
  Target,
  Save,
  Download,
  //Upload,
  //Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TrainingSession, TrainingDrill } from "@/app/dashboard/trainings/page";

interface TrainingControlsProps {
  session: TrainingSession;
  selectedDrill?: TrainingDrill | null;
  onStartDrill: (drill: TrainingDrill) => void;
  onStopTraining: () => void;
  onClearRink: () => void;
  onAutoPosition: () => void;
  assignedPlayersCount: number;
  isDemoMode?: boolean;
}

export function TrainingControls({
  session,
  selectedDrill,
  onStartDrill,
  onStopTraining,
  onClearRink,
  onAutoPosition,
  assignedPlayersCount,
  isDemoMode = false
}: TrainingControlsProps) {
  
  const canStartDrill = selectedDrill && 
    assignedPlayersCount >= selectedDrill.minPlayers && 
    assignedPlayersCount <= selectedDrill.maxPlayers;

  const canAutoPosition = selectedDrill && !session.isRunning;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-lg shadow border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Session Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {isDemoMode ? "Mode Démonstration" : session.isRunning ? "Entraînement en cours" : "Entraînement arrêté"}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              {isDemoMode && (
                <Badge className="bg-purple-100 text-purple-800 animate-pulse">
                  Démo en cours
                </Badge>
              )}
              {selectedDrill ? (
                <Badge className="bg-blue-100 text-blue-800">
                  {selectedDrill.name}
                </Badge>
              ) : (
                <span className="text-sm text-gray-500">Aucun exercice sélectionné</span>
              )}
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">
                {assignedPlayersCount} joueurs sur la glace
              </span>
            </div>
          </div>

          {/* Session Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              session.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className={`text-sm font-medium ${
              session.isRunning ? 'text-green-600' : 'text-gray-500'
            }`}>
              {session.isRunning ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-3">
          {/* Player Management */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearRink}
              disabled={assignedPlayersCount === 0 || session.isRunning}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Vider</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onAutoPosition}
              disabled={!canAutoPosition}
              className="flex items-center space-x-2"
            >
              <Users2 className="w-4 h-4" />
              <span>Auto-Position</span>
            </Button>
          </div>

          {/* Drill Controls */}
          <div className="flex items-center space-x-2">
            {!session.isRunning ? (
              <Button
                onClick={() => selectedDrill && onStartDrill(selectedDrill)}
                disabled={!canStartDrill}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Démarrer</span>
              </Button>
            ) : (
              <Button
                onClick={onStopTraining}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Square className="w-4 h-4" />
                <span>Arrêter</span>
              </Button>
            )}
          </div>

          {/* Session Actions */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Drill Requirements Warning */}
      {selectedDrill && !canStartDrill && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <strong>{selectedDrill.name}</strong> nécessite entre{" "}
              <strong>{selectedDrill.minPlayers}</strong> et{" "}
              <strong>{selectedDrill.maxPlayers}</strong> joueurs.{" "}
              Actuellement: <strong>{assignedPlayersCount}</strong> joueurs sur la glace.
            </p>
          </div>
          {assignedPlayersCount < selectedDrill.minPlayers && (
            <p className="text-xs text-yellow-700 mt-1">
              Ajoutez {selectedDrill.minPlayers - assignedPlayersCount} joueur{selectedDrill.minPlayers - assignedPlayersCount > 1 ? 's' : ''} de plus.
            </p>
          )}
          {assignedPlayersCount > selectedDrill.maxPlayers && (
            <p className="text-xs text-yellow-700 mt-1">
              Retirez {assignedPlayersCount - selectedDrill.maxPlayers} joueur{assignedPlayersCount - selectedDrill.maxPlayers > 1 ? 's' : ''}.
            </p>
          )}
        </motion.div>
      )}

      {/* Drill Instructions */}
      {selectedDrill && session.isRunning && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Instructions - {selectedDrill.name}
          </h4>
          <div className="space-y-1">
            {selectedDrill.instructions.map((instruction, index) => (
              <p key={index} className="text-sm text-blue-800">
                {index + 1}. {instruction}
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}