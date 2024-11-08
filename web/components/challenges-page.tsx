"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Search, MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import ChallengeEditor from "./add-challenge";

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

export function ChallengesPage() {
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
    // Add more sample challenges here
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEditChallenge = (challenge: Challenge) => {
    if (selectedChallenge) {
      setChallenges(
        challenges.map((c) => (c.id === challenge.id ? challenge : c))
      );
    } else {
      setChallenges([
        ...challenges,
        { ...challenge, id: Date.now().toString() },
      ]);
    }
    setIsAddModalOpen(false);
    setSelectedChallenge(null);
  };

  const handleDeleteChallenge = () => {
    if (selectedChallenge) {
      setChallenges(challenges.filter((c) => c.id !== selectedChallenge.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          {" "}
          <Plus /> Add Challenge
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Max Score</TableHead>
            <TableHead>Verification Type</TableHead>
            <TableHead>Hints</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChallenges.map((challenge) => (
            <TableRow key={challenge.id}>
              <TableCell>{challenge.no}</TableCell>
              <TableCell>{challenge.title}</TableCell>
              <TableCell>{challenge.creator}</TableCell>
              <TableCell>{challenge.maxScore}</TableCell>
              <TableCell>{challenge.verificationType}</TableCell>
              <TableCell>{challenge.numHints}</TableCell>
              <TableCell>
                {new Date(challenge.startTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(challenge.endTime).toLocaleString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedChallenge(challenge);
                        setIsAddModalOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedChallenge(challenge);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-100 bg-transparent border-none">
          <ChallengeEditor challenge={selectedChallenge} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this challenge?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              challenge.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChallenge}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
