"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter,
  Upload,
  Download,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Player, PlayerStatus } from "@/types/coach";
import { AddPlayerModal } from "./AddPlayerModal";
import { PlayerDetailsModal } from "./PlayerDetailsModal";

interface PlayerManagementProps {
  players: Player[];
  campId: string;
  onAddPlayer: (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdatePlayer: (id: string, player: Partial<Player>) => void;
  onDeletePlayer: (id: string) => void;
  onImportPlayers: (players: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

export function PlayerManagement({ 
  players, 
  campId,
  onAddPlayer, 
  onUpdatePlayer, 
  onDeletePlayer,
  onImportPlayers
}: PlayerManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPlayers = players.filter(player => 
    player.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.number.toString().includes(searchQuery)
  );

  const handleViewDetails = (player: Player) => {
    setSelectedPlayer(player);
    setShowDetailsModal(true);
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setShowAddModal(true);
  };

  const handleToggleStatus = (player: Player) => {
    const newStatus: PlayerStatus = player.status === 'locke' ? 'a-evaluer' : 'locke';
    onUpdatePlayer(player.id, { status: newStatus });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');      
      const players: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < 5) continue;
        
        players.push({
          firstName: values[0],
          lastName: values[1],
          dateOfBirth: values[2],
          position: values[3] as Player['position'],
          number: parseInt(values[4]),
          status: 'a-evaluer',
          groupIds: [],
          campId: campId
        });
      }
      
      onImportPlayers(players);
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Date de naissance', 'Position', 'Numéro', 'Statut'];
    const rows = players.map(p => [
      p.firstName,
      p.lastName,
      p.dateOfBirth,
      p.position,
      p.number,
      p.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joueurs-camp-${campId}.csv`;
    a.click();
  };

  const getStatusBadge = (status: PlayerStatus) => {
    switch (status) {
      case 'invite':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Invité</Badge>;
      case 'a-evaluer':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">À évaluer</Badge>;
      case 'locke':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Confirmé</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des joueurs</h2>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer CSV
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
          <Button 
            onClick={() => {
              setSelectedPlayer(null);
              setShowAddModal(true);
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau joueur
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtrer
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joueur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Âge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Évaluations
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlayers.map((player, index) => (
              <motion.tr
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {player.firstName[0]}{player.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{player.position}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#{player.number}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()} ans
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(player.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">3/5</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(player)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditPlayer(player)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(player)}>
                        {player.status === 'locke' ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Débloquer
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Confirmer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeletePlayer(player.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedPlayer(null);
        }}
        onSubmit={(data) => {
          if (selectedPlayer) {
            onUpdatePlayer(selectedPlayer.id, data);
          } else {
            onAddPlayer(data);
          }
          setShowAddModal(false);
          setSelectedPlayer(null);
        }}
        initialData={selectedPlayer}
        campId={campId}
      />

      {selectedPlayer && (
        <PlayerDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
        />
      )}
    </div>
  );
}