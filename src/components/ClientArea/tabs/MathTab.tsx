"use client";

import React, { useState, useEffect } from 'react';
import MathRoboticsDemo from '@/components/ThreeJS/MathRoboticsDemo';

const MathTab: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-white text-2xl font-bold animate-pulse">
          Caricamento strumenti matematici e robotica...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-200px)]">
      <MathRoboticsDemo />
    </div>
  );
};

export default MathTab;
