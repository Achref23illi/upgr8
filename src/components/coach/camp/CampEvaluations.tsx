"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampEvaluationsProps {
  campId: string;
}

const mockEvaluationData = {
  criteria: [
    { id: "c1", name: "Patinage", avgScore: 4.2, evaluations: 120 },
    { id: "c2", name: "Maniement", avgScore: 4.0, evaluations: 118 },
    { id: "c3", name: "Tir", avgScore: 3.8, evaluations: 119 },
    { id: "c4", name: "Vision du jeu", avgScore: 4.3, evaluations: 121 },
    { id: "c5", name: "Physique", avgScore: 4.1, evaluations: 120 }
  ],
  playerSummaries: [
    {
      id: "p1",
      name: "Alexandre Dubois",
      number: 17,
      avgScore: 4.2,
      evaluationCount: 5,
      tags: ["cimente"],
      trend: "up"
    },
    {
      id: "p2",
      name: "Maxime Tremblay",
      number: 9,
      avgScore: 4.0,
      evaluationCount: 3,
      tags: ["a-surveiller"],
      trend: "stable"
    },
    {
      id: "p3",
      name: "Gabriel Roy",
      number: 4,
      avgScore: 3.5,
      evaluationCount: 4,
      tags: ["surevalue"],
      trend: "down"
    },
    {
      id: "p4",
      name: "Samuel Gagné",
      number: 31,
      avgScore: 4.5,
      evaluationCount: 4,
      tags: ["cimente"],
      trend: "up"
    }
  ]
};

export function CampEvaluations({}: CampEvaluationsProps) {
  const [tagFilter, setTagFilter] = useState("all");

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'cimente':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            ✓ Cimenté
          </Badge>
        );
      case 'a-surveiller':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            ⚠ À surveiller
          </Badge>
        );
      case 'surevalue':
        return (
          <Badge className="bg-gray-50 text-gray-700 border-gray-200">
            ↗ Surévalué
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTrendIndicator = (trend: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-600 font-bold">↗</span>;
      case 'down':
        return <span className="text-red-600 font-bold">↘</span>;
      default:
        return <span className="text-gray-400">—</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-gray-900';
    return 'text-red-600';
  };

  const filteredPlayers = mockEvaluationData.playerSummaries.filter(player => {
    if (tagFilter === "all") return true;
    return player.tags.includes(tagFilter);
  });

  return (
    <div className="space-y-8">
      {/* Criteria Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Vue d&apos;ensemble par critère</h3>
          <Button variant="outline" size="sm">
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mockEvaluationData.criteria.map((criterion) => (
            <div key={criterion.id} className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-3">{criterion.name}</h4>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className={`text-2xl font-bold ${getScoreColor(criterion.avgScore)}`}>
                    {criterion.avgScore}
                  </span>
                  <span className="text-sm text-gray-600">/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${criterion.avgScore * 20}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {criterion.evaluations} évaluations
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player Evaluations Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Résumé des évaluations par joueur</h3>
          <div className="flex gap-3">
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les tags</SelectItem>
                <SelectItem value="cimente">Cimenté</SelectItem>
                <SelectItem value="a-surveiller">À surveiller</SelectItem>
                <SelectItem value="surevalue">Surévalué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Joueur
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Note moyenne
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Évaluations
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Tendance
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border">
                        <span className="text-xs font-medium text-gray-600">#{player.number}</span>
                      </div>
                      <span className="font-medium text-gray-900">{player.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg ${getScoreColor(player.avgScore)}`}>
                        {player.avgScore}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(player.avgScore / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      <span className="text-gray-900">{player.evaluationCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xl">
                    {getTrendIndicator(player.trend)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {player.tags.map((tag, index) => (
                        <span key={`${player.id}-tag-${index}`}>
                          {getTagBadge(tag)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tag Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-green-900">Joueurs cimentés</h4>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              ✓
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900 mb-2">
            {mockEvaluationData.playerSummaries.filter(p => p.tags.includes('cimente')).length}
          </div>
          <p className="text-sm text-green-700">
            Note élevée avec faible écart
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-red-900">À surveiller</h4>
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
              !
            </div>
          </div>
          <div className="text-3xl font-bold text-red-900 mb-2">
            {mockEvaluationData.playerSummaries.filter(p => p.tags.includes('a-surveiller')).length}
          </div>
          <p className="text-sm text-red-700">
            Écart d&apos;opinion important
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Surévalués</h4>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
              ↗
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {mockEvaluationData.playerSummaries.filter(p => p.tags.includes('surevalue')).length}
          </div>
          <p className="text-sm text-gray-700">
            Note basse avec faible écart
          </p>
        </div>
      </div>
    </div>
  );
}