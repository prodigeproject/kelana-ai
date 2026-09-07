import Link from "next/link";
import { Trip } from "@/types/trip";

const destinationIcons: Record<string, string> = {
  Japan: "🗾",
  Korea: "🇰🇷",
  Indonesia: "🇮🇩",
  Bali: "🌴",
  Paris: "🇫🇷",
};

const categoryClasses: Record<string, string> = {
  Backpacker: "bg-emerald-100 text-emerald-800",
  Standard: "bg-blue-100 text-blue-800",
  Luxury: "bg-amber-100 text-amber-800",
};

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{destinationIcons[trip.destination] ?? "✈️"}</span>
          <div>
            <h2 className="text-xl font-bold text-slate-950">{trip.destination}</h2>
            <p className="text-sm text-slate-500">{trip.days} days</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryClasses[trip.category] ?? "bg-slate-100 text-slate-700"}`}>
          {trip.category}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">USD {trip.budget.toLocaleString("en-US")}</span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-800">{trip.travel_style ?? "Travel plan"}</span>
      </div>
      <Link className="mt-6 inline-flex font-semibold text-cyan-700 hover:text-cyan-900" href={`/trips/${trip.id}`}>
        View Details →
      </Link>
    </article>
  );
}
