"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Player } from "@/types/coach";
import { PlayerManagement } from "@/components/coach/PlayerManagement";

const mockPlayers: Player[] = [
  {
    id: "player-1",
    firstName: "Alexandre",
    lastName: "Dubois",
    dateOfBirth: "2010-03-15",
    position: "Centre",
    number: 17,
    status: "a-evaluer",
    groupIds: ["g1"],
    campId: "camp-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "player-2",
    firstName: "Maxime",
    lastName: "Tremblay",
    dateOfBirth: "2010-06-22",
    position: "Ailier gauche",
    number: 9,
    status: "locke",
    groupIds: ["g1"],
    campId: "camp-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "player-3",
    firstName: "Gabriel",
    lastName: "Roy",
    dateOfBirth: "2011-01-08",
    position: "Défenseur",
    number: 4,
    status: "a-evaluer",
    groupIds: ["g2"],
    campId: "camp-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "player-4",
    firstName: "Samuel",
    lastName: "Gagné",
    dateOfBirth: "2010-09-30",
    position: "Gardien",
    number: 31,
    status: "invite",
    groupIds: ["g2"],
    campId: "camp-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function PlayersPage() {
  const searchParams = useSearchParams();
  const campId = searchParams.get('campId') || 'camp-1';
  
  const [players, setPlayers] = useState<Player[]>(
    mockPlayers.filter(p => p.campId === campId)
  );

  const handleAddPlayer = (newPlayer: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    const player: Player = {
      ...newPlayer,
      id: `player-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlayers([...players, player]);
  };

  const handleUpdatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(players.map(player => 
      player.id === id 
        ? { ...player, ...updates, updatedAt: new Date().toISOString() }
        : player
    ));
  };

  const handleDeletePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const handleImportPlayers = (newPlayers: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const importedPlayers: Player[] = newPlayers.map(p => ({
      ...p,
      id: `player-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    setPlayers([...players, ...importedPlayers]);
  };

  return (
    <PlayerManagement
      players={players}
      campId={campId}
      onAddPlayer={handleAddPlayer}
      onUpdatePlayer={handleUpdatePlayer}
      onDeletePlayer={handleDeletePlayer}
      onImportPlayers={handleImportPlayers}
    />
  );
}