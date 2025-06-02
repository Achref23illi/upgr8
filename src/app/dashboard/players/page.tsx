"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  User, 
  //Star,
  //Calendar,
  //MapPin,
  //Trophy,
  //Target,
  Shield,
  Clock,
  //TrendingUp,
  Search,
  Filter,
  //MoreVertical,
  Activity,
  AlertTriangle,
  //Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddPlayerModal } from "@/components/players/AddPlayerModal";
import { PlayerDetailsModal } from "@/components/players/PlayerDetailsModal";

// Player interface
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
  shoots?: "L" | "R"; // Left or Right handed
  birthplace?: string;
}

// Generate comprehensive mock player data
const generateMockPlayers = (): Player[] => {
  const teams = [
    { name: "Titans U15 AAA", color: "bg-red-800" },
    { name: "Lions Novice A", color: "bg-yellow-700" },
    { name: "Eagles Midget Elite", color: "bg-green-800" },
    { name: "Wolves Bantam AA", color: "bg-gray-800" },
    { name: "Panthers Pee-Wee A", color: "bg-purple-800" },
    { name: "Sharks Atome BB", color: "bg-blue-800" },
  ];

  const positions = ["G", "D", "C", "LW", "RW"];
  const firstNames = [
    "Alex", "Emma", "Maxime", "Sophie", "Lucas", "Camille", "Nathan", "Léa",
    "Samuel", "Chloé", "Gabriel", "Jade", "Antoine", "Zoé", "Thomas", "Maya",
    "William", "Alice", "Olivier", "Rose", "Étienne", "Clara", "Simon", "Élise",
    "Félix", "Juliette", "Benjamin", "Océane", "Raphaël", "Laurie", "Jacob", "Rosalie",
    "Noah", "Maëlle", "Louis", "Anaïs", "Arthur", "Coralie", "Alexis", "Amélie"
  ];
  const lastNames = [
    "Tremblay", "Gagnon", "Roy", "Bouchard", "Gauthier", "Morin", "Lavoie",
    "Fortin", "Gagné", "Ouellet", "Pelletier", "Bélanger", "Lévesque", "Bergeron",
    "Leblanc", "Paquette", "Girard", "Simard", "Boucher", "Caron", "Beaulieu",
    "Côté", "Dubois", "Poirier", "Fournier", "Lapierre", "Dufour", "Thibault"
  ];

  const players: Player[] = [];
  const usedNumbers = new Set<string>();

  // Use deterministic values to avoid hydration errors
  for (let i = 0; i < 120; i++) {
    const team = teams[i % teams.length];
    const position = positions[i % positions.length];
    
    // Generate unique number per team deterministically
    let number: number;
    let numberKey: string;
    let numberAttempt = 0;
    do {
      number = 1 + ((i + numberAttempt) % 99);
      numberKey = `${team.name}-${number}`;
      numberAttempt++;
    } while (usedNumbers.has(numberKey));
    usedNumbers.add(numberKey);

    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(i + 7) % lastNames.length];
    
    const gamesPlayed = 5 + (i % 20);
    const goals = position === "G" ? 0 : (i % 30);
    const assists = position === "G" ? 0 : ((i + 5) % 35);
    
    const statuses: ("active" | "injured" | "suspended")[] = 
      ["active", "active", "active", "active", "active", "active", "injured", "suspended"];
    const status = statuses[i % statuses.length];

    const age = 8 + (i % 12); // 8-19 years old
    const shoots = i % 10 < 3 ? "L" : "R"; // 30% left, 70% right

    const injuries = ["Entorse cheville", "Commotion cérébrale", "Blessure épaule", "Fracture poignet"];
    const birthplaces = ["Montréal, QC", "Québec, QC", "Laval, QC", "Gatineau, QC", "Sherbrooke, QC", "Trois-Rivières, QC"];

    players.push({
      id: `player-${i}`,
      name: `${firstName} ${lastName}`,
      number,
      position,
      age,
      height: `${150 + (i % 40)}cm`,
      weight: `${40 + (i % 50)}kg`,
      team: team.name,
      teamColor: team.color,
      goals,
      assists,
      points: goals + assists,
      penaltyMinutes: i % 30,
      gamesPlayed,
      plusMinus: (i % 21) - 10, // -10 to +10
      phone: `514-${100 + (i % 900)}-${1000 + (i % 9000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      parent: `Parent de ${firstName}`,
      status,
      injuryDetails: status === "injured" ? injuries[i % injuries.length] : undefined,
      dateJoined: `202${i % 4}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
      shoots,
      birthplace: birthplaces[i % birthplaces.length]
    });
  }

  return players.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Players Page
 * 
 * Displays all players with filtering options and ability to add new players.
 */
export default function PlayersPage() {
  const [allPlayers] = React.useState<Player[]>(generateMockPlayers());
  const [filteredPlayers, setFilteredPlayers] = React.useState<Player[]>(allPlayers);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedPosition, setSelectedPosition] = React.useState("");
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  // Get unique values for filters
  const positions = ["G", "D", "C", "LW", "RW"];
  const teams = [...new Set(allPlayers.map(p => p.team))].sort();
  const statuses = [
    { value: "active", label: "Actif" },
    { value: "injured", label: "Blessé" },
    { value: "suspended", label: "Suspendu" }
  ];

  // Apply filters
  React.useEffect(() => {
    let filtered = allPlayers;

    if (searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.number.toString().includes(searchTerm)
      );
    }

    if (selectedPosition) {
      filtered = filtered.filter(player => player.position === selectedPosition);
    }

    if (selectedTeam) {
      filtered = filtered.filter(player => player.team === selectedTeam);
    }

    if (selectedStatus) {
      filtered = filtered.filter(player => player.status === selectedStatus);
    }

    setFilteredPlayers(filtered);
  }, [searchTerm, selectedPosition, selectedTeam, selectedStatus, allPlayers]);

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

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDetailsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPosition("");
    setSelectedTeam("");
    setSelectedStatus("");
  };

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

  // Calculate statistics
  const stats = {
    total: allPlayers.length,
    active: allPlayers.filter(p => p.status === "active").length,
    injured: allPlayers.filter(p => p.status === "injured").length,
    goalies: allPlayers.filter(p => p.position === "G").length,
    skaters: allPlayers.filter(p => p.position !== "G").length,
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
          <h1 className="text-3xl font-bold text-gray-900">Joueurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos joueurs et suivez leurs performances
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Joueur
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Blessés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.injured}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Gardiens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.goalies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Patineurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.skaters}</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <DynamicInput
              type="text"
              placeholder="Rechercher par nom ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DynamicSelect
            placeholder="Toutes les positions"
            value={selectedPosition}
            onValueChange={setSelectedPosition}
            options={positions.map(pos => ({ value: pos, label: pos }))}
          />

          <DynamicSelect
            placeholder="Toutes les équipes"
            value={selectedTeam}
            onValueChange={setSelectedTeam}
            options={teams.map(team => ({ value: team, label: team }))}
          />

          <DynamicSelect
            placeholder="Tous les statuts"
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            options={statuses}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {filteredPlayers.length} joueur{filteredPlayers.length !== 1 ? 's' : ''} trouvé{filteredPlayers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Players Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredPlayers.map((player) => {
          const StatusIcon = getStatusIcon(player.status);
          
          return (
            <motion.div
              key={player.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlayerClick(player)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200"
            >
              {/* Player Header */}
              <div className={`${player.teamColor} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarFallback className="bg-white/20 text-white font-bold text-lg">
                        #{player.number}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{player.name}</h3>
                      <p className="text-white/80 text-sm">{player.team}</p>
                    </div>
                  </div>
                  <Badge className={`${getPositionColor(player.position)} text-xs font-bold`}>
                    {player.position}
                  </Badge>
                </div>
              </div>

              {/* Player Stats */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Âge</span>
                  <span className="font-semibold">{player.age} ans</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Points</span>
                  <span className="font-semibold">
                    {player.position === "G" ? `${player.gamesPlayed} PJ` : `${player.points} pts`}
                  </span>
                </div>

                {player.position !== "G" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Buts/Passes</span>
                    <span className="font-semibold">{player.goals}B {player.assists}A</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">+/-</span>
                  <span className={`font-semibold ${
                    player.plusMinus >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {player.plusMinus >= 0 ? '+' : ''}{player.plusMinus}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(player.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {player.status === "active" ? "Actif" : 
                       player.status === "injured" ? "Blessé" : "Suspendu"}
                    </Badge>
                    {player.shoots && (
                      <span className="text-xs text-gray-500">Lance: {player.shoots}</span>
                    )}
                  </div>
                  {player.injuryDetails && (
                    <p className="text-xs text-red-600 mt-1">{player.injuryDetails}</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun joueur trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Essayez de modifier vos filtres ou ajoutez un nouveau joueur.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Joueur
          </Button>
        </motion.div>
      )}

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlayer={(player) => {
          // Handle adding player logic here
          console.log("Adding player:", player);
          setIsAddModalOpen(false);
        }}
        teams={teams}
      />

      {/* Player Details Modal */}
      {selectedPlayer && (
        <PlayerDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
        />
      )}
    </div>
  );
}