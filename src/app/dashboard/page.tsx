"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Trophy,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  Target,
  Activity,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
  //ArrowRight,
  Play,
  User,
  Shield,
  //Zap,
  //Award,
  BarChart3,
  //CheckCircle,
  //AlertCircle,
  //MapPin,
  Timer,
  FileText,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
//import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

// Mock data for statistics
const stats = {
  teams: {
    total: 6,
    active: 5,
    change: +1,
    changePercent: 20
  },
  players: {
    total: 72,
    active: 68,
    injured: 4,
    change: +3,
    changePercent: 4.3
  },
  trainings: {
    thisWeek: 12,
    completed: 10,
    upcoming: 2,
    change: +2,
    changePercent: 20
  },
  evaluations: {
    total: 156,
    thisMonth: 24,
    avgRating: 7.8,
    change: +0.3,
    changePercent: 4
  }
};

// Recent activities
const recentActivities = [
  {
    id: 1,
    type: "training",
    title: "Entraînement Power Play",
    team: "Titans U15 AAA",
    time: "Il y a 2 heures",
    icon: Play,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "evaluation",
    title: "Évaluation de Alex Tremblay",
    rating: 8.5,
    time: "Il y a 5 heures",
    icon: ClipboardCheck,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "player",
    title: "Nouveau joueur ajouté",
    name: "Sophie Lavoie",
    team: "Eagles Midget Elite",
    time: "Hier",
    icon: User,
    color: "text-purple-600"
  },
  {
    id: 4,
    type: "team",
    title: "Équipe mise à jour",
    name: "Wolves Bantam AA",
    time: "Hier",
    icon: Users,
    color: "text-orange-600"
  },
  {
    id: 5,
    type: "training",
    title: "Entraînement Défensif",
    team: "Lions Novice A",
    time: "Il y a 2 jours",
    icon: Shield,
    color: "text-red-600"
  }
];

// Upcoming trainings
const upcomingTrainings = [
  {
    id: 1,
    title: "Patinage de Puissance",
    team: "Titans U15 AAA",
    date: "Aujourd'hui",
    time: "16:00",
    duration: "90 min",
    players: 18
  },
  {
    id: 2,
    title: "Tactiques Offensives",
    team: "Panthers Pee-Wee A",
    date: "Aujourd'hui",
    time: "18:30",
    duration: "60 min",
    players: 15
  },
  {
    id: 3,
    title: "Développement des Gardiens",
    team: "Tous les Gardiens",
    date: "Demain",
    time: "07:00",
    duration: "120 min",
    players: 6
  }
];

// Top performers
const topPerformers = [
  {
    id: 1,
    name: "Alex Tremblay",
    team: "Titans U15 AAA",
    position: "C",
    rating: 9.2,
    improvement: +0.8,
    goals: 24,
    assists: 31
  },
  {
    id: 2,
    name: "Emma Gagnon",
    team: "Lions Novice A",
    position: "G",
    rating: 8.9,
    improvement: +0.5,
    saves: 89.2,
    shutouts: 3
  },
  {
    id: 3,
    name: "Maxime Roy",
    team: "Eagles Midget Elite",
    position: "D",
    rating: 8.7,
    improvement: +0.6,
    plusMinus: 18,
    blocks: 45
  }
];

// Team standings
const teamStandings = [
  { name: "Titans U15 AAA", wins: 18, losses: 4, points: 36, trend: "up" },
  { name: "Eagles Midget Elite", wins: 16, losses: 6, points: 32, trend: "up" },
  { name: "Wolves Bantam AA", wins: 14, losses: 8, points: 28, trend: "same" },
  { name: "Panthers Pee-Wee A", wins: 12, losses: 10, points: 24, trend: "down" },
  { name: "Lions Novice A", wins: 10, losses: 12, points: 20, trend: "up" },
  { name: "Sharks Atome BB", wins: 8, losses: 14, points: 16, trend: "down" }
];

/**
 * Resume (Dashboard Overview) Page
 * 
 * Provides a comprehensive overview of all app data
 */
export default function DashboardPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-2">
            Vue d&apos;ensemble de votre programme de hockey
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800 px-3 py-1">
            <Activity className="h-3 w-3 mr-1" />
            Saison Active
          </Badge>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Rapport</span>
          </Button>
        </div>
      </motion.div>

      {/* Main Statistics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Teams Stats */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center text-sm ${
              stats.teams.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.teams.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1">{stats.teams.changePercent}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.teams.total}</h3>
          <p className="text-gray-600 text-sm">Équipes Totales</p>
          <div className="mt-3 text-xs text-gray-500">
            {stats.teams.active} actives
          </div>
        </motion.div>

        {/* Players Stats */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center text-sm ${
              stats.players.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.players.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1">{stats.players.changePercent}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.players.total}</h3>
          <p className="text-gray-600 text-sm">Joueurs Totaux</p>
          <div className="mt-3 text-xs text-gray-500">
            {stats.players.active} actifs • {stats.players.injured} blessés
          </div>
        </motion.div>

        {/* Trainings Stats */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`flex items-center text-sm ${
              stats.trainings.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.trainings.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1">{stats.trainings.changePercent}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.trainings.thisWeek}</h3>
          <p className="text-gray-600 text-sm">Entraînements cette semaine</p>
          <div className="mt-3 text-xs text-gray-500">
            {stats.trainings.completed} complétés • {stats.trainings.upcoming} à venir
          </div>
        </motion.div>

        {/* Evaluations Stats */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div className={`flex items-center text-sm ${
              stats.evaluations.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.evaluations.change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1">{stats.evaluations.changePercent}%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.evaluations.avgRating}/10</h3>
          <p className="text-gray-600 text-sm">Note Moyenne</p>
          <div className="mt-3 text-xs text-gray-500">
            {stats.evaluations.thisMonth} ce mois-ci
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activities & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activités Récentes
                </h2>
                <Link href="/dashboard/trainings">
                  <Button variant="ghost" size="sm">
                    Voir tout
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`${activity.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        {activity.team && (
                          <p className="text-sm text-gray-600">{activity.team}</p>
                        )}
                        {activity.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-semibold">{activity.rating}/10</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Trainings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Prochains Entraînements
                </h2>
                <Link href="/dashboard/trainings">
                  <Button variant="ghost" size="sm">
                    Voir tout
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingTrainings.map((training) => (
                <div key={training.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{training.title}</h4>
                      <p className="text-sm text-gray-600">{training.team}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {training.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {training.time}
                        </span>
                        <span className="flex items-center">
                          <Timer className="h-4 w-4 mr-1" />
                          {training.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {training.players}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Top Performers & Team Standings */}
        <div className="space-y-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Meilleurs Joueurs
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {topPerformers.map((player, index) => (
                <div key={player.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`
                        ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          index === 1 ? 'bg-gray-100 text-gray-800' : 
                          'bg-orange-100 text-orange-800'}
                      `}>
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-600">
                      {player.team} • {player.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{player.rating}</span>
                    </div>
                    <span className={`text-xs ${
                      player.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {player.improvement >= 0 ? '+' : ''}{player.improvement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team Standings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-lg shadow border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Classement des Équipes
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {teamStandings.map((team, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 w-4">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{team.name}</p>
                        <p className="text-xs text-gray-500">
                          {team.wins}V - {team.losses}D
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{team.points} pts</span>
                      {team.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {team.trend === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-lg p-6 text-white"
      >
        <h2 className="text-xl font-bold mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/trainings">
            <Button 
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Entraînement
            </Button>
          </Link>
          <Link href="/dashboard/evaluations">
            <Button 
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Nouvelle Évaluation
            </Button>
          </Link>
          <Link href="/dashboard/players">
            <Button 
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <User className="h-4 w-4 mr-2" />
              Ajouter Joueur
            </Button>
          </Link>
          <Link href="/dashboard/teams">
            <Button 
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Users className="h-4 w-4 mr-2" />
              Créer Équipe
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}