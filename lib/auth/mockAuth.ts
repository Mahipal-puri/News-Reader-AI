import type { User } from "@/types";

const wait = (ms = 250) => new Promise<void>((r) => setTimeout(r, ms));

const fakeUser = (email: string, name?: string): User => ({
  id: "u_" + email.replace(/[^a-z0-9]/gi, "_").toLowerCase(),
  name: name || email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  email,
  avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(email)}/120/120`,
  role: "user",
  createdAt: new Date().toISOString()
});

export const mockAuth = {
  async signIn(email: string, _password: string): Promise<User> {
    await wait();
    if (!email.includes("@")) throw new Error("Enter a valid email");
    return fakeUser(email);
  },
  async signUp(name: string, email: string, _password: string): Promise<User> {
    await wait();
    if (!email.includes("@")) throw new Error("Enter a valid email");
    if (name.trim().length < 2) throw new Error("Name is too short");
    return fakeUser(email, name);
  },
  async signInWithGoogle(): Promise<User> {
    await wait();
    return fakeUser("you@gmail.com", "Google User");
  },
  async signInWithOtp(phoneOrEmail: string, _code: string): Promise<User> {
    await wait();
    const email = phoneOrEmail.includes("@")
      ? phoneOrEmail
      : `${phoneOrEmail.replace(/\D/g, "")}@otp.local`;
    return fakeUser(email);
  }
};
