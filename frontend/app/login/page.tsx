"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) { setError("Invalid email or password."); return; }
    const data = await response.json(); localStorage.setItem("token", data.access_token); router.push("/trips");
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8"><h1 className="text-3xl font-bold text-slate-950">Welcome back</h1><p className="mt-2 text-slate-500">Login to KelanaAI</p><label className="mt-8 block text-sm font-medium text-slate-700">Email<input className="mt-2 w-full rounded-xl border p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="mt-4 block text-sm font-medium text-slate-700">Password<input className="mt-2 w-full rounded-xl border p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{error && <p className="mt-4 text-sm text-rose-700">{error}</p>}<button className="mt-6 w-full rounded-xl bg-slate-950 p-3 font-semibold text-white">Login</button><p className="mt-5 text-sm text-slate-600">Don&apos;t have an account? <Link className="font-semibold text-cyan-700" href="/register">Register</Link></p></form></main>;
}
