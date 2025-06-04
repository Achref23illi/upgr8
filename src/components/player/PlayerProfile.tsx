"use client";

import { useState } from "react";
import { 
  Camera, 
  Save, 
  Edit2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlayerProfileProps {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    position: string;
    number: number;
    photoUrl: string | null;
    email: string;
  };
}

const positions = [
  'Gardien', 
  'Défenseur', 
  'Attaquant'
];

export function PlayerProfile({ player }: PlayerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: player.firstName,
    lastName: player.lastName,
    dateOfBirth: player.dateOfBirth,
    position: player.position,
    number: player.number,
    email: player.email,
    photoUrl: player.photoUrl || ''
  });

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: player.firstName,
      lastName: player.lastName,
      dateOfBirth: player.dateOfBirth,
      position: player.position,
      number: player.number,
      email: player.email,
      photoUrl: player.photoUrl || ''
    });
    setIsEditing(false);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mon profil hockey</h2>
          <p className="text-gray-600 mt-1">Gardez vos informations à jour pour les entraîneurs et évaluateurs</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Modifier le profil
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button onClick={handleCancel} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800 text-white">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo and Quick Stats */}
        <div className="space-y-6">
          {/* Photo Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-4 ring-gray-100">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h3 className="text-xl font-semibold mt-4">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-gray-600">#{formData.number} • {formData.position}</p>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Mon parcours hockey
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Catégorie d&apos;âge</span>
                <span className="font-medium">U{calculateAge(formData.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Années de jeu</span>
                <span className="font-medium">5 ans</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Niveau de compétence</span>
                <span className="font-medium text-gray-900">Avancé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Informations personnelles
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">
                    Prénom
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">
                    Nom de famille
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                    placeholder="Votre nom de famille"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Adresse courriel
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                  placeholder="votre.courriel@exemple.com"
                />
                <p className="text-xs text-gray-500 mt-1">Utilisé pour les notifications importantes concernant les camps et évaluations</p>
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">
                  Date de naissance
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Ceci détermine votre catégorie d&apos;âge pour les camps</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="position" className="text-gray-700 font-medium">
                    Position de jeu
                  </Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="position" className="mt-2">
                      <SelectValue placeholder="Sélectionnez votre position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="number" className="text-gray-700 font-medium">
                    Numéro de chandail
                  </Label>
                  <Input
                    id="number"
                    type="number"
                    min="0"
                    max="99"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                    disabled={!isEditing}
                    className="mt-2"
                    placeholder="00"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}