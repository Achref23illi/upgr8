"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCampModalProps {
  isOpen: boolean;
  onClose: () => void;
  camp: {
    id: string;
    name: string;
    level: string;
    location: string;
    startDate: string;
    endDate: string;
    groups: Array<{ id: string; name: string; color: string }>;
  };
  onSave: (campData: {
    name: string;
    level: string;
    location: string;
    startDate: string;
    endDate: string;
    groups: Array<{ id: string; name: string; color: string }>;
  }) => void;
}

const levelOptions = [
  { value: "U7", label: "U7" },
  { value: "U9", label: "U9" },
  { value: "U11", label: "U11" },
  { value: "U13", label: "U13" },
  { value: "U15", label: "U15" },
  { value: "U18", label: "U18" },
  { value: "Junior", label: "Junior" },
  { value: "Senior", label: "Senior" },
  { value: "M15", label: "M15" },
  { value: "M17", label: "M17" }
];

const defaultGroupColors = ["#ef4444", "#374151", "#6b7280", "#9ca3af"];

export function EditCampModal({ isOpen, onClose, camp, onSave }: EditCampModalProps) {
  const [formData, setFormData] = useState({
    name: camp.name,
    level: camp.level,
    location: camp.location,
    startDate: camp.startDate,
    endDate: camp.endDate,
    groups: [...camp.groups]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du camp est requis";
    }
    if (!formData.level) {
      newErrors.level = "Le niveau est requis";
    }
    if (!formData.location.trim()) {
      newErrors.location = "L'emplacement est requis";
    }
    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }
    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }
    if (formData.groups.length < 1) {
      newErrors.groups = "Au moins un groupe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving camp:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addGroup = () => {
    const newGroup = {
      id: `g${formData.groups.length + 1}`,
      name: `Groupe ${String.fromCharCode(65 + formData.groups.length)}`,
      color: defaultGroupColors[formData.groups.length % defaultGroupColors.length]
    };
    setFormData({
      ...formData,
      groups: [...formData.groups, newGroup]
    });
  };

  const removeGroup = (groupId: string) => {
    setFormData({
      ...formData,
      groups: formData.groups.filter(g => g.id !== groupId)
    });
  };

  const updateGroup = (groupId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      groups: formData.groups.map(g => 
        g.id === groupId ? { ...g, [field]: value } : g
      )
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Modifier le camp</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <span className="text-4xl leading-none block w-8 h-8 flex items-center justify-center">×</span>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du camp *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Camp M15 Excellence"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-600">⚠ {errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau *</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger className={errors.level ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-sm text-red-600">⚠ {errors.level}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Emplacement *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Centre Sportif Montréal"
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-sm text-red-600">⚠ {errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">⚠ {errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">⚠ {errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Groups Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Groupes</h3>
                <p className="text-sm text-gray-600">Gérez les groupes du camp</p>
              </div>
              <Button onClick={addGroup} variant="outline" size="sm">
                + Ajouter un groupe
              </Button>
            </div>

            {errors.groups && (
              <p className="text-sm text-red-600">⚠ {errors.groups}</p>
            )}

            <div className="space-y-3">
              {formData.groups.map((group, index) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="font-medium text-gray-900">Groupe {index + 1}</span>
                    </div>
                    {formData.groups.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGroup(group.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`group-name-${group.id}`}>Nom du groupe</Label>
                      <Input
                        id={`group-name-${group.id}`}
                        value={group.name}
                        onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                        placeholder="Ex: Groupe A"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`group-color-${group.id}`}>Couleur</Label>
                      <div className="flex gap-2 mt-2">
                        {defaultGroupColors.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                              group.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateGroup(group.id, 'color', color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>
    </div>
  );
}