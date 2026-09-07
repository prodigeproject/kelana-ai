"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Trip = {
  id: number;
  destination: string;
  days: number;
  budget: number;
  category: string;
  daily_budget: number;
  ai_recommendation?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function splitItinerary(recommendation: string) {
  return recommendation
    .split(/(?=(?:Day\s+\d+\s*:|Travel Tips\s*:|Local Food Recommendations\s*:|Estimated Budget Breakdown\s*:))/i)
    .map((section) => section.trim())
    .filter(Boolean);
}

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("Japan");
  const [budget, setBudget] = useState("2000");
  const [days, setDays] = useState("5");
  const [travelStyle, setTravelStyle] = useState("Family");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itinerarySections = useMemo(
    () => (trip?.ai_recommendation ? splitItinerary(trip.ai_recommendation) : []),
    [trip],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setTrip(null);

    try {
      const response = await fetch(`${API_URL}/api/v1/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
        },
        body: JSON.stringify({
          destination,
          budget: Number(budget),
          days: Number(days),
          travel_style: travelStyle,
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (!response.ok) throw new Error("Unable to create the trip.");

      const createdTrip: Trip = await response.json();
      const recommendationResponse = await fetch(
        `${API_URL}/api/v1/trips/${createdTrip.id}/generate`,
        { method: "POST", headers: { ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}) } },
      );

      if (!recommendationResponse.ok) {
        throw new Error("Unable to generate the itinerary.");
      }

      const recommendation = await recommendationResponse.json();
      setTrip({ ...createdTrip, ai_recommendation: recommendation.ai_recommendation });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate the itinerary. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 bg-slate-950 text-slate-100">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2200&q=85)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/30 via-slate-950/80 to-slate-950" />

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between">
            <span className="text-lg font-semibold tracking-wide text-white">KelanaAI</span>
            <span className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-slate-200">
              AI travel planner
            </span>
          </header>

          <div className="mx-auto max-w-3xl py-20 text-center sm:py-28">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Plan your next adventure
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Travel plans made for you.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Tell KelanaAI where you want to go, and get a practical itinerary tailored to your time and budget.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto grid max-w-5xl gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-5 lg:p-6"
          >
            <label className="text-sm font-medium text-slate-200 lg:col-span-2">
              Destination
              <input className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300" name="destination" value={destination} onChange={(event) => setDestination(event.target.value)} required />
            </label>
            <label className="text-sm font-medium text-slate-200">
              Budget (USD)
              <input className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300" name="budget" type="number" min="1" value={budget} onChange={(event) => setBudget(event.target.value)} required />
            </label>
            <label className="text-sm font-medium text-slate-200">
              Days
              <input className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300" name="days" type="number" min="1" value={days} onChange={(event) => setDays(event.target.value)} required />
            </label>
            <label className="text-sm font-medium text-slate-200">
              Travel style
              <select className="mt-2 w-full rounded-xl border border-white/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-300" name="travel_style" value={travelStyle} onChange={(event) => setTravelStyle(event.target.value)}>
                <option>Family</option>
                <option>Solo</option>
                <option>Couple</option>
                <option>Backpacker</option>
              </select>
            </label>
            <button className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-5" type="submit" disabled={loading}>
              {loading ? "Generating itinerary..." : "Generate AI Trip"}
            </button>
          </form>

          {error && (
            <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between gap-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
              <span>{error}</span>
              <button className="font-semibold underline" onClick={() => setError("")} type="button">Dismiss</button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-12">
        {loading && (
          <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-300/20 bg-slate-900 p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-300" />
            <p className="font-medium text-white">Amazon Bedrock is thinking...</p>
            <p className="mt-2 text-sm text-slate-400">Your itinerary will appear here shortly.</p>
          </div>
        )}

        {trip && !loading && (
          <article className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">AI recommendation</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{trip.destination}</h2>
              </div>
              <p className="text-sm text-slate-400">{trip.days} days · USD {trip.budget.toLocaleString("en-US")} · {trip.category}</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(itinerarySections.length ? itinerarySections : [trip.ai_recommendation ?? ""]).map((section, index) => (
                <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-5" key={`${section}-${index}`}>
                  <h3 className="text-lg font-semibold text-white">{section.split("\n")[0]}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{section.split("\n").slice(1).join("\n") || section}</p>
                </section>
              ))}
            </div>
          </article>
        )}
      </section>

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© 2026 KelanaAI. All rights reserved.</span>
          <nav className="flex gap-5" aria-label="Footer navigation">
            <a className="transition hover:text-white" href="#">Home</a>
            <a className="transition hover:text-white" href="#">About</a>
            <a className="transition hover:text-white" href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
