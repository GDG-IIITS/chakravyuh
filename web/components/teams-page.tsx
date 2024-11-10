"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ArrowUpDown,
  Download,
  Edit,
  MoreVertical,
  Search,
} from "lucide-react";
import TeamEditor from "./teams-editor";
import axios from "axios";

// Mock data for demonstration
// const mockTeams = [
//   {
//     name: "Team A",
//     ug: "UG1",
//     member1: "John",
//     member2: "Jane",
//     lead: "John",
//     score: 100,
//   },
//   {
//     name: "Team B",
//     ug: "UG2",
//     member1: "Alice",
//     member2: "Bob",
//     lead: "Alice",
//     score: 90,
//   },
//   {
//     name: "Team C",
//     ug: "UG1",
//     member1: "Charlie",
//     member2: "David",
//     lead: "Charlie",
//     score: 110,
//   },
//   {
//     name: "Team D",
//     ug: "UG3",
//     member1: "Eve",
//     member2: "Frank",
//     lead: "Eve",
//     score: 95,
//   },
//   {
//     name: "Team E",
//     ug: "UG2",
//     member1: "Grace",
//     member2: "Henry",
//     lead: "Grace",
//     score: 105,
//   },
// ];

export default function TeamsPageComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUG, setSelectedUG] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [teams, setTeams] = useState<any[]>([]);
  const [isSubmissioniModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/teams`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        setTeams(response.data); // Assuming the response data is an array of users
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, [setIsSubmissionModalOpen]);

  const filteredAndSortedTeams = teams
    .filter(
      (team) =>
        (team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.member1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.member2.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.lead.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedUG === "" || team.ug === selectedUG)
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );

  const handleDownload = () => {
    const teamIDs = teams.map((team) => team.name).join("\n");
    const blob = new Blob([teamIDs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_ids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow md:flex-grow-0 md:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by team or member name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedUG} onValueChange={setSelectedUG}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by UG" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="--">All UGs</SelectItem>
            <SelectItem value="UG1">UG1</SelectItem>
            <SelectItem value="UG2">UG2</SelectItem>
            <SelectItem value="UG3">UG3</SelectItem>
            <SelectItem value="UG4">UG4</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-grow"></div>
        <Button
          variant="default"
          className="bg-black text-white"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download TeamIDs
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>UG</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Team ID</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Current Score
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTeams.map((team) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.ug}</TableCell>
                <TableCell>{team.lead.fullName}</TableCell>
                <TableCell>{team._id}</TableCell>
                <TableCell>{team.score}</TableCell>
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
                          setSelectedTeam(team);
                          setIsSubmissionModalOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Make Submission
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={isSubmissioniModalOpen}
          onOpenChange={setIsSubmissionModalOpen}
        >
          <DialogContent className="bg-gray-100 bg-transparent border-none">
            <TeamEditor
              team={selectedTeam}
              setIsSubmissionModalOpen={setIsSubmissionModalOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
