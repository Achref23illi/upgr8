"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TrainingSession, TrainingDrill, TrainingPlayer } from "@/app/dashboard/trainings/page";

interface HockeyRinkProps {
  session: TrainingSession;
  selectedDrill?: TrainingDrill | null;
  players: TrainingPlayer[];
  draggedPlayer?: TrainingPlayer | null;
  onPlayerDrop: (playerId: string, x: number, y: number, positionId?: string) => void;
  onPlayerRemove: (playerId: string) => void;
  onPlayerDragEnd?: () => void;
  dimensions: { width: number; height: number };
  onDimensionsChange: (dimensions: { width: number; height: number }) => void;
}

export function HockeyRink({
  session,
  selectedDrill,
  players,
  draggedPlayer,
  onPlayerDrop,
  onPlayerRemove,
  //onPlayerDragEnd,
  dimensions,
  onDimensionsChange
}: HockeyRinkProps) {
  const rinkRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [dragOverPosition, setDragOverPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [hoveredPositionId, setHoveredPositionId] = React.useState<string | null>(null);

  // Handle drag over rink
  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!rinkRef.current) return;

    const rect = rinkRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setDragOverPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, []);

  // Handle drop on rink
  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedPlayer || !rinkRef.current) return;

    const rect = rinkRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clear drag over position
    setDragOverPosition(null);

    // Check if dropping on a drill position
    let targetPositionId: string | undefined;
    if (selectedDrill) {
      for (const pos of selectedDrill.positions) {
        if (pos.type === "player") {
          const distance = Math.sqrt(
            Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
          );
          if (distance < 8) { // 8% radius for snapping
            targetPositionId = pos.id;
            onPlayerDrop(draggedPlayer.id, pos.x, pos.y, targetPositionId);
            // Cleanup is handled in the parent component's handlePlayerDrop
            return;
          }
        }
      }
    }

    onPlayerDrop(draggedPlayer.id, x, y);
    // Cleanup is handled in the parent component's handlePlayerDrop
  }, [draggedPlayer, selectedDrill, onPlayerDrop]);

  // Handle drag leave
  const handleDragLeave = React.useCallback(() => {
    setDragOverPosition(null);
  }, []);

  // Get player position style
  const getPlayerPositionStyle = React.useCallback((player: TrainingPlayer) => {
    const position = session.playerPositions[player.id];
    if (!position) return {};

    return {
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)'
    };
  }, [session.playerPositions]);

  // Get position color based on player position
  const getPositionColor = (position: string) => {
    switch (position) {
      case "G": return "bg-purple-600 border-purple-700";
      case "D": return "bg-blue-600 border-blue-700";
      case "C": return "bg-green-600 border-green-700";
      case "LW": return "bg-yellow-600 border-yellow-700";
      case "RW": return "bg-orange-600 border-orange-700";
      default: return "bg-gray-600 border-gray-700";
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (isFullscreen) {
      onDimensionsChange({ width: 800, height: 400 });
    } else {
      onDimensionsChange({ width: 1200, height: 600 });
    }
    setIsFullscreen(!isFullscreen);
  };

  const assignedPlayers = players.filter(p => session.playerPositions[p.id]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Rink Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Patinoire</h3>
          {selectedDrill && (
            <Badge className="bg-blue-100 text-blue-800">
              {selectedDrill.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {assignedPlayers.length} joueurs
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Hockey Rink */}
      <div className="p-4">
        <div
          ref={rinkRef}
          className="relative bg-gradient-to-b from-blue-50 to-blue-100 border-4 border-gray-800 rounded-lg overflow-hidden"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            margin: '0 auto'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          {/* Ice Surface Background */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-50 via-blue-100 to-blue-200 opacity-50" />

          {/* Rink Markings */}
          {/* Center Line */}
          <div className="absolute left-0 right-0 h-1 bg-red-600 top-1/2 transform -translate-y-1/2" />
          
          {/* Center Circle */}
          <div 
            className="absolute border-4 border-blue-600 rounded-full"
            style={{
              width: '20%',
              height: '40%',
              left: '40%',
              top: '30%'
            }}
          />

          {/* Face-off Circles */}
          <div 
            className="absolute border-2 border-blue-600 rounded-full"
            style={{
              width: '8%',
              height: '16%',
              left: '15%',
              top: '20%'
            }}
          />
          <div 
            className="absolute border-2 border-blue-600 rounded-full"
            style={{
              width: '8%',
              height: '16%',
              right: '15%',
              top: '20%'
            }}
          />
          <div 
            className="absolute border-2 border-blue-600 rounded-full"
            style={{
              width: '8%',
              height: '16%',
              left: '15%',
              bottom: '20%'
            }}
          />
          <div 
            className="absolute border-2 border-blue-600 rounded-full"
            style={{
              width: '8%',
              height: '16%',
              right: '15%',
              bottom: '20%'
            }}
          />

          {/* Goals */}
          <div 
            className="absolute bg-red-600 border-2 border-red-800"
            style={{
              width: '3%',
              height: '15%',
              left: '2%',
              top: '42.5%'
            }}
          />
          <div 
            className="absolute bg-red-600 border-2 border-red-800"
            style={{
              width: '3%',
              height: '15%',
              right: '2%',
              top: '42.5%'
            }}
          />

          {/* Goal Creases */}
          <div 
            className="absolute border-2 border-blue-600 bg-blue-200 opacity-30"
            style={{
              width: '8%',
              height: '20%',
              left: '2%',
              top: '40%',
              borderRadius: '0 50% 50% 0'
            }}
          />
          <div 
            className="absolute border-2 border-blue-600 bg-blue-200 opacity-30"
            style={{
              width: '8%',
              height: '20%',
              right: '2%',
              top: '40%',
              borderRadius: '50% 0 0 50%'
            }}
          />

          {/* Drill Positions */}
          {selectedDrill && selectedDrill.positions.map((pos) => (
            <motion.div
              key={pos.id}
              className={`absolute w-8 h-8 rounded-full border-2 ${
                pos.type === "player" 
                  ? "border-green-500 bg-green-100" 
                  : pos.type === "cone"
                  ? "border-orange-500 bg-orange-100"
                  : pos.type === "puck"
                  ? "border-black bg-gray-800"
                  : "border-red-500 bg-red-100"
              } ${pos.required ? "border-solid" : "border-dashed"} 
              flex items-center justify-center cursor-pointer transition-all duration-200 ${
                hoveredPositionId === pos.id ? "scale-110 shadow-lg" : ""
              }`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredPositionId(pos.id)}
              onMouseLeave={() => setHoveredPositionId(null)}
              whileHover={{ scale: 1.1 }}
            >
              {pos.type === "player" && pos.position && (
                <span className="text-xs font-bold text-gray-700">
                  {pos.position}
                </span>
              )}
              {pos.type === "cone" && (
                <Target className="w-4 h-4 text-orange-600" />
              )}
              {pos.type === "puck" && (
                <div className="w-3 h-3 bg-black rounded-full" />
              )}
            </motion.div>
          ))}

          {/* Drag Over Indicator */}
          {dragOverPosition && draggedPlayer && (
            <motion.div
              className="absolute w-10 h-10 rounded-full border-2 border-dashed border-blue-500 bg-blue-100 opacity-70 flex items-center justify-center"
              style={{
                left: `${dragOverPosition.x}%`,
                top: `${dragOverPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <span className="text-xs font-bold text-blue-600">
                #{draggedPlayer.number}
              </span>
            </motion.div>
          )}

          {/* Players on Rink */}
          <AnimatePresence>
            {assignedPlayers.map((player) => (
              <motion.div
                key={player.id}
                className="absolute w-12 h-12 cursor-pointer group"
                style={getPlayerPositionStyle(player)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                layout
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {/* Player Avatar */}
                <div className={`relative w-12 h-12 rounded-full border-3 ${getPositionColor(player.position)} shadow-lg`}>
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-white text-gray-900 font-bold text-sm">
                      #{player.number}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onPlayerRemove(player.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* Player Info Tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {player.name} • {player.position}
                </div>

                {/* Energy Bar */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      player.energy > 75 ? 'bg-green-500' :
                      player.energy > 50 ? 'bg-yellow-500' :
                      player.energy > 25 ? 'bg-orange-500' : 'bg-red-500'
                    } transition-all duration-300`}
                    style={{ width: `${player.energy}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Instructions Overlay */}
          {!assignedPlayers.length && !selectedDrill && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Glissez des joueurs sur la patinoire</p>
                <p className="text-sm">Sélectionnez un exercice pour voir les positions recommandées</p>
              </div>
            </div>
          )}

          {/* Drill Instructions */}
          {selectedDrill && !assignedPlayers.length && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-md">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedDrill.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedDrill.description}</p>
              <div className="text-xs text-gray-500">
                Joueurs requis: {selectedDrill.minPlayers}-{selectedDrill.maxPlayers}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}