"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeam: (team: {
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
  }) => void;
}

// Hockey categories and levels
const categories = [
  "Novice",
  "Atome", 
  "Pee-Wee",
  "Bantam",
  "Midget",
  "Junior",
  "Senior"
];

const levels = [
  "Récréatif",
  "C",
  "CC", 
  "B",
  "BB",
  "A",
  "AA",
  "AAA",
  "Elite"
];

const arenas = [
  "Aréna Jean-Béliveau",
  "Centre Sportif Metro",
  "Aréna Communautaire",
  "Aréna Municipal",
  "Aréna Sud",
  "Aréna Nord",
  "Complexe Sportif Central",
  "Aréna des Champions"
];

const teamColors = [
  { name: "Rouge Foncé", value: "bg-red-800" },
  { name: "Bleu Foncé", value: "bg-blue-800" },
  { name: "Vert Foncé", value: "bg-green-800" },
  { name: "Jaune Foncé", value: "bg-yellow-700" },
  { name: "Violet Foncé", value: "bg-purple-800" },
  { name: "Gris Foncé", value: "bg-gray-800" },
  { name: "Indigo Foncé", value: "bg-indigo-800" },
  { name: "Orange Foncé", value: "bg-orange-800" },
  { name: "Teal Foncé", value: "bg-teal-800" },
  { name: "Rose Foncé", value: "bg-rose-800" },
];

export function AddTeamModal({ isOpen, onClose, onAddTeam }: AddTeamModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    level: "",
    playersCount: "",
    averageAge: "",
    wins: "0",
    losses: "0",
    overtimeLosses: "0",
    goalsFor: "0",
    goalsAgainst: "0",
    nextGame: "",
    arena: "",
    coach: "",
    assistantCoach: "",
    founded: new Date().getFullYear().toString(),
    color: "bg-red-800"
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Le nom de l'équipe est requis";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.level) newErrors.level = "Le niveau est requis";
    if (!formData.coach.trim()) newErrors.coach = "Le nom de l'entraîneur est requis";
    if (!formData.arena) newErrors.arena = "L'aréna est requis";
    
    const playersCount = parseInt(formData.playersCount);
    if (!formData.playersCount || playersCount < 10 || playersCount > 25) {
      newErrors.playersCount = "Le nombre de joueurs doit être entre 10 et 25";
    }

    const averageAge = parseFloat(formData.averageAge);
    if (!formData.averageAge || averageAge < 5 || averageAge > 25) {
      newErrors.averageAge = "L'âge moyen doit être entre 5 et 25 ans";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const teamData = {
      ...formData,
      playersCount: parseInt(formData.playersCount),
      averageAge: parseFloat(formData.averageAge),
      wins: parseInt(formData.wins),
      losses: parseInt(formData.losses),
      overtimeLosses: parseInt(formData.overtimeLosses),
      goalsFor: parseInt(formData.goalsFor),
      goalsAgainst: parseInt(formData.goalsAgainst),
      assistantCoach: formData.assistantCoach || undefined
    };

    onAddTeam(teamData);
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      level: "",
      playersCount: "",
      averageAge: "",
      wins: "0",
      losses: "0",
      overtimeLosses: "0",
      goalsFor: "0",
      goalsAgainst: "0",
      nextGame: "",
      arena: "",
      coach: "",
      assistantCoach: "",
      founded: new Date().getFullYear().toString(),
      color: "bg-red-800"
    });
    setErrors({});
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

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
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Ajouter une Nouvelle Équipe
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-8 w-8" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Team Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Information de l&apos;Équipe</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicInput
                      type="text"
                      placeholder="Nom de l'équipe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={errors.name}
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <DynamicSelect
                        placeholder="Catégorie"
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                        options={categories.map(cat => ({ value: cat, label: cat }))}
                      />

                      <DynamicSelect
                        placeholder="Niveau"
                        value={formData.level}
                        onValueChange={(value) => handleInputChange("level", value)}
                        options={levels.map(level => ({ value: level, label: level }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DynamicInput
                      type="number"
                      placeholder="Nombre de joueurs"
                      value={formData.playersCount}
                      onChange={(e) => handleInputChange("playersCount", e.target.value)}
                      error={errors.playersCount}
                      min="10"
                      max="25"
                      required
                    />

                    <DynamicInput
                      type="number"
                      placeholder="Âge moyen"
                      value={formData.averageAge}
                      onChange={(e) => handleInputChange("averageAge", e.target.value)}
                      error={errors.averageAge}
                      step="0.1"
                      min="5"
                      max="25"
                      required
                    />

                    <DynamicInput
                      type="text"
                      placeholder="Année de fondation"
                      value={formData.founded}
                      onChange={(e) => handleInputChange("founded", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicSelect
                      placeholder="Aréna principal"
                      value={formData.arena}
                      onValueChange={(value) => handleInputChange("arena", value)}
                      options={arenas.map(arena => ({ value: arena, label: arena }))}
                    />
                    <DynamicSelect
                      placeholder="Couleur de l'équipe"
                      value={formData.color}
                      onValueChange={(value) => handleInputChange("color", value)}
                      options={teamColors.map(color => ({ 
                        value: color.value, 
                        label: color.name 
                      }))}
                    />
                  </div>
                </div>

                {/* Staff Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personnel d&apos;Entraînement</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicInput
                      type="text"
                      placeholder="Entraîneur principal"
                      value={formData.coach}
                      onChange={(e) => handleInputChange("coach", e.target.value)}
                      error={errors.coach}
                      required
                    />

                    <DynamicInput
                      type="text"
                      placeholder="Entraîneur assistant (optionnel)"
                      value={formData.assistantCoach}
                      onChange={(e) => handleInputChange("assistantCoach", e.target.value)}
                    />
                  </div>
                </div>

                {/* Season Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Statistiques de la Saison</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Victoires
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="0"
                        value={formData.wins}
                        onChange={(e) => handleInputChange("wins", e.target.value)}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Défaites
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="0"
                        value={formData.losses}
                        onChange={(e) => handleInputChange("losses", e.target.value)}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        D Prolongation
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="0"
                        value={formData.overtimeLosses}
                        onChange={(e) => handleInputChange("overtimeLosses", e.target.value)}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buts Pour
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="0"
                        value={formData.goalsFor}
                        onChange={(e) => handleInputChange("goalsFor", e.target.value)}
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buts Contre
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="0"
                        value={formData.goalsAgainst}
                        onChange={(e) => handleInputChange("goalsAgainst", e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Next Game */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Prochain Match</h3>
                  
                  <DynamicInput
                    type="text"
                    placeholder="Ex: Samedi 15h00 vs Éperviers"
                    value={formData.nextGame}
                    onChange={(e) => handleInputChange("nextGame", e.target.value)}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ajouter l&apos;Équipe
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}