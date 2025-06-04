"use client";
import { 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIReportsProps {
  playerId: string;
}

const mockReports = [
  {
    id: "report-1",
    title: "Analyse de performance - Mars 2025",
    type: "Performance Analysis",
    generatedAt: "2025-03-15T10:30:00Z",
    confidence: 92,
    summary: "Alexandre montre une progression constante dans ses compétences offensives, particulièrement dans la création de jeu et la vision du terrain. Son leadership naturel se développe bien.",
    strengths: [
      "Excellence en création de jeu et passes décisives",
      "Vision du jeu remarquable pour son âge",
      "Leadership naturel sur la glace",
      "Amélioration constante du patinage"
    ],
    improvements: [
      "Précision du tir à améliorer, surtout en mouvement",
      "Jeu défensif à renforcer dans la zone défensive",
      "Condition physique générale à développer"
    ],
    recommendations: [
      "Augmenter les séances de tir spécifiques",
      "Travailler le positionnement défensif avec un coach",
      "Programme de conditionnement physique personnalisé"
    ],
    dataPoints: 847
  },
  {
    id: "report-2",
    title: "Rapport de progression - Janvier 2025",
    type: "Progress Report",
    generatedAt: "2025-01-20T14:15:00Z",
    confidence: 88,
    summary: "Développement positif observé au cours des dernières semaines. Alexandre s'adapte bien aux nouvelles stratégies d'équipe et montre une maturité croissante dans son jeu.",
    strengths: [
      "Adaptation rapide aux nouvelles stratégies",
      "Maturité de jeu en progression",
      "Communication efficace avec les coéquipiers",
      "Régularité dans les performances"
    ],
    improvements: [
      "Gestion du stress en situation de pression",
      "Vitesse de réaction à améliorer",
      "Travail en supériorité numérique"
    ],
    recommendations: [
      "Exercices de gestion du stress et concentration",
      "Drills de réaction et agilité",
      "Pratique spécifique du jeu de puissance"
    ],
    dataPoints: 623
  }
];

export function AIReports({ }: AIReportsProps) {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Mes Rapports IA</h1>
          <p className="text-sm text-gray-600">Analyses générées automatiquement</p>
        </div>

        <div className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{report.title}</h3>
                  <p className="text-xs text-gray-600">
                    {new Date(report.generatedAt).toLocaleDateString()} • {report.type}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  report.confidence >= 90 ? 'bg-green-100 text-green-800' :
                  report.confidence >= 75 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.confidence}% de confiance
                </span>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-xs text-gray-700 leading-relaxed mb-3">{report.summary}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-900">Points forts :</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {report.strengths.map((strength, index) => (
                      <li key={index} className="text-xs text-gray-600">{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-3">
                  <h4 className="text-xs font-semibold text-gray-900">Axes d&apos;amélioration :</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {report.improvements.map((improvement, index) => (
                      <li key={index} className="text-xs text-gray-600">{improvement}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-3">
                  <h4 className="text-xs font-semibold text-gray-900">Recommandations :</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {report.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-xs text-gray-600">{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Basé sur {report.dataPoints} points de données
                </span>
                <Button size="sm" variant="outline" className="text-xs">
                  Voir détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}