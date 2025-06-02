"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicSelect } from "@/components/ui/dynamic-select";

interface AddEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvaluation: (evaluation: {
    playerName: string;
    playerId: string;
    evaluatorName: string;
    evaluationDate: string;
    evaluationType: string;
    category: string;
    overallRating: number;
    skills: {
      skating: number;
      shooting: number;
      passing: number;
      stickHandling: number;
      positioning: number;
      hockey_iq: number;
      compete: number;
      physicality: number;
    };
    strengths: string;
    improvements: string;
    comments: string;
    recommendedLevel: string;
    nextSteps: string;
  }) => void;
  players: Array<{ id: string; name: string; team: string }>;
}

const evaluationTypes = [
  { value: "seasonal", label: "Évaluation Saisonnière" },
  { value: "tryout", label: "Essai/Tryout" },
  { value: "progress", label: "Suivi de Progrès" },
  { value: "special", label: "Évaluation Spéciale" }
];

const categories = [
  { value: "U7", label: "U7 (Initiation)" },
  { value: "U9", label: "U9 (Novice)" },
  { value: "U11", label: "U11 (Atome)" },
  { value: "U13", label: "U13 (Pee-Wee)" },
  { value: "U15", label: "U15 (Bantam)" },
  { value: "U18", label: "U18 (Midget)" },
  { value: "Junior", label: "Junior" },
  { value: "Senior", label: "Senior" }
];

const recommendedLevels = [
  { value: "recreational", label: "Récréatif" },
  { value: "c", label: "C" },
  { value: "cc", label: "CC" },
  { value: "b", label: "B" },
  { value: "bb", label: "BB" },
  { value: "a", label: "A" },
  { value: "aa", label: "AA" },
  { value: "aaa", label: "AAA" },
  { value: "elite", label: "Elite" }
];

const skillLabels = {
  skating: "Patinage",
  shooting: "Tir",
  passing: "Passes",
  stickHandling: "Maniement",
  positioning: "Positionnement",
  hockey_iq: "QI Hockey",
  compete: "Compétitivité",
  physicality: "Physique"
};

export function AddEvaluationModal({ 
  isOpen, 
  onClose, 
  onAddEvaluation, 
  players 
}: AddEvaluationModalProps) {
  const [formData, setFormData] = React.useState({
    playerId: "",
    evaluatorName: "",
    evaluationDate: new Date().toISOString().split('T')[0],
    evaluationType: "",
    category: "",
    overallRating: 5,
    skills: {
      skating: 5,
      shooting: 5,
      passing: 5,
      stickHandling: 5,
      positioning: 5,
      hockey_iq: 5,
      compete: 5,
      physicality: 5
    },
    strengths: "",
    improvements: "",
    comments: "",
    recommendedLevel: "",
    nextSteps: ""
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith("skills.")) {
      const skillName = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillName]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.playerId) newErrors.playerId = "Le joueur est requis";
    if (!formData.evaluatorName.trim()) newErrors.evaluatorName = "Le nom de l'évaluateur est requis";
    if (!formData.evaluationType) newErrors.evaluationType = "Le type d'évaluation est requis";
    if (!formData.category) newErrors.category = "La catégorie est requise";
    if (!formData.strengths.trim()) newErrors.strengths = "Les forces sont requises";
    if (!formData.improvements.trim()) newErrors.improvements = "Les améliorations sont requises";
    if (!formData.recommendedLevel) newErrors.recommendedLevel = "Le niveau recommandé est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedPlayer = players.find(p => p.id === formData.playerId);
    
    onAddEvaluation({
      ...formData,
      playerName: selectedPlayer?.name || "",
      overallRating: Math.round(
        Object.values(formData.skills).reduce((a, b) => a + b, 0) / 
        Object.keys(formData.skills).length * 10
      ) / 10
    });
    
    // Reset form
    setFormData({
      playerId: "",
      evaluatorName: "",
      evaluationDate: new Date().toISOString().split('T')[0],
      evaluationType: "",
      category: "",
      overallRating: 5,
      skills: {
        skating: 5,
        shooting: 5,
        passing: 5,
        stickHandling: 5,
        positioning: 5,
        hockey_iq: 5,
        compete: 5,
        physicality: 5
      },
      strengths: "",
      improvements: "",
      comments: "",
      recommendedLevel: "",
      nextSteps: ""
    });
    setErrors({});
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const renderSkillSlider = (skill: keyof typeof formData.skills) => (
    <div key={skill} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {skillLabels[skill]}
        </label>
        <span className="text-sm font-semibold text-gray-900">
          {formData.skills[skill]}/10
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={formData.skills[skill]}
        onChange={(e) => handleInputChange(`skills.${skill}`, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${formData.skills[skill] * 10}%, #e5e7eb ${formData.skills[skill] * 10}%, #e5e7eb 100%)`
        }}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );

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
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <ClipboardCheck className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Nouvelle Évaluation
                  </h2>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Information Générale</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DynamicSelect
                      placeholder="Sélectionner un joueur"
                      value={formData.playerId}
                      onValueChange={(value) => handleInputChange("playerId", value)}
                      options={players.map(p => ({ 
                        value: p.id, 
                        label: `${p.name} - ${p.team}` 
                      }))}
                      required
                    />

                    <DynamicInput
                      type="text"
                      placeholder="Nom de l'évaluateur"
                      value={formData.evaluatorName}
                      onChange={(e) => handleInputChange("evaluatorName", e.target.value)}
                      error={errors.evaluatorName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DynamicInput
                      type="date"
                      value={formData.evaluationDate}
                      onChange={(e) => handleInputChange("evaluationDate", e.target.value)}
                    />

                    <DynamicSelect
                      placeholder="Type d'évaluation"
                      value={formData.evaluationType}
                      onValueChange={(value) => handleInputChange("evaluationType", value)}
                      options={evaluationTypes}
                      required
                    />
                    
                    <DynamicSelect
                      placeholder="Catégorie"
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                      options={categories}
                      required
                    />
                  </div>
                </div>

                {/* Skills Evaluation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Évaluation des Compétences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(formData.skills).map((skill) => 
                      renderSkillSlider(skill as keyof typeof formData.skills)
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Note Globale</span>
                      <div className="flex items-center space-x-2">
                        <Star className={`h-6 w-6 ${
                          Math.round(Object.values(formData.skills).reduce((a, b) => a + b, 0) / 
                          Object.keys(formData.skills).length) >= 8 ? 'text-yellow-500' : 
                          Math.round(Object.values(formData.skills).reduce((a, b) => a + b, 0) / 
                          Object.keys(formData.skills).length) >= 6 ? 'text-orange-500' : 'text-gray-400'
                        }`} />
                        <span className="text-2xl font-bold text-gray-900">
                          {Math.round(Object.values(formData.skills).reduce((a, b) => a + b, 0) / 
                          Object.keys(formData.skills).length * 10) / 10}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Written Evaluation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Évaluation Écrite</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Forces principales
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Décrivez les principales forces du joueur..."
                        value={formData.strengths}
                        onChange={(e) => handleInputChange("strengths", e.target.value)}
                      />
                      {errors.strengths && (
                        <p className="text-sm text-red-600 mt-1">{errors.strengths}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points à améliorer
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Identifiez les domaines nécessitant une amélioration..."
                        value={formData.improvements}
                        onChange={(e) => handleInputChange("improvements", e.target.value)}
                      />
                      {errors.improvements && (
                        <p className="text-sm text-red-600 mt-1">{errors.improvements}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commentaires additionnels
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Observations supplémentaires ou contexte..."
                        value={formData.comments}
                        onChange={(e) => handleInputChange("comments", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recommandations</h3>
                  
                  
                  <DynamicSelect
                    placeholder="Niveau recommandé"
                    value={formData.recommendedLevel}
                    onValueChange={(value) => handleInputChange("recommendedLevel", value)}
                    options={recommendedLevels}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prochaines étapes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Recommandations pour le développement futur..."
                      value={formData.nextSteps}
                      onChange={(e) => handleInputChange("nextSteps", e.target.value)}
                    />
                  </div>
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
                    Créer l&apos;Évaluation
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