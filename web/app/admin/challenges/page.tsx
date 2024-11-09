import { ChallengesProvider } from "@/context/challengesContext";
import { ChallengesPage } from "@/components/challenges-page";

export default function App() {
  return (
    <ChallengesProvider>
      <ChallengesPage />
    </ChallengesProvider>
  );
}
