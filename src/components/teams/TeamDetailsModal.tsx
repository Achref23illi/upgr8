"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Users, 
  User, 
  Shield, 
  //Star,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  //Phone,
  //Mail,
  Activity,
  //Award,
  AlertTriangle
} from "lucide-react";
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
}

interface Team {
  id: string;
  name: string;
  category: string;
  level: string;
  playersCount: number;
  averageAge: number;
  wins: number;
  losses: number;
  overtimeLosses: number;
  goalsFor: number;
  goalsAgainst: number;
  nextGame: string;
  arena: string;
  coach: string;
  assistantCoach?: string;
  founded: string;
  color: string;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
}

// Mock player data
const generateMockPlayers = (teamId: string,): Player[] => {
  const firstNames = [
    "Alex", "Emma", "Maxime", "Sophie", "Lucas", "Camille", "Nathan", "Léa",
    "Samuel", "Chloé", "Gabriel", "Jade", "Antoine", "Zoé", "Thomas", "Maya",
    "William", "Alice", "Olivier", "Rose", "Étienne", "Clara", "Simon", "Élise"
  ];
  const lastNames = [
    "Tremblay", "Gagnon", "Roy", "Bouchard", "Gauthier", "Morin", "Lavoie",
    "Fortin", "Gagné", "Ouellet", "Pelletier", "Bélanger", "Lévesque", "Bergeron",
    "Leblanc", "Paquette", "Girard", "Simard", "Boucher", "Caron", "Beaulieu"
  ];

  const players: Player[] = [];
  const usedNumbers = new Set<number>();

  for (let i = 0; i < 20; i++) {
    let number: number;
    do {
      number = Math.floor(Math.random() * 99) + 1;
    } while (usedNumbers.has(number));
    usedNumbers.add(number);

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    let position: string;
    if (i < 2) position = "G"; // 2 goalies
    else if (i < 8) position = "D"; // 6 defensemen
    else {
      const forwardPositions = ["C", "LW", "RW"];
      position = forwardPositions[Math.floor(Math.random() * forwardPositions.length)];
    }

    const gamesPlayed = Math.floor(Math.random() * 20) + 10;
    const goals = position === "G" ? 0 : Math.floor(Math.random() * 25);
    const assists = position === "G" ? 0 : Math.floor(Math.random() * 30);
    
    const statuses: ("active" | "injured" | "suspended")[] = ["active", "active", "active", "active", "injured"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    players.push({
      id: `${teamId}-player-${i}`,
      name: `${firstName} ${lastName}`,
      number,
      position,
      age: Math.floor(Math.random() * 6) + 12, // 12-17 years old
      height: `${Math.floor(Math.random() * 20) + 160}cm`,
      weight: `${Math.floor(Math.random() * 30) + 50}kg`,
      goals,
      assists,
      points: goals + assists,
      penaltyMinutes: Math.floor(Math.random() * 20),
      gamesPlayed,
      plusMinus: Math.floor(Math.random() * 21) - 10, // -10 to +10
      phone: `514-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      parent: `Parent de ${firstName}`,
      status,
      injuryDetails: status === "injured" ? "Entorse à la cheville" : undefined,
      avatar: undefined
    });
  }

  return players.sort((a, b) => a.number - b.number);
};

export function TeamDetailsModal({ isOpen, onClose, team }: TeamDetailsModalProps) {
  const [players] = React.useState<Player[]>(() => generateMockPlayers(team.id));
  const [activeTab, setActiveTab] = React.useState("roster");

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

  const teamStats = {
    totalGames: team.wins + team.losses + team.overtimeLosses,
    winPercentage: Math.round((team.wins / (team.wins + team.losses + team.overtimeLosses || 1)) * 100),
    goalDifferential: team.goalsFor - team.goalsAgainst,
    averageGoalsFor: (team.goalsFor / (team.wins + team.losses + team.overtimeLosses || 1)).toFixed(1),
    averageGoalsAgainst: (team.goalsAgainst / (team.wins + team.losses + team.overtimeLosses || 1)).toFixed(1)
  };

  const topScorers = players
    .filter(p => p.position !== "G")
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const goalies = players.filter(p => p.position === "G");
  const activePlayer = players.filter(p => p.status === "active").length;
  const injuredPlayers = players.filter(p => p.status === "injured").length;

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
              className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className={`${team.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-2xl font-bold">{team.name}</h2>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {team.category} {team.level}
                        </Badge>
                        <span className="text-white/80">
                          {team.wins}V-{team.losses}D-{team.overtimeLosses}DP
                        </span>
                        <span className="text-white/80">
                          {teamStats.winPercentage}% victoires
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-3 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 border-b border-gray-200 bg-white rounded-none h-12">
                    <TabsTrigger value="roster" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Effectif
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Statistiques
                    </TabsTrigger>
                    <TabsTrigger value="info" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                      Informations
                    </TabsTrigger>
                  </TabsList>

                  {/* Roster Tab */}
                  <TabsContent value="roster" className="m-0 p-6">
                    <div className="space-y-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div>
                            <span className="text-sm text-gray-600">Joueurs Actifs</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{activePlayer}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div>
                            <span className="text-sm text-gray-600">Blessés</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{injuredPlayers}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div>
                            <span className="text-sm text-gray-600">Gardiens</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{goalies.length}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div>
                            <span className="text-sm text-gray-600">Âge Moyen</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">{team.averageAge}</p>
                        </div>
                      </div>

                      {/* Players List */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Liste des Joueurs</h3>
                            <span className="text-sm text-gray-500">{players.length} joueurs</span>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joueur
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Position
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Âge
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stats
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {players.map((player) => {
                                  const StatusIcon = getStatusIcon(player.status);
                                  return (
                                    <tr key={player.id} className="hover:bg-gray-50">
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                                              #{player.number}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                              {player.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              #{player.number}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={getPositionColor(player.position)}>
                                          {player.position}
                                        </Badge>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {player.age} ans
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {player.position === "G" ? 
                                          `${player.gamesPlayed} PJ` : 
                                          `${player.goals}B ${player.assists}A ${player.points}Pts`
                                        }
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <Badge className={getStatusColor(player.status)}>
                                            {player.status === "active" ? "Actif" : 
                                             player.status === "injured" ? "Blessé" : "Suspendu"}
                                          </Badge>
                                          {player.injuryDetails && (
                                            <span className="ml-2 text-xs text-gray-500">
                                              {player.injuryDetails}
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="m-0 p-6">
                    <div className="space-y-6">
                      {/* Team Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Matchs Joués</p>
                            <p className="text-2xl font-bold text-gray-900">{teamStats.totalGames}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Buts/Match</p>
                            <p className="text-2xl font-bold text-gray-900">{teamStats.averageGoalsFor}</p>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Buts Encaissés/Match</p>
                            <p className="text-2xl font-bold text-gray-900">{teamStats.averageGoalsAgainst}</p>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Différentiel</p>
                            <p className={`text-2xl font-bold ${
                              teamStats.goalDifferential >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {teamStats.goalDifferential >= 0 ? '+' : ''}{teamStats.goalDifferential}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Top Scorers */}
                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900">Meilleurs Pointeurs</h3>
                        </div>
                        <div className="p-6 max-h-96 overflow-y-auto">
                          <div className="space-y-4">
                            {topScorers.map((player, index) => (
                              <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full font-bold text-sm">
                                    #{index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{player.name}</p>
                                    <p className="text-sm text-gray-500">#{player.number} • {player.position}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">{player.points} pts</p>
                                  <p className="text-sm text-gray-500">{player.goals}B {player.assists}A</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Info Tab */}
                  <TabsContent value="info" className="m-0 p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Team Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Information de l&apos;Équipe</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Nom complet:</span>
                              <span className="font-medium">{team.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Catégorie:</span>
                              <span className="font-medium">{team.category} {team.level}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fondée en:</span>
                              <span className="font-medium">{team.founded}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Aréna principal:</span>
                              <span className="font-medium">{team.arena}</span>
                            </div>
                          </div>
                        </div>

                        {/* Staff Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnel d&apos;Entraînement</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Entraîneur principal:</span>
                              <span className="font-medium">{team.coach}</span>
                            </div>
                            {team.assistantCoach && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Entraîneur assistant:</span>
                                <span className="font-medium">{team.assistantCoach}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Next Game */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochain Match</h3>
                        <div>
                          <p className="font-medium text-gray-900">{team.nextGame}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {team.arena}
                          </p>
                        </div>
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