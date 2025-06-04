"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Mail, 
  User, 
  Shield, 
  MoreVertical, 
  Edit, 
  Trash2,
  UserPlus,
  Search,
  Users,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

// Staff member interface
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "head-coach" | "assistant-coach" | "scout" | "general-manager" | "evaluator";
  status: "active" | "pending" | "inactive";
  joinedDate: string;
  lastActive: string;
  assignedPlayers?: number;
  permissions: string[];
}

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: "staff-1",
    firstName: "Martin",
    lastName: "Dubois",
    email: "martin.dubois@upgr8.com",
    role: "head-coach",
    status: "active",
    joinedDate: "2024-01-15",
    lastActive: "2025-06-04",
    permissions: ["all"]
  },
  {
    id: "staff-2",
    firstName: "Sarah",
    lastName: "Lavoie",
    email: "sarah.lavoie@upgr8.com",
    role: "assistant-coach",
    status: "active",
    joinedDate: "2024-02-01",
    lastActive: "2025-06-03",
    permissions: ["players", "evaluations", "trainings"]
  },
  {
    id: "staff-3",
    firstName: "Pierre",
    lastName: "Tremblay",
    email: "pierre.tremblay@upgr8.com",
    role: "scout",
    status: "active",
    joinedDate: "2024-03-10",
    lastActive: "2025-06-02",
    assignedPlayers: 45,
    permissions: ["evaluations"]
  },
  {
    id: "staff-4",
    firstName: "Julie",
    lastName: "Gagnon",
    email: "julie.gagnon@upgr8.com",
    role: "evaluator",
    status: "pending",
    joinedDate: "2025-05-28",
    lastActive: "N/A",
    assignedPlayers: 0,
    permissions: ["evaluations"]
  },
  {
    id: "staff-5",
    firstName: "Alexandre",
    lastName: "Roy",
    email: "alexandre.roy@upgr8.com",
    role: "general-manager",
    status: "active",
    joinedDate: "2024-01-10",
    lastActive: "2025-06-04",
    permissions: ["all"]
  }
];

const roleLabels = {
  "head-coach": "Entraîneur-chef",
  "assistant-coach": "Entraîneur adjoint",
  "scout": "Dépisteur",
  "evaluator": "Évaluateur",
  "general-manager": "Directeur général"
};

const roleColors = {
  "head-coach": "bg-red-100 text-red-800",
  "assistant-coach": "bg-blue-100 text-blue-800",
  "scout": "bg-green-100 text-green-800",
  "evaluator": "bg-purple-100 text-purple-800",
  "general-manager": "bg-orange-100 text-orange-800"
};

const statusColors = {
  "active": "bg-green-100 text-green-800",
  "pending": "bg-yellow-100 text-yellow-800",
  "inactive": "bg-gray-100 text-gray-800"
};

const statusLabels = {
  "active": "Actif",
  "pending": "En attente",
  "inactive": "Inactif"
};

export default function StaffPage() {
  const [staff, setStaff] = React.useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteForm, setInviteForm] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "evaluator"
  });

  const filteredStaff = staff.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName} ${member.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleInvite = () => {
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      firstName: inviteForm.firstName,
      lastName: inviteForm.lastName,
      email: inviteForm.email,
      role: inviteForm.role as any,
      status: "pending",
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: "N/A",
      assignedPlayers: 0,
      permissions: inviteForm.role === "head-coach" || inviteForm.role === "general-manager" 
        ? ["all"] 
        : inviteForm.role === "assistant-coach" 
        ? ["players", "evaluations", "trainings"]
        : ["evaluations"]
    };

    setStaff(prev => [...prev, newMember]);
    setShowInviteModal(false);
    setInviteForm({ email: "", firstName: "", lastName: "", role: "evaluator" });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestion du personnel</h1>
              <p className="text-sm text-gray-600">
                Gérez les rôles, permissions et accès de votre équipe
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard/staff/assignments">
                <Button variant="outline" className="px-4 py-2 text-sm">
                  Assignations
                </Button>
              </Link>
              <Link href="/dashboard/staff/logs">
                <Button variant="outline" className="px-4 py-2 text-sm">
                  Journal d'activité
                </Button>
              </Link>
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
              >
                Inviter membre
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
            <div className="text-sm text-gray-600">Total membres</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">
              {staff.filter(s => s.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Actifs</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {staff.filter(s => s.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">En attente</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {staff.filter(s => s.role === "evaluator").length}
            </div>
            <div className="text-sm text-gray-600">Évaluateurs</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="head-coach">Entraîneur-chef</option>
                <option value="assistant-coach">Entraîneur adjoint</option>
                <option value="scout">Dépisteur</option>
                <option value="evaluator">Évaluateur</option>
                <option value="general-manager">Directeur général</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Staff List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Membres du personnel</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredStaff.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                        {getInitials(member.firstName, member.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </h4>
                      <div className="mt-1">
                        <span className="text-sm text-gray-600">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className={roleColors[member.role]}>
                          {roleLabels[member.role]}
                        </Badge>
                        <Badge className={statusColors[member.status]}>
                          {statusLabels[member.status]}
                        </Badge>
                        {member.assignedPlayers !== undefined && (
                          <span className="text-sm text-gray-500">
                            {member.assignedPlayers} joueurs assignés
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Rejoint le {new Date(member.joinedDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Dernière activité: {member.lastActive === "N/A" ? "N/A" : 
                        new Date(member.lastActive).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        Options
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Inviter un membre</h3>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <Input
                        value={inviteForm.firstName}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <Input
                        value={inviteForm.lastName}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      value={inviteForm.role}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="evaluator">Évaluateur</option>
                      <option value="assistant-coach">Entraîneur adjoint</option>
                      <option value="scout">Dépisteur</option>
                      <option value="head-coach">Entraîneur-chef</option>
                      <option value="general-manager">Directeur général</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleInvite}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!inviteForm.email || !inviteForm.firstName || !inviteForm.lastName}
                  >
                    Envoyer invitation
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}