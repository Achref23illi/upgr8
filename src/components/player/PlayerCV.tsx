"use client";

import { 
  Trophy,
  Medal
} from "lucide-react";

interface PlayerCVProps {
  player: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    position: string;
    number: number;
    photoUrl: string | null;
  };
}


export function PlayerCV({ player }: PlayerCVProps) {

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">CV Sportif</h1>
          <p className="text-sm text-gray-600">Profil complet de carrière</p>
        </div>

        {/* En-tête du profil */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-red-700">
                {player.firstName[0]}{player.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {player.firstName} {player.lastName}
              </h2>
              <p className="text-sm text-gray-600">#{player.number} • {player.position}</p>
              <p className="text-xs text-gray-500">Né le {new Date(player.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-red-600">75</div>
            <div className="text-xs text-gray-600">Points cette saison</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-red-600">4.2</div>
            <div className="text-xs text-gray-600">Note moyenne</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg font-bold text-red-600">6</div>
            <div className="text-xs text-gray-600">Camps participés</div>
          </div>
        </div>

        {/* Expérience */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Expérience de jeu</h3>
          <div className="space-y-3">
            <div className="border-l-3 border-red-500 pl-3">
              <h4 className="text-sm font-semibold text-gray-900">Lightning Academy</h4>
              <p className="text-xs text-gray-600">2024-25 • Centre • #17</p>
              <p className="text-xs text-gray-500 mt-1">35 buts, 40 passes en 28 matchs</p>
            </div>
            <div className="border-l-3 border-gray-300 pl-3">
              <h4 className="text-sm font-semibold text-gray-900">Thunder Bay Wolves</h4>
              <p className="text-xs text-gray-600">2023-24 • Centre • #12</p>
              <p className="text-xs text-gray-500 mt-1">28 buts, 32 passes en 26 matchs</p>
            </div>
          </div>
        </div>

        {/* Réalisations */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Réalisations et distinctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-xs font-medium text-gray-900">Meilleur pointeur de l&apos;équipe</p>
                <p className="text-xs text-gray-600">Saison 2024-25</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
              <Medal className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-medium text-gray-900">Joueur le plus amélioré</p>
                <p className="text-xs text-gray-600">Camp M15 Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}