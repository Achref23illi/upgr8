"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  User, 
  Trophy,
  FileText,
  LogOut,
  Star,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlayerProfile } from "@/components/player/PlayerProfile";
import { EvaluationHistory } from "@/components/player/EvaluationHistory";
import { PlayerCV } from "@/components/player/PlayerCV";
import { AIReports } from "@/components/player/AIReports";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

type TabView = 'profile' | 'evaluations' | 'cv' | 'reports';

const mockPlayerData = {
  id: "player-1",
  firstName: "Alexandre",
  lastName: "Dubois",
  dateOfBirth: "2010-03-15",
  position: "Centre",
  number: 17,
  photoUrl: null,
  email: "alexandre.dubois@email.com",
  stats: {
    totalEvaluations: 24,
    averageScore: 4.2,
    improvementRate: 15,
    campsParticipated: 6
  }
};


// Mock top players data - only from player's team (Lightning Academy)
const topPlayersTeam = [
  { rank: 1, name: "Connor Matthews", position: "Forward", goals: 42, assists: 28, points: 70, category: "points" },
  { rank: 2, name: "Lucas Bergeron", position: "Forward", goals: 38, assists: 32, points: 70, category: "points" },
  { rank: 3, name: "Alexandre Dubois", position: "Centre", goals: 35, assists: 40, points: 75, category: "points", isCurrentPlayer: true },
  { rank: 4, name: "Ethan MacKinnon", position: "Defense", goals: 8, assists: 45, points: 53, category: "points" },
  { rank: 5, name: "Ryan Drouin", position: "Forward", goals: 30, assists: 25, points: 55, category: "points" },
];

const topGoalScorers = [
  { rank: 1, name: "Connor Matthews", position: "Forward", goals: 42, category: "goals" },
  { rank: 2, name: "Lucas Bergeron", position: "Forward", goals: 38, category: "goals" },
  { rank: 3, name: "Alexandre Dubois", position: "Centre", goals: 35, category: "goals", isCurrentPlayer: true },
  { rank: 4, name: "Ryan Drouin", position: "Forward", goals: 30, category: "goals" },
  { rank: 5, name: "Marcus Johnson", position: "Forward", goals: 28, category: "goals" },
];

const topAssists = [
  { rank: 1, name: "Ethan MacKinnon", position: "Defense", assists: 45, category: "assists" },
  { rank: 2, name: "Alexandre Dubois", position: "Centre", assists: 40, category: "assists", isCurrentPlayer: true },
  { rank: 3, name: "Lucas Bergeron", position: "Forward", assists: 32, category: "assists" },
  { rank: 4, name: "Connor Matthews", position: "Forward", assists: 28, category: "assists" },
  { rank: 5, name: "Jake Wilson", position: "Centre", assists: 26, category: "assists" },
];

const topDefenders = [
  { rank: 1, name: "Ethan MacKinnon", position: "Defense", blocks: 89, hits: 156, category: "defense" },
  { rank: 2, name: "Mike Thompson", position: "Defense", blocks: 78, hits: 142, category: "defense" },
  { rank: 3, name: "Sam Rodriguez", position: "Defense", blocks: 65, hits: 128, category: "defense" },
  { rank: 4, name: "Chris Anderson", position: "Defense", blocks: 58, hits: 115, category: "defense" },
  { rank: 5, name: "Alex Davis", position: "Defense", blocks: 52, hits: 103, category: "defense" },
];

// Custom Profile Content Component
function ProfileContent({ player }: { player: typeof mockPlayerData }) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("points");

  const getTopPlayersData = () => {
    switch (selectedCategory) {
      case "goals": return topGoalScorers;
      case "assists": return topAssists;
      case "defense": return topDefenders;
      default: return topPlayersTeam;
    }
  };

  const getStatDisplay = (player: { goals?: number; assists?: number; blocks?: number; hits?: number; points?: number }) => {
    switch (selectedCategory) {
      case "goals": return player.goals;
      case "assists": return player.assists;
      case "defense": return `${player.blocks}B / ${player.hits}H`;
      default: return player.points;
    }
  };

  const getStatLabel = () => {
    switch (selectedCategory) {
      case "goals": return "Buts";
      case "assists": return "Passes";
      case "defense": return "Blocs/Mises en échec";
      default: return "Points";
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Meneurs d&apos;équipe</h2>
              <span className="text-sm text-gray-500">Lightning Academy</span>
            </div>
            
            {/* Category Selector */}
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
              {[
                { id: "points", label: "Points" },
                { id: "goals", label: "Buts" },
                { id: "assists", label: "Passes" },
                { id: "defense", label: "Défense" }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 mb-2 px-2 pb-2 border-b border-gray-200">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Joueur</div>
              <div className="col-span-2 text-center">Pos</div>
              <div className="col-span-2 text-right">{getStatLabel()}</div>
            </div>
            
            {/* Table Body */}
            <div className="space-y-1">
              {getTopPlayersData().map((player) => (
                <div 
                  key={player.rank} 
                  className={`grid grid-cols-12 gap-2 items-center px-2 py-2 rounded ${
                    player.isCurrentPlayer ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div className="col-span-1 text-gray-600 text-sm font-medium">{player.rank}</div>
                  <div className="col-span-7">
                    <span className={`text-sm font-medium ${
                      player.isCurrentPlayer ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {player.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-center text-gray-600 text-xs">{player.position}</div>
                  <div className={`col-span-2 text-right font-bold text-sm ${
                    player.isCurrentPlayer ? 'text-red-900' : 'text-gray-900'
                  }`}>
                    {getStatDisplay(player)}
                  </div>
                </div>
              ))}
            </div>
            
            {mockPlayerData.position !== "G" && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>
                    {selectedCategory === "goals" && mockPlayerData.firstName === "Alexandre" ? "Tu es classé #3 pour les buts !" :
                     selectedCategory === "assists" && mockPlayerData.firstName === "Alexandre" ? "Tu es classé #2 pour les passes !" :
                     selectedCategory === "points" && mockPlayerData.firstName === "Alexandre" ? "Tu es classé #3 pour les points !" :
                     "Continue ton excellent travail !"}
                  </strong> Excellente performance cette saison !
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Statistiques de la saison</h2>
              <Badge className="bg-gray-100 text-gray-700">2024-25</Badge>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Matchs joués</span>
                <span className="text-lg font-bold text-gray-900">28</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Buts</span>
                <span className="text-lg font-bold text-gray-900">35</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Passes</span>
                <span className="text-lg font-bold text-gray-900">40</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-red-700">Total des points</span>
                <span className="text-lg font-bold text-red-900">75</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tes performances</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Note moyenne</span>
                <span className="font-bold text-lg text-red-600">4.2/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux d&apos;amélioration</span>
                <span className="font-bold text-lg text-red-600">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Camps fréquentés</span>
                <span className="font-bold text-lg text-gray-900">6</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hockey Profile Section */}
      <PlayerProfile player={player} />
    </div>
  );
}

export default function PlayerDashboard() {
  const [activeTab, setActiveTab] = useState<TabView>('profile');
  const [player] = useState(mockPlayerData);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: 'profile' as TabView, label: 'Mon profil', icon: User },
    { id: 'evaluations' as TabView, label: 'Mes évaluations', icon: Star },
    { id: 'cv' as TabView, label: 'CV sportif', icon: Trophy },
    { id: 'reports' as TabView, label: 'Mes rapports', icon: FileText }
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - Fixed height */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200 bg-white">
          <Image 
            src="/logo.png" 
            alt="UpGr8" 
            width={160} 
            height={56}
            className="w-auto h-12"
          />
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 min-h-0">
          <div className="h-full flex flex-col">
            {/* User Info */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-red-700">
                    {player.firstName[0]}{player.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    {player.firstName} {player.lastName}
                  </h2>
                  <p className="text-xs text-gray-600">#{player.number} • {player.position}</p>
                </div>
              </div>
            </div>

            {/* Navigation - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto px-3">
              <nav className="space-y-1 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? "bg-red-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom section - Always visible */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-3">
            <div className="space-y-1">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors relative"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
                <span className="ml-auto w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                Paramètres
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                Aide
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </button>
            </div>

            {/* User info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-red-700">
                    {player.firstName[0]}{player.lastName[0]}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{player.firstName} {player.lastName}</p>
                  <p className="text-xs text-gray-500">Joueur</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        {activeTab === 'profile' && <ProfileContent player={player} />}
        {activeTab === 'evaluations' && <EvaluationHistory playerId={player.id} />}
        {activeTab === 'cv' && <PlayerCV player={player} />}
        {activeTab === 'reports' && <AIReports playerId={player.id} />}
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={{
          id: "player-1",
          name: `${player.firstName} ${player.lastName}`,
          type: "player"
        }}
      />
    </div>
  );
}