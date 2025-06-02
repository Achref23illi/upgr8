"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Camera,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
  Languages
} from "lucide-react";
import { DynamicInput } from "@/components/ui/dynamic-input";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { cn } from "@/lib/utils";

/**
 * User profile settings interface
 */
interface UserSettings {
  // Profile
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  bio: string;
  avatar?: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  trainingReminders: boolean;
  evaluationAlerts: boolean;
  weeklyReports: boolean;
  
  // Security
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  
  // Preferences
  language: string;
  timezone: string;
  theme: string;
  dateFormat: string;
  autoSave: boolean;
  compactView: boolean;
}

/**
 * Settings Page Component
 * 
 * Comprehensive settings interface with multiple sections:
 * - Profile settings
 * - Notification preferences  
 * - Security settings
 * - Application preferences
 */
export default function SettingsPage() {
  const [settings, setSettings] = React.useState<UserSettings>({
    // Profile defaults
    firstName: "Martin",
    lastName: "Dubois", 
    email: "coach.martin@upgr8.com",
    phone: "+1 (514) 555-0123",
    organization: "Club de Hockey Montréal",
    bio: "Coach principal avec 15 ans d'expérience en développement des jeunes talents.",
    
    // Notification defaults
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    trainingReminders: true,
    evaluationAlerts: true,
    weeklyReports: true,
    
    // Security defaults
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    
    // Preferences defaults
    language: "fr",
    timezone: "America/Montreal",
    theme: "light",
    dateFormat: "DD/MM/YYYY",
    autoSave: true,
    compactView: false
  });

  const [errors, setErrors] = React.useState<Partial<UserSettings>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof UserSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate password changes
  const validatePasswordChange = (): boolean => {
    const newErrors: Partial<UserSettings> = {};
    
    if (settings.newPassword && !settings.currentPassword) {
      newErrors.currentPassword = "Mot de passe actuel requis";
    }
    
    if (settings.newPassword && settings.newPassword.length < 8) {
      newErrors.newPassword = "Le nouveau mot de passe doit contenir au moins 8 caractères";
    }
    
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save settings
  const handleSaveSettings = async (section: string) => {
    setIsSaving(true);
    
    // Validate password section if needed
    if (section === "security" && settings.newPassword && !validatePasswordChange()) {
      setIsSaving(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Saving ${section} settings:`, settings);
      setIsSaving(false);
      
      // Clear password fields after successful save
      if (section === "security") {
        setSettings(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
        <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Préférences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informations du profil
              </h2>
              
              {/* Avatar Section */}
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-red-100 text-red-600 text-xl font-semibold">
                    {settings.firstName[0]}{settings.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DynamicButton
                    label="Changer la photo"
                    variant="outline"
                    icon={Camera}
                    onClick={() => alert("Fonctionnalité de téléchargement à implémenter")}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG ou GIF. Taille maximale 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DynamicInput
                  label="Prénom"
                  value={settings.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                <DynamicInput
                  label="Nom"
                  value={settings.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                <DynamicInput
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <DynamicInput
                  label="Téléphone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-4 mb-6">
                <DynamicInput
                  label="Organisation"
                  value={settings.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Décrivez votre expérience et expertise..."
                  />
                </div>
              </div>

              <DynamicButton
                label={isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
                onClick={() => handleSaveSettings("profile")}
                disabled={isSaving}
                icon={Save}
              />
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Préférences de notification
              </h2>

              <div className="space-y-6">
                {/* Communication Preferences */}
                <div>
                  <h3 className="font-medium mb-3">Méthodes de communication</h3>
                  <div className="space-y-3">
                    {[
                      { key: "emailNotifications", label: "Notifications par email", icon: Mail },
                      { key: "smsNotifications", label: "Notifications SMS", icon: Smartphone },
                      { key: "pushNotifications", label: "Notifications push", icon: Bell }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof UserSettings] as boolean}
                          onChange={(e) => handleInputChange(key as keyof UserSettings, e.target.checked)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Event Notifications */}
                <div>
                  <h3 className="font-medium mb-3">Types de notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: "trainingReminders", label: "Rappels d'entraînement" },
                      { key: "evaluationAlerts", label: "Alertes d'évaluation" },
                      { key: "weeklyReports", label: "Rapports hebdomadaires" }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof UserSettings] as boolean}
                          onChange={(e) => handleInputChange(key as keyof UserSettings, e.target.checked)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <DynamicButton
                  label={isSaving ? "Sauvegarde..." : "Sauvegarder les préférences"}
                  onClick={() => handleSaveSettings("notifications")}
                  disabled={isSaving}
                  icon={Save}
                />
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Paramètres de sécurité
              </h2>

              {/* Password Change */}
              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Changer le mot de passe</h3>
                <div className="relative">
                  <DynamicInput
                    label="Mot de passe actuel"
                    type={showCurrentPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    error={errors.currentPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <DynamicInput
                    label="Nouveau mot de passe"
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    error={errors.newPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <DynamicInput
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>

              {/* Two-Factor Authentication */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Authentification à deux facteurs</h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => handleInputChange("twoFactorEnabled", e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <Lock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Activer l&apos;authentification à deux facteurs</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
              </div>

              <DynamicButton
                label={isSaving ? "Sauvegarde..." : "Mettre à jour la sécurité"}
                onClick={() => handleSaveSettings("security")}
                disabled={isSaving}
                icon={Save}
              />
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Préférences d&apos;application
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language & Region */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Languages className="w-4 h-4 mr-2" />
                    Langue et région
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format de date
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleInputChange("dateFormat", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                {/* Interface Preferences */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Interface
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thème
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleInputChange("theme", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="light">Clair</option>
                      <option value="dark">Sombre</option>
                      <option value="auto">Automatique</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: "autoSave", label: "Sauvegarde automatique" },
                      { key: "compactView", label: "Vue compacte" }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key as keyof UserSettings] as boolean}
                          onChange={(e) => handleInputChange(key as keyof UserSettings, e.target.checked)}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <DynamicButton
                  label={isSaving ? "Sauvegarde..." : "Sauvegarder les préférences"}
                  onClick={() => handleSaveSettings("preferences")}
                  disabled={isSaving}
                  icon={Save}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}