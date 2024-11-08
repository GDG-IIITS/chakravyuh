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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function ChallengeEditor() {
  const [verificationMode, setVerificationMode] = useState("Mono");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py">
      <CardHeader>
        <div className="mb-4">
          <Progress
            value={(currentPage / totalPages) * 100}
            className="w-ful"
          />
        </div>
        <CardTitle>Add New Challenge</CardTitle>
        <CardDescription>
          Create a new digital treasure hunt challenge
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="min-h-[400px]">
            {currentPage === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter challenge title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challengeNumber">Challenge Number</Label>
                  <Input
                    id="challengeNumber"
                    type="number"
                    placeholder="Enter challenge number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="challengeSummary">Challenge Summary</Label>
                  <Textarea
                    id="challengeSummary"
                    placeholder="Enter challenge summary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter challenge description"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="datetime-local" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="datetime-local" required />
                  </div>
                </div>
              </>
            )}
            {currentPage === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="verificationMode">Verification Mode</Label>
                  <Select
                    value={verificationMode}
                    onValueChange={setVerificationMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verification mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mono">Mono</SelectItem>
                      <SelectItem value="Unique">Unique</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {verificationMode === "Mono" && (
                  <div className="space-y-2">
                    <Label htmlFor="flag">Flag</Label>
                    <Input id="flag" placeholder="Enter flag" required />
                  </div>
                )}
                {verificationMode === "Unique" && (
                  <div className="space-y-2">
                    <Label htmlFor="csv">Paste CSV Text</Label>
                    <Textarea id="csv" placeholder="Paste CSV text" required />
                  </div>
                )}
                {verificationMode === "Custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="apiKey"
                        type={isApiKeyVisible ? "text" : "password"}
                        placeholder="Enter API key"
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                      >
                        {isApiKeyVisible ? "Hide" : "Show"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            document.getElementById("apiKey").value
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentPage === 2 && (
            <Button type="button" onClick={() => setCurrentPage(1)}>
              Previous
            </Button>
          )}
          {currentPage === 1 && (
            <Button type="button" onClick={() => setCurrentPage(2)}>
              Next
            </Button>
          )}
          {currentPage === 2 && (
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
