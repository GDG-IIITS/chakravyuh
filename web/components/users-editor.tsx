import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserEditorProps {
  user: any; // User data
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to control modal visibility
}

const UserEditor: React.FC<UserEditorProps> = ({
  user,
  setIsEditModalOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editRoleValue, setEditRoleValue] = useState(user.role);
  const router = useRouter();

  console.log(user.role, user._id);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const updateData = {
      role: editRoleValue,
    };

    console.log(updateData);
    setIsLoading(true);
    // Update user role
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
        updateData,
        { withCredentials: true }
      );

      console.log(response);
      console.log("control reaches here ");
      setIsLoading(false);
      setIsEditModalOpen(false);
      router.push("/admin/users");
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py">
      <CardHeader>
        <CardTitle>Edit Role</CardTitle>
        <CardDescription>
          Edit the user roles among user/admin/superuser
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="min-h-[150px]">
            <div className="mb-2">
              <Label className="ml-1" htmlFor="role">
                Role
              </Label>
              <Select value={editRoleValue} onValueChange={setEditRoleValue}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superuser">Superuser</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" className="ml-auto" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserEditor;
