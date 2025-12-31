"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h1>Login</h1>

      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />

      <label style={{ marginTop: 12, display: "block" }}>Password</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        style={{ width: "100%" }}
      />

      <button
        style={{ marginTop: 16, width: "100%" }}
        onClick={() => signIn("credentials", { email, password, callbackUrl: "/app" })}
      >
        Sign in
      </button>

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        Try: admin@test.com / support@test.com / user@test.com<br />
        Password: Password123!
      </p>
    </div>
  );
}
