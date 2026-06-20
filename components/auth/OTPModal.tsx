"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockAuth } from "@/lib/auth/mockAuth";
import { useToast } from "@/components/ui/Toast";
import type { User } from "@/types";

export function OTPModal({
  open,
  onClose,
  onSuccess
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (u: User) => void;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState<"id" | "code">("id");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = () => {
    if (!contact.trim()) {
      toast("Enter your email or phone", "error");
      return;
    }
    toast("Demo OTP: 123456", "info");
    setStep("code");
  };

  const verify = async () => {
    setBusy(true);
    try {
      const u = await mockAuth.signInWithOtp(contact, code);
      onSuccess(u);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Sign in with OTP">
      {step === "id" ? (
        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            Enter your email or phone. We'll send you a one-time code.
          </p>
          <Input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@example.com or +1 555 0123"
          />
          <Button className="w-full" onClick={sendCode}>
            Send code
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-neutral-500">
            We sent a code to <b>{contact}</b>. (Demo code: 123456)
          </p>
          <Input
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep("id")}
            >
              Back
            </Button>
            <Button className="flex-1" onClick={verify} disabled={busy}>
              Verify
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
