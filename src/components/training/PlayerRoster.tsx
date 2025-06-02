"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Users, Battery, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TrainingPlayer } from "@/app/dashboard/trainings/page";

interface PlayerRosterProps {
  players: TrainingPlayer[];
  onPlayerDragStart: (player: TrainingPlayer) => void;
  onPlayerDragEnd: () => void;
}

export function PlayerRoster({ players, onPlayerDragStart, onPlayerDragEnd }: PlayerRosterProps) {
  const [draggedPlayerId, setDraggedPlayerId] = React.useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = React.useState<string>("all");
  const [draggedPlayer, setDraggedPlayer] = React.useState<TrainingPlayer | null>(null);
  const [floatingPlayerPosition, setFloatingPlayerPosition] = React.useState<{ x: number; y: number } | null>(null);

  // Handle drag start with floating player
  const handleDragStart = (e: React.DragEvent, player: TrainingPlayer) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedPlayerId(player.id);
    setDraggedPlayer(player);
    onPlayerDragStart(player);
    
    // Create floating player element
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setFloatingPlayerPosition({ x: rect.left, y: rect.top });
  };

  const handleDragEnd = () => {
    setDraggedPlayerId(null);
    setDraggedPlayer(null);
    setFloatingPlayerPosition(null);
    onPlayerDragEnd();
  };

  // Update floating player position on mouse move
  React.useEffect(() => {
    if (!draggedPlayer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setFloatingPlayerPosition({ x: e.clientX - 50, y: e.clientY - 50 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [draggedPlayer]);

  const getPositionColor = (position: string) => {
    switch (position) {
      case "G": return "bg-purple-100 text-purple-800";
      case "D": return "bg-blue-100 text-blue-800";
      case "C": return "bg-green-100 text-green-800";
      case "LW": return "bg-yellow-100 text-yellow-800";
      case "RW": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy > 75) return "bg-green-500";
    if (energy > 50) return "bg-yellow-500";
    if (energy > 25) return "bg-orange-500";
    return "bg-red-500";
  };

  // Filter players by selected position
  const filteredPlayers = React.useMemo(() => {
    if (selectedPosition === "all") return players;
    return players.filter(player => player.position === selectedPosition);
  }, [players, selectedPosition]);

  // Group players by position
  const playersByPosition = React.useMemo(() => {
    const groups: Record<string, TrainingPlayer[]> = {
      G: [],
      D: [],
      C: [],
      LW: [],
      RW: []
    };

    filteredPlayers.forEach(player => {
      if (groups[player.position]) {
        groups[player.position].push(player);
      }
    });

    return groups;
  }, [filteredPlayers]);

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Effectif
            </h3>
            <Badge variant="secondary">
              {players.length} disponibles
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Glissez les joueurs sur la patinoire
          </p>
        </div>

        {/* Position Filter Tabs */}
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedPosition("all")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedPosition === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Tous ({players.length})
            </button>
            {["G", "D", "C", "LW", "RW"].map((pos) => {
              const count = players.filter(p => p.position === pos).length;
              return (
                <button
                  key={pos}
                  onClick={() => setSelectedPosition(pos)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedPosition === pos
                      ? `${getPositionColor(pos)} shadow-sm`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {pos} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Player List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {players.length === 0 
                  ? "Tous les joueurs sont sur la glace"
                  : "Aucun joueur dans cette position"
                }
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {/* Show all players without position grouping when filtered */}
              {selectedPosition !== "all" ? (
                filteredPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    variants={itemVariants}
                    className={`bg-gray-50 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-gray-100 border border-transparent hover:border-gray-300 ${
                      draggedPlayerId === player.id ? 'opacity-50 scale-95' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, player)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PlayerCard player={player} />
                  </motion.div>
                ))
              ) : (
                Object.entries(playersByPosition).map(([position, positionPlayers]) => 
                  positionPlayers.length > 0 ? (
                    <div key={position}>
                      {/* Position Header */}
                      <div className="flex items-center mb-2">
                        <Badge className={`${getPositionColor(position)} text-xs`}>
                          {position}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-2">
                          {positionPlayers.length} joueur{positionPlayers.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Players in Position */}
                      <div className="space-y-2">
                        {positionPlayers.map((player) => (
                          <motion.div
                            key={player.id}
                            variants={itemVariants}
                            className={`bg-gray-50 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-gray-100 border border-transparent hover:border-gray-300 ${
                              draggedPlayerId === player.id ? 'opacity-50 scale-95' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, player)}
                            onDragEnd={handleDragEnd}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <PlayerCard player={player} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )
              )}
          </motion.div>
        )}
      </div>

        {/* Instructions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <p>💡 <strong>Astuce:</strong></p>
            <p>• Filtrez par position pour accès rapide</p>
            <p>• Glissez pour positionner librement</p>
            <p>• Déposez sur les zones vertes pour l'exercice</p>
          </div>
        </div>
      </div>

      {/* Floating Player While Dragging */}
      {draggedPlayer && floatingPlayerPosition && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          className="fixed pointer-events-none z-50 bg-white rounded-lg shadow-xl border-2 border-blue-500 p-3"
          style={{
            left: floatingPlayerPosition.x,
            top: floatingPlayerPosition.y,
            width: '200px'
          }}
        >
          <PlayerCard player={draggedPlayer} compact />
        </motion.div>
      )}
    </>
  );

  // PlayerCard component
  function PlayerCard({ player, compact = false }: { player: TrainingPlayer; compact?: boolean }) {
    return (
      <>
        <div className="flex items-center space-x-3">
          {/* Player Avatar */}
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-white text-gray-900 font-bold text-sm">
                #{player.number}
              </AvatarFallback>
            </Avatar>
            {/* Position Badge */}
            <Badge 
              className={`absolute -top-1 -right-1 text-xs ${getPositionColor(player.position)} border-white border-2`}
            >
              {player.position}
            </Badge>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {player.name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {/* Energy Level */}
              <div className="flex items-center space-x-1">
                <Battery className="w-3 h-3 text-gray-400" />
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getEnergyColor(player.energy)} transition-all duration-300`}
                    style={{ width: `${player.energy}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {player.energy}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Indicator - hide in compact mode */}
        {!compact && (
          <div className="mt-2 text-center">
            <div className="inline-flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        )}
      </>
    );
  }
}