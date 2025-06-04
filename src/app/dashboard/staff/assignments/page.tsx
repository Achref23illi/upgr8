"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  User, 
  Search, 
  Filter, 
  Plus, 
  X,
  Check,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

// Types
interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  team: string;
  category: string;
  evaluatorId?: string;
}

interface Evaluator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  assignedCount: number;
  maxAssignments: number;
}

// Mock data
const mockEvaluators: Evaluator[] = [
  {
    id: "eval-1",
    firstName: "Pierre",
    lastName: "Tremblay",
    email: "pierre.tremblay@upgr8.com",
    assignedCount: 15,
    maxAssignments: 20
  },
  {
    id: "eval-2",
    firstName: "Marie",
    lastName: "Bouchard",
    email: "marie.bouchard@upgr8.com",
    assignedCount: 12,
    maxAssignments: 15
  },
  {
    id: "eval-3",
    firstName: "Jean",
    lastName: "Lavoie",
    email: "jean.lavoie@upgr8.com",
    assignedCount: 8,
    maxAssignments: 25
  },
  {
    id: "eval-4",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@upgr8.com",
    assignedCount: 0,
    maxAssignments: 20
  }
];

const mockPlayers: Player[] = [
  // U15 Players
  { id: "p1", firstName: "Alexandre", lastName: "Dubois", number: 17, position: "C", team: "Titans U15", category: "U15", evaluatorId: "eval-1" },
  { id: "p2", firstName: "Emma", lastName: "Gagnon", number: 31, position: "G", team: "Titans U15", category: "U15", evaluatorId: "eval-1" },
  { id: "p3", firstName: "Marc", lastName: "Tremblay", number: 24, position: "LW", team: "Lions U15", category: "U15" },
  { id: "p4", firstName: "Sophie", lastName: "Lavoie", number: 7, position: "D", team: "Eagles U15", category: "U15", evaluatorId: "eval-2" },
  
  // U13 Players  
  { id: "p5", firstName: "Gabriel", lastName: "Roy", number: 12, position: "C", team: "Sharks U13", category: "U13", evaluatorId: "eval-2" },
  { id: "p6", firstName: "Camille", lastName: "Morin", number: 8, position: "RW", team: "Panthers U13", category: "U13" },
  { id: "p7", firstName: "Lucas", lastName: "Girard", number: 15, position: "D", team: "Wolves U13", category: "U13", evaluatorId: "eval-3" },
  
  // U11 Players
  { id: "p8", firstName: "Jade", lastName: "Pelletier", number: 9, position: "LW", team: "Tigers U11", category: "U11" },
  { id: "p9", firstName: "Nathan", lastName: "Côté", number: 5, position: "D", team: "Bears U11", category: "U11", evaluatorId: "eval-3" },
  { id: "p10", firstName: "Zoé", lastName: "Bergeron", number: 13, position: "C", team: "Hawks U11", category: "U11" }
];

export default function EvaluatorAssignmentsPage() {
  const [players, setPlayers] = React.useState<Player[]>(mockPlayers);
  const [evaluators] = React.useState<Evaluator[]>(mockEvaluators);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedEvaluator, setSelectedEvaluator] = React.useState<string>("all");
  const [showAssignmentModal, setShowAssignmentModal] = React.useState(false);
  const [selectedPlayers, setSelectedPlayers] = React.useState<string[]>([]);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = `${player.firstName} ${player.lastName} ${player.team}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || player.category === selectedCategory;
    const matchesEvaluator = selectedEvaluator === "all" || 
      (selectedEvaluator === "unassigned" && !player.evaluatorId) ||
      player.evaluatorId === selectedEvaluator;
    
    return matchesSearch && matchesCategory && matchesEvaluator;
  });

  const getEvaluatorName = (evaluatorId: string) => {
    const evaluator = evaluators.find(e => e.id === evaluatorId);
    return evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : "";
  };

  const handleAssignPlayers = (evaluatorId: string) => {
    setPlayers(prev => prev.map(player => 
      selectedPlayers.includes(player.id) 
        ? { ...player, evaluatorId }
        : player
    ));
    setSelectedPlayers([]);
    setShowAssignmentModal(false);
  };

  const handleUnassignPlayer = (playerId: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, evaluatorId: undefined }
        : player
    ));
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const unassignedCount = players.filter(p => !p.evaluatorId).length;
  const assignedCount = players.filter(p => p.evaluatorId).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center mb-4">
            <Link href="/dashboard/staff">
              <Button variant="outline" size="sm" className="mr-4">
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Assignation des évaluateurs</h1>
              <p className="text-sm text-gray-600">
                Assignez les joueurs aux évaluateurs pour les évaluations
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{players.length}</div>
            <div className="text-sm text-gray-600">Total joueurs</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{assignedCount}</div>
            <div className="text-sm text-gray-600">Assignés</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{unassignedCount}</div>
            <div className="text-sm text-gray-600">Non assignés</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{evaluators.length}</div>
            <div className="text-sm text-gray-600">Évaluateurs</div>
          </div>
        </motion.div>

        {/* Evaluators Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Charge de travail des évaluateurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluators.map((evaluator) => (
              <div key={evaluator.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-sm">
                      {evaluator.firstName[0]}{evaluator.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">
                      {evaluator.firstName} {evaluator.lastName}
                    </h4>
                    <p className="text-xs text-gray-600">{evaluator.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assignés</span>
                    <span className="font-medium">{evaluator.assignedCount}/{evaluator.maxAssignments}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        evaluator.assignedCount / evaluator.maxAssignments > 0.8 
                          ? 'bg-red-500' 
                          : evaluator.assignedCount / evaluator.maxAssignments > 0.6 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${(evaluator.assignedCount / evaluator.maxAssignments) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher joueur ou équipe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Toutes catégories</option>
                <option value="U15">U15</option>
                <option value="U13">U13</option>
                <option value="U11">U11</option>
                <option value="U9">U9</option>
              </select>
              <select
                value={selectedEvaluator}
                onChange={(e) => setSelectedEvaluator(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="unassigned">Non assignés</option>
                {evaluators.map(evaluator => (
                  <option key={evaluator.id} value={evaluator.id}>
                    {evaluator.firstName} {evaluator.lastName}
                  </option>
                ))}
              </select>
            </div>
            {selectedPlayers.length > 0 && (
              <Button
                onClick={() => setShowAssignmentModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Assigner {selectedPlayers.length} joueur(s)
              </Button>
            )}
          </div>
        </motion.div>

        {/* Players List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Joueurs ({filteredPlayers.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player.id)}
                      onChange={() => togglePlayerSelection(player.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-sm">
                      {player.number}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {player.position}
                        </Badge>
                        <span className="text-sm text-gray-600">{player.team}</span>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          {player.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {player.evaluatorId ? (
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {getEvaluatorName(player.evaluatorId)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnassignPlayer(player.id)}
                        >
                          Retirer
                        </Button>
                      </div>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Non assigné
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assigner {selectedPlayers.length} joueur(s)
                  </h3>
                  <button
                    onClick={() => setShowAssignmentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Sélectionnez un évaluateur pour assigner les joueurs sélectionnés
                  </p>
                  
                  {evaluators.map((evaluator) => (
                    <button
                      key={evaluator.id}
                      onClick={() => handleAssignPlayers(evaluator.id)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {evaluator.firstName} {evaluator.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {evaluator.assignedCount}/{evaluator.maxAssignments} assignés
                          </div>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              evaluator.assignedCount / evaluator.maxAssignments > 0.8 
                                ? 'bg-red-500' 
                                : evaluator.assignedCount / evaluator.maxAssignments > 0.6 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${(evaluator.assignedCount / evaluator.maxAssignments) * 100}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}