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

export default function ChallengeEditor() {
  const { selectedChallenge, addChallenge, setSelectedChallenge } =
    useChallengesContext();

  const [verificationMode, setVerificationMode] = useState("mono");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hints, setHints] = useState<Hint[]>([{ text: "", show: false }]);
  const [Challenge, setChallenge] = useState(selectedChallenge);

  useEffect(() => {
    if (selectedChallenge) {
      setVerificationMode(selectedChallenge.verificationType);
      setHints(
        selectedChallenge.numHints
          ? Array(selectedChallenge.numHints).fill({
              text: "Some hint here",
              show: false,
            })
          : []
      );
    }
  }, [selectedChallenge]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (selectedChallenge) {
      console.log("Updating challenge", Challenge);
    } else {
      console.log("adding challenge", {
        title: Challenge?.title || "",
        no: Challenge?.no || 0,
        summary: Challenge?.summary || "",
        creator: "",
        maxScore: Challenge?.maxScore || 0,
        submissionVerificationMode: verificationMode,
        flag: Challenge?.flag || "",
        csv: Challenge?.csv || "",
        numHints: hints.length,
        startTime: Challenge?.startTime || "",
        endTime: Challenge?.endTime || "",
      });
      // Call addChallenge from context
      addChallenge({
        title: Challenge?.title || "",
        no: Challenge?.no || 0,
        summary: Challenge?.summary || "",
        creator: "",
        maxScore: Challenge?.maxScore || 0,
        submissionVerificationMode: verificationMode,
        flag: Challenge?.flag || "",
        csv: Challenge?.csv || "",
        numHints: hints.length,
        startTime: Challenge?.startTime || "",
        endTime: Challenge?.endTime || "",
      });
    }
    setIsLoading(false);
  };

  const addHint = useCallback(() => {
    setHints((prevHints) => [...prevHints, { text: "", show: false }]);
  }, []);

  const deleteHint = useCallback((index) => {
    setHints((prevHints) => prevHints.filter((_, i) => i !== index));
  }, []);

  const updateHint = useCallback((index, newHint) => {
    setHints((prevHints) => {
      const updatedHints = [...prevHints];
      updatedHints[index] = newHint;
      return updatedHints;
    });
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto py">
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

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="min-h-[300px]">
            {currentPage === 1 && (
              <>
                <InputField
                  label="Title"
                  id="title"
                  placeholder="Enter challenge title"
                  value={Challenge?.title || ""}
                  required
                  onChange={(e) =>
                    setChallenge({
                      ...Challenge,
                      title: e.target.value,
                    })
                  }
                />
                <InputField
                  label="Number"
                  id="challengeNumber"
                  type="number"
                  placeholder="Enter challenge number"
                  value={Challenge?.no || 0}
                  required
                  onChange={(e) =>
                    setChallenge({
                      ...Challenge,
                      no: Number(e.target.value),
                    })
                  }
                />
                <TextareaField
                  label="Summary"
                  id="challengeSummary"
                  placeholder="Enter challenge summary"
                  value={Challenge?.summary || ""}
                  onChange={(e) =>
                    setChallenge({
                      ...Challenge,
                      summary: e.target.value,
                    })
                  }
                />
                <InputField
                  label="Max Score"
                  id="maxScore"
                  type="number"
                  placeholder="Enter max score"
                  value={Challenge?.maxScore || 0}
                  required
                  onChange={(e) =>
                    setChallenge({
                      ...Challenge,
                      maxScore: Number(e.target.value),
                    })
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
                  value={Challenge?.description || ""}
                  onChange={(e) =>
                    setChallenge({
                      ...Challenge,
                      description: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Start Time"
                    id="startTime"
                    type="datetime-local"
                    value={Challenge?.startTime || ""}
                    required
                    onChange={(e) =>
                      setChallenge({
                        ...Challenge,
                        startTime: e.target.value,
                      })
                    }
                  />
                  <InputField
                    label="End Time"
                    id="endTime"
                    type="datetime-local"
                    value={Challenge?.endTime || ""}
                    required
                    onChange={(e) =>
                      setChallenge({
                        ...Challenge,
                        endTime: e.target.value,
                      })
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
                  onChange={(value) => setVerificationMode(value)}
                />
                {verificationMode === "mono" && (
                  <InputField
                    label="Flag"
                    id="flag"
                    placeholder="Enter flag"
                    required
                    onChange={(e) =>
                      setChallenge({
                        ...Challenge,
                        flag: e.target.value,
                      })
                    }
                  />
                )}
                {verificationMode === "unique" && (
                  <TextareaField
                    label="Paste CSV Text"
                    id="csv"
                    placeholder="Paste CSV text"
                    rows={10}
                    required
                    onChange={(e) =>
                      setChallenge({
                        ...Challenge,
                        csv: e.target.value,
                      })
                    }
                  />
                )}
                {verificationMode === "custom" && (
                  <ApiKeyField
                    isApiKeyVisible={isApiKeyVisible}
                    onToggle={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  />
                )}
              </>
            )}

            {currentPage === 4 && (
              <>
                <Label className="ml-1">Hints</Label>
                {hints.map((hint, index) => (
                  <HintItem
                    key={index}
                    hint={hint}
                    onDelete={() => deleteHint(index)}
                    onChange={(newHint) => updateHint(index, newHint)}
                  />
                ))}
                <Button
                  type="button"
                  onClick={addHint}
                  className="flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </Button>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Challenge"}
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

const ApiKeyField = ({ isApiKeyVisible, onToggle }) => (
  <div className="flex items-center space-x-2">
    <Label>Require API Key</Label>
    <Switch checked={isApiKeyVisible} onCheckedChange={onToggle} />
  </div>
);

const HintItem = ({ hint, onDelete, onChange }) => (
  <div className="flex items-center space-x-2 mb-2">
    <Textarea
      value={hint.text}
      onChange={(e) => onChange({ ...hint, text: e.target.value })}
      placeholder="Hint text"
    />
    <Button type="button" onClick={onDelete} variant="destructive">
      <Trash size={16} />
    </Button>
  </div>
);
