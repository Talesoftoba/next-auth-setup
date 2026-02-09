
"use client";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";






import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  // Error coming from NextAuth redirect
  const errorParam = searchParams.get("error");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    // This runs only if redirect is false,
    // but we keep it here for safety
    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Log In</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border p-2 rounded"
        />

        {(error || errorParam) && (
          <p className="text-red-500 text-sm text-center">
            {error || "Invalid email or password"}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white p-2 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}