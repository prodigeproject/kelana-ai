"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) }); if (!response.ok) { setError("Registration failed."); return; } router.push("/login"); }
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8"><h1 className="text-3xl font-bold text-slate-950">Create your account</h1><label className="mt-8 block text-sm font-medium text-slate-700">Name<input className="mt-2 w-full rounded-xl border p-3" value={name} onChange={(e) => setName(e.target.value)} required /></label><label className="mt-4 block text-sm font-medium text-slate-700">Email<input className="mt-2 w-full rounded-xl border p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="mt-4 block text-sm font-medium text-slate-700">Password<input className="mt-2 w-full rounded-xl border p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required /></label>{error && <p className="mt-4 text-sm text-rose-700">{error}</p>}<button className="mt-6 w-full rounded-xl bg-slate-950 p-3 font-semibold text-white">Register</button><p className="mt-5 text-sm text-slate-600">Already registered? <Link className="font-semibold text-cyan-700" href="/login">Login</Link></p></form></main>;
}
