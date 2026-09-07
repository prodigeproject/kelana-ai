import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white"><p className="text-sm uppercase tracking-widest text-cyan-300">404</p><h1 className="mt-3 text-4xl font-bold">Page not found</h1><Link className="mt-6 rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950" href="/">Back to KelanaAI</Link></main>;
}
