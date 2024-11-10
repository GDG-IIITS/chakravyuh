"use client";
import { useChallengesContext } from "@/context/challengesContext";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import ChallengeEditor from "./challenge-editor";

export function ChallengesPage() {
  const {
    challenges,
    searchTerm,
    isAddModalOpen,
    isDeleteModalOpen,
    selectedChallenge,
    setSelectedChallenge,
    setSearchTerm,
    openAddModal,
    closeAddModal,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteChallenge,
  } = useChallengesContext();

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function mapToChallengeType(challenge) {
    return {
      id: challenge._id,
      title: challenge.title,
      description: challenge.description || "",
      no: challenge.no,
      tags: challenge.tags,
      summary: challenge.summary || "",
      creator: challenge.creator,
      maxScore: challenge.maxScore || 0,
      submissionVerificationMode: challenge.submissionVerification.kind,
      flag: challenge.submissionVerification.flag || "",
      csv: challenge.csv || "",
      numHints: challenge.hints ? challenge.hints.length : 0,
      startTime: challenge.startTime,
      endTime: challenge.endTime,
    };
  }

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
        <Button
          onClick={() => {
            setSelectedChallenge(null); // Reset selectedChallenge for new challenge creation
            openAddModal();
          }}
        >
          <Plus /> Add Challenge
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Verification Type</TableHead>
            <TableHead>Hints</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredChallenges.map((challenge) => (
            <TableRow key={challenge._id}>
              <TableCell>{challenge.no}</TableCell>
              <TableCell>{challenge.title}</TableCell>
              <TableCell>{challenge.creator}</TableCell>
              <TableCell>{challenge.tags.join(", ") || "N/A"}</TableCell>
              <TableCell>{challenge.submissionVerification.kind}</TableCell>
              <TableCell>{challenge.hints.length}</TableCell>
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
                        setSelectedChallenge(mapToChallengeType(challenge));
                        openAddModal();
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal(challenge)}
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

      <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
        <DialogContent className="bg-gray-100 bg-transparent border-none">
          <ChallengeEditor />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this challenge?
            </AlertDialogTitle>
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
