"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function AssistantPage() {
  const [question, setQuestion] = useState(""); const [answer, setAnswer] = useState(""); const [sources, setSources] = useState<string[]>([]); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); const token = localStorage.getItem("token"); const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/assistant`, { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ question }) }); const data = await response.json(); setAnswer(data.answer ?? "Unable to answer the question."); setSources(data.sources ?? []); setLoading(false); }
  return <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950"><div className="mx-auto max-w-3xl"><Link className="font-semibold text-cyan-700" href="/">← KelanaAI</Link><h1 className="mt-8 text-4xl font-bold">Travel Assistant</h1><p className="mt-2 text-slate-600">Ask questions answered from your trusted travel documents.</p><form onSubmit={submit} className="mt-8 flex gap-3"><input className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Can I bring medication into Japan?" value={question} onChange={(e) => setQuestion(e.target.value)} required /><button className="rounded-xl bg-slate-950 px-5 font-semibold text-white">{loading ? "Asking..." : "Ask"}</button></form>{answer && <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">AI Answer</h2><p className="mt-4 whitespace-pre-line leading-7 text-slate-700">{answer}</p>{sources.length > 0 && <div className="mt-5 border-t pt-4 text-sm text-slate-500">Source: {sources.join(", ")}</div>}</section>}</div></main>;
}
