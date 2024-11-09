"use client";

import { createContext, useContext, useState } from "react";

// Define the Challenge type
type Challenge = {
  id: string;
  title: string;
  no: number;
  summary: string;
  creator: string;
  maxScore: number;
  verificationType: string;
  numHints: number;
  startTime: string;
  endTime: string;
};

// Context props type
interface ChallengesContextType {
  challenges: Challenge[];
  searchTerm: string;
  isAddModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedChallenge: Challenge | null;
  setSearchTerm: (term: string) => void;
  setChallenges: (challenges: Challenge[]) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openDeleteModal: (challenge: Challenge) => void;
  closeDeleteModal: () => void;
  handleDeleteChallenge: () => void;
}

// Create context
const ChallengesContext = createContext<ChallengesContextType | undefined>(
  undefined
);

// Provider component
export const ChallengesProvider = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Web Security Challenge",
      no: 1,
      summary: "Find and exploit vulnerabilities in a web application",
      creator: "John Doe",
      maxScore: 100,
      verificationType: "Automatic",
      numHints: 3,
      startTime: "2023-06-01T00:00:00Z",
      endTime: "2023-06-30T23:59:59Z",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDeleteModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedChallenge(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteChallenge = () => {
    if (selectedChallenge) {
      setChallenges(challenges.filter((c) => c.id !== selectedChallenge.id));
    }
    closeDeleteModal();
  };

  return (
    <ChallengesContext.Provider
      value={{
        challenges,
        searchTerm,
        isAddModalOpen,
        isDeleteModalOpen,
        selectedChallenge,
        setSearchTerm,
        setChallenges,
        openAddModal,
        closeAddModal,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
};

// Custom hook to use the context
export const useChallengesContext = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error(
      "useChallengesContext must be used within a ChallengesProvider"
    );
  }
  return context;
};
