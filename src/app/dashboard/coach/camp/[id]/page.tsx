"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Calendar,
  MapPin,
  Users,
  UserCheck,
  Activity,
  ArrowLeft,
  Eye,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampOverview } from "@/components/coach/camp/CampOverview";
import { CampPlayers } from "@/components/coach/camp/CampPlayers";
import { CampEvaluators } from "@/components/coach/camp/CampEvaluators";
import { CampEvaluations } from "@/components/coach/camp/CampEvaluations";
import { CampHistory } from "@/components/coach/camp/CampHistory";
import { EditCampModal } from "@/components/coach/camp/EditCampModal";
import { ExportDataModal } from "@/components/coach/camp/ExportDataModal";
import { AIReportModal } from "@/components/coach/camp/AIReportModal";
import { CampClosureModal } from "@/components/coach/camp/CampClosureModal";
import { Camp, PlayerReport } from "@/types/coach";

interface PageProps {
  params: Promise<{ id: string }>;
}

const mockCamp: Camp = {
  id: "camp-1",
  name: "Camp M15 Excellence",
  level: "M15",
  location: "Centre Sportif Montréal",
  startDate: "2025-03-10",
  endDate: "2025-03-15",
  groups: [
    { id: "g1", campId: "camp-1", name: "Group A", color: "#ef4444" },
    { id: "g2", campId: "camp-1", name: "Group B", color: "#3b82f6" }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  stats: {
    totalPlayers: 45,
    evaluatedPlayers: 32,
    totalEvaluators: 8,
    activeEvaluators: 6,
    completedEvaluations: 128,
    pendingEvaluations: 17
  }
};

export default function CampDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [camp, setCamp] = useState<Camp>(mockCamp);

  useEffect(() => {
    params.then(resolvedParams => {
      // Load camp data based on resolved params.id if needed
      console.log('Camp ID:', resolvedParams.id);
    });
  }, [params]);

  const [activeTab, setActiveTab] = useState("overview");
  const [isArchiving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAIReportModalOpen, setIsAIReportModalOpen] = useState(false);
  const [isCampClosureModalOpen, setIsCampClosureModalOpen] = useState(false);


  const handleEditCamp = (campData: {
    name: string;
    level: string;
    location: string;
    startDate: string;
    endDate: string;
    groups: Array<{ id: string; name: string; color: string }>;
  }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCamp(prevCamp => ({ ...prevCamp, ...campData }));
        resolve(campData);
      }, 1000);
    });
  };

  const handleGenerateAIReports = async (reports: PlayerReport[]): Promise<void> => {
    // Simulate API call to generate reports
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Generated AI reports:', reports);
        resolve();
      }, 1000);
    });
  };

  const handleCampClosure = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCamp(prevCamp => ({ ...prevCamp, isActive: false }));
        resolve();
      }, 2000);
    });
  };

  const getStatusColor = () => {
    if (!camp.isActive) return "bg-gray-100 text-gray-800";
    const now = new Date();
    const start = new Date(camp.startDate);
    const end = new Date(camp.endDate);
    
    if (now < start) return "bg-blue-100 text-blue-800";
    if (now > end) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = () => {
    if (!camp.isActive) return "Archived";
    const now = new Date();
    const start = new Date(camp.startDate);
    const end = new Date(camp.endDate);
    
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const evaluationProgress = camp.stats ? 
    (camp.stats.evaluatedPlayers / camp.stats.totalPlayers) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-3 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{camp.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{camp.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge className={getStatusColor()}>
                      {getStatusText()}
                    </Badge>
                    <Badge variant="outline">{camp.level}</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {camp.isActive && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Camp
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsExportModalOpen(true)}
                  >
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsAIReportModalOpen(true)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Generate AI Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsCampClosureModalOpen(true)}
                    disabled={isArchiving}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Close & Archive Camp
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{camp.stats?.totalPlayers || 0}</div>
            <div className="text-sm text-gray-600">Total Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{camp.stats?.evaluatedPlayers || 0}</div>
            <div className="text-sm text-gray-600">Evaluated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{camp.stats?.totalEvaluators || 0}</div>
            <div className="text-sm text-gray-600">Evaluators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{camp.stats?.completedEvaluations || 0}</div>
            <div className="text-sm text-gray-600">Evaluations Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{camp.stats?.pendingEvaluations || 0}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Evaluation Progress</span>
            <span className="text-sm text-gray-600">{Math.round(evaluationProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-red-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${evaluationProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Players</span>
            </TabsTrigger>
            <TabsTrigger value="evaluators" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Evaluators</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Evaluations</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CampOverview camp={{
              id: camp.id,
              name: camp.name,
              groups: camp.groups,
              stats: {
                totalPlayers: camp.stats?.totalPlayers || 0,
                evaluatorsAssigned: camp.stats?.totalEvaluators || 0,
                evaluationsCompleted: camp.stats?.completedEvaluations || 0,
                pendingEvaluations: camp.stats?.pendingEvaluations || 0
              }
            }} />
          </TabsContent>

          <TabsContent value="players">
            <CampPlayers campId={camp.id} groups={camp.groups} />
          </TabsContent>

          <TabsContent value="evaluators">
            <CampEvaluators campId={camp.id} groups={camp.groups} />
          </TabsContent>

          <TabsContent value="evaluations">
            <CampEvaluations campId={camp.id} />
          </TabsContent>

          <TabsContent value="history">
            <CampHistory campId={camp.id} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Camp Modal */}
      <EditCampModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        camp={camp}
        onSave={(campData) => {
          handleEditCamp(campData);
          setIsEditModalOpen(false);
        }}
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        campData={{
          id: camp.id,
          name: camp.name,
          totalPlayers: camp.stats?.totalPlayers || 0,
          totalEvaluators: camp.stats?.totalEvaluators || 0,
          totalEvaluations: camp.stats?.completedEvaluations || 0
        }}
      />

      {/* AI Report Modal */}
      <AIReportModal
        isOpen={isAIReportModalOpen}
        onClose={() => setIsAIReportModalOpen(false)}
        campData={{
          id: camp.id,
          name: camp.name,
          totalPlayers: camp.stats?.totalPlayers || 0,
          evaluatedPlayers: camp.stats?.evaluatedPlayers || 0
        }}
        onGenerate={handleGenerateAIReports}
      />

      {/* Camp Closure Modal */}
      <CampClosureModal
        isOpen={isCampClosureModalOpen}
        onClose={() => setIsCampClosureModalOpen(false)}
        campData={{
          id: camp.id,
          name: camp.name,
          totalPlayers: camp.stats?.totalPlayers || 0,
          evaluatedPlayers: camp.stats?.evaluatedPlayers || 0,
          totalEvaluators: camp.stats?.totalEvaluators || 0,
          completedEvaluations: camp.stats?.completedEvaluations || 0,
          pendingEvaluations: camp.stats?.pendingEvaluations || 0
        }}
        onArchive={handleCampClosure}
      />
    </div>
  );
}