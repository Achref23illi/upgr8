"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
//import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  //UserCheck, 
  //AlertTriangle,
  //FileText,
  //TrendingUp,
  //Activity,
  BarChart3,
  Plus,
  ClipboardCheck,
  User
} from "lucide-react";
//import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardStats, Alert, Camp } from "@/types/coach";
import { AddCampModal } from "@/components/coach/AddCampModal";
import { AddPlayerModal } from "@/components/coach/AddPlayerModal";
import { AddTeamModal } from "@/components/teams/AddTeamModal";

const mockStats: DashboardStats = {
  activeCamps: 3,
  totalPlayers: 156,
  evaluatorsAssigned: 12,
  pendingEvaluations: 34,
  completedEvaluations: 122,
  reportsGenerated: 89
};

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "unevaluated-player",
    title: "Joueurs non évalués",
    message: "8 joueurs n'ont reçu aucune évaluation dans le camp M15 Excellence",
    severity: "warning",
    campId: "camp-1",
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    id: "2",
    type: "inactive-evaluator",
    title: "Évaluateur inactif",
    message: "Jean Tremblay n'a pas soumis d'évaluation depuis 3 jours",
    severity: "warning",
    evaluatorId: "eval-1",
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    id: "3",
    type: "pending-validation",
    title: "Rapports en attente",
    message: "5 rapports IA générés attendent votre validation",
    severity: "info",
    createdAt: new Date().toISOString(),
    isRead: false
  }
];

const mockActiveCamps: Camp[] = [
  {
    id: "camp-1",
    name: "Camp M15 Excellence",
    level: "M15",
    location: "Centre Sportif Montréal",
    startDate: "2025-03-10",
    endDate: "2025-03-15",
    groups: [
      { id: "g1", campId: "camp-1", name: "Groupe A", color: "#ef4444" },
      { id: "g2", campId: "camp-1", name: "Groupe B", color: "#3b82f6" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "camp-2",
    name: "Camp M13 Développement",
    level: "M13",
    location: "Aréna Laval",
    startDate: "2025-03-17",
    endDate: "2025-03-20",
    groups: [
      { id: "g3", campId: "camp-2", name: "Groupe A", color: "#10b981" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];


export default function CoachDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [activeCamps, setActiveCamps] = useState<Camp[]>(mockActiveCamps);
  const [isAddCampModalOpen, setIsAddCampModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [showNewEvalModal, setShowNewEvalModal] = useState(false);

  // Evaluation state
  const [newEvaluation, setNewEvaluation] = useState({
    playerName: "",
    playerNumber: "",
    position: "",
    skills: {
      skating: 5,
      shooting: 5,
      passing: 5,
      defense: 5,
      gameIQ: 5,
      attitude: 5
    },
    comments: "",
    evaluatedBy: "Coach Martin"
  });
  const [selectedCategory, setSelectedCategory] = useState("U15");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  // Mock players data
  const mockPlayers = [
    // U15 Players
    { id: "p1", name: "Alexandre Dubois", number: 17, position: "C", category: "U15" },
    { id: "p2", name: "Maxime Tremblay", number: 9, position: "LW", category: "U15" },
    { id: "p3", name: "Gabriel Roy", number: 4, position: "D", category: "U15" },
    { id: "p4", name: "Samuel Gagné", number: 31, position: "G", category: "U15" },
    // U13 Players
    { id: "p5", name: "Émile Bouchard", number: 12, position: "C", category: "U13" },
    { id: "p6", name: "Sophie Lavoie", number: 7, position: "D", category: "U13" },
    // U11 Players
    { id: "p7", name: "Gabriel Fortin", number: 6, position: "C", category: "U11" },
    { id: "p8", name: "Camille Bouchard", number: 10, position: "LW", category: "U11" },
    // U9 Players
    { id: "p9", name: "Félix Boucher", number: 4, position: "C", category: "U9" },
    { id: "p10", name: "Jade Pelletier", number: 9, position: "LW", category: "U9" }
  ];

  const statCards = [
    {
      title: "Camps actifs",
      value: stats.activeCamps,
      change: "+2 ce mois-ci"
    },
    {
      title: "Total joueurs",
      value: stats.totalPlayers,
      change: "+12 cette semaine"
    },
    {
      title: "Évaluateurs",
      value: stats.evaluatorsAssigned,
      change: "Tous actifs"
    },
    {
      title: "Évaluations",
      value: `${stats.completedEvaluations}/${stats.completedEvaluations + stats.pendingEvaluations}`,
      change: `${stats.pendingEvaluations} en attente`
    }
  ];


  const handleCreateCamp = (campData: Omit<Camp, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCamp: Camp = {
      ...campData,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setActiveCamps([...activeCamps, newCamp]);
    setIsAddCampModalOpen(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      activeCamps: prev.activeCamps + 1
    }));
  };

  const handleCreatePlayer = (playerData: unknown) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Player created:", playerData);
        setIsAddPlayerModalOpen(false);
        // Update stats
        setStats(prev => ({
          ...prev,
          totalPlayers: prev.totalPlayers + 1
        }));
        resolve(playerData);
      }, 1000);
    });
  };

  const handleCreateTeam = (teamData: unknown) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Team created:", teamData);
        setIsAddTeamModalOpen(false);
        resolve(teamData);
      }, 1000);
    });
  };

  // Evaluation handlers
  const handlePlayerSelect = (playerId: string) => {
    const player = mockPlayers.find(p => p.id === playerId);
    if (player) {
      setNewEvaluation(prev => ({
        ...prev,
        playerName: player.name,
        playerNumber: player.number.toString(),
        position: player.position
      }));
      setSelectedPlayerId(playerId);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPlayerId("");
    setNewEvaluation(prev => ({
      ...prev,
      playerName: "",
      playerNumber: "",
      position: ""
    }));
  };

  const handleNewEvaluation = () => {
    if (!selectedPlayerId) return;

    // Create the new evaluation
    const newPlayerEvaluation = {
      id: `eval-${Date.now()}`,
      playerName: newEvaluation.playerName,
      playerNumber: parseInt(newEvaluation.playerNumber),
      position: newEvaluation.position,
      skills: newEvaluation.skills,
      comments: newEvaluation.comments,
      evaluatedBy: newEvaluation.evaluatedBy,
      date: new Date()
    };

    console.log("Nouvelle évaluation:", newPlayerEvaluation);
    setShowNewEvalModal(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingEvaluations: prev.pendingEvaluations + 1
    }));
    
    // Reset form
    setNewEvaluation({
      playerName: "",
      playerNumber: "",
      position: "",
      skills: { skating: 5, shooting: 5, passing: 5, defense: 5, gameIQ: 5, attitude: 5 },
      comments: "",
      evaluatedBy: "Coach Martin"
    });
    setSelectedCategory("U15");
    setSelectedPlayerId("");
  };

  const filteredPlayers = mockPlayers.filter(player => player.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Gérez vos camps et suivez les performances</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytiques
              </button>
              <button 
                onClick={() => setIsAddCampModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Nouveau camp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setIsAddPlayerModalOpen(true)}
              className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors group">
              <div className="text-center">
                <p className="font-medium text-gray-900">Ajouter joueur</p>
                <p className="text-sm text-gray-600">Inscrire nouveau joueur</p>
              </div>
            </button>
            
            <button 
              onClick={() => setShowNewEvalModal(true)}
              className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors group">
              <div className="text-center">
                <p className="font-medium text-gray-900">Nouvelle évaluation</p>
                <p className="text-sm text-gray-600">Commencer évaluation joueur</p>
              </div>
            </button>
            
            <button 
              onClick={() => setIsAddTeamModalOpen(true)}
              className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors group">
              <div className="text-center">
                <p className="font-medium text-gray-900">Créer équipe</p>
                <p className="text-sm text-gray-600">Former nouvelle équipe</p>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Camps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Camps actifs</h2>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => setIsAddCampModalOpen(true)}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter camp
                    </Button>
                    <button className="text-red-600 text-sm font-medium hover:text-red-700">
                      Voir tout
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activeCamps.map((camp) => (
                    <div 
                      key={camp.id} 
                      onClick={() => router.push(`/dashboard/coach/camp/${camp.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-red-700">{camp.name}</h3>
                          <p className="text-gray-600 text-sm">{camp.location}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {camp.level}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{new Date(camp.startDate).toLocaleDateString()}</span>
                          <span>{camp.groups.length} groupes</span>
                        </div>
                        <div className="text-red-600 text-sm font-medium group-hover:text-red-700">
                          Cliquer pour gérer →
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Alertes récentes</h2>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {alerts.filter(a => !a.isRead).length}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Camp Modal */}
      <AddCampModal
        isOpen={isAddCampModalOpen}
        onClose={() => setIsAddCampModalOpen(false)}
        onSubmit={handleCreateCamp}
      />

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onSubmit={handleCreatePlayer}
      />

      {/* Add Team Modal */}
      <AddTeamModal
        isOpen={isAddTeamModalOpen}
        onClose={() => setIsAddTeamModalOpen(false)}
        onSubmit={handleCreateTeam}
      />

      {/* Add Evaluation Modal */}
      {showNewEvalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Nouvelle évaluation</h2>
                <button
                  onClick={() => setShowNewEvalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Sélection catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["U5", "U7", "U9", "U11", "U13", "U15", "U18", "Junior", "Senior"].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection joueur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joueur
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => handlePlayerSelect(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Sélectionnez un joueur...</option>
                  {filteredPlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      #{player.number} - {player.name} ({player.position})
                    </option>
                  ))}
                </select>
              </div>

              {/* Informations joueur (lecture seule) */}
              {selectedPlayerId && (
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nom du joueur
                    </label>
                    <div className="text-sm text-gray-900">{newEvaluation.playerName}</div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Numéro
                    </label>
                    <div className="text-sm text-gray-900">#{newEvaluation.playerNumber}</div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Position
                    </label>
                    <div className="text-sm text-gray-900">{newEvaluation.position}</div>
                  </div>
                </div>
              )}

              {/* Compétences */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Évaluation des compétences (1-10)</h3>
                <div className="space-y-3">
                  {Object.entries(newEvaluation.skills).map(([skill, score]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 w-24">
                        {skill === 'gameIQ' ? 'Vision de jeu' : 
                         skill === 'skating' ? 'Patinage' :
                         skill === 'shooting' ? 'Tir' :
                         skill === 'passing' ? 'Passes' :
                         skill === 'defense' ? 'Défense' :
                         skill === 'attitude' ? 'Attitude' : skill}
                      </label>
                      <div className="flex items-center gap-3 flex-1 max-w-xs">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={score}
                          onChange={(e) => setNewEvaluation(prev => ({
                            ...prev,
                            skills: { ...prev.skills, [skill]: parseInt(e.target.value) }
                          }))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-gray-900 w-8">{score}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaires
                </label>
                <textarea
                  value={newEvaluation.comments}
                  onChange={(e) => setNewEvaluation(prev => ({ ...prev, comments: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Points forts, points à améliorer, observations générales..."
                />
              </div>

              {/* Évaluateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Évaluateur
                </label>
                <select
                  value={newEvaluation.evaluatedBy}
                  onChange={(e) => setNewEvaluation(prev => ({ ...prev, evaluatedBy: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="Coach Martin">Coach Martin</option>
                  <option value="Coach Sarah">Coach Sarah</option>
                  <option value="Coach Alex">Coach Alex</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewEvalModal(false)}
                className="text-sm"
              >
                Annuler
              </Button>
              <Button
                onClick={handleNewEvaluation}
                className="text-sm bg-red-600 hover:bg-red-700"
                disabled={!selectedPlayerId}
              >
                Enregistrer l&apos;évaluation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}