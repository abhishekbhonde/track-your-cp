"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard", // Change to your main page
    });

    if (!result?.ok) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl  font-bold mb-4 text-center">Sign In</h2>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full bg-black text-white py-2 rounded-md mb-4"
        >
          Sign in with GitHub
        </button>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md mb-4"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Sign In
          </button>
          <div>
            <p className="text-black">Don't have an account? <Link className="text-blue" href="/api/auth/register">register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
