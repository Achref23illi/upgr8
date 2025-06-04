"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampPlayersProps {
  campId: string;
  groups: Array<{ id: string; name: string; color: string }>;
}

const mockPlayers = [
  {
    id: "1",
    name: "Alexandre Dubois",
    number: 17,
    position: "Centre",
    groupId: "g1",
    evaluationStatus: "completed",
    evaluationCount: 5,
    avgScore: 4.2
  },
  {
    id: "2",
    name: "Maxime Tremblay",
    number: 9,
    position: "Ailier gauche",
    groupId: "g1",
    evaluationStatus: "partial",
    evaluationCount: 3,
    avgScore: 4.0
  },
  {
    id: "3",
    name: "Gabriel Roy",
    number: 4,
    position: "Défenseur",
    groupId: "g2",
    evaluationStatus: "none",
    evaluationCount: 0,
    avgScore: 0
  },
  {
    id: "4",
    name: "Samuel Gagné",
    number: 31,
    position: "Gardien",
    groupId: "g2",
    evaluationStatus: "completed",
    evaluationCount: 4,
    avgScore: 4.5
  }
];

export function CampPlayers({ groups }: CampPlayersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string, count: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {count} évaluations
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {count} évaluations
          </Badge>
        );
      case 'none':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Non évalué
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.number.toString().includes(searchQuery);
    const matchesGroup = selectedGroup === "all" || player.groupId === selectedGroup;
    const matchesStatus = statusFilter === "all" || player.evaluationStatus === statusFilter;
    
    return matchesSearch && matchesGroup && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les groupes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les groupes</SelectItem>
              {groups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complété</SelectItem>
              <SelectItem value="partial">Partiel</SelectItem>
              <SelectItem value="none">Non évalué</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {filteredPlayers.length} joueurs trouvés
          </p>
          <Button variant="outline" size="sm">
            Plus de filtres
          </Button>
        </div>
      </div>

      {/* Players List */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player, index) => {
            const group = groups.find(g => g.id === player.groupId);
            
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        #{player.number}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{player.name}</h4>
                      <p className="text-sm text-gray-600">{player.position}</p>
                    </div>
                  </div>
                  {group && (
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: group.color }}
                      title={group.name}
                    >
                      {group.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {getStatusBadge(player.evaluationStatus, player.evaluationCount)}
                  {player.avgScore > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Note moyenne</span>
                      <span className="font-medium text-gray-900">{player.avgScore}/5</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Voir évaluations
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}