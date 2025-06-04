"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail,
  Users,
  Grip,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InviteEvaluatorModal } from "./InviteEvaluatorModal";

interface CampEvaluatorsProps {
  campId: string;
  groups: Array<{ id: string; name: string; color: string }>;
}

interface Evaluator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  assignedPlayers: number;
  completedEvaluations: number;
  groupId?: string;
}

interface EvaluatorInvitation {
  email: string;
  role: string;
  groupId?: string;
}

const mockEvaluators: Evaluator[] = [
  {
    id: "e1",
    name: "Marie Leclerc",
    email: "marie.leclerc@email.com",
    role: "Entraîneur adjoint",
    status: "active",
    assignedPlayers: 8,
    completedEvaluations: 6,
    groupId: "g1"
  },
  {
    id: "e2",
    name: "Jean Tremblay",
    email: "jean.tremblay@email.com",
    role: "Dépisteur",
    status: "active",
    assignedPlayers: 7,
    completedEvaluations: 7,
    groupId: "g1"
  },
  {
    id: "e3",
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    role: "Entraîneur-chef",
    status: "active",
    assignedPlayers: 10,
    completedEvaluations: 5,
    groupId: "g2"
  },
  {
    id: "e4",
    name: "Pierre Dubois",
    email: "pierre.dubois@email.com",
    role: "DG",
    status: "inactive",
    assignedPlayers: 5,
    completedEvaluations: 0
  },
  {
    id: "e5",
    name: "Luc Bergeron",
    email: "luc.bergeron@email.com",
    role: "Dépisteur",
    status: "pending",
    assignedPlayers: 0,
    completedEvaluations: 0
  }
];

export function CampEvaluators({ campId, groups }: CampEvaluatorsProps) {
  const [evaluators, setEvaluators] = useState<Evaluator[]>(mockEvaluators);
  const [draggedEvaluator, setDraggedEvaluator] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleDragStart = (evaluatorId: string) => {
    setDraggedEvaluator(evaluatorId);
  };

  const handleDragEnd = () => {
    setDraggedEvaluator(null);
  };

  const handleDrop = (groupId: string | null) => {
    if (!draggedEvaluator) return;

    setEvaluators(prevEvaluators =>
      prevEvaluators.map(evaluator =>
        evaluator.id === draggedEvaluator
          ? { ...evaluator, groupId: groupId || undefined }
          : evaluator
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Inactif
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleInviteEvaluators = async (invitations: EvaluatorInvitation[]): Promise<void> => {
    // Simulate API call to send invitations
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Invitations sent:', invitations);
        resolve();
      }, 1000);
    });
  };

  const unassignedEvaluators = evaluators.filter(e => !e.groupId);
  const getGroupEvaluators = (groupId: string) => evaluators.filter(e => e.groupId === groupId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Gestion des évaluateurs</h3>
            <p className="text-sm text-gray-600 mt-1">
              Glissez-déposez les évaluateurs pour les assigner aux groupes
            </p>
          </div>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setIsInviteModalOpen(true)}
          >
            Inviter un évaluateur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Evaluators */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Évaluateurs disponibles
          </h4>
          <div
            className="space-y-3 min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(null)}
          >
            {unassignedEvaluators.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Tous les évaluateurs sont assignés
              </p>
            ) : (
              unassignedEvaluators.map((evaluator) => (
                <motion.div
                  key={evaluator.id}
                  draggable
                  onDragStart={() => handleDragStart(evaluator.id)}
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, opacity: 0.8 }}
                  className="bg-gray-50 rounded-lg p-4 cursor-move"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Grip className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{evaluator.name}</p>
                        <p className="text-sm text-gray-600">{evaluator.role}</p>
                      </div>
                    </div>
                    {getStatusBadge(evaluator.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{evaluator.email}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Groups */}
        {groups.map((group) => {
          const groupEvaluators = getGroupEvaluators(group.id);
          const totalAssigned = groupEvaluators.reduce((sum, e) => sum + e.assignedPlayers, 0);
          const totalCompleted = groupEvaluators.reduce((sum, e) => sum + e.completedEvaluations, 0);

          return (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.name}
                  </h4>
                  <Badge variant="outline">
                    {groupEvaluators.length} évaluateurs
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {totalCompleted}/{totalAssigned} évaluations complétées
                </div>
              </div>

              <div
                className="space-y-3 min-h-[200px] border-2 border-dashed rounded-lg p-4"
                style={{ borderColor: group.color + '50' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(group.id)}
              >
                {groupEvaluators.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Déposez des évaluateurs ici
                  </p>
                ) : (
                  groupEvaluators.map((evaluator) => (
                    <motion.div
                      key={evaluator.id}
                      draggable
                      onDragStart={() => handleDragStart(evaluator.id)}
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, opacity: 0.8 }}
                      className="bg-gray-50 rounded-lg p-3 cursor-move"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Grip className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">{evaluator.name}</p>
                            <p className="text-xs text-gray-600">{evaluator.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">
                          {evaluator.completedEvaluations}/{evaluator.assignedPlayers} joueurs
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{
                              width: `${(evaluator.completedEvaluations / evaluator.assignedPlayers) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Résumé des assignations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total évaluateurs</p>
            <p className="text-xl font-bold text-gray-900">{evaluators.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Évaluateurs actifs</p>
            <p className="text-xl font-bold text-green-600">
              {evaluators.filter(e => e.status === 'active').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Taux de complétion moyen</p>
            <p className="text-xl font-bold text-gray-900">
              {Math.round(
                evaluators.reduce((sum, e) => 
                  sum + (e.assignedPlayers ? (e.completedEvaluations / e.assignedPlayers) * 100 : 0), 0
                ) / evaluators.filter(e => e.assignedPlayers > 0).length
              )}%
            </p>
          </div>
        </div>
      </div>

      {/* Invite Evaluator Modal */}
      <InviteEvaluatorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        campData={{
          id: campId,
          name: "Camp", // This should come from props
          groups: groups
        }}
        onInvite={handleInviteEvaluators}
      />
    </div>
  );
}