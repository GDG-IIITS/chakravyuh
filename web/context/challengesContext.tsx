"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

type Challenge = {
  id: string;
  title: string;
  no: number;
  summary: string;
  creator: string;
  maxScore: number;
  submissionVerificationMode: string;
  flag: string;
  csv: string;
  numHints: number;
  startTime: string;
  endTime: string;
};

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
  setSelectedChallenge: (challenge: Challenge | null) => void;
  addChallenge: (challenge: Omit<Challenge, "id">) => void;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(
  undefined
);

export const ChallengesProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  useEffect(() => {
    // Fetch challenges from API using Axios
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/challenges`,
          {
            withCredentials: true,
          }
        );
        setChallenges(response.data);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => {
    setSelectedChallenge(null);
    setIsAddModalOpen(false);
  };

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

  const addChallenge = async (challenge: Omit<Challenge, "id">) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges`,
        {
          ...challenge,
          hints: challenge.numHints
            ? Array(challenge.numHints).fill({
                text: "Some hint here",
                show: false,
              })
            : [],
        },
        {
          withCredentials: true, // Send credentials (cookies) with the request
        }
      );

      console.log("Hi");
      console.log(response.data);

      setChallenges([
        ...challenges,
        { ...response.data, id: String(response.data.no) },
      ]); // Add challenge to state
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
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
        setSelectedChallenge,
        addChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallengesContext = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error(
      "useChallengesContext must be used within a ChallengesProvider"
    );
  }
  return context;
};
