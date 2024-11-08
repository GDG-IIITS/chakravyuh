'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle } from "lucide-react"

// This would typically come from an API call
const users = [
  { id: 1, uname: "johndoe", email: "john@example.com", fullName: "John Doe", teamName: "Sales", emailVerified: true, isActive: true },
  { id: 2, uname: "janedoe", email: "jane@example.com", fullName: "Jane Doe", teamName: "Marketing", emailVerified: false, isActive: true },
  { id: 3, uname: "bobsmith", email: "bob@example.com", fullName: "Bob Smith", teamName: "IT", emailVerified: true, isActive: true },
  { id: 4, uname: "alicew", email: "alice@example.com", fullName: "Alice Williams", teamName: "HR", emailVerified: false, isActive: false },
  { id: 5, uname: "mikebrown", email: "mike@example.com", fullName: "Mike Brown", teamName: null, emailVerified: true, isActive: true },
]

export function UsersTable() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Users Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead className="text-center">Email Verified</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.uname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.teamName || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      {user.emailVerified ? (
                        <CheckCircle2 className="inline h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="inline h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.isActive ? (
                        <CheckCircle2 className="inline h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="inline h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}