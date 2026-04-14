import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { changePassword, deleteAccount, updateProfile } from "@/api/authApi";
import Avatar from "@/components/ui/Avatar";
import AlertDialog from "@/components/ui/AlertDialog";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Select from "@/components/ui/Select";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  currency: z.string().min(3, "Currency is required"),
  avatar: z.string().optional()
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm your new password")
}).refine((values) => values.newPassword === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});

export default function Profile() {
  const { user, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useUiStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || "", currency: user?.currency || "INR", avatar: user?.avatar || "" }
  });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  return (
    <div className="page-shell">
      <div><h1 className="text-3xl font-semibold">Profile</h1><p className="text-sm text-muted-foreground">Manage personal details, password, theme, and account actions.</p></div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel p-6">
          <div className="mb-6 flex items-center gap-4">
            <Avatar src={user?.avatar} fallback={user?.name || "SW"} className="h-16 w-16" />
            <div><h2 className="text-xl font-semibold">{user?.name}</h2><p className="text-sm text-muted-foreground">{user?.email}</p></div>
          </div>
          <form className="space-y-4" onSubmit={profileForm.handleSubmit(async (values) => {
            try {
              const response = await updateProfile(values);
              setUser(response.data.data);
              toast.success("Profile updated");
            } catch (error) {
              toast.error(error.response?.data?.message || "Could not update profile");
            }
          })}>
            <div><Label>Name</Label><Input {...profileForm.register("name")} /></div>
            <div><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
            <div><Label>Avatar URL / Base64</Label><Input {...profileForm.register("avatar")} /></div>
            <div>
              <Label>Currency</Label>
              <Select {...profileForm.register("currency")}>
                <option value="INR">INR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="AED">AED</option>
              </Select>
            </div>
            <Button type="submit" loading={profileForm.formState.isSubmitting}>Save Changes</Button>
          </form>
        </section>

        <div className="space-y-6">
          <section className="glass-panel p-6">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <form className="mt-4 space-y-4" onSubmit={passwordForm.handleSubmit(async (values) => {
              try {
                await changePassword(values);
                toast.success("Password updated");
                passwordForm.reset();
              } catch (error) {
                toast.error(error.response?.data?.message || "Could not change password");
              }
            })}>
              <div><Label>Current Password</Label><Input type="password" {...passwordForm.register("currentPassword")} /></div>
              <div><Label>New Password</Label><Input type="password" {...passwordForm.register("newPassword")} /></div>
              <div><Label>Confirm New Password</Label><Input type="password" {...passwordForm.register("confirmPassword")} /></div>
              <Button type="submit" loading={passwordForm.formState.isSubmitting}>Update Password</Button>
            </form>
          </section>

          <section className="glass-panel p-6">
            <h2 className="text-xl font-semibold">App Settings</h2>
            <div className="mt-4 flex gap-2">
              {["light", "dark", "system"].map((option) => (
                <Button key={option} variant={theme === option ? "default" : "outline"} onClick={() => setTheme(option)}>
                  {option}
                </Button>
              ))}
            </div>
          </section>

          <section className="glass-panel border-red-500/30 p-6">
            <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
            <p className="mt-2 text-sm text-muted-foreground">Deleting your account removes all transactions, budgets, and custom categories.</p>
            <Button variant="destructive" className="mt-4" onClick={() => setConfirmDelete(true)}>Delete Account</Button>
          </section>
        </div>
      </div>

      <AlertDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete account?"
        description="This permanently deletes your profile and financial data."
        onConfirm={async () => {
          await deleteAccount();
          logout();
          setConfirmDelete(false);
        }}
      />
    </div>
  );
}
