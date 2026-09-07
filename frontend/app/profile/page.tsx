"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = { name: string; email: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tripCount, setTripCount] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/auth/me`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/trips`, { headers }),
    ]).then(async ([profileResponse, tripsResponse]) => {
      if (!profileResponse.ok || !tripsResponse.ok) throw new Error("Unable to load profile.");
      setProfile(await profileResponse.json());
      setTripCount((await tripsResponse.json()).length);
    }).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load profile."));
  }, []);
  return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950"><div className="mx-auto max-w-2xl"><Link className="font-semibold text-cyan-700" href="/trips">← Back to Trips</Link><h1 className="mt-8 text-4xl font-bold">Profile</h1>{error && <p className="mt-6 text-rose-700">{error}</p>}{profile && <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm text-slate-500">Name</p><p className="text-xl font-semibold">{profile.name}</p><p className="mt-6 text-sm text-slate-500">Email</p><p className="text-xl font-semibold">{profile.email}</p><p className="mt-6 text-sm text-slate-500">Total Trips Generated</p><p className="text-3xl font-bold text-cyan-700">{tripCount}</p></div>}</div></main>;
}
