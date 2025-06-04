"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  User, 
  Search, 
  Filter, 
  ArrowLeft,
  Shield,
  UserCheck,
  ClipboardCheck,
  FileText,
  Settings,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

// Types
interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  targetId?: string;
  details: string;
  ipAddress: string;
  severity: "info" | "warning" | "error";
}

// Mock activity logs
const mockActivityLogs: ActivityLog[] = [
  {
    id: "log-1",
    timestamp: "2025-06-04T14:30:00Z",
    userId: "staff-1",
    userName: "Martin Dubois",
    userRole: "head-coach",
    action: "player_evaluation_created",
    target: "evaluation",
    targetId: "eval-123",
    details: "Évaluation créée pour Alexandre Dubois (#17)",
    ipAddress: "192.168.1.100",
    severity: "info"
  },
  {
    id: "log-2", 
    timestamp: "2025-06-04T14:15:00Z",
    userId: "staff-3",
    userName: "Pierre Tremblay",
    userRole: "scout",
    action: "player_data_accessed",
    target: "player",
    targetId: "player-15",
    details: "Consultation du profil de Emma Gagnon",
    ipAddress: "192.168.1.105",
    severity: "info"
  },
  {
    id: "log-3",
    timestamp: "2025-06-04T13:45:00Z",
    userId: "staff-2",
    userName: "Sarah Lavoie",
    userRole: "assistant-coach",
    action: "staff_role_updated",
    target: "staff",
    targetId: "staff-4",
    details: "Rôle modifié pour Julie Gagnon: evaluator → scout",
    ipAddress: "192.168.1.102",
    severity: "warning"
  },
  {
    id: "log-4",
    timestamp: "2025-06-04T13:20:00Z",
    userId: "staff-1",
    userName: "Martin Dubois", 
    userRole: "head-coach",
    action: "staff_invited",
    target: "staff",
    details: "Invitation envoyée à alexandre.roy@email.com (role: evaluator)",
    ipAddress: "192.168.1.100",
    severity: "info"
  },
  {
    id: "log-5",
    timestamp: "2025-06-04T12:30:00Z",
    userId: "staff-4",
    userName: "Julie Gagnon",
    userRole: "evaluator",
    action: "login_failed",
    target: "authentication",
    details: "Tentative de connexion échouée - mot de passe incorrect",
    ipAddress: "192.168.1.108",
    severity: "warning"
  },
  {
    id: "log-6",
    timestamp: "2025-06-04T11:45:00Z",
    userId: "staff-3",
    userName: "Pierre Tremblay",
    userRole: "scout",
    action: "unauthorized_access_attempt",
    target: "admin_panel",
    details: "Tentative d'accès non autorisé au panneau d'administration",
    ipAddress: "192.168.1.105",
    severity: "error"
  },
  {
    id: "log-7",
    timestamp: "2025-06-04T11:15:00Z",
    userId: "staff-2",
    userName: "Sarah Lavoie",
    userRole: "assistant-coach",
    action: "evaluation_report_downloaded",
    target: "report",
    targetId: "report-89",
    details: "Téléchargement du rapport d'évaluation pour l'équipe U15",
    ipAddress: "192.168.1.102",
    severity: "info"
  },
  {
    id: "log-8",
    timestamp: "2025-06-04T10:30:00Z",
    userId: "staff-1",
    userName: "Martin Dubois",
    userRole: "head-coach",
    action: "data_export",
    target: "players",
    details: "Export des données joueurs - catégorie U13",
    ipAddress: "192.168.1.100", 
    severity: "info"
  }
];

const actionLabels: Record<string, string> = {
  "player_evaluation_created": "Évaluation créée",
  "player_data_accessed": "Données consultées",
  "staff_role_updated": "Rôle modifié",
  "staff_invited": "Personnel invité",
  "login_failed": "Connexion échouée",
  "unauthorized_access_attempt": "Accès non autorisé",
  "evaluation_report_downloaded": "Rapport téléchargé",
  "data_export": "Export de données"
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "player_evaluation_created":
    case "evaluation_report_downloaded":
      return ClipboardCheck;
    case "player_data_accessed":
      return UserCheck;
    case "staff_role_updated":
    case "staff_invited":
      return Shield;
    case "login_failed":
    case "unauthorized_access_attempt":
      return AlertTriangle;
    case "data_export":
      return FileText;
    default:
      return Settings;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "error":
      return "bg-red-100 text-red-800 border-red-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const roleLabels: Record<string, string> = {
  "head-coach": "Entraîneur-chef",
  "assistant-coach": "Entraîneur adjoint", 
  "scout": "Dépisteur",
  "evaluator": "Évaluateur",
  "general-manager": "Directeur général"
};

export default function ActivityLogsPage() {
  const [logs] = React.useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");
  const [selectedUser, setSelectedUser] = React.useState<string>("all");

  const filteredLogs = logs.filter(log => {
    const matchesSearch = `${log.userName} ${log.details} ${log.action}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    const matchesUser = selectedUser === "all" || log.userId === selectedUser;
    
    return matchesSearch && matchesAction && matchesSeverity && matchesUser;
  });

  const uniqueUsers = Array.from(new Set(logs.map(log => ({ id: log.userId, name: log.userName }))))
    .filter((user, index, arr) => arr.findIndex(u => u.id === user.id) === index);

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
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
          <div className="flex items-center mb-4">
            <Link href="/dashboard/staff">
              <Button variant="outline" size="sm" className="mr-4">
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Journal d'activité</h1>
              <p className="text-sm text-gray-600">
                Suivi des actions et accès du personnel
              </p>
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
            <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
            <div className="text-sm text-gray-600">Total activités</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {logs.filter(l => l.severity === "info").length}
            </div>
            <div className="text-sm text-gray-600">Informations</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {logs.filter(l => l.severity === "warning").length}
            </div>
            <div className="text-sm text-gray-600">Avertissements</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.severity === "error").length}
            </div>
            <div className="text-sm text-gray-600">Erreurs</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les utilisateurs</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes les actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{actionLabels[action] || action}</option>
              ))}
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les niveaux</option>
              <option value="info">Information</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
            <Button variant="outline">
              Exporter
            </Button>
          </div>
        </motion.div>

        {/* Activity Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Activités récentes ({filteredLogs.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => {
              const { date, time } = formatTimestamp(log.timestamp);
              
              return (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold text-xs">
                              {getInitials(log.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-900">{log.userName}</h4>
                            <p className="text-sm text-gray-600">{roleLabels[log.userRole]}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            {actionLabels[log.action] || log.action}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{log.details}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            {date} à {time}
                          </span>
                          <span>IP: {log.ipAddress}</span>
                          {log.targetId && (
                            <span>ID: {log.targetId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity === "error" ? "Erreur" : 
                       log.severity === "warning" ? "Avertissement" : "Info"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}