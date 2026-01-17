"use client";

import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <label className="block mb-2">Email</label>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
      />

      <label className="block mb-2 mt-3">Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-6"
      />

      <Button
        style={{ width: "100%" }}
        onClick={() => signIn("credentials", { email, password, callbackUrl: "/app" })}
        variant="primary"
        size="md"
        disabled={!email || !password}
      >
        Sign in
      </Button>

      <p className="mt-4 text-xs opacity-80">
        Try: admin@test.com / support@test.com / user@test.com<br />
        Password: Password123!
      </p>
    </div>
  );
}
