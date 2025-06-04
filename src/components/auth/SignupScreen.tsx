"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { DynamicSelect, type DynamicSelectOption } from "@/components/ui/dynamic-select";
import { SimpleLoadingScreen } from "@/components/common/SimpleLoadingScreen";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, UserPlus, Upload, Users, UserCircle, Briefcase, Calendar, ImageIcon, Link } from "lucide-react";

/**
 * Form values interface for signup submission
 */
export interface SignupFormData {
  // Initial signup
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "coach" | "player";
  // Coach specific
  coachRole?: string;
  coachLevel?: string;
  teamName?: string;
  teamCategory?: string;
  teamLevel?: string;
  players?: Player[];
  // Player specific
  dateOfBirth?: string;
  playerPosition?: string;
  jerseyNumber?: string;
  profilePhoto?: string;
  linkExistingProfile?: boolean;
  existingProfileCode?: string;
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
 * Props for the SignupScreen component
 */
export interface SignupScreenProps {
  onSignupSubmit?: (data: SignupFormData) => void;
  onNavigateToLogin?: () => void;
}

/**
 * SignupScreen Component
 */
export function SignupScreen({
  onSignupSubmit,
  onNavigateToLogin
}: SignupScreenProps) {
  // Step management
  const [currentStep, setCurrentStep] = React.useState(0); // 0 = initial signup
  const [isCoachFlow, setIsCoachFlow] = React.useState(false);
  
  // Form state
  const [formData, setFormData] = React.useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "coach",
    coachRole: "",
    coachLevel: "",
    teamName: "",
    teamCategory: "",
    teamLevel: "",
    players: [],
    dateOfBirth: "",
    playerPosition: "",
    jerseyNumber: "",
    profilePhoto: "",
    linkExistingProfile: false,
    existingProfileCode: "",
  });
  
  const [errors, setErrors] = React.useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Player form state
  const [newPlayer, setNewPlayer] = React.useState<Omit<Player, "id">>({
    fullName: "",
    number: "",
    position: "",
  });

  // Options for selects
  const coachRoleOptions: DynamicSelectOption[] = [
    { value: "coach-chef", label: "Coach-chef" },
    { value: "dg", label: "DG (Directeur Général)" },
    { value: "directeur-hockey", label: "Directeur hockey" },
  ];

  const coachLevelOptions: DynamicSelectOption[] = [
    { value: "Initiation", label: "Initiation" },
    { value: "Régional", label: "Régional" },
    { value: "Provincial", label: "Provincial" },
    { value: "National", label: "National" },
    { value: "Haute Performance", label: "Haute Performance" },
  ];

  const teamCategoryOptions: DynamicSelectOption[] = [
    { value: "U7", label: "U7 (Pré-novice)" },
    { value: "U9", label: "U9 (Novice)" },
    { value: "U11", label: "U11 (Atome)" },
    { value: "U13", label: "U13 (Pee-wee)" },
    { value: "U15", label: "U15 (Bantam)" },
    { value: "U18", label: "U18 (Midget)" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
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
    { value: "Centre", label: "Centre" },
    { value: "Ailier gauche", label: "Ailier gauche" },
    { value: "Ailier droit", label: "Ailier droit" },
  ];

  const playerPositionOptions: DynamicSelectOption[] = [
    { value: "Gardien", label: "Gardien" },
    { value: "Défenseur", label: "Défenseur" },
    { value: "Attaquant", label: "Attaquant" },
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof SignupFormData];
        return newErrors;
      });
    }
  };

  // Handle role toggle
  const handleRoleChange = (role: "coach" | "player") => {
    setFormData(prev => ({ ...prev, role }));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (step === 0) {
      // Initial signup validation
      if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName) newErrors.lastName = "Le nom de famille est requis";
      if (!formData.email) {
        newErrors.email = "Le courriel est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Veuillez entrer une adresse courriel valide";
      }
      if (!formData.password) {
        newErrors.password = "Le mot de passe est requis";
      } else if (formData.password.length < 8) {
        newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
      }
    } else if (step === 1 && isCoachFlow) {
      // Coach role selection
      if (!formData.coachRole) newErrors.coachRole = "Veuillez sélectionner votre rôle";
    } else if (step === 2 && isCoachFlow) {
      // Personal info
      if (!formData.coachLevel) newErrors.coachLevel = "Le niveau d&apos;entraîneur est requis";
    } else if (step === 3 && isCoachFlow) {
      // Team creation
      if (!formData.teamName) newErrors.teamName = "Le nom de l&apos;équipe est requis";
      if (!formData.teamCategory) newErrors.teamCategory = "La catégorie d&apos;équipe est requise";
    } else if (step === 1 && !isCoachFlow) {
      // Player personal info
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "La date de naissance est requise";
      if (!formData.playerPosition) newErrors.playerPosition = "La position est requise";
      if (!formData.jerseyNumber) newErrors.jerseyNumber = "Le numéro de chandail est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle initial signup
  const handleInitialSignup = () => {
    if (!validateStep(0)) return;
    
    if (formData.role === "coach") {
      setIsCoachFlow(true);
      setCurrentStep(1);
    } else {
      // Player flow - wait for instructions
      setCurrentStep(1);
    }
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
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
        players: [...(prev.players || []), player],
      }));
      setNewPlayer({ fullName: "", number: "", position: "" });
    }
  };

  // Remove player
  const removePlayer = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players?.filter(p => p.id !== playerId) || [],
    }));
  };

  // Final submission
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (onSignupSubmit) {
        onSignupSubmit(formData);
      } else {
        console.log("Signup completed:", formData);
        window.location.href = formData.role === "coach" ? "/dashboard/coach" : "/player";
      }
      setIsSubmitting(false);
    }, 2000);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.3 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Render step content
  const renderStepContent = () => {
    // Initial signup form
    if (currentStep === 0) {
      return (
        <motion.div
          key="initial-signup"
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Créer un compte</h1>
            <p className="text-gray-600 text-sm">Commencez votre parcours hockey avec UpGr8</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Je suis un :</p>
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => handleRoleChange("coach")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                  formData.role === "coach"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                Entraîneur
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("player")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200",
                  formData.role === "player"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                Joueur
              </button>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <DynamicInput
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Jean"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  className="h-10 text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de famille
                </label>
                <DynamicInput
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Dupont"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse courriel
              </label>
              <DynamicInput
                type="email"
                name="email"
                id="email"
                placeholder="jean@exemple.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                className="h-10 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <DynamicInput
                type="password"
                name="password"
                id="password"
                placeholder="Créez un mot de passe robuste"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                className="h-10 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Doit contenir au moins 8 caractères</p>
            </div>

            <div className="text-xs text-gray-600">
              En créant un compte, vous acceptez nos{" "}
              <a href="#" className="font-medium text-red-600 hover:text-red-700">
                Conditions d&apos;utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="font-medium text-red-600 hover:text-red-700">
                Politique de confidentialité
              </a>
            </div>

            <button
              type="button"
              onClick={handleInitialSignup}
              className="w-full py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
            >
              Créer le compte
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">
                Vous avez déjà un compte ?{" "}
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateToLogin) {
                      onNavigateToLogin();
                    } else {
                      window.location.href = "/";
                    }
                  }}
                  className="font-medium text-red-600 hover:text-red-700"
                >
                  Se connecter
                </a>
              </span>
            </div>
          </form>
        </motion.div>
      );
    }

    // Coach flow
    if (isCoachFlow) {
      switch (currentStep) {
        case 1:
          // Coach role selection
          return (
            <motion.div
              key="coach-role"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Sélectionnez votre rôle</h2>
                  <p className="text-gray-600 text-sm">Choisissez votre poste d&apos;entraîneur</p>
                </div>
              </div>

              <div className="space-y-2">
                {coachRoleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center p-3 border rounded-lg cursor-pointer transition-all text-sm",
                      formData.coachRole === option.value
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="coachRole"
                      value={option.value}
                      checked={formData.coachRole === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, coachRole: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{option.label}</p>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      formData.coachRole === option.value
                        ? "border-red-500 bg-red-500"
                        : "border-gray-300"
                    )}>
                      {formData.coachRole === option.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.coachRole && (
                <p className="text-sm text-red-600">{errors.coachRole}</p>
              )}
            </motion.div>
          );

        case 2:
          // Personal information
          return (
            <motion.div
              key="personal-info"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <UserCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Informations entraîneur</h2>
                  <p className="text-gray-600 text-sm">Parlez-nous de votre expérience d&apos;entraîneur</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Niveau d&apos;entraîneur
                </label>
                <DynamicSelect
                  placeholder="Sélectionnez votre niveau"
                  options={coachLevelOptions}
                  value={formData.coachLevel || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, coachLevel: value }))}
                />
                {errors.coachLevel && (
                  <p className="text-sm text-red-600 mt-1">{errors.coachLevel}</p>
                )}
              </div>
            </motion.div>
          );

        case 3:
          // Team creation
          return (
            <motion.div
              key="team-creation"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Créez votre équipe</h2>
                  <p className="text-gray-600 text-sm">Configurez les informations de votre équipe</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nom de l&apos;équipe
                </label>
                <DynamicInput
                  type="text"
                  name="teamName"
                  placeholder="Entrez le nom de l&apos;équipe"
                  value={formData.teamName || ""}
                  onChange={handleInputChange}
                  error={errors.teamName}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Catégorie
                </label>
                <DynamicSelect
                  placeholder="Sélectionnez la catégorie"
                  options={teamCategoryOptions}
                  value={formData.teamCategory || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, teamCategory: value }))}
                />
                {errors.teamCategory && (
                  <p className="text-sm text-red-600 mt-1">{errors.teamCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Niveau (Optionnel)
                </label>
                <DynamicSelect
                  placeholder="Sélectionnez le niveau"
                  options={teamLevelOptions}
                  value={formData.teamLevel || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, teamLevel: value }))}
                  disabled={!formData.teamCategory}
                />
              </div>
            </motion.div>
          );

        case 4:
          // Player management
          return (
            <motion.div
              key="player-management"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <UserPlus className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ajouter des joueurs</h2>
                  <p className="text-gray-600 text-sm">Construisez l&apos;alignement de votre équipe (optionnel)</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-medium text-gray-900">
                  {formData.players?.length || 0} joueur{formData.players?.length !== 1 && "s"} ajouté{formData.players?.length !== 1 && "s"}
                </p>
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Ajouter un joueur</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DynamicInput
                    type="text"
                    placeholder="Nom complet"
                    value={newPlayer.fullName}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, fullName: e.target.value }))
                    }
                    className="h-10"
                  />
                  <DynamicInput
                    type="number"
                    placeholder="Numéro"
                    value={newPlayer.number}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, number: e.target.value }))
                    }
                    className="h-10"
                  />
                </div>
                <DynamicSelect
                  placeholder="Sélectionnez la position"
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
                  className="w-full"
                />
              </div>

              {formData.players && formData.players.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Joueurs ajoutés</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {formData.players.map(player => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-white border rounded-lg p-3"
                      >
                        <div>
                          <span className="font-medium">#{player.number}</span> - {player.fullName}
                          {player.position && <span className="text-gray-500 ml-2">({player.position})</span>}
                        </div>
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <DynamicButton
                  label="Importer depuis CSV"
                  variant="outline"
                  icon={Upload}
                  onClick={() => alert("Import CSV bientôt disponible")}
                  className="w-full"
                />
              </div>
            </motion.div>
          );
      }
    }

    // Player flow
    if (!isCoachFlow) {
      switch (currentStep) {
        case 1:
          // Player personal information
          return (
            <motion.div
              key="player-info"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <UserCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Informations joueur</h2>
                  <p className="text-gray-600 text-sm">Parlez-nous de vous</p>
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date de naissance
                </label>
                <div className="relative">
                  <DynamicInput
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth || ""}
                    onChange={handleInputChange}
                    error={errors.dateOfBirth}
                    className="h-10 text-sm pl-10"
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Position
                </label>
                <DynamicSelect
                  placeholder="Sélectionnez votre position"
                  options={playerPositionOptions}
                  value={formData.playerPosition || ""}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, playerPosition: value }))}
                />
                {errors.playerPosition && (
                  <p className="text-sm text-red-600 mt-1">{errors.playerPosition}</p>
                )}
              </div>

              <div>
                <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Numéro de chandail
                </label>
                <DynamicInput
                  type="number"
                  name="jerseyNumber"
                  id="jerseyNumber"
                  placeholder="99"
                  value={formData.jerseyNumber || ""}
                  onChange={handleInputChange}
                  error={errors.jerseyNumber}
                  className="h-10 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Photo de profil (optionnelle)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger une photo</p>
                  <p className="text-xs text-gray-500">PNG, JPG jusqu&apos;à 5 Mo</p>
                </div>
              </div>
            </motion.div>
          );

        case 2:
          // Link existing profile
          return (
            <motion.div
              key="link-profile"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Link className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Lier un profil existant</h2>
                  <p className="text-gray-600 text-sm">Connectez-vous à votre historique d&apos;évaluations</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="profileOption"
                    checked={!formData.linkExistingProfile}
                    onChange={() => setFormData(prev => ({ ...prev, linkExistingProfile: false }))}
                    className="text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Créer un nouveau profil</p>
                    <p className="text-sm text-gray-600">Commencer avec un nouveau profil de joueur</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="profileOption"
                    checked={formData.linkExistingProfile === true}
                    onChange={() => setFormData(prev => ({ ...prev, linkExistingProfile: true }))}
                    className="text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Lier un profil existant</p>
                    <p className="text-sm text-gray-600">Se connecter aux évaluations des camps précédents</p>
                  </div>
                </label>
              </div>

              {formData.linkExistingProfile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="existingProfileCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Code de profil ou inscription au camp
                    </label>
                    <DynamicInput
                      type="text"
                      name="existingProfileCode"
                      id="existingProfileCode"
                      placeholder="Entrez le code fourni par votre entraîneur"
                      value={formData.existingProfileCode || ""}
                      onChange={handleInputChange}
                      className="h-10 text-sm"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Demandez à votre entraîneur votre code de profil ou utilisez votre numéro d&apos;inscription au camp
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Conseil :</strong> Si vous n&apos;avez pas de code, vous pouvez quand même créer un nouveau profil. 
                      Votre entraîneur pourra lier vos évaluations plus tard.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
      }
    }
  };

  // Calculate total steps
  const totalSteps = isCoachFlow ? 4 : 2;

  return (
    <>
      <SimpleLoadingScreen isLoading={isSubmitting} />
      
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <motion.div 
          className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-8 bg-white"
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <div className="w-full max-w-sm">
            {/* Logo */}
            {currentStep === 0 && (
              <div className="mb-6">
                <Image 
                  src="/logo.png" 
                  alt="UpGr8 Logo" 
                  width={140} 
                  height={49}
                  priority
                  className="w-auto h-12"
                />
              </div>
            )}

            {/* Progress indicator for multi-step */}
            {currentStep > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-600">
                    Étape {currentStep} de {totalSteps}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-red-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation for multi-step */}
            {currentStep > 0 && (
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Retour
                </button>
                
                {(isCoachFlow && currentStep < 4) || (!isCoachFlow && currentStep < 2) ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    Continuer
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Création..." : "Terminer"}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div 
          className="hidden lg:block lg:w-[60%] relative overflow-hidden bg-gray-100"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <Image
            src="/signup.jpg"
            alt="Hockey players"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
        </motion.div>
      </div>
    </>
  );
}

export default SignupScreen;