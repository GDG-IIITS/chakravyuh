import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TeamEditorProps {
  team: any; // User data
  setIsSubmissionModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to control modal visibility
}

const TeamEditor: React.FC<TeamEditorProps> = ({
  team,
  setIsSubmissionModalOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const submitData = {
      team: team._id,
      challenge: challengeId,
      score: 1,
    };

    console.log(submitData);
    setIsLoading(true);
    // Update user role
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges/mark/done`,
        submitData,
        { withCredentials: true }
      );

      console.log(response);
      setIsLoading(false);
      setIsSubmissionModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py">
      <CardHeader>
        <CardTitle>Make submission</CardTitle>
        <CardDescription>
          Submit the challenge Id which this team has completed
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="min-h-[150px]">
            <div className="mb-2">
              <Label className="ml-1" htmlFor="challengeId">
                Challenge Id
              </Label>
              <Input
                id="challengeId"
                value={challengeId}
                onChange={(e) => setChallengeId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TeamEditor;
