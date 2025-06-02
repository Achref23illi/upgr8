"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Star,
  Clock,
  Trophy,
  Target,
  Activity,
  Edit,
  Share2,
  Download,
  BarChart3,
  Zap,
  CheckCircle,
  Medal,
  Building
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * Achievement interface
 */
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

/**
 * Activity interface
 */
interface RecentActivity {
  id: string;
  type: "evaluation" | "training" | "team" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
}

/**
 * Coaching statistics interface
 */
interface CoachingStats {
  yearsOfExperience: number;
  totalPlayers: number;
  totalTeams: number;
  totalEvaluations: number;
  totalTrainingSessions: number;
  successRate: number;
  playerImprovement: number;
  championships: number;
}

/**
 * Profile Page Component
 * 
 * Displays comprehensive coach profile with:
 * - Personal information and contact details
 * - Coaching statistics and achievements
 * - Experience timeline and certifications
 * - Recent activity feed
 * - Performance metrics
 */
export default function ProfilePage() {
  // Mock user data
  const userProfile = {
    firstName: "Martin",
    lastName: "Dubois",
    email: "coach.martin@upgr8.com",
    phone: "+1 (514) 555-0123",
    location: "Montréal, QC",
    organization: "Club de Hockey Montréal",
    position: "Coach Principal",
    joinDate: "2019-09-15",
    bio: "Coach passionné avec plus de 15 ans d'expérience dans le développement de jeunes talents. Spécialisé dans les techniques offensives et la préparation mentale des joueurs.",
    certifications: [
      "Certification Hockey Canada Niveau 4",
      "Formation Développement des Compétences",
      "Certification Premiers Soins"
    ],
    languages: ["Français", "English"],
    socialMedia: {
      twitter: "@coach_martin",
      linkedin: "martin-dubois-coach"
    }
  };

  // Mock coaching statistics
  const coachingStats: CoachingStats = {
    yearsOfExperience: 15,
    totalPlayers: 247,
    totalTeams: 12,
    totalEvaluations: 1584,
    totalTrainingSessions: 892,
    successRate: 87,
    playerImprovement: 94,
    championships: 6
  };

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Mentor Exceptionnel",
      description: "100+ joueurs formés avec succès",
      icon: Trophy,
      unlocked: true,
      unlockedDate: "2023-12-01"
    },
    {
      id: "2",
      title: "Évaluateur Expert",
      description: "1000+ évaluations complétées",
      icon: Star,
      unlocked: true,
      unlockedDate: "2023-10-15"
    },
    {
      id: "3",
      title: "Champion",
      description: "5 championnats remportés",
      icon: Medal,
      unlocked: true,
      unlockedDate: "2023-05-20"
    },
    {
      id: "4",
      title: "Innovateur",
      description: "Nouvelles techniques d'entraînement",
      icon: Zap,
      unlocked: true,
      unlockedDate: "2023-08-10"
    },
    {
      id: "5",
      title: "Perfectionniste",
      description: "95% taux de satisfaction joueurs",
      icon: Target,
      unlocked: false,
      progress: 87,
      maxProgress: 95
    },
    {
      id: "6",
      title: "Stratège Master",
      description: "100 stratégies d'entraînement créées",
      icon: BarChart3,
      unlocked: false,
      progress: 73,
      maxProgress: 100
    }
  ];

  // Mock recent activities
  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "evaluation",
      title: "Évaluation complétée",
      description: "Alexandre Tremblay - Amélioration notable en tir",
      timestamp: "Il y a 2 heures",
      icon: Star
    },
    {
      id: "2",
      type: "training",
      title: "Entraînement planifié",
      description: "Session technique - Passes et réceptions",
      timestamp: "Il y a 4 heures",
      icon: Activity
    },
    {
      id: "3",
      type: "achievement",
      title: "Nouveau badge débloqué",
      description: "Évaluateur Expert - 1000+ évaluations",
      timestamp: "Il y a 1 jour",
      icon: Award
    },
    {
      id: "4",
      type: "team",
      title: "Équipe mise à jour",
      description: "Les Titans - Nouveau joueur ajouté",
      timestamp: "Il y a 2 jours",
      icon: Users
    },
    {
      id: "5",
      type: "evaluation",
      title: "Rapport mensuel généré",
      description: "Analyse des performances - Octobre 2024",
      timestamp: "Il y a 3 jours",
      icon: TrendingUp
    }
  ];

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
    <motion.div
      className="container mx-auto p-6 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src="/avatar.jpg" alt="Profile" />
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                {userProfile.firstName[0]}{userProfile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-red-100 text-lg mb-1">{userProfile.position}</p>
              <p className="text-red-200 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {userProfile.organization}
              </p>
              <p className="text-red-200 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-2" />
                Membre depuis {new Date(userProfile.joinDate).toLocaleDateString('fr-FR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations personnelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p className="font-medium">{userProfile.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Expérience</p>
                  <p className="font-medium">{coachingStats.yearsOfExperience} ans</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">À propos</h3>
              <p className="text-gray-600 leading-relaxed">{userProfile.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Certifications</h3>
                <div className="space-y-2">
                  {userProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Langues</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coaching Statistics */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Statistiques de coaching
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Joueurs formés", value: coachingStats.totalPlayers, icon: Users, color: "text-blue-600" },
                { label: "Équipes dirigées", value: coachingStats.totalTeams, icon: Trophy, color: "text-green-600" },
                { label: "Évaluations", value: coachingStats.totalEvaluations, icon: Star, color: "text-yellow-600" },
                { label: "Entraînements", value: coachingStats.totalTrainingSessions, icon: Activity, color: "text-red-600" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <stat.icon className={cn("w-8 h-8 mx-auto mb-2", stat.color)} />
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Taux de réussite</span>
                  <span className="text-lg font-bold text-green-600">{coachingStats.successRate}%</span>
                </div>
                <Progress value={coachingStats.successRate} className="h-2" />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Amélioration joueurs</span>
                  <span className="text-lg font-bold text-blue-600">{coachingStats.playerImprovement}%</span>
                </div>
                <Progress value={coachingStats.playerImprovement} className="h-2" />
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Championnats</span>
                  <span className="text-lg font-bold text-yellow-600">{coachingStats.championships}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(coachingStats.championships, 5) }, (_, i) => (
                    <Trophy key={i} className="w-4 h-4 text-yellow-500" />
                  ))}
                  {coachingStats.championships > 5 && (
                    <span className="text-sm text-yellow-600">+{coachingStats.championships - 5}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Réalisations
              </h2>
              <Badge variant="secondary">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} débloquées
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    achievement.unlocked
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      achievement.unlocked 
                        ? "bg-green-100 text-green-600" 
                        : "bg-gray-100 text-gray-400"
                    )}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-medium",
                        achievement.unlocked ? "text-gray-900" : "text-gray-500"
                      )}>
                        {achievement.title}
                      </h3>
                      <p className={cn(
                        "text-sm",
                        achievement.unlocked ? "text-gray-600" : "text-gray-400"
                      )}>
                        {achievement.description}
                      </p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Débloqué le {new Date(achievement.unlockedDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progression</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / (achievement.maxProgress || 100)) * 100} 
                            className="h-1" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-8">
          <motion.div variants={itemVariants} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Activité récente
              </h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    activity.type === "evaluation" && "bg-yellow-100 text-yellow-600",
                    activity.type === "training" && "bg-blue-100 text-blue-600",
                    activity.type === "team" && "bg-green-100 text-green-600",
                    activity.type === "achievement" && "bg-purple-100 text-purple-600"
                  )}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                  </div>
                  {index < recentActivities.length - 1 && (
                    <div className="absolute left-[22px] mt-8 h-4 w-px bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full text-sm">
                Voir toute l&apos;activité
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Télécharger CV
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="w-4 h-4 mr-2" />
                Partager profil
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Rapport d&apos;activité
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}