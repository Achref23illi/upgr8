"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Player evaluation interface
interface PlayerEvaluation {
  id: string;
  playerName: string;
  playerNumber: number;
  position: string;
  skills: {
    skating: number;
    shooting: number;
    passing: number;
    defense: number;
    gameIQ: number;
    attitude: number;
  };
  comments: string;
  evaluatedBy: string;
  date: Date;
}

// Mock data
const mockEvaluations: PlayerEvaluation[] = [
  {
    id: "eval-1",
    playerName: "Emma Gagnon",
    playerNumber: 31,
    position: "G",
    skills: { skating: 8, shooting: 6, passing: 7, defense: 9, gameIQ: 8, attitude: 9 },
    comments: "Excellente gardienne, très réactive. Doit améliorer la sortie de zone.",
    evaluatedBy: "Coach Martin",
    date: new Date("2024-01-15")
  },
  {
    id: "eval-2", 
    playerName: "Marc Tremblay",
    playerNumber: 24,
    position: "LW",
    skills: { skating: 7, shooting: 8, passing: 6, defense: 5, gameIQ: 7, attitude: 8 },
    comments: "Bon tireur, patinage à améliorer. Très motivé à l'entraînement.",
    evaluatedBy: "Coach Sarah",
    date: new Date("2024-01-14")
  },
  {
    id: "eval-3",
    playerName: "Sophie Lavoie", 
    playerNumber: 7,
    position: "D",
    skills: { skating: 8, shooting: 5, passing: 8, defense: 9, gameIQ: 8, attitude: 9 },
    comments: "Défenseuse solide, excellente vision de jeu. Continue comme ça.",
    evaluatedBy: "Coach Martin",
    date: new Date("2024-01-13")
  }
];

// Mock players data
const mockPlayers = [
  // U5 Players
  { id: "p1", name: "Lily Tremblay", number: 2, position: "C", category: "U5" },
  { id: "p2", name: "Noah Dubois", number: 5, position: "LW", category: "U5" },
  { id: "p3", name: "Zoé Martin", number: 8, position: "RW", category: "U5" },
  { id: "p4", name: "Sam Gagnon", number: 11, position: "D", category: "U5" },
  { id: "p5", name: "Mia Roy", number: 14, position: "G", category: "U5" },

  // U7 Players
  { id: "p6", name: "Alex Dubois", number: 3, position: "C", category: "U7" },
  { id: "p7", name: "Marie Côté", number: 7, position: "LW", category: "U7" },
  { id: "p8", name: "Lucas Martin", number: 12, position: "D", category: "U7" },
  { id: "p9", name: "Emma Roy", number: 15, position: "RW", category: "U7" },
  { id: "p10", name: "Noah Gagnon", number: 21, position: "G", category: "U7" },

  // U9 Players
  { id: "p11", name: "Félix Boucher", number: 4, position: "C", category: "U9" },
  { id: "p12", name: "Jade Pelletier", number: 9, position: "LW", category: "U9" },
  { id: "p13", name: "William Côté", number: 13, position: "D", category: "U9" },
  { id: "p14", name: "Chloé Lavoie", number: 16, position: "RW", category: "U9" },
  { id: "p15", name: "Antoine Morin", number: 20, position: "G", category: "U9" },

  // U11 Players
  { id: "p16", name: "Gabriel Fortin", number: 6, position: "C", category: "U11" },
  { id: "p17", name: "Camille Bouchard", number: 10, position: "LW", category: "U11" },
  { id: "p18", name: "Mathis Roy", number: 14, position: "D", category: "U11" },
  { id: "p19", name: "Léa Gagnon", number: 18, position: "RW", category: "U11" },
  { id: "p20", name: "Raphaël Martin", number: 25, position: "G", category: "U11" },

  // U13 Players
  { id: "p21", name: "Justin Tremblay", number: 8, position: "C", category: "U13" },
  { id: "p22", name: "Océane Dubois", number: 11, position: "LW", category: "U13" },
  { id: "p23", name: "Samuel Côté", number: 17, position: "D", category: "U13" },
  { id: "p24", name: "Maëlle Boucher", number: 19, position: "RW", category: "U13" },
  { id: "p25", name: "Étienne Pelletier", number: 30, position: "G", category: "U13" },
  
  // U15 Players
  { id: "p26", name: "Emma Gagnon", number: 31, position: "G", category: "U15" },
  { id: "p27", name: "Marc Tremblay", number: 24, position: "LW", category: "U15" },
  { id: "p28", name: "Sophie Lavoie", number: 7, position: "D", category: "U15" },
  { id: "p29", name: "Thomas Roy", number: 15, position: "RW", category: "U15" },
  { id: "p30", name: "Gabriel Morin", number: 12, position: "C", category: "U15" },
  { id: "p31", name: "Maya Boucher", number: 19, position: "LW", category: "U15" },
  { id: "p32", name: "Nathan Côté", number: 5, position: "D", category: "U15" },
  
  // U18 Players
  { id: "p33", name: "Simon Pelletier", number: 9, position: "C", category: "U18" },
  { id: "p34", name: "Jade Fortin", number: 17, position: "RW", category: "U18" },
  { id: "p35", name: "Olivier Bouchard", number: 23, position: "D", category: "U18" },
  { id: "p36", name: "Camille Gagnon", number: 22, position: "LW", category: "U18" },
  { id: "p37", name: "Vincent Moreau", number: 1, position: "G", category: "U18" },

  // Junior Players
  { id: "p38", name: "Alexandre Dumont", number: 27, position: "C", category: "Junior" },
  { id: "p39", name: "Sarah Leblanc", number: 18, position: "LW", category: "Junior" },
  { id: "p40", name: "Maxime Gauthier", number: 4, position: "D", category: "Junior" },
  { id: "p41", name: "Jessica Caron", number: 26, position: "RW", category: "Junior" },
  { id: "p42", name: "Kevin Bergeron", number: 35, position: "G", category: "Junior" },
  { id: "p43", name: "Émilie Rousseau", number: 13, position: "C", category: "Junior" },
  { id: "p44", name: "Jonathan Mercier", number: 21, position: "D", category: "Junior" },

  // Senior Players
  { id: "p45", name: "Patrick Bélanger", number: 16, position: "C", category: "Senior" },
  { id: "p46", name: "Caroline Desjardins", number: 28, position: "LW", category: "Senior" },
  { id: "p47", name: "Daniel Girard", number: 6, position: "D", category: "Senior" },
  { id: "p48", name: "Marie-Claude Hébert", number: 14, position: "RW", category: "Senior" },
  { id: "p49", name: "François Leclerc", number: 33, position: "G", category: "Senior" },
  { id: "p50", name: "Nathalie Poirier", number: 29, position: "C", category: "Senior" },
  { id: "p51", name: "Stéphane Thibault", number: 8, position: "D", category: "Senior" },
  { id: "p52", name: "Isabelle Lafond", number: 25, position: "LW", category: "Senior" }
];

export default function EvaluationsPage() {
  const [selectedPlayer, setSelectedPlayer] = React.useState<PlayerEvaluation | null>(null);
  const [showNewEvalModal, setShowNewEvalModal] = React.useState(false);
  const [evaluations, setEvaluations] = React.useState<PlayerEvaluation[]>(mockEvaluations);
  const [newEvaluation, setNewEvaluation] = React.useState({
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
  const [selectedCategory, setSelectedCategory] = React.useState("U15");
  const [selectedPlayerId, setSelectedPlayerId] = React.useState("");

  const getSkillColor = (score: number) => {
    if (score >= 8) return "text-green-700 bg-green-50";
    if (score >= 6) return "text-yellow-700 bg-yellow-50";
    return "text-red-700 bg-red-red-50";
  };

  const calculateAverage = (skills: PlayerEvaluation['skills']) => {
    const values = Object.values(skills);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

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

  const filteredPlayers = mockPlayers.filter(player => player.category === selectedCategory);

  const handleNewEvaluation = () => {
    if (!selectedPlayerId) return;

    // Créer la nouvelle évaluation
    const newPlayerEvaluation: PlayerEvaluation = {
      id: `eval-${Date.now()}`,
      playerName: newEvaluation.playerName,
      playerNumber: parseInt(newEvaluation.playerNumber),
      position: newEvaluation.position,
      skills: newEvaluation.skills,
      comments: newEvaluation.comments,
      evaluatedBy: newEvaluation.evaluatedBy,
      date: new Date()
    };

    // Ajouter à la liste des évaluations
    setEvaluations(prev => [newPlayerEvaluation, ...prev]);

    console.log("Nouvelle évaluation:", newPlayerEvaluation);
    setShowNewEvalModal(false);
    
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

  // Limiter aux 7 évaluations les plus récentes
  const recentEvaluations = evaluations.slice(0, 7);

  // Filtrer les évaluations de cette saison (2024-2025)
  const thisSeasonEvaluations = evaluations.filter(evaluation => {
    const evalYear = evaluation.date.getFullYear();
    const evalMonth = evaluation.date.getMonth();
    // Saison 2024-25: Septembre 2024 à Août 2025
    return (evalYear === 2024 && evalMonth >= 8) || (evalYear === 2025 && evalMonth < 8);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Évaluations</h1>
          <p className="text-sm text-gray-600">Toutes catégories - Saison 2024</p>
        </div>
        <Button 
          size="sm" 
          className="text-sm bg-red-600 hover:bg-red-700"
          onClick={() => setShowNewEvalModal(true)}
        >
          Nouvelle évaluation
        </Button>
      </div>

      {/* Section des évaluations de cette saison */}
      <div className="bg-white border rounded-lg mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-900">
              Évaluations de cette saison ({thisSeasonEvaluations.length})
            </h2>
            <Badge className="bg-red-100 text-red-800">2024-25</Badge>
          </div>
        </div>
        <div className="divide-y">
          {thisSeasonEvaluations.length > 0 ? (
            thisSeasonEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                onClick={() => setSelectedPlayer(evaluation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedPlayer?.id === evaluation.id ? 'bg-red-50 border-l-4 border-red-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-sm font-medium text-red-700">
                      {evaluation.playerNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{evaluation.playerName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{evaluation.position}</span>
                        <span>•</span>
                        <span>{evaluation.date.toLocaleDateString('fr-CA')}</span>
                        <span>•</span>
                        <span>{evaluation.evaluatedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-gray-900">
                      {calculateAverage(evaluation.skills)}/10
                    </div>
                    <div className="text-sm text-gray-500">Moyenne</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">Aucune évaluation pour cette saison</p>
              <p className="text-xs mt-1">Les évaluations apparaîtront ici une fois créées</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Liste des évaluations récentes */}
        <div className="lg:col-span-2 bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-base font-medium text-gray-900">
              Évaluations récentes ({recentEvaluations.length}/7)
            </h2>
          </div>
          <div className="divide-y">
            {recentEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                onClick={() => setSelectedPlayer(evaluation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedPlayer?.id === evaluation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {evaluation.playerNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{evaluation.playerName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{evaluation.position}</span>
                        <span>•</span>
                        <span>{evaluation.date.toLocaleDateString('fr-CA')}</span>
                        <span>•</span>
                        <span>{evaluation.evaluatedBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-medium text-gray-900">
                      {calculateAverage(evaluation.skills)}/10
                    </div>
                    <div className="text-sm text-gray-500">Moyenne</div>
                  </div>
                </div>
              </div>
            ))}
            
            {recentEvaluations.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Aucune évaluation disponible</p>
                <p className="text-xs mt-1">Commencez par créer une nouvelle évaluation</p>
              </div>
            )}
          </div>
        </div>

        {/* Détails de l'évaluation */}
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-base font-medium text-gray-900">Détails</h2>
          </div>
          <div className="p-4">
            {selectedPlayer ? (
              <div className="space-y-5">
                {/* Informations joueur */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-base font-medium">
                      {selectedPlayer.playerNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">{selectedPlayer.playerName}</h3>
                      <p className="text-sm text-gray-600">{selectedPlayer.position}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Évalué par {selectedPlayer.evaluatedBy} le {selectedPlayer.date.toLocaleDateString('fr-CA')}
                  </div>
                </div>

                {/* Compétences */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">Compétences</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedPlayer.skills).map(([skill, score]) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {skill === 'gameIQ' ? 'Vision de jeu' : 
                           skill === 'skating' ? 'Patinage' :
                           skill === 'shooting' ? 'Tir' :
                           skill === 'passing' ? 'Passes' :
                           skill === 'defense' ? 'Défense' :
                           skill === 'attitude' ? 'Attitude' : skill}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                          <span className={`text-sm px-2 py-1 rounded ${getSkillColor(score)}`}>
                            {score}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900">Moyenne générale</span>
                      <span className="text-base font-bold text-blue-600">
                        {calculateAverage(selectedPlayer.skills)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Commentaires */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-3">Commentaires</h4>
                  <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 leading-relaxed">
                    {selectedPlayer.comments}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="text-sm flex-1">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Imprimer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4"></div>
                <p className="text-base text-gray-500">Sélectionnez une évaluation</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{evaluations.length}</div>
          <div className="text-sm text-gray-600">Total Évaluations</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-red-600">{thisSeasonEvaluations.length}</div>
          <div className="text-sm text-gray-600">Cette saison</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {evaluations.length > 0 
              ? (evaluations.reduce((acc, evaluation) => acc + parseFloat(calculateAverage(evaluation.skills)), 0) / evaluations.length).toFixed(1)
              : '0.0'
            }
          </div>
          <div className="text-sm text-gray-600">Moyenne équipe</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {evaluations.filter(evaluation => {
              const daysDiff = Math.floor((new Date().getTime() - evaluation.date.getTime()) / (1000 * 60 * 60 * 24));
              return daysDiff <= 7;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Cette semaine</div>
        </div>
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-gray-900">
            {new Set(evaluations.map(evaluation => evaluation.playerName)).size}
          </div>
          <div className="text-sm text-gray-600">Joueurs évalués</div>
        </div>
      </div>

      {/* Modal nouvelle évaluation */}
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