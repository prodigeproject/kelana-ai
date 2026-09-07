import Link from "next/link";
import { getTrip } from "@/services/tripService";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getTrip(Number(id));
  return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950 sm:px-10"><div className="mx-auto max-w-4xl"><Link className="font-semibold text-cyan-700" href="/trips">← Back to Trips</Link><div className="mt-8 rounded-3xl bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">Destination</p><h1 className="mt-2 text-4xl font-bold">{trip.destination}</h1><div className="mt-6 grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-slate-500">Budget</p><p className="font-semibold">USD {trip.budget.toLocaleString("en-US")}</p></div><div><p className="text-sm text-slate-500">Category</p><p className="font-semibold">{trip.category}</p></div><div><p className="text-sm text-slate-500">Days</p><p className="font-semibold">{trip.days} days</p></div></div><section className="mt-8 border-t border-slate-200 pt-8"><h2 className="text-2xl font-bold">AI Recommendation</h2><p className="mt-4 whitespace-pre-line leading-8 text-slate-700">{trip.ai_recommendation ?? "No recommendation saved for this trip."}</p></section></div></div></main>;
}
