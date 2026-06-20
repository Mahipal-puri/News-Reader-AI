"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockAuth } from "@/lib/auth/mockAuth";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { useToast } from "@/components/ui/Toast";
import { GoogleButton } from "./GoogleButton";
import { OTPModal } from "./OTPModal";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user =
        mode === "login"
          ? await mockAuth.signIn(email, password)
          : await mockAuth.signUp(name, email, password);
      dispatch(setUser(user));
      toast(`Welcome${user.name ? `, ${user.name}` : ""}`, "success");
      router.push("/home");
    } catch (err: any) {
      toast(err?.message || "Sign-in failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "login"
            ? "Sign in to your personalized news feed."
            : "Personalize your feed in seconds."}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <label className="block">
            <span className="text-xs text-neutral-500">Name</span>
            <div className="relative mt-1">
              <UserIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="pl-9"
                required
              />
            </div>
          </label>
        )}
        <label className="block">
          <span className="text-xs text-neutral-500">Email</span>
          <div className="relative mt-1">
            <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-9"
              required
            />
          </div>
        </label>
        <label className="block">
          <span className="text-xs text-neutral-500">Password</span>
          <div className="relative mt-1">
            <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-9"
              required
              minLength={4}
            />
          </div>
        </label>
        {mode === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => toast("Password recovery is a demo stub", "info")}
              className="text-xs text-brand-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        OR
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="space-y-2">
        <GoogleButton
          onSuccess={(u) => {
            dispatch(setUser(u));
            router.push("/home");
          }}
        />
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => setOtpOpen(true)}
        >
          Continue with OTP
        </Button>
      </div>

      <p className="text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-600 hover:underline">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already a member?{" "}
            <Link href="/login" className="text-brand-600 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>

      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onSuccess={(u) => {
          dispatch(setUser(u));
          setOtpOpen(false);
          router.push("/home");
        }}
      />
    </div>
  );
}
