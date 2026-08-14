import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function ProfileTab() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [userName, setUserName] = useState(user?.userName || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleUpdateProfile(e) {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("User name cannot be empty!");
      return;
    }

    setLoading(true);
    dispatch(
      updateUserProfile({
        userId: user?.id,
        formData: {
          userName,
          oldPassword,
          newPassword,
        },
      })
    ).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message || "Profile updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(data?.payload?.message || "Failed to update profile!");
      }
    });
  }

  return (
    <div className="max-w-md py-4 space-y-6">
      <h2 className="text-xl font-bold">Profile Settings</h2>
      
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted cursor-not-allowed" />
          <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">User Name</Label>
          <Input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <hr className="my-4" />
        <h3 className="font-semibold text-md">Change Password</h3>

        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

export default ProfileTab;
