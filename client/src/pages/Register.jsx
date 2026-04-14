import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerUser } from "@/api/authApi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

const schema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm the password")
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  return (
    <div className="page-shell min-h-screen items-center justify-center">
      <div className="w-full max-w-xl rounded-[2rem] border bg-background p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">SpendWise</p>
        <h1 className="mt-4 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start tracking expenses, budgets, and reports in one place.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(async (values) => {
          try {
            await registerUser(values);
            toast.success("Registration successful. Please log in.");
            navigate("/login");
          } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
          }
        })}>
          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
            <p className="mt-1 text-xs text-red-500">{errors.name?.message}</p>
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password")} />
            <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" {...register("confirmPassword")} />
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword?.message}</p>
          </div>
          <Button className="w-full" loading={isSubmitting} type="submit">
            Create Account
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already registered? <Link to="/login" className="font-medium text-sky-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
