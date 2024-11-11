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
import { useChallengesContext } from "@/context/challengesContext";
import { Switch } from "./ui/switch";

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
  const { selectedChallenge, updateChallenge, addChallenge } =
    useChallengesContext();

  const [verificationMode, setVerificationMode] = useState("mono");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hints, setHints] = useState<Hint[]>([{ text: "", show: false }]);
  const [tags, setTags] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<Challenge>();

  useEffect(() => {
    if (selectedChallenge) {
      setChallenge(selectedChallenge);
      setVerificationMode(selectedChallenge.submissionVerificationMode);
      setHints(selectedChallenge.hints || []);
      setTags(selectedChallenge.tags || []);
    }
  }, [selectedChallenge]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentPage !== 4) return;

    setIsLoading(true);
    try {
      console.log(challenge);
      const challengeData = {
        ...challenge,

        tags: tags.filter((tag) => tag.trim() !== ""), // Remove empty tags
        submissionVerificationMode: verificationMode,
        hints: hints,
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

  const updateHint = useCallback((index: number, updatedHint: Hint) => {
    setHints((prev) => {
      const newHints = [...prev];
      newHints[index] = updatedHint;
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
                  onChange={(e: any) =>
                    handleInputChange("title", e.target.value)
                  }
                />
                <InputField
                  label="Number"
                  id="challengeNumber"
                  type="number"
                  placeholder="Enter challenge number"
                  value={challenge?.no || ""}
                  required
                  onChange={(e: any) =>
                    handleInputChange("no", Number(e.target.value))
                  }
                />
                <TextareaField
                  label="Summary"
                  id="challengeSummary"
                  placeholder="Enter challenge summary"
                  value={challenge?.summary || ""}
                  onChange={(e: any) =>
                    handleInputChange("summary", e.target.value)
                  }
                />
                <InputField
                  label="Max Score"
                  id="maxScore"
                  type="number"
                  placeholder="Enter max score"
                  value={challenge?.maxScore || ""}
                  required
                  onChange={(e: any) =>
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
                  onChange={(e: any) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Start Time"
                    placeholder={new Date().toISOString()}
                    id="startTime"
                    type="datetime-local"
                    value={challenge?.startTime || ""}
                    required
                    onChange={(e: any) =>
                      handleInputChange("startTime", e.target.value)
                    }
                  />
                  <InputField
                    label="End Time"
                    id="endTime"
                    placeholder={new Date().toISOString()}
                    type="datetime-local"
                    value={challenge?.endTime || ""}
                    required
                    onChange={(e: any) =>
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
                    onChange={(e: any) =>
                      handleInputChange("flag", e.target.value)
                    }
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
                    onChange={(e: any) =>
                      handleInputChange("csv", e.target.value)
                    }
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
                        <div className="flex-grow">
                          <Textarea
                            value={hint.text}
                            onChange={(e) =>
                              updateHint(index, {
                                ...hint,
                                text: e.target.value,
                              })
                            }
                            placeholder="Enter hint text"
                          />
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={hint.show}
                              onCheckedChange={(checked) =>
                                updateHint(index, { ...hint, show: checked })
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => deleteHint(index)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
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
                          onChange={(e: any) =>
                            updateTag(index, e.target.value)
                          }
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
