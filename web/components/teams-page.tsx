"use client";

import { useState } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowUpDown, Search } from "lucide-react";

// Mock data for demonstration
const mockTeams = [
  { name: "Team A", ug: "UG1", member1: "John", member2: "Jane", score: 100 },
  { name: "Team B", ug: "UG2", member1: "Alice", member2: "Bob", score: 90 },
  {
    name: "Team C",
    ug: "UG1",
    member1: "Charlie",
    member2: "David",
    score: 110,
  },
  { name: "Team D", ug: "UG3", member1: "Eve", member2: "Frank", score: 95 },
  { name: "Team E", ug: "UG2", member1: "Grace", member2: "Henry", score: 105 },
];

export function TeamsPageComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUG, setSelectedUG] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredAndSortedTeams = mockTeams
    .filter(
      (team) =>
        (team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.member1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.member2.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedUG === "" || team.ug === selectedUG)
    )
    .sort((a, b) =>
      sortOrder === "asc" ? a.score - b.score : b.score - a.score
    );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Teams</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
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
        <Button
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort by Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>UG</TableHead>
              <TableHead>Member 1</TableHead>
              <TableHead>Member 2</TableHead>
              <TableHead>Current Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTeams.map((team) => (
              <TableRow key={team.name}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.ug}</TableCell>
                <TableCell>{team.member1}</TableCell>
                <TableCell>{team.member2}</TableCell>
                <TableCell>{team.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
