"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { PandaLogo } from "@/components/brand/panda-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AuthDecorations } from "./auth-decorations";
import { cn } from "@/lib/utils";
import { saveAuthSession } from "@/lib/auth-session";
import { loadProfile, saveProfile } from "@/lib/profile-storage";
import { initializeNewUserData } from "@/lib/user-data-storage";
import { authService } from "@/services/auth.service";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  return score;
}

function strengthLabel(score: number) {
  if (score === 0) return "";
  if (score <= 25) return "Weak";
  if (score <= 50) return "Fair";
  if (score <= 75) return "Good";
  return "Strong";
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid =
    name.trim() &&
    email.includes("@") &&
    strength >= 50 &&
    passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    saveAuthSession({ email: trimmedEmail, name: trimmedName });

    // New account starts with empty tasks and planner
    initializeNewUserData(trimmedEmail);

    saveProfile({
      name: trimmedName,
      email: trimmedEmail,
      about: "",
      profileImage: "",
    });

    try {
      const response = authService.signup({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      console.log("Registration successful:", response);
      router.push("/register");
    } catch (error) {
      console.error("Registration failed:", error);
    } 
    router.push("/home");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 gradient-soft py-12">
      <AuthDecorations />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-xl green-glow border border-emerald-100/60">
          <div className="flex flex-col items-center text-center mb-8">
            <PandaLogo size="lg" className="mb-4" />
            <h1 className="text-3xl font-bold text-emerald-900">Create Account</h1>
            <p className="text-sm text-emerald-600/80 mt-1">
              Join AkAi and boost your productivity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60" />
                <Input
                  id="name"
                  placeholder="John Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                  className={cn(
                    "pl-10 h-11 rounded-xl border-emerald-100 bg-white/80",
                    touched.name && !name.trim() && "border-red-300"
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="user@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={cn(
                    "pl-10 h-11 rounded-xl border-emerald-100 bg-white/80",
                    touched.email && !email.includes("@") && "border-red-300"
                  )}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-emerald-100 bg-white/80"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/60"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <Progress value={strength} className="h-1.5" />
                    <p
                      className={cn(
                        "text-xs",
                        strength <= 25 && "text-red-500",
                        strength > 25 && strength <= 50 && "text-amber-600",
                        strength > 50 && strength <= 75 && "text-emerald-600",
                        strength > 75 && "text-emerald-700 font-medium"
                      )}
                    >
                      {strengthLabel(strength)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60" />
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  className={cn(
                    "pl-10 pr-10 h-11 rounded-xl border-emerald-100 bg-white/80",
                    touched.confirm &&
                      confirmPassword &&
                      !passwordsMatch &&
                      "border-red-300"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600/60"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {touched.confirm && confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="w-full h-12 rounded-xl text-base font-semibold gradient-green border-0 shadow-lg shadow-emerald-200/50 hover:opacity-95 disabled:opacity-50 mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-emerald-700/70 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
