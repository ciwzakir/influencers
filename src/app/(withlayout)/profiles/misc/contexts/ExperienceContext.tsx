"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Define the structure of each experience
export interface ExperienceType {
  id: number;
  experiences: string;
}

// Define the context value type
interface ExperienceContextProps {
  experiences: ExperienceType[];
}

// Create the context with a default value
const ExperienceContext = createContext<ExperienceContextProps>({
  experiences: [],
});

// Custom hook to access the experience context
export const useExperience = (): ExperienceContextProps => {
  return useContext(ExperienceContext);
};

// Provider component to wrap parts of your app that need access
export const ExperienceProvider = ({
  experiences,
  children,
}: {
  experiences: ExperienceType[];
  children: ReactNode;
}) => {
  return (
    <ExperienceContext.Provider value={{ experiences }}>
      {children}
    </ExperienceContext.Provider>
  );
};
