"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camp, CampLevel, Group } from "@/types/coach";

interface AddCampModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Camp, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Camp | null;
}

const campLevels: CampLevel[] = ['U7', 'U9', 'U11', 'U13', 'U15', 'U18', 'Junior', 'Senior', 'M15', 'M13'];

type CampFormat = 'single-group' | 'multiple-teams';

const groupColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export function AddCampModal({ isOpen, onClose, onSubmit, initialData }: AddCampModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    level: '' as CampLevel,
    location: '',
    startDate: '',
    endDate: '',
    format: 'single-group' as CampFormat,
    groups: [] as Omit<Group, 'id' | 'campId'>[],
    isActive: true,
    logo: null as File | null
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        level: initialData.level,
        location: initialData.location,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        format: initialData.groups.length <= 1 ? 'single-group' : 'multiple-teams',
        groups: initialData.groups.map(g => ({ name: g.name, color: g.color })),
        isActive: initialData.isActive,
        logo: null
      });
    } else {
      setFormData({
        name: '',
        level: '' as CampLevel,
        location: '',
        startDate: '',
        endDate: '',
        format: 'single-group',
        groups: [],
        isActive: true,
        logo: null
      });
    }
  }, [initialData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du camp est requis";
    }
    if (!formData.level) {
      newErrors.level = "Le niveau est requis";
    }
    if (!formData.location.trim()) {
      newErrors.location = "L&apos;emplacement est requis";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      logo: formData.logo ? logoPreview || undefined : undefined,
      groups: formData.groups.map((g, index) => ({
        ...g,
        id: `group-${Date.now()}-${index}`,
        campId: ''
      }))
    });
  };

  const addGroup = () => {
    const usedColors = formData.groups.map(g => g.color);
    const availableColors = groupColors.filter(c => !usedColors.includes(c));
    const color = availableColors.length > 0 ? availableColors[0] : groupColors[0];
    
    const groupName = formData.format === 'single-group' 
      ? `Groupe ${formData.groups.length + 1}`
      : `Équipe ${formData.groups.length + 1}`;
    
    setFormData({
      ...formData,
      groups: [...formData.groups, { name: groupName, color }]
    });
  };

  const handleFormatChange = (newFormat: CampFormat) => {
    setFormData({
      ...formData,
      format: newFormat,
      groups: []
    });
  };

  const removeGroup = (index: number) => {
    setFormData({
      ...formData,
      groups: formData.groups.filter((_, i) => i !== index)
    });
  };

  const updateGroup = (index: number, field: 'name' | 'color', value: string) => {
    const newGroups = [...formData.groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setFormData({ ...formData, groups: newGroups });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Modifier le camp' : 'Création d&apos;un camp'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configurez votre nouveau camp d&apos;évaluation hockey
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Camp Identity */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">
              Identité du camp
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="name">Nom du camp *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Camp Excellence M15 Printemps 2025"
                    className={errors.name ? 'border-red-500' : ''}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Niveau *</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value as CampLevel })}
                      required
                    >
                      <SelectTrigger id="level" className={errors.level ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {campLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.level && <p className="text-sm text-red-600 mt-1">{errors.level}</p>}
                  </div>

                  <div>
                    <Label htmlFor="location">Lieu *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Centre Sportif Montréal"
                      className={errors.location ? 'border-red-500' : ''}
                      required
                    />
                    {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={errors.startDate ? 'border-red-500' : ''}
                      required
                    />
                    {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      min={formData.startDate}
                      className={errors.endDate ? 'border-red-500' : ''}
                      required
                    />
                    {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>}
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <Label>Logo ou identité visuelle (optionnel)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-24 h-24 object-contain mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, logo: null });
                          setLogoPreview(null);
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <label htmlFor="logo" className="cursor-pointer">
                          <span className="text-sm font-medium text-red-600 hover:text-red-700">
                            Ajouter un logo
                          </span>
                          <input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu&apos;à 2MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Camp Format */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">
              Format du camp
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.format === 'single-group' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFormatChange('single-group')}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="single-group"
                    name="format"
                    value="single-group"
                    checked={formData.format === 'single-group'}
                    onChange={() => handleFormatChange('single-group')}
                    className="w-4 h-4 text-red-600 mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="single-group" className="font-medium cursor-pointer text-base">
                      Format groupes d&apos;entraînement
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Tous les participants s&apos;entraînent ensemble, organisés en groupes pour une meilleure gestion
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.format === 'multiple-teams' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFormatChange('multiple-teams')}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id="multiple-teams"
                    name="format"
                    value="multiple-teams"
                    checked={formData.format === 'multiple-teams'}
                    onChange={() => handleFormatChange('multiple-teams')}
                    className="w-4 h-4 text-red-600 mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="multiple-teams" className="font-medium cursor-pointer text-base">
                      Format équipes compétitives
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Les participants sont divisés en équipes distinctes qui s&apos;affrontent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Groups/Teams Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">
              Configuration des {formData.format === 'single-group' ? 'groupes' : 'équipes'}
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                  {formData.format === 'single-group' 
                    ? 'Créez des groupes d&apos;entraînement pour organiser les participants'
                    : 'Créez des équipes qui s\'affronteront durant le camp'
                  }
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGroup}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {formData.groups.map((group, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div
                      className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors flex-shrink-0"
                      style={{ backgroundColor: group.color }}
                      onClick={() => {
                        const currentIndex = groupColors.indexOf(group.color);
                        const nextIndex = (currentIndex + 1) % groupColors.length;
                        updateGroup(index, 'color', groupColors[nextIndex]);
                      }}
                      title="Cliquer pour changer la couleur"
                    />
                    <Input
                      value={group.name}
                      onChange={(e) => updateGroup(index, 'name', e.target.value)}
                      placeholder={`Nom du ${formData.format === 'single-group' ? 'groupe' : 'équipe'}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGroup(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-10 w-10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}

                {formData.groups.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-white">
                    <p className="text-sm text-gray-500 mb-2">
                      Aucun {formData.format === 'single-group' ? 'groupe' : 'équipe'} ajouté
                    </p>
                    <p className="text-xs text-gray-400">
                      Cliquez sur &quot;Ajouter&quot; pour commencer
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
              {initialData ? 'Mettre à jour le camp' : 'Créer le camp'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
