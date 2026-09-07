import { Trip } from "@/types/trip";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

export function getTrips() {
  return request<Trip[]>("/trips", { cache: "no-store" });
}

export function getTrip(id: number) {
  return request<Trip>(`/trips/${id}`, { cache: "no-store" });
}
