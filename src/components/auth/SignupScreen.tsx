"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Users, UserPlus, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { DynamicSelect, type DynamicSelectOption } from "@/components/ui/dynamic-select";
import { InteractiveImageDisplay } from "@/components/common/interactive-image-display";
//import { cn } from "@/lib/utils";

/**
 * Interface for form data collected across all steps
 */
interface SignupFormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  coachLevel: string;
  // Step 2: Team Information
  teamName: string;
  teamCategory: string;
  teamLevel: string;
  // Step 3: Players
  players: Player[];
}

/**
 * Interface for player data
 */
interface Player {
  id: string;
  fullName: string;
  number: string;
  position: string;
}

/**
 * SignupScreen Component
 * 
 * A multi-step signup form with dynamic image display.
 * Features three steps: Personal Info, Team Creation, and Player Management.
 * Images update dynamically based on coach level and team selections.
 */
export function SignupScreen() {
  // Step management
  const [currentStep, setCurrentStep] = React.useState(1);
  
  // Form data state
  const [formData, setFormData] = React.useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    coachLevel: "",
    teamName: "",
    teamCategory: "",
    teamLevel: "",
    players: [],
  });

  // Form errors state
  const [errors, setErrors] = React.useState<Partial<Record<keyof SignupFormData, string>>>({});

  // Image display state
  const [currentBaseImageKey, setCurrentBaseImageKey] = React.useState<string>("");
  const [currentOverlayText, setCurrentOverlayText] = React.useState<string>("");

  // Player form state (Step 3)
  const [newPlayer, setNewPlayer] = React.useState<Omit<Player, "id">>({
    fullName: "",
    number: "",
    position: "",
  });

  // Options for DynamicSelect components
  const coachLevelOptions: DynamicSelectOption[] = [
    { value: "Initiation", label: "Initiation", imageKey: "Initiation" },
    { value: "Régional", label: "Régional", imageKey: "Régional" },
    { value: "Provincial", label: "Provincial", imageKey: "Provincial" },
    { value: "National", label: "National", imageKey: "National" },
    { value: "Haute Performance", label: "Haute Performance", imageKey: "Haute Performance" },
  ];

  const teamCategoryOptions: DynamicSelectOption[] = [
    { value: "U7 ( Pré-novice )", label: "U7 ( Pré-novice )", imageKey: "U7 ( Pré-novice )" },
    { value: "U9 ( Novice )", label: "U9 ( Novice )", imageKey: "U9 ( Novice )" },
    { value: "U11 ( Atome )", label: "U11 ( Atome )", imageKey: "U11 ( Atome )" },
    { value: "U13 ( Pee-wee )", label: "U13 ( Pee-wee )", imageKey: "U13 ( Pee-wee )" },
    { value: "U15 ( Bantam )", label: "U15 ( Bantam )", imageKey: "U15 ( Bantam )" },
    { value: "U18 ( Midget )", label: "U18 ( Midget )", imageKey: "U18 ( Midget Espoir )" },
    { value: "Junior", label: "Junior", imageKey: "U21 ( Junior )" },
    { value: "Senior", label: "Senior", imageKey: "Senior" },
  ];

  const teamLevelOptions: DynamicSelectOption[] = [
    { value: "Récréatif", label: "Récréatif" },
    { value: "C", label: "C" },
    { value: "B", label: "B" },
    { value: "A", label: "A" },
    { value: "AA", label: "AA" },
    { value: "AAA", label: "AAA" },
  ];

  const positionOptions: DynamicSelectOption[] = [
    { value: "Gardien", label: "Gardien" },
    { value: "Défenseur", label: "Défenseur" },
    { value: "Attaquant", label: "Attaquant" },
    { value: "Polyvalent", label: "Polyvalent" },
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof SignupFormData];
        return newErrors;
      });
    }
  };

  // Handle coach level change
  const handleCoachLevelChange = (value: string, option: DynamicSelectOption) => {
    setFormData(prev => ({ ...prev, coachLevel: value }));
    setCurrentBaseImageKey(option.imageKey || "");
    setCurrentOverlayText(""); // Clear overlay when showing coach
    setErrors(prev => ({ ...prev, coachLevel: undefined }));
  };

  // Handle team category change
  const handleTeamCategoryChange = (value: string, option: DynamicSelectOption) => {
    setFormData(prev => ({ ...prev, teamCategory: value }));
    setCurrentBaseImageKey(option.imageKey || "");
    setErrors(prev => ({ ...prev, teamCategory: undefined }));
  };

  // Handle team level change
  const handleTeamLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, teamLevel: value }));
    setCurrentOverlayText(value);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName) newErrors.lastName = "Le nom est requis";
      if (!formData.email) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Veuillez entrer un email valide";
      }
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 6) {
        newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      }
      if (!formData.coachLevel) newErrors.coachLevel = "Le niveau d'entraîneur est requis";
    } else if (step === 2) {
      if (!formData.teamName) newErrors.teamName = "Le nom de l'équipe est requis";
      if (!formData.teamCategory) newErrors.teamCategory = "La catégorie est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Add player
  const addPlayer = () => {
    if (newPlayer.fullName && newPlayer.number) {
      const player: Player = {
        id: Date.now().toString(),
        ...newPlayer,
      };
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, player],
      }));
      setNewPlayer({ fullName: "", number: "", position: "" });
    }
  };

  // Remove player
  const removePlayer = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId),
    }));
  };

  // Handle final submission
  const handleSubmit = () => {
    console.log("Signup completed with data:", formData);
    alert("Inscription terminée! Vous allez être redirigé vers la page de connexion.");
    // In a real app, this would save the data and then redirect
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  // Animation variants
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 mb-6">
              <UserCircle className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                <p className="text-gray-600">Créez votre profil d&apos;entraîneur</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DynamicInput
                label="Prénom"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                placeholder="Jean"
              />
              <DynamicInput
                label="Nom"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                placeholder="Dupont"
              />
            </div>

            <DynamicInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="jean.dupont@example.com"
            />

            <DynamicInput
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <DynamicSelect
              label="Niveau d'entraîneur"
              placeholder="Sélectionnez votre niveau"
              options={coachLevelOptions}
              value={formData.coachLevel}
              onValueChange={handleCoachLevelChange}
              containerClassName={errors.coachLevel ? "error" : ""}
            />
            {errors.coachLevel && (
              <p className="text-sm text-red-600 -mt-2">{errors.coachLevel}</p>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Créer votre équipe</h2>
                <p className="text-gray-600">Définissez les informations de votre équipe</p>
              </div>
            </div>

            <DynamicInput
              label="Nom de l'équipe"
              name="teamName"
              type="text"
              value={formData.teamName}
              onChange={handleInputChange}
              error={errors.teamName}
              placeholder="Les Étoiles de Montréal"
            />

            <DynamicSelect
              label="Catégorie"
              placeholder="Sélectionnez une catégorie"
              options={teamCategoryOptions}
              value={formData.teamCategory}
              onValueChange={handleTeamCategoryChange}
              containerClassName={errors.teamCategory ? "error" : ""}
            />
            {errors.teamCategory && (
              <p className="text-sm text-red-600 -mt-2">{errors.teamCategory}</p>
            )}

            <DynamicSelect
              label="Niveau (Optionnel)"
              placeholder="Sélectionnez un niveau"
              options={teamLevelOptions}
              value={formData.teamLevel}
              onValueChange={handleTeamLevelChange}
              disabled={!formData.teamCategory}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 mb-6">
              <UserPlus className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ajouter vos joueurs</h2>
                <p className="text-gray-600">Construisez votre roster</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-medium text-gray-900">
                {formData.players.length} joueur{formData.players.length !== 1 && "s"} ajouté{formData.players.length !== 1 && "s"}
              </p>
            </div>

            {/* Add player form */}
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium text-gray-900">Ajouter un joueur</h3>
              <div className="grid grid-cols-2 gap-4">
                <DynamicInput
                  label="Nom complet"
                  type="text"
                  value={newPlayer.fullName}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Marie Tremblay"
                />
                <DynamicInput
                  label="Numéro"
                  type="number"
                  value={newPlayer.number}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="99"
                />
              </div>
              <DynamicSelect
                label="Position"
                placeholder="Sélectionnez une position"
                options={positionOptions}
                value={newPlayer.position}
                onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value }))}
              />
              <DynamicButton
                label="Ajouter le joueur"
                onClick={addPlayer}
                variant="secondary"
                icon={UserPlus}
                disabled={!newPlayer.fullName || !newPlayer.number}
              />
            </div>

            {/* Players list */}
            {formData.players.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Joueurs ajoutés</h3>
                {formData.players.map(player => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-white border rounded-lg p-3"
                  >
                    <div>
                      <span className="font-medium">#{player.number}</span> - {player.fullName}
                      {player.position && <span className="text-gray-500 ml-2">({player.position})</span>}
                    </div>
                    <DynamicButton
                      label="Retirer"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(player.id)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* CSV Import */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OU</span>
              </div>
            </div>

            <div className="border rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-3">Importer depuis un fichier CSV</p>
              <DynamicButton
                label="Choisir un fichier"
                variant="outline"
                icon={Upload}
                onClick={() => alert("Import CSV - Fonctionnalité à venir")}
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Centered Form Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-600">
                    Étape {currentStep} sur 3
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentStep === 1 && "Informations personnelles"}
                    {currentStep === 2 && "Création d'équipe"}
                    {currentStep === 3 && "Ajout de joueurs"}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-red-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <DynamicButton
                    label="Retour"
                    variant="outline"
                    onClick={prevStep}
                    icon={ChevronLeft}
                  />
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <DynamicButton
                    label="Continuer"
                    onClick={nextStep}
                    icon={ChevronRight}
                    iconPosition="right"
                  />
                ) : (
                  <DynamicButton
                    label="Terminer"
                    onClick={handleSubmit}
                    variant="default"
                  />
                )}
              </div>

              {/* Link to login */}
              <div className="mt-6 text-center border-t pt-6">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte?{" "}
                  <a
                    href="/login"
                    className="text-red-600 font-medium hover:text-red-700 hover:underline"
                  >
                    Se connecter
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Image Display Section - Bottom Right */}
      <AnimatePresence>
        {currentBaseImageKey && (
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none">
            <motion.div
              key={`${currentStep}-${currentBaseImageKey}`}
              initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: 0, 
                y: 0,
                rotate: currentStep === 2 ? -5 : 0,
              }}
              exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100,
                damping: 20
              }}
              className="relative w-full h-full"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tl from-red-100/40 via-transparent to-transparent rounded-tl-full blur-2xl" />
              
              {/* Semi-transparent background */}
              <div className="absolute inset-0 bg-gradient-to-tl from-white/60 to-transparent rounded-tl-full" />
              
              {/* Image container */}
              <div className="absolute bottom-0 right-0 w-[450px] h-[450px]">
                <InteractiveImageDisplay
                  baseImageKey={currentBaseImageKey}
                  overlayText={currentOverlayText}
                  altText="Hockey player visualization"
                  className="w-full h-full"
                  imageClassName="object-contain drop-shadow-2xl"
                  overlayClassName="text-3xl w-20 h-20"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SignupScreen;