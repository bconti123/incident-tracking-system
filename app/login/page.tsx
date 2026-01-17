"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { FormField } from "@/components/ui/FormField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/app",
        redirect: false, // lets us show an error instead of instantly navigating
      });

      if (!res) {
        setError("Login failed. Please try again.");
        return;
      }

      if (res.error) {
        setError("Invalid email or password.");
        return;
      }

      // If redirect:false, NextAuth gives us a URL to navigate to
      if (res.url) window.location.href = res.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabled = !email || !password || isSubmitting;

  return (
    <div className="max-w-sm mx-auto pt-20">
      <Form
        title="Login"
        error={error}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <FormField
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=""
        />

        <Button
          type="submit"
          style={{ width: "100%" }}
          variant="primary"
          size="md"
          disabled={disabled}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-xs opacity-80">
          Try: admin@test.com / support@test.com / user@test.com
          <br />
          Password: Password123!
        </p>
      </Form>
    </div>
  );
}
