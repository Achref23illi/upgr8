"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  User, 
  //Star,
  Calendar,
  MapPin,
  Trophy,
  Target,
  //Shield,
  //Clock,
  //TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddTeamModal } from "@/components/teams/AddTeamModal";
import { TeamDetailsModal } from "@/components/teams/TeamDetailsModal";

// Team interface
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
  logo?: string;
}

// Mock team data
const mockTeams: Team[] = [
  {
    id: "1",
    name: "Titans U15 AAA",
    category: "Bantam",
    level: "AAA",
    playersCount: 20,
    averageAge: 14.5,
    wins: 15,
    losses: 3,
    overtimeLosses: 2,
    goalsFor: 78,
    goalsAgainst: 45,
    nextGame: "Samedi 15h00 vs Éperviers",
    arena: "Aréna Jean-Béliveau",
    coach: "Martin Dubois",
    assistantCoach: "Pierre Lafleur",
    founded: "2019",
    color: "bg-red-800",
  },
  {
    id: "2",
    name: "Lions Novice A",
    category: "Novice",
    level: "A",
    playersCount: 16,
    averageAge: 8.2,
    wins: 12,
    losses: 5,
    overtimeLosses: 1,
    goalsFor: 65,
    goalsAgainst: 38,
    nextGame: "Dimanche 10h00 vs Lynx",
    arena: "Aréna Communautaire",
    coach: "Sophie Martin",
    founded: "2021",
    color: "bg-yellow-700",
  },
  {
    id: "3",
    name: "Eagles Midget Elite",
    category: "Midget",
    level: "Elite",
    playersCount: 22,
    averageAge: 16.8,
    wins: 18,
    losses: 2,
    overtimeLosses: 0,
    goalsFor: 95,
    goalsAgainst: 28,
    nextGame: "Vendredi 19h30 vs Faucons",
    arena: "Centre Sportif Metro",
    coach: "Marc Bergeron",
    assistantCoach: "Julie Tremblay",
    founded: "2018",
    color: "bg-green-800",
  },
  {
    id: "4",
    name: "Wolves Bantam AA",
    category: "Bantam",
    level: "AA",
    playersCount: 19,
    averageAge: 13.9,
    wins: 10,
    losses: 8,
    overtimeLosses: 2,
    goalsFor: 58,
    goalsAgainst: 52,
    nextGame: "Lundi 18h00 vs Ours",
    arena: "Aréna Municipal",
    coach: "David Roy",
    founded: "2020",
    color: "bg-gray-800",
  },
  {
    id: "5",
    name: "Panthers Pee-Wee A",
    category: "Pee-Wee",
    level: "A",
    playersCount: 17,
    averageAge: 11.3,
    wins: 14,
    losses: 4,
    overtimeLosses: 1,
    goalsFor: 72,
    goalsAgainst: 41,
    nextGame: "Samedi 13h00 vs Requins",
    arena: "Aréna Sud",
    coach: "Annie Leclerc",
    founded: "2022",
    color: "bg-purple-800",
  },
  {
    id: "6",
    name: "Sharks Atome BB",
    category: "Atome",
    level: "BB",
    playersCount: 15,
    averageAge: 9.7,
    wins: 8,
    losses: 9,
    overtimeLosses: 3,
    goalsFor: 45,
    goalsAgainst: 48,
    nextGame: "Dimanche 14h30 vs Rats",
    arena: "Aréna Nord",
    coach: "François Gagnon",
    founded: "2023",
    color: "bg-blue-800",
  },
];

/**
 * Teams Page
 * 
 * Displays all teams in a grid layout with the ability to add new teams
 * and view detailed team information including players.
 */
export default function TeamsPage() {
  const [teams, setTeams] = React.useState<Team[]>(mockTeams);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleAddTeam = (newTeam: Omit<Team, 'id'>) => {
    const team: Team = {
      ...newTeam,
      id: Date.now().toString(),
    };
    setTeams(prev => [...prev, team]);
    setIsAddModalOpen(false);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDetailsModalOpen(true);
  };

  const getWinPercentage = (wins: number, losses: number, overtimeLosses: number) => {
    const totalGames = wins + losses + overtimeLosses;
    if (totalGames === 0) return 0;
    return Math.round((wins / totalGames) * 100);
  };

  const getGoalDifferential = (goalsFor: number, goalsAgainst: number) => {
    const diff = goalsFor - goalsAgainst;
    return diff >= 0 ? `+${diff}` : diff.toString();
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
          <h1 className="text-3xl font-bold text-gray-900">Équipes</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos équipes et suivez leurs performances
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter Équipe
        </Button>
      </motion.div>

      {/* Teams Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Équipes</p>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Joueurs</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((sum, team) => sum + team.playersCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Victoires</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((sum, team) => sum + team.wins, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Buts</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((sum, team) => sum + team.goalsFor, 0)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Teams Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {teams.map((team) => {
          const winPercentage = getWinPercentage(team.wins, team.losses, team.overtimeLosses);
          const goalDiff = getGoalDifferential(team.goalsFor, team.goalsAgainst);
          
          return (
            <motion.div
              key={team.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTeamClick(team)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer border border-gray-200"
            >
              {/* Team Header */}
              <div className={`${team.color} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{team.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {team.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {team.level}
                      </Badge>
                    </div>
                  </div>
                  <Users className="h-8 w-8" />
                </div>
              </div>

              {/* Team Stats */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joueurs</span>
                  <span className="font-semibold">{team.playersCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Âge moyen</span>
                  <span className="font-semibold">{team.averageAge} ans</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fiche</span>
                  <span className="font-semibold">
                    {team.wins}V-{team.losses}D-{team.overtimeLosses}DP
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">% Victoires</span>
                  <span className={`font-semibold ${
                    winPercentage >= 70 ? 'text-green-600' : 
                    winPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {winPercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Différentiel</span>
                  <span className={`font-semibold ${
                    goalDiff.startsWith('+') ? 'text-green-600' : 
                    goalDiff === '0' ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {goalDiff}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{team.nextGame}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{team.arena}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTeam={handleAddTeam}
      />

      {/* Team Details Modal */}
      {selectedTeam && (
        <TeamDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedTeam(null);
          }}
          team={selectedTeam}
        />
      )}
    </div>
  );
}