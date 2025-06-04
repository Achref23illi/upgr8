export type UserRole = 'coach-chef' | 'dg' | 'directeur-hockey' | 'entraineur-adjoint' | 'depisteur';

export type PlayerStatus = 'invite' | 'a-evaluer' | 'locke' | 'Active' | 'Inactive' | 'Injured';

export type PlayerPosition = 'Gardien' | 'Défenseur' | 'Attaquant' | 'Centre' | 'Ailier gauche' | 'Ailier droit' | 'Forward' | 'Defense' | 'Goalie';

export type CampLevel = 'M13' | 'M15' | 'M18' | 'U7' | 'U9' | 'U11' | 'U13' | 'U15' | 'U18' | 'Junior' | 'Senior';

export type EvaluationTag = 'cimente' | 'a-surveiller' | 'surevalue';

export interface Camp {
  id: string;
  name: string;
  level: CampLevel;
  location: string;
  startDate: string;
  endDate: string;
  groups: Group[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  logo?: string;
  stats?: {
    totalPlayers: number;
    evaluatedPlayers: number;
    totalEvaluators: number;
    activeEvaluators: number;
    completedEvaluations: number;
    pendingEvaluations: number;
  };
}

export interface Group {
  id: string;
  campId: string;
  name: string;
  color: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  position: PlayerPosition;
  number: number;
  status: PlayerStatus;
  groupIds: string[];
  campId: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  assignedPlayerIds: string[];
  campIds: string[];
  isActive: boolean;
  lastLogin?: string;
  invitedAt: string;
  acceptedAt?: string;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface Evaluation {
  id: string;
  playerId: string;
  evaluatorId: string;
  campId: string;
  criteria: {
    criteriaId: string;
    score: number;
  }[];
  comments: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerEvaluationSummary {
  playerId: string;
  averageScores: {
    criteriaId: string;
    average: number;
    standardDeviation: number;
    evaluationCount: number;
  }[];
  overallAverage: number;
  tags: EvaluationTag[];
  totalEvaluations: number;
}

export interface AIReport {
  id: string;
  playerId: string;
  campId: string;
  strengths: string[];
  developmentAreas: string[];
  finalStatus: string;
  nextSteps: string[];
  personalizedMessage?: string;
  validatedBy?: string;
  validatedAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  activeCamps: number;
  totalPlayers: number;
  evaluatorsAssigned: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  reportsGenerated: number;
}

export interface Alert {
  id: string;
  type: 'unevaluated-player' | 'inactive-evaluator' | 'pending-validation' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  campId?: string;
  playerId?: string;
  evaluatorId?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}