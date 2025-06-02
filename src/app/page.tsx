"use client";

import * as React from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { SimpleLoadingScreen } from "@/components/common/SimpleLoadingScreen";

export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  // Show loading screen for 2 seconds when app first loads
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Initial loading screen */}
      <SimpleLoadingScreen isLoading={isInitialLoading} />
      
      {/* Show login screen after initial loading */}
      {!isInitialLoading && <LoginScreen />}
    </>
  );
}