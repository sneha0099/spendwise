import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional()
});

export default function Login() {
  const navigate = useNavigate();
  const { token, login, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: true }
  });

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  return (
    <div className="page-shell min-h-screen items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border bg-background shadow-soft lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hidden bg-zinc-950 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">SpendWise</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Track every rupee with clarity, rhythm, and confidence.</h1>
          <p className="mt-4 max-w-md text-zinc-300">A polished expense tracker built for budgets, reports, and daily money decisions.</p>
        </div>
        <div className="p-6 sm:p-10">
          <h2 className="text-3xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(async (values) => {
            const success = await login(values);
            if (success) navigate("/dashboard");
          })}>
            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} {...register("password")} />
                <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p>
            </div>
            <Checkbox label="Remember me" {...register("rememberMe")} />
            <Button className="w-full" loading={loading} type="submit">
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account? <Link to="/register" className="font-medium text-sky-500">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
