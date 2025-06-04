"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (player: {
    name: string;
    number: number;
    position: string;
    age: number;
    height: string;
    weight: string;
    team: string;
    phone?: string;
    email?: string;
    parent?: string;
    shoots?: "L" | "R";
    birthplace?: string;
  }) => void;
  teams: string[];
}

// Hockey positions and other options
const positions = [
  { value: "G", label: "Gardien (G)" },
  { value: "D", label: "Défenseur (D)" },
  { value: "C", label: "Centre (C)" },
  { value: "LW", label: "Ailier Gauche (LW)" },
  { value: "RW", label: "Ailier Droit (RW)" }
];

const shootingHands = [
  { value: "L", label: "Gauche" },
  { value: "R", label: "Droite" }
];

const birthplaces = [
  "Montréal, QC",
  "Québec, QC", 
  "Laval, QC",
  "Gatineau, QC",
  "Sherbrooke, QC",
  "Trois-Rivières, QC",
  "Saguenay, QC",
  "Lévis, QC",
  "Terrebonne, QC",
  "Saint-Jean-sur-Richelieu, QC",
  "Repentigny, QC",
  "Brossard, QC",
  "Drummondville, QC",
  "Saint-Jérôme, QC",
  "Granby, QC"
];

export function AddPlayerModal({ isOpen, onClose, onAddPlayer, teams }: AddPlayerModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    number: "",
    position: "",
    age: "",
    height: "",
    weight: "",
    team: "",
    phone: "",
    email: "",
    parent: "",
    shoots: "R" as "L" | "R",
    birthplace: ""
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

    if (!formData.name.trim()) newErrors.name = "Le nom du joueur est requis";
    if (!formData.position) newErrors.position = "La position est requise";
    if (!formData.team) newErrors.team = "L'équipe est requise";
    
    const number = parseInt(formData.number);
    if (!formData.number || number < 1 || number > 99) {
      newErrors.number = "Le numéro doit être entre 1 et 99";
    }

    const age = parseInt(formData.age);
    if (!formData.age || age < 5 || age > 25) {
      newErrors.age = "L'âge doit être entre 5 et 25 ans";
    }

    if (!formData.height) {
      newErrors.height = "La taille est requise";
    }

    if (!formData.weight) {
      newErrors.weight = "Le poids est requis";
    }

    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Phone validation if provided (basic)
    if (formData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Format de téléphone: 514-123-4567";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const playerData = {
      name: formData.name.trim(),
      number: parseInt(formData.number),
      position: formData.position,
      age: parseInt(formData.age),
      height: formData.height,
      weight: formData.weight,
      team: formData.team,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      parent: formData.parent || undefined,
      shoots: formData.shoots,
      birthplace: formData.birthplace || undefined
    };

    onAddPlayer(playerData);
    
    // Reset form
    setFormData({
      name: "",
      number: "",
      position: "",
      age: "",
      height: "",
      weight: "",
      team: "",
      phone: "",
      email: "",
      parent: "",
      shoots: "R",
      birthplace: ""
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
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Ajouter un Nouveau Joueur
                  </h2>
                </div>
                <Button variant="ghost" size="lg" onClick={handleClose} className="h-12 w-12">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Information Personnelle</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicInput
                      type="text"
                      placeholder="Nom complet du joueur"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      error={errors.name}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Âge
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="Âge en années"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        error={errors.age}
                        min="5"
                        max="25"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Taille
                      </label>
                      <DynamicInput
                        type="text"
                        placeholder="Ex: 175cm"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        error={errors.height}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poids
                      </label>
                      <DynamicInput
                        type="text"
                        placeholder="Ex: 65kg"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        error={errors.weight}
                        required
                      />
                    </div>
                  </div>

                  <DynamicSelect
                    placeholder="Lieu de naissance"
                    value={formData.birthplace}
                    onValueChange={(value) => handleInputChange("birthplace", value)}
                    options={birthplaces.map(place => ({ value: place, label: place }))}
                  />
                </div>

                {/* Hockey Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Information Hockey</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro
                      </label>
                      <DynamicInput
                        type="number"
                        placeholder="1-99"
                        value={formData.number}
                        onChange={(e) => handleInputChange("number", e.target.value)}
                        error={errors.number}
                        min="1"
                        max="99"
                        required
                      />
                    </div>

                    <DynamicSelect
                      placeholder="Position"
                      value={formData.position}
                      onValueChange={(value) => handleInputChange("position", value)}
                      options={positions}
                      required
                    />

                    <DynamicSelect
                      placeholder="Lance"
                      value={formData.shoots}
                      onValueChange={(value) => handleInputChange("shoots", value)}
                      options={shootingHands}
                    />
                  </div>

                  <DynamicSelect
                    placeholder="Équipe"
                    value={formData.team}
                    onValueChange={(value) => handleInputChange("team", value)}
                    options={teams.map(team => ({ value: team, label: team }))}
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Information de Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicInput
                      type="tel"
                      placeholder="Téléphone (514-123-4567)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      error={errors.phone}
                    />

                    <DynamicInput
                      type="email"
                      placeholder="Email du joueur"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      error={errors.email}
                    />
                  </div>

                  <DynamicInput
                    type="text"
                    placeholder="Nom du parent/tuteur (optionnel)"
                    value={formData.parent}
                    onChange={(e) => handleInputChange("parent", e.target.value)}
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
                    Ajouter le Joueur
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