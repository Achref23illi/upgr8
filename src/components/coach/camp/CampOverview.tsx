"use client";

import { Badge } from "@/components/ui/badge";

interface CampOverviewProps {
  camp: {
    id: string;
    name: string;
    groups: Array<{ id: string; name: string; color: string }>;
    stats: {
      totalPlayers: number;
      evaluatorsAssigned: number;
      evaluationsCompleted: number;
      pendingEvaluations: number;
    };
  };
}

const mockGroupStats = [
  {
    groupId: "g1",
    name: "Groupe A",
    color: "#ef4444",
    players: 23,
    evaluators: 3,
    completionRate: 85,
    pendingEvals: 7
  },
  {
    groupId: "g2",
    name: "Groupe B",
    color: "#374151",
    players: 22,
    evaluators: 3,
    completionRate: 70,
    pendingEvals: 15
  }
];

const mockRecentActivity = [
  {
    id: "1",
    type: "evaluation",
    message: "Marie Leclerc a évalué 5 joueurs du Groupe A",
    time: "Il y a 15 minutes",
    icon: "check-circle",
    color: "text-green-600"
  },
  {
    id: "2",
    type: "warning",
    message: "3 joueurs du Groupe B n'ont aucune évaluation",
    time: "Il y a 1 heure",
    icon: "alert-triangle",
    color: "text-red-600"
  },
  {
    id: "3",
    type: "update",
    message: "Jean Tremblay a été assigné au Groupe B",
    time: "Il y a 2 heures",
    icon: "user-check",
    color: "text-gray-600"
  }
];

export function CampOverview({ camp }: CampOverviewProps) {
  const overallCompletion = camp.stats.evaluationsCompleted;

  return (
    <div className="space-y-8">
      {/* Groups Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Groupes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockGroupStats.map((group) => (
            <div key={group.groupId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                  <h4 className="font-medium text-gray-900">{group.name}</h4>
                </div>
                <Badge variant="outline">
                  {group.completionRate}% complété
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-xl font-semibold text-gray-900">{group.players}</div>
                  <div className="text-sm text-gray-600">Joueurs</div>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <div className="text-xl font-semibold text-gray-900">{group.evaluators}</div>
                  <div className="text-sm text-gray-600">Évaluateurs</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium">{group.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${group.completionRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  {group.pendingEvals} évaluations en attente
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Progression globale</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div 
                className="absolute inset-0 rounded-full bg-red-600"
                style={{ 
                  background: `conic-gradient(#dc2626 ${overallCompletion * 3.6}deg, #e5e7eb 0deg)`
                }}
              ></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{overallCompletion}%</div>
                  <div className="text-sm text-gray-600">Complété</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Évaluations complètes</span>
              <span className="font-medium">122/156</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">En attente</span>
              <span className="font-medium text-red-600">34</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Évaluateurs actifs</span>
              <span className="font-medium">6/8</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité récente</h3>
          <div className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'evaluation' ? 'bg-green-600' :
                  activity.type === 'warning' ? 'bg-red-600' : 'bg-gray-600'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {camp.stats.pendingEvaluations > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
              !
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">Points d&apos;attention</h4>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• 8 joueurs n&apos;ont reçu aucune évaluation</li>
                <li>• 2 évaluateurs n&apos;ont pas commencé leurs évaluations</li>
                <li>• Date limite de clôture dans 3 jours</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}