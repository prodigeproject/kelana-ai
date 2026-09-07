"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TripCard } from "@/components/TripCard";
import { getTrips } from "@/services/tripService";
import { Trip } from "@/types/trip";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrips().then(setTrips).catch(() => setError("Unable to load trip history.")).finally(() => setLoading(false));
  }, []);

  const visibleTrips = useMemo(() => {
    const filtered = trips.filter((trip) => `${trip.destination} ${trip.travel_style ?? ""}`.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sort === "oldest") return a.id - b.id;
      if (sort === "budget") return b.budget - a.budget;
      return b.id - a.id;
    });
  }, [trips, search, sort]);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(visibleTrips.length / pageSize));
  const paginatedTrips = visibleTrips.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><Link className="text-sm font-semibold text-cyan-700" href="/">← KelanaAI</Link><h1 className="mt-3 text-4xl font-bold">Trip History</h1><p className="mt-2 text-slate-600">Your saved itineraries.</p></div>
          <Link className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white" href="/">Generate a Trip</Link>
        </header>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <input className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-cyan-600" placeholder="Search trips..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <select className="rounded-xl border border-slate-300 bg-white px-4 py-3" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="latest">Latest</option><option value="oldest">Oldest</option><option value="budget">Highest Budget</option></select>
        </div>
        {loading && <p className="py-16 text-center text-slate-500">Loading trip history...</p>}
        {error && <p className="py-16 text-center text-rose-700">{error}</p>}
        {!loading && !error && visibleTrips.length === 0 && <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-bold">No trips found.</h2><p className="mt-2 text-slate-500">Create your first itinerary.</p></div>}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{paginatedTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
        {pageCount > 1 && <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Trip pagination"><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span className="text-sm text-slate-600">Page {page} of {pageCount}</span><button className="rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></nav>}
      </div>
    </main>
  );
}
