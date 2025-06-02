"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Play } from "lucide-react";

interface TrainingTimerProps {
  isRunning: boolean;
  elapsedTime: number; // in seconds
  totalDuration: number; // in minutes
}

export function TrainingTimer({ isRunning, elapsedTime, totalDuration }: TrainingTimerProps) {
  const [currentTime, setCurrentTime] = React.useState(elapsedTime);

  // Update timer when running
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setCurrentTime(elapsedTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, elapsedTime]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const totalSeconds = totalDuration * 60;
  const progressPercentage = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;
  const isOvertime = currentTime > totalSeconds && totalSeconds > 0;

  // Get color based on progress

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        {/* Timer Display */}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isRunning ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {isRunning ? (
              <Play className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-600" />
            )}
          </div>
          
          <div>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold font-mono ${
                isOvertime ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatTime(currentTime)}
              </span>
              {totalDuration > 0 && (
                <span className="text-sm text-gray-500 font-mono">
                  / {formatTime(totalDuration * 60)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isRunning ? "Temps écoulé" : "Chronomètre"}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {totalDuration > 0 && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className={`text-sm font-medium ${
                isOvertime ? 'text-red-600' : 'text-gray-900'
              }`}>
                {isOvertime ? "Prolongation" : `${Math.round(progressPercentage)}%`}
              </p>
              <p className="text-xs text-gray-500">
                {isOvertime ? 
                  `+${formatTime(currentTime - totalSeconds)}` : 
                  `${formatTime(Math.max(0, totalSeconds - currentTime))} restant`
                }
              </p>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={isOvertime ? "#ef4444" : 
                    progressPercentage > 75 ? "#f97316" :
                    progressPercentage > 50 ? "#eab308" : "#22c55e"}
                  strokeWidth="3"
                  strokeDasharray={`${Math.min(progressPercentage, 100)}, 100`}
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${Math.min(progressPercentage, 100)}, 100` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>
              
              {/* Center indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${
                  isRunning ? 
                    (isOvertime ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse') :
                    'bg-gray-400'
                }`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {isOvertime && totalDuration > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-center"
        >
          <p className="text-sm text-red-800 font-medium">
            ⏰ Exercice en prolongation
          </p>
        </motion.div>
      )}

      {isRunning && !isOvertime && progressPercentage > 90 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-center"
        >
          <p className="text-sm text-orange-800 font-medium">
            ⚠️ Exercice bientôt terminé
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}