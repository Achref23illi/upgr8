"use client";

import { motion } from "framer-motion";
import { 
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  UserPlus,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampHistoryProps {
  campId: string;
}

const mockHistory = [
  {
    id: "h1",
    timestamp: "2025-03-15T10:30:00",
    user: "Marie Leclerc",
    action: "evaluation_completed",
    details: "A complété l'évaluation de 5 joueurs du Groupe A",
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    id: "h2",
    timestamp: "2025-03-15T09:15:00",
    user: "Coach Martin",
    action: "report_generated",
    details: "Rapport IA généré pour Alexandre Dubois",
    icon: FileText,
    color: "text-blue-500"
  },
  {
    id: "h3",
    timestamp: "2025-03-14T16:45:00",
    user: "Système",
    action: "alert",
    details: "Alerte: 3 joueurs du Groupe B sans évaluation",
    icon: AlertCircle,
    color: "text-orange-500"
  },
  {
    id: "h4",
    timestamp: "2025-03-14T14:20:00",
    user: "Coach Martin",
    action: "evaluator_assigned",
    details: "Jean Tremblay assigné au Groupe B",
    icon: UserPlus,
    color: "text-purple-500"
  },
  {
    id: "h5",
    timestamp: "2025-03-14T11:00:00",
    user: "Sophie Martin",
    action: "evaluation_started",
    details: "A commencé l'évaluation de 10 joueurs",
    icon: Star,
    color: "text-yellow-500"
  },
  {
    id: "h6",
    timestamp: "2025-03-13T15:30:00",
    user: "Coach Martin",
    action: "invitation_sent",
    details: "Invitation envoyée à Pierre Dubois",
    icon: Mail,
    color: "text-indigo-500"
  },
  {
    id: "h7",
    timestamp: "2025-03-12T09:00:00",
    user: "Coach Martin",
    action: "camp_created",
    details: "Camp M15 Excellence créé",
    icon: CheckCircle,
    color: "text-green-500"
  }
];

export function CampHistory({ }: CampHistoryProps) {
  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      evaluation_completed: "Évaluation complétée",
      report_generated: "Rapport généré",
      alert: "Alerte système",
      evaluator_assigned: "Évaluateur assigné",
      evaluation_started: "Évaluation débutée",
      invitation_sent: "Invitation envoyée",
      camp_created: "Camp créé"
    };
    return labels[action] || action;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Il y a ${diffInMinutes} minutes`;
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heures`;
    } else {
      return date.toLocaleDateString('fr-CA', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const groupedHistory = mockHistory.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('fr-CA');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, typeof mockHistory>);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Historique du camp</h3>
        <p className="text-sm text-gray-600 mt-1">
          Suivi complet de toutes les activités et modifications
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedHistory).map(([date, events], groupIndex) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-gray-300 flex-1" />
              <Badge variant="outline" className="bg-gray-50">
                {date === new Date().toLocaleDateString('fr-CA') ? "Aujourd&apos;hui" : date}
              </Badge>
              <div className="h-px bg-gray-300 flex-1" />
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${event.color}`}>
                      <event.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getActionLabel(event.action)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Affichage des {mockHistory.length} dernières activités
          </p>
          <button className="text-red-600 hover:text-red-700 font-medium">
            Voir plus d&apos;historique
          </button>
        </div>
      </div>
    </div>
  );
}