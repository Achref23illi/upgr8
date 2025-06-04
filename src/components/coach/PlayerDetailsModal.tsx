"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Hash, Target, Shield, UserCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/coach";

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
}

export function PlayerDetailsModal({ isOpen, onClose, player }: PlayerDetailsModalProps) {
  if (!isOpen) return null;

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(player.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadge = () => {
    switch (player.status) {
      case 'invite':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Invité</Badge>;
      case 'a-evaluer':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">À évaluer</Badge>;
      case 'locke':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Confirmé</Badge>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {player.firstName[0]}{player.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {player.firstName} {player.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge()}
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    #{player.number}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Target className="w-4 h-4 mr-2" />
                    Position
                  </div>
                  <p className="font-medium text-gray-900">{player.position}</p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date de naissance
                  </div>
                  <p className="font-medium text-gray-900">
                    {new Date(player.dateOfBirth).toLocaleDateString('fr-CA', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })} ({getAge()} ans)
                  </p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Hash className="w-4 h-4 mr-2" />
                    Numéro de chandail
                  </div>
                  <p className="font-medium text-gray-900">#{player.number}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Shield className="w-4 h-4 mr-2" />
                    Groupes assignés
                  </div>
                  <div className="space-y-1">
                    {player.groupIds.length > 0 ? (
                      player.groupIds.map(groupId => (
                        <Badge key={groupId} variant="outline">
                          Groupe {groupId}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Aucun groupe assigné</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Évaluations
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complétées</span>
                      <span className="font-medium">3/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Résumé des évaluations
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.2</p>
                    <p className="text-sm text-gray-600">Note moyenne</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">+0.5</p>
                    <p className="text-sm text-gray-600">Progression</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                    <p className="text-sm text-gray-600">Potentiel</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Informations supplémentaires</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Ajouté le:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(player.createdAt).toLocaleDateString('fr-CA')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Dernière modification:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(player.updatedAt).toLocaleDateString('fr-CA')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline">
                Voir les évaluations
              </Button>
              <Button variant="outline">
                Générer rapport
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                Modifier le joueur
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}