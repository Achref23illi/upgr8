"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  User, 
  //Shield, 
  //Target,
  //Star,
  Calendar,
  //MapPin,
 // Trophy,
  Clock,
  //TrendingUp,
  Phone,
  Mail,
  Activity,
  //Award,
  AlertTriangle,
  Edit,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  age: number;
  height: string;
  weight: string;
  team: string;
  teamColor: string;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  gamesPlayed: number;
  plusMinus: number;
  phone?: string;
  email?: string;
  parent?: string;
  status: "active" | "injured" | "suspended";
  injuryDetails?: string;
  avatar?: string;
  dateJoined: string;
  shoots?: "L" | "R";
  birthplace?: string;
}

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
}

// Generate mock game log for the player
const generateGameLog = (player: Player) => {
  const games = [];
  const teams = ["Éperviers", "Faucons", "Lynx", "Requins", "Ours", "Rats", "Eagles", "Lions"];
  
  for (let i = 0; i < Math.min(player.gamesPlayed, 10); i++) {
    const opponent = teams[Math.floor(Math.random() * teams.length)];
    const isHome = Math.random() > 0.5;
    const goals = player.position === "G" ? 0 : Math.floor(Math.random() * 4);
    const assists = player.position === "G" ? 0 : Math.floor(Math.random() * 3);
    const pim = Math.floor(Math.random() * 5) * 2; // Even minutes
    const plusMinus = Math.floor(Math.random() * 7) - 3; // -3 to +3
    
    games.push({
      date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString('fr-CA'),
      opponent,
      isHome,
      goals,
      assists,
      points: goals + assists,
      pim,
      plusMinus,
      result: Math.random() > 0.4 ? "V" : "D"
    });
  }
  
  return games.reverse();
};

export function PlayerDetailsModal({ isOpen, onClose, player }: PlayerDetailsModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [gameLog] = React.useState(() => generateGameLog(player));

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "injured": return "bg-red-100 text-red-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return Activity;
      case "injured": return AlertTriangle;
      case "suspended": return Clock;
      default: return User;
    }
  };

  // Calculate advanced stats
  const pointsPerGame = player.gamesPlayed > 0 ? (player.points / player.gamesPlayed).toFixed(2) : "0.00";
  const goalsPerGame = player.gamesPlayed > 0 ? (player.goals / player.gamesPlayed).toFixed(2) : "0.00";
  const assistsPerGame = player.gamesPlayed > 0 ? (player.assists / player.gamesPlayed).toFixed(2) : "0.00";
  const pimPerGame = player.gamesPlayed > 0 ? (player.penaltyMinutes / player.gamesPlayed).toFixed(1) : "0.0";

  const StatusIcon = getStatusIcon(player.status);

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
              <div className={`${player.teamColor} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-3 border-white">
                      <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
                        #{player.number}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{player.name}</h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className={`${getPositionColor(player.position)} font-semibold`}>
                          {player.position}
                        </Badge>
                        <span className="text-white/80">{player.team}</span>
                        <span className="text-white/80">#{player.number}</span>
                        {player.shoots && (
                          <span className="text-white/80">Lance: {player.shoots}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="lg" onClick={onClose} className="text-white hover:bg-white/20 h-12 w-12">
                      <X className="h-7 w-7" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 border-b border-gray-200 bg-white rounded-none h-12">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Aperçu
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Statistiques
                    </TabsTrigger>
                    <TabsTrigger value="games" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Matchs
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="m-0 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Personnelle</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Âge:</span>
                              <span className="font-medium">{player.age} ans</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taille:</span>
                              <span className="font-medium">{player.height}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Poids:</span>
                              <span className="font-medium">{player.weight}</span>
                            </div>
                            {player.birthplace && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lieu de naissance:</span>
                                <span className="font-medium">{player.birthplace}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rejoint le:</span>
                              <span className="font-medium">{new Date(player.dateJoined).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                          <div className="space-y-3">
                            {player.phone && (
                              <div>
                                <span className="text-sm text-gray-600">Téléphone:</span>
                                <div className="text-gray-900">{player.phone}</div>
                              </div>
                            )}
                            {player.email && (
                              <div>
                                <span className="text-sm text-gray-600">Email:</span>
                                <div className="text-gray-900">{player.email}</div>
                              </div>
                            )}
                            {player.parent && (
                              <div>
                                <span className="text-sm text-gray-600">Parent/Tuteur:</span>
                                <div className="text-gray-900">{player.parent}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Quick Stats */}
                      <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut Actuel</h3>
                          <div className="flex items-center space-x-3 mb-4">
                            <Badge className={getStatusColor(player.status)}>
                              {player.status === "active" ? "Actif" : 
                               player.status === "injured" ? "Blessé" : "Suspendu"}
                            </Badge>
                          </div>
                          {player.injuryDetails && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800">
                                <strong>Détails de la blessure:</strong> {player.injuryDetails}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Rapides</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-gray-900">{player.points}</p>
                              <p className="text-sm text-gray-600">Points</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-gray-900">{player.gamesPlayed}</p>
                              <p className="text-sm text-gray-600">Matchs</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className={`text-2xl font-bold ${
                                player.plusMinus >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {player.plusMinus >= 0 ? '+' : ''}{player.plusMinus}
                              </p>
                              <p className="text-sm text-gray-600">+/-</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-gray-900">{player.penaltyMinutes}</p>
                              <p className="text-sm text-gray-600">PIM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="m-0 p-6">
                    <div className="space-y-6">
                      {/* Season Stats */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de la Saison</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">{player.gamesPlayed}</p>
                            <p className="text-sm text-gray-600">Matchs Joués</p>
                          </div>
                          {player.position !== "G" && (
                            <>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{player.goals}</p>
                                <p className="text-sm text-gray-600">Buts</p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{player.assists}</p>
                                <p className="text-sm text-gray-600">Passes</p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">{player.points}</p>
                                <p className="text-sm text-gray-600">Points</p>
                              </div>
                            </>
                          )}
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className={`text-2xl font-bold ${
                              player.plusMinus >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {player.plusMinus >= 0 ? '+' : ''}{player.plusMinus}
                            </p>
                            <p className="text-sm text-gray-600">+/-</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-600">{player.penaltyMinutes}</p>
                            <p className="text-sm text-gray-600">PIM</p>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Stats */}
                      {player.position !== "G" && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques Avancées</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-xl font-bold text-gray-900">{pointsPerGame}</p>
                              <p className="text-sm text-gray-600">Points/Match</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-xl font-bold text-gray-900">{goalsPerGame}</p>
                              <p className="text-sm text-gray-600">Buts/Match</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-xl font-bold text-gray-900">{assistsPerGame}</p>
                              <p className="text-sm text-gray-600">Passes/Match</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-xl font-bold text-gray-900">{pimPerGame}</p>
                              <p className="text-sm text-gray-600">PIM/Match</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Games Tab */}
                  <TabsContent value="games" className="m-0 p-6">
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Derniers Matchs</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Adversaire
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Résultat
                              </th>
                              {player.position !== "G" && (
                                <>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    B
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    A
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pts
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    +/-
                                  </th>
                                </>
                              )}
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PIM
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {gameLog.map((game, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {game.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {game.isHome ? "vs" : "@"} {game.opponent}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge className={game.result === "V" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {game.result}
                                  </Badge>
                                </td>
                                {player.position !== "G" && (
                                  <>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {game.goals}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {game.assists}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {game.points}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <span className={game.plusMinus >= 0 ? "text-green-600" : "text-red-600"}>
                                        {game.plusMinus >= 0 ? "+" : ""}{game.plusMinus}
                                      </span>
                                    </td>
                                  </>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {game.pim}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}