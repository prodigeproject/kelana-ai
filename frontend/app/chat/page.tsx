"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Conversation = { id: number; title: string; created_at: string };
type Message = { id?: number; role: "user" | "assistant"; content: string; created_at: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function headers() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadConversations() {
    const response = await fetch(`${API_URL}/api/v1/conversations`, { headers: headers(), cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load conversations.");
    const data: Conversation[] = await response.json();
    setConversations(data);
    return data;
  }

  async function loadMessages(id: number) {
    const response = await fetch(`${API_URL}/api/v1/conversations/${id}/messages`, { headers: headers(), cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load messages.");
    setConversationId(id);
    setMessages(await response.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations()
      .then(async (items) => {
        if (items[0]) await loadMessages(items[0].id);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load chat."))
      .finally(() => setInitializing(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function createConversation() {
    const response = await fetch(`${API_URL}/api/v1/conversations`, { method: "POST", headers: headers() });
    if (!response.ok) throw new Error("Unable to create conversation.");
    const created: Conversation = await response.json();
    setConversations((items) => [created, ...items]);
    setConversationId(created.id);
    setMessages([]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content) return;
    let activeId = conversationId;
    setError("");
    if (!activeId) {
      try {
        const response = await fetch(`${API_URL}/api/v1/conversations`, { method: "POST", headers: headers() });
        if (!response.ok) throw new Error("Unable to create conversation.");
        const created: Conversation = await response.json();
        activeId = created.id;
        setConversationId(activeId);
        setConversations((items) => [created, ...items]);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to create conversation.");
        return;
      }
    }
    setText("");
    setMessages((items) => [...items, { role: "user", content, created_at: new Date().toISOString() }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/conversations/${activeId}/messages`, { method: "POST", headers: headers(), body: JSON.stringify({ content }) });
      if (!response.ok) throw new Error("Unable to send message.");
      const answer: Message = await response.json();
      setMessages((items) => [...items, answer]);
      await loadConversations();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send message.");
    } finally {
      setLoading(false);
    }
  }

  const activeConversation = conversations.find((item) => item.id === conversationId);

  return (
    <main className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900 p-5 md:block">
        <div className="flex items-center justify-between gap-3"><h2 className="font-bold">Conversations</h2><button className="rounded-lg bg-cyan-300 px-3 py-1 text-sm font-bold text-slate-950" onClick={() => void createConversation()}>+</button></div>
        <div className="mt-5 space-y-2">{conversations.map((conversation) => <button key={conversation.id} className={`block w-full rounded-xl px-3 py-3 text-left text-sm ${conversation.id === conversationId ? "bg-cyan-300 text-slate-950" : "bg-slate-800 text-slate-300"}`} onClick={() => void loadMessages(conversation.id)}>{conversation.title}</button>)}</div>
      </aside>
      <section className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-white/10 px-6 py-5"><h1 className="text-xl font-bold">KelanaAI Chat</h1><p className="text-sm text-slate-400">{activeConversation?.title ?? "New conversation"}</p></header>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-6 py-8">{initializing && <p className="text-center text-slate-500">Loading conversation...</p>}{!initializing && messages.length === 0 && <p className="text-center text-slate-500">Start a conversation about your next trip.</p>}{messages.map((message, index) => <div key={`${message.created_at}-${message.id ?? index}`} className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === "user" ? "self-end bg-cyan-300 text-slate-950" : "bg-slate-800 text-slate-100"}`}><p className="whitespace-pre-line">{message.content}</p><time className="mt-2 block text-xs opacity-60">{new Date(message.created_at).toLocaleTimeString()}</time></div>)}{loading && <div className="self-start rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-400">AI is typing...</div>}{error && <p className="text-center text-sm text-rose-300">{error}</p>}<div ref={bottomRef} /></div>
        <form onSubmit={submit} className="mx-auto flex w-full max-w-3xl gap-3 px-6 pb-8"><input className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-300" placeholder="Type a message..." value={text} onChange={(event) => setText(event.target.value)} /><button className="rounded-xl bg-cyan-300 px-5 font-semibold text-slate-950" disabled={loading}>Send</button></form>
      </section>
    </main>
  );
}
