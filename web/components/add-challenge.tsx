"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function AddChallenge() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Here you would typically send the form data to your API
    // For this example, we'll just simulate an API call with a timeout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    toast({
      title: "Challenge Created",
      description: "Your new challenge has been successfully added.",
    });
  };

  return (
    <>
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Challenge</CardTitle>
            <CardDescription>
              Create a new digital treasure hunt challenge
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  placeholder="Enter challenge title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" placeholder="Enter API key" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter challenge description"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="datetime-local" required />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Challenge"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
