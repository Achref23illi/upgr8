"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InviteEvaluatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  campData: {
    id: string;
    name: string;
    groups: Array<{ id: string; name: string; color: string }>;
  };
  onInvite: (invitations: Invitation[]) => Promise<void>;
}

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  assignedGroups: string[];
  status: 'draft' | 'sending' | 'sent' | 'error';
  inviteLink?: string;
  expiresAt?: string;
}

const roleOptions = [
  {
    value: "evaluator",
    label: "Évaluateur",
    description: "Peut évaluer les joueurs assignés",
    permissions: ["evaluate_players", "view_assignments"]
  },
  {
    value: "guest_evaluator", 
    label: "Évaluateur invité",
    description: "Accès restreint aux joueurs assignés uniquement",
    permissions: ["evaluate_assigned_players"]
  },
  {
    value: "observer",
    label: "Observateur",
    description: "Peut voir les évaluations mais pas les modifier",
    permissions: ["view_evaluations"]
  },
  {
    value: "assistant_coach",
    label: "Entraîneur assistant",
    description: "Peut évaluer et voir les rapports",
    permissions: ["evaluate_players", "view_reports", "view_assignments"]
  }
];

const permissionLabels: Record<string, string> = {
  "evaluate_players": "Évaluer tous les joueurs",
  "evaluate_assigned_players": "Évaluer joueurs assignés seulement",
  "view_evaluations": "Voir les évaluations",
  "view_reports": "Voir les rapports",
  "view_assignments": "Voir les assignations"
};

export function InviteEvaluatorModal({ isOpen, onClose, campData, onInvite }: InviteEvaluatorModalProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentInvite, setCurrentInvite] = useState({
    email: "",
    name: "",
    role: "",
    assignedGroups: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const validateInvite = () => {
    const newErrors: Record<string, string> = {};

    if (!currentInvite.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInvite.email)) {
      newErrors.email = "Format d'email invalide";
    } else if (invitations.some(inv => inv.email === currentInvite.email)) {
      newErrors.email = "Cet email a déjà été invité";
    }

    if (!currentInvite.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!currentInvite.role) {
      newErrors.role = "Le rôle est requis";
    }

    if (currentInvite.assignedGroups.length === 0 && 
        (currentInvite.role === "evaluator" || currentInvite.role === "guest_evaluator")) {
      newErrors.assignedGroups = "Au moins un groupe doit être assigné";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addInvitation = () => {
    if (!validateInvite()) return;

    const selectedRole = roleOptions.find(r => r.value === currentInvite.role);
    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      email: currentInvite.email,
      name: currentInvite.name,
      role: currentInvite.role,
      permissions: selectedRole?.permissions || [],
      assignedGroups: currentInvite.assignedGroups,
      status: 'draft',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    setInvitations([...invitations, newInvitation]);
    setCurrentInvite({ email: "", name: "", role: "", assignedGroups: [] });
    setErrors({});
  };

  const removeInvitation = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id));
  };

  const sendInvitations = async () => {
    if (invitations.length === 0) return;

    setIsSending(true);

    for (const invitation of invitations) {
      setInvitations(prev => prev.map(inv => 
        inv.id === invitation.id ? { ...inv, status: 'sending' } : inv
      ));

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock invite link
      const inviteLink = `https://upgr8.app/invite/${invitation.id}/${campData.id}`;
      
      setInvitations(prev => prev.map(inv => 
        inv.id === invitation.id 
          ? { ...inv, status: 'sent', inviteLink }
          : inv
      ));
    }

    setIsSending(false);
    await onInvite(invitations);
  };

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sending':
        return <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Envoyé</Badge>;
      case 'sending':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Envoi...</Badge>;
      case 'error':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Erreur</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const getRoleInfo = (role: string) => {
    return roleOptions.find(r => r.value === role);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Inviter des évaluateurs</h2>
                <p className="text-sm text-gray-600">
                  Camp: {campData.name} • Gestion des accès et permissions
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose} disabled={isSending}>
              Fermer
            </Button>
          </div>

          {/* Add New Invitation Form */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nouvel évaluateur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentInvite.email}
                  onChange={(e) => setCurrentInvite({ ...currentInvite, email: e.target.value })}
                  placeholder="evaluateur@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={currentInvite.name}
                  onChange={(e) => setCurrentInvite({ ...currentInvite, name: e.target.value })}
                  placeholder="Nom de l'évaluateur"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select value={currentInvite.role} onValueChange={(value) => setCurrentInvite({ ...currentInvite, role: value })}>
                  <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-gray-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Groupes assignés</Label>
                <div className="flex flex-wrap gap-2">
                  {campData.groups.map(group => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        const isSelected = currentInvite.assignedGroups.includes(group.id);
                        setCurrentInvite({
                          ...currentInvite,
                          assignedGroups: isSelected
                            ? currentInvite.assignedGroups.filter(id => id !== group.id)
                            : [...currentInvite.assignedGroups, group.id]
                        });
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                        currentInvite.assignedGroups.includes(group.id)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: group.color }}
                        />
                        {group.name}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.assignedGroups && (
                  <p className="text-sm text-red-600">{errors.assignedGroups}</p>
                )}
              </div>
            </div>

            {/* Role Permissions Preview */}
            {currentInvite.role && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissions accordées
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getRoleInfo(currentInvite.role)?.permissions.map(permission => (
                    <Badge key={permission} variant="secondary">
                      {permissionLabels[permission]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={addInvitation} className="bg-red-600 hover:bg-red-700">
                Ajouter à la liste
              </Button>
            </div>
          </div>

          {/* Invitations List */}
          {invitations.length > 0 && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Invitations ({invitations.length})
                </h3>
                <Button 
                  onClick={sendInvitations}
                  disabled={isSending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer tout ({invitations.length})
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {invitations.map((invitation, index) => {
                  const roleInfo = getRoleInfo(invitation.role);
                  const assignedGroupNames = campData.groups
                    .filter(g => invitation.assignedGroups.includes(g.id))
                    .map(g => g.name);

                  return (
                    <motion.div
                      key={invitation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{invitation.name}</h4>
                            {getStatusBadge(invitation.status)}
                            <Badge variant="outline">{roleInfo?.label}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p className="font-medium">{invitation.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Groupes assignés</p>
                              <p className="font-medium">
                                {assignedGroupNames.length > 0 ? assignedGroupNames.join(', ') : 'Aucun'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Expire le</p>
                              <p className="font-medium">
                                {invitation.expiresAt ? new Date(invitation.expiresAt).toLocaleDateString() : '-'}
                              </p>
                            </div>
                          </div>

                          {invitation.inviteLink && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Lien d&apos;invitation</p>
                                  <p className="text-xs text-gray-600 truncate max-w-md">{invitation.inviteLink}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyInviteLink(invitation.inviteLink!)}
                                >
                                  Copier
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(invitation.status)}
                          {invitation.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeInvitation(invitation.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Retirer
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {invitations.length === 0 
                ? "Aucune invitation en attente"
                : `${invitations.filter(inv => inv.status === 'sent').length}/${invitations.length} invitations envoyées`
              }
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose} disabled={isSending}>
                {isSending ? 'Fermer après envoi' : 'Fermer'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}