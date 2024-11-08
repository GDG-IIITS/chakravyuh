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
import { Plus, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ChallengeEditor() {
  const [verificationMode, setVerificationMode] = useState("Mono");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hints, setHints] = useState([{ text: "", show: false }]);
  const totalPages = 4;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  const addHint = () => {
    setHints([...hints, { text: "", show: false }]);
  };

  const deleteHint = (index) => {
    setHints(hints.filter((_, i) => i !== index));
  };

  const updateHint = (index, newHint) => {
    const newHints = [...hints];
    newHints[index] = newHint;
    setHints(newHints);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py">
      <CardHeader>
        <div className="mb-4">
          <Progress
            value={(currentPage / totalPages) * 100}
            className="w-full"
          />
        </div>
        <CardTitle>Add New Challenge</CardTitle>
        <CardDescription>
          Create a new digital treasure hunt challenge
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="min-h-[300px]">
            {currentPage === 1 && (
              <>
                <div className="mb-2">
                  <Label className="ml-1" htmlFor="title">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter challenge title"
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label className="ml-1" htmlFor="challengeNumber">
                    Number
                  </Label>
                  <Input
                    id="challengeNumber"
                    type="number"
                    placeholder="Enter challenge number"
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label className="ml-1" htmlFor="challengeSummary">
                    Summary
                  </Label>
                  <Textarea
                    id="challengeSummary"
                    placeholder="Enter challenge summary"
                    required
                  />
                </div>
                <div className="mb-2">
                  <Label className="ml-1" htmlFor="maxScore">
                    Max Score
                  </Label>
                  <Input
                    id="maxScore"
                    type="number"
                    placeholder="Enter max score"
                    required
                  />
                </div>
              </>
            )}
            {currentPage === 2 && (
              <>
                <div className="mb-2 h-3/4">
                  <Label className="ml-1" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={10}
                    placeholder="Enter challenge description"
                    required
                    className="h-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-2">
                    <Label className="ml-1" htmlFor="startTime">
                      Start Time
                    </Label>
                    <Input id="startTime" type="datetime-local" required />
                  </div>
                  <div className="mb-2">
                    <Label className="ml-1" htmlFor="endTime">
                      End Time
                    </Label>
                    <Input id="endTime" type="datetime-local" required />
                  </div>
                </div>
              </>
            )}
            {currentPage === 3 && (
              <>
                <div className="mb-2">
                  <Label className="ml-1" htmlFor="verificationMode">
                    Verification Mode
                  </Label>
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
                  <div className="mb-2">
                    <Label className="ml-1" htmlFor="flag">
                      Flag
                    </Label>
                    <Input id="flag" placeholder="Enter flag" required />
                  </div>
                )}
                {verificationMode === "Unique" && (
                  <div className="mb-2">
                    <Label className="ml-1" htmlFor="csv">
                      Paste CSV Text
                    </Label>
                    <Textarea
                      id="csv"
                      rows={10}
                      placeholder="Paste CSV text"
                      required
                    />
                  </div>
                )}
                {verificationMode === "Custom" && (
                  <div className="mb-2">
                    <Label className="ml-1" htmlFor="apiKey">
                      API Key
                    </Label>
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
            {currentPage === 4 && (
              <>
                <div className="mb-2">
                  <Label className="ml-1">Hints</Label>
                  {hints.map((hint, index) => (
                    <div
                      key={index}
                      className="mb-2 flex items-center space-x-2"
                    >
                      <Textarea
                        value={hint.text}
                        onChange={(e) =>
                          updateHint(index, { ...hint, text: e.target.value })
                        }
                        placeholder="Enter hint text"
                        required
                      />

                      <label className="flex items-center space-x-2">
                        <Switch
                          checked={hint.show}
                          onCheckedChange={(checked) =>
                            updateHint(index, { ...hint, show: checked })
                          }
                        />
                      </label>
                      <Button
                        type="button"
                        onClick={() => deleteHint(index)}
                        className="p-2 bg-white hover:bg-gray-100"
                      >
                        <Trash size={16} className="text-black" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addHint}
                    className="flex items-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentPage > 1 && (
            <Button
              type="button"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
          )}
          {currentPage < 4 && (
            <Button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              className={currentPage === 1 ? "ml-auto" : ""}
            >
              Next
            </Button>
          )}
          {currentPage === 4 && (
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
