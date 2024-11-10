"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useChallengesContext } from "@/context/challengesContext";

type Hint = {
  text: string;
  show: boolean;
};

type Challenge = {
  title?: string;
  no?: number;
  summary?: string;
  description?: string;
  maxScore?: number;
  startTime?: string;
  endTime?: string;
  flag?: string;
  csv?: string;
  tags?: string[];
  submissionVerificationMode?: string;
};

export default function ChallengeEditor() {
  const {
    selectedChallenge,
    updateChallenge,
    addChallenge,
    setSelectedChallenge,
  } = useChallengesContext();

  const [verificationMode, setVerificationMode] = useState("mono");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hints, setHints] = useState<Hint[]>([{ text: "", show: false }]);
  const [tags, setTags] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    if (selectedChallenge) {
      setChallenge(selectedChallenge);
      setVerificationMode(selectedChallenge.submissionVerificationMode);
      // Convert hints from number to array of hint objects
      const initialHints = Array.from(
        { length: selectedChallenge.numHints || 1 },
        () => ({ text: "", show: false })
      );
      setHints(initialHints);
      setTags(selectedChallenge.tags || []);
    }
  }, [selectedChallenge]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentPage !== 4) return;

    setIsLoading(true);
    try {
      const challengeData = {
        ...challenge,
        tags: tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
        numHints: hints.filter((hint) => hint.text.trim() !== "").length, // Count non-empty hints
        submissionVerificationMode: verificationMode,
        hints: hints
          .map((hint) => hint.text)
          .filter((text) => text.trim() !== ""), // Save non-empty hint texts
      };

      if (selectedChallenge) {
        // Update existing challenge
        console.log("Updating challenge", challengeData);
        await updateChallenge(selectedChallenge.id, challengeData);
      } else {
        // Add new challenge
        console.log("Adding challenge", challengeData);
        await addChallenge(challengeData);
      }
    } catch (error) {
      console.error("Error saving challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addHint = useCallback(() => {
    setHints((prev) => [...prev, { text: "", show: false }]);
  }, []);

  const deleteHint = useCallback((index: number) => {
    setHints((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateHint = useCallback((index: number, text: string) => {
    setHints((prev) => {
      const newHints = [...prev];
      newHints[index] = { ...newHints[index], text };
      return newHints;
    });
  }, []);

  const addTag = useCallback(() => {
    setTags((prev) => [...prev, ""]);
  }, []);

  const deleteTag = useCallback((index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateTag = useCallback((index: number, value: string) => {
    setTags((prev) => {
      const newTags = [...prev];
      newTags[index] = value;
      return newTags;
    });
  }, []);

  const handleInputChange = (field: keyof Challenge, value: any) => {
    setChallenge((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="mb-4">
          <Progress value={(currentPage / 4) * 100} className="w-full" />
        </div>
        <CardTitle>
          {selectedChallenge ? "Edit Challenge" : "Add New Challenge"}
        </CardTitle>
        <CardDescription>
          {selectedChallenge
            ? "Edit the details of the selected challenge"
            : "Create a new digital treasure hunt challenge"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={(event) => event.preventDefault()}>
        <CardContent className="space-y-4">
          <div className="min-h-[300px]">
            {currentPage === 1 && (
              <>
                <InputField
                  label="Title"
                  id="title"
                  placeholder="Enter challenge title"
                  value={challenge?.title || ""}
                  required
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                <InputField
                  label="Number"
                  id="challengeNumber"
                  type="number"
                  placeholder="Enter challenge number"
                  value={challenge?.no || ""}
                  required
                  onChange={(e) =>
                    handleInputChange("no", Number(e.target.value))
                  }
                />
                <TextareaField
                  label="Summary"
                  id="challengeSummary"
                  placeholder="Enter challenge summary"
                  value={challenge?.summary || ""}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                />
                <InputField
                  label="Max Score"
                  id="maxScore"
                  type="number"
                  placeholder="Enter max score"
                  value={challenge?.maxScore || ""}
                  required
                  onChange={(e) =>
                    handleInputChange("maxScore", Number(e.target.value))
                  }
                />
              </>
            )}

            {currentPage === 2 && (
              <>
                <TextareaField
                  label="Description"
                  id="description"
                  placeholder="Enter challenge description"
                  rows={10}
                  value={challenge?.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Start Time"
                    id="startTime"
                    type="datetime-local"
                    value={challenge?.startTime || ""}
                    required
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                  />
                  <InputField
                    label="End Time"
                    id="endTime"
                    type="datetime-local"
                    value={challenge?.endTime || ""}
                    required
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {currentPage === 3 && (
              <>
                <SelectField
                  label="Verification Mode"
                  value={verificationMode}
                  options={["mono", "unique", "custom"]}
                  onChange={setVerificationMode}
                />
                {verificationMode === "mono" && (
                  <InputField
                    label="Flag"
                    id="flag"
                    placeholder="Enter flag"
                    value={challenge?.flag || ""}
                    required
                    onChange={(e) => handleInputChange("flag", e.target.value)}
                  />
                )}
                {verificationMode === "unique" && (
                  <TextareaField
                    label="Paste CSV Text"
                    id="csv"
                    value={challenge?.csv || ""}
                    placeholder="Paste CSV text"
                    rows={10}
                    required
                    onChange={(e) => handleInputChange("csv", e.target.value)}
                  />
                )}
              </>
            )}

            {currentPage === 4 && (
              <>
                <div className="space-y-2">
                  <Label className="ml-1">Hints</Label>
                  <div className="space-y-2">
                    {hints.map((hint, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Textarea
                          value={hint.text}
                          onChange={(e) => updateHint(index, e.target.value)}
                          placeholder="Enter hint text"
                        />
                        <Button
                          type="button"
                          onClick={() => deleteHint(index)}
                          variant="destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addHint}
                      className="flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Hint</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="ml-1">Tags</Label>
                  <div className="space-y-2">
                    {tags.map((tag, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={tag}
                          onChange={(e) => updateTag(index, e.target.value)}
                          placeholder="Enter tag"
                        />
                        <Button
                          type="button"
                          onClick={() => deleteTag(index)}
                          variant="destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addTag}
                      className="flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>Add Tag</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {currentPage < 4 ? (
            <Button
              type="button"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === 4}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : selectedChallenge
                ? "Update Challenge"
                : "Create Challenge"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
}) => (
  <div className="mb-2">
    <Label className="ml-1" htmlFor={id}>
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  </div>
);

const TextareaField = ({
  label,
  id,
  placeholder,
  rows = 4,
  required = false,
  value,
  onChange,
}) => (
  <div className="mb-2">
    <Label className="ml-1" htmlFor={id}>
      {label}
    </Label>
    <Textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange }) => (
  <div className="mb-2">
    <Label className="ml-1">{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
