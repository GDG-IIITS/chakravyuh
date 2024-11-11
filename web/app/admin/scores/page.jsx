"use client";

import { useState } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle2, XCircle } from "lucide-react";

export default function Page() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChallenge, setSelectedChallenge] = useState("");

    // Dummy data for submissions
    const [submissions, setSubmissions] = useState([
        {
            teamName: "Alpha Team",
            challengeName: "Challenge 1",
            createdAt: "2024-11-05T12:34:56Z",
            score: 1,
        },
        {
            teamName: "Beta Squad",
            challengeName: "Challenge 2",
            createdAt: "2024-11-06T14:20:00Z",
            score: 0,
        },
        {
            teamName: "Gamma Group",
            challengeName: "Challenge 3",
            createdAt: "2024-11-07T16:15:30Z",
            score: 1,
        },
    ]);

    const filteredSubmissions = submissions.filter((submission) => {
        return (
            (submission.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                submission.challengeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedChallenge === "" || submission.challengeName === selectedChallenge)
        );
    });

    return (
        <div className="container mx-auto py-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow md:flex-grow-0 md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by team or challenge name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Challenges" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="--">All Challenges</SelectItem>
                        <SelectItem value="Challenge 1">Challenge 1</SelectItem>
                        <SelectItem value="Challenge 2">Challenge 2</SelectItem>
                        <SelectItem value="Challenge 3">Challenge 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Team Name</TableHead>
                            <TableHead>Challenge Name</TableHead>
                            <TableHead>Submission Date</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubmissions.map((submission, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{submission.teamName}</TableCell>
                                <TableCell>{submission.challengeName}</TableCell>
                                <TableCell>
                                    {new Date(submission.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </TableCell>
                                <TableCell>
                                    {submission.score === 1 ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
