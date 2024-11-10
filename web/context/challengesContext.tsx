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
  description: string;
  tags: string[];
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

type ChallengeReturned = {
  _id: string;
  creator: string;
  no: number;
  title: string;
  summary: string;
  tags: string[];
  startTime: string;
  endTime: string;
  description: string;
  hints: {
    text: string;
    show: boolean;
  }[];
  submissionVerification: {
    kind: string;
    flag: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

interface ChallengesContextType {
  challenges: ChallengeReturned[];
  searchTerm: string;
  isAddModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedChallenge: Challenge | null;
  setSearchTerm: (term: string) => void;
  setChallenges: (challenges: ChallengeReturned[]) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openDeleteModal: (challenge: Challenge) => void;
  closeDeleteModal: () => void;
  handleDeleteChallenge: () => void;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  addChallenge: (challenge: Omit<Challenge, "id">) => Promise<void>;
  updateChallenge: (id: string, challenge: Partial<Challenge>) => Promise<void>;
}

const ChallengesContext = createContext<ChallengesContextType | undefined>(
  undefined
);

export const ChallengesProvider = ({ children }: { children: ReactNode }) => {
  const [challenges, setChallenges] = useState<ChallengeReturned[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  useEffect(() => {
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
      setChallenges(challenges.filter((c) => c._id !== selectedChallenge.id));
    }
    closeDeleteModal();
  };

  const addChallenge = async (challenge: Omit<Challenge, "id">) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges`,
        {
          ...challenge,
          tags: challenge.tags,
          hints: challenge.numHints
            ? Array(challenge.numHints).fill({
                text: "Some hint here",
                show: false,
              })
            : [],
        },
        {
          withCredentials: true,
        }
      );

      setChallenges([...challenges, response.data]);
    } catch (error) {
      console.error("Error adding challenge:", error);
      throw error;
    }
  };

  const updateChallenge = async (id: string, challenge: Partial<Challenge>) => {
    try {
      // Prepare the update payload
      const updatePayload = {
        ...challenge,
        submissionVerification: {
          kind: challenge.submissionVerificationMode,
          flag: challenge.flag,
        },
      };

      // Remove fields that shouldn't be sent in the update
      delete updatePayload.submissionVerificationMode;
      delete updatePayload.flag;
      delete updatePayload.id;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges/${id}`,
        updatePayload,
        {
          withCredentials: true,
        }
      );

      // Update the challenges state
      setChallenges(challenges.map((c) => (c._id === id ? response.data : c)));

      // Close the modal
      closeAddModal();
    } catch (error) {
      console.error("Error updating challenge:", error);
      throw error;
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
        updateChallenge,
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
