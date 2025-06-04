"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  User,
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
    <div className="space-y-3">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Joueurs</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gérez vos joueurs et suivez leurs performances
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <Plus className="h-3 w-3 mr-1" />
          Ajouter
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-2"
      >
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Total</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Actifs</p>
            <p className="text-lg font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Blessés</p>
            <p className="text-lg font-bold text-gray-900">{stats.injured}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Gardiens</p>
            <p className="text-lg font-bold text-gray-900">{stats.goalies}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Patineurs</p>
            <p className="text-lg font-bold text-gray-900">{stats.skaters}</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-lg border border-gray-200 p-3"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 text-xs px-2 py-1"
          >
            Effacer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            <DynamicInput
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 text-xs h-8"
            />
          </div>

          <DynamicSelect
            placeholder="Position"
            value={selectedPosition}
            onValueChange={setSelectedPosition}
            options={positions.map(pos => ({ value: pos, label: pos }))}
          />

          <DynamicSelect
            placeholder="Équipe"
            value={selectedTeam}
            onValueChange={setSelectedTeam}
            options={teams.map(team => ({ value: team, label: team }))}
          />

          <DynamicSelect
            placeholder="Statut"
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            options={statuses}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {filteredPlayers.length} résultat{filteredPlayers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </motion.div>

      {/* Players Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3"
      >
        {filteredPlayers.map((player) => {
          const StatusIcon = getStatusIcon(player.status);
          
          return (
            <motion.div
              key={player.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePlayerClick(player)}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {/* Player Header */}
              <div className={`${player.teamColor} text-white p-2 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                      #{player.number}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-xs leading-tight truncate">{player.name}</h3>
                      <p className="text-white/80 text-xs truncate">{player.team}</p>
                    </div>
                  </div>
                  <Badge className={`${getPositionColor(player.position)} text-xs px-1 py-0`}>
                    {player.position}
                  </Badge>
                </div>
              </div>

              {/* Player Stats */}
              <div className="p-2 space-y-2">
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs font-bold text-gray-900">{player.age}</div>
                    <div className="text-xs text-gray-600">ans</div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className="text-xs font-bold text-gray-900">
                      {player.position === "G" ? player.gamesPlayed : player.points}
                    </div>
                    <div className="text-xs text-gray-600">
                      {player.position === "G" ? "PJ" : "pts"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-1">
                    <div className={`text-xs font-bold ${
                      player.plusMinus >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {player.plusMinus >= 0 ? '+' : ''}{player.plusMinus}
                    </div>
                    <div className="text-xs text-gray-600">+/-</div>
                  </div>
                </div>

                {player.position !== "G" && (
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">B/A</span>
                      <span className="font-medium text-gray-900">{player.goals}/{player.assists}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PUN</span>
                      <span className="font-medium text-gray-900">{player.penaltyMinutes}</span>
                    </div>
                  </div>
                )}

                <div className="pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      <Badge className={`${getStatusColor(player.status)} text-xs px-1 py-0`}>
                        {player.status === "active" ? "Actif" : 
                         player.status === "injured" ? "Blessé" : "Suspendu"}
                      </Badge>
                    </div>
                    {player.shoots && (
                      <span className="text-xs text-gray-500">{player.shoots}</span>
                    )}
                  </div>
                  {player.injuryDetails && (
                    <p className="text-xs text-red-600 mt-1 truncate">{player.injuryDetails}</p>
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
          className="text-center py-8"
        >
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun joueur trouvé
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Modifiez vos filtres ou ajoutez un nouveau joueur.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter un Joueur
          </Button>
        </motion.div>
      )}

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPlayer={(player) => {
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