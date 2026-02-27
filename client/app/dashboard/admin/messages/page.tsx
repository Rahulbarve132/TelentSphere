"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Loader2,
  RefreshCcw,
  Search,
  ChevronDown,
  ChevronUp,
  Inbox,
  User,
  Calendar,
  Trash2,
  NotebookPen,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";
import { toast } from "sonner";

interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
  status?: "unread" | "read" | "resolved";
  adminNotes?: string;
}

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages]     = useState<ContactMessage[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);
  // Local draft edits keyed by message _id
  const [drafts, setDrafts] = useState<Record<string, { status: string; adminNotes: string }>>({});

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contact");
      if (res.data.success) {
        // Support both array-at-root and nested structures
        const data: ContactMessage[] =
          Array.isArray(res.data.data)
            ? res.data.data
            : res.data.data?.messages ?? res.data.data?.contacts ?? [];
        setMessages(data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      day:    "numeric",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expanded === id) setExpanded(null);
      toast.success("Message deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const handlePatch = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setPatchingId(id);
    try {
      const res = await api.patch(`/contact/${id}`, {
        status:     draft.status,
        adminNotes: draft.adminNotes,
      });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === id
              ? { ...m, status: draft.status as ContactMessage["status"], adminNotes: draft.adminNotes }
              : m
          )
        );
        toast.success("Message updated");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update message");
    } finally {
      setPatchingId(null);
    }
  };

  // Initialise a draft when a card is expanded
  const handleExpand = (msg: ContactMessage) => {
    const id = msg._id;
    if (!drafts[id]) {
      setDrafts((prev) => ({
        ...prev,
        [id]: {
          status:     msg.status     ?? "unread",
          adminNotes: msg.adminNotes ?? "",
        },
      }));
    }
    setExpanded((prev) => (prev === id ? null : id));
  };

  const statusMeta = {
    unread:   { label: "Unread",   color: "bg-blue-500/15 text-blue-600 border-blue-500/30",   icon: CircleDot },
    read:     { label: "Read",     color: "bg-muted text-muted-foreground border-border",        icon: Clock },
    resolved: { label: "Resolved", color: "bg-green-500/15 text-green-600 border-green-500/30", icon: CheckCircle2 },
  } as const;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            Contact Messages
          </h1>
          <p className="text-muted-foreground mt-1">
            Submissions from the public contact form.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start sm:self-auto"
          onClick={fetchMessages}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {messages.filter((m) => !m.read).length}
              </p>
              <p className="text-xs text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 hidden sm:flex">
          <CardContent className="pt-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(messages.map((m) => m.email)).size}
              </p>
              <p className="text-xs text-muted-foreground">Unique Senders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 border-dashed bg-card/30">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-lg">
                {search ? "No messages match your search" : "No messages yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? "Try a different keyword."
                  : "Messages submitted via the contact form will appear here."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isOpen = expanded === msg._id;
            const initials = `${msg.firstName[0] ?? ""}${msg.lastName[0] ?? ""}`.toUpperCase();

            return (
              <Card
                key={msg._id}
                className={`border-border/50 bg-card/50 transition-all duration-200 hover:border-primary/30 hover:shadow-md ${
                  isOpen ? "border-primary/40 shadow-md" : ""
                }`}
              >
                {/* Row header */}
                <button
                  className="w-full text-left"
                  onClick={() => handleExpand(msg)}
                >
                  <CardContent className="pt-4 pb-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                      {initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">
                          {msg.firstName} {msg.lastName}
                        </span>
                        {/* Status badge */}
                        {(() => {
                          const s = msg.status ?? "unread";
                          const meta = statusMeta[s as keyof typeof statusMeta] ?? statusMeta.unread;
                          const Icon = meta.icon;
                          return (
                            <Badge className={`text-[10px] px-1.5 py-0.5 border flex items-center gap-1 ${meta.color}`}>
                              <Icon className="w-2.5 h-2.5" />
                              {meta.label}
                            </Badge>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {msg.email}
                      </p>
                      {!isOpen && (
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {msg.message}
                        </p>
                      )}
                    </div>

                    {/* Date + chevron */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(msg.createdAt)}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </button>

                {/* Expanded body */}
                {isOpen && drafts[msg._id] && (
                  <CardContent className="pt-0 pb-5 border-t border-border/40">
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      {/* Sender meta */}
                      <div className="sm:w-56 shrink-0 space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4 shrink-0" />
                          <span className="font-medium text-foreground">
                            {msg.firstName} {msg.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4 shrink-0" />
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-primary hover:underline truncate"
                          >
                            {msg.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>{formatDate(msg.createdAt)}</span>
                        </div>
                      </div>

                      {/* Message body */}
                      <div className="flex-1 bg-muted/30 rounded-xl p-4 border border-border/40">
                        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* ── Admin Controls ───────────────────────────────── */}
                    <div className="mt-5 p-4 rounded-xl border border-border/50 bg-muted/20 space-y-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <NotebookPen className="w-3.5 h-3.5" />
                        Admin Controls
                      </p>

                      {/* Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="text-sm font-medium text-foreground w-28 shrink-0">
                          Status
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {(["unread", "read", "resolved"] as const).map((s) => {
                            const meta = statusMeta[s];
                            const Icon = meta.icon;
                            const active = drafts[msg._id].status === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [msg._id]: { ...prev[msg._id], status: s },
                                  }))
                                }
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                  active
                                    ? `${meta.color} ring-2 ring-offset-1 ring-offset-background ring-current`
                                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor={`notes-${msg._id}`} className="text-sm font-medium text-foreground">
                          Admin Notes
                          <span className="ml-2 text-xs text-muted-foreground font-normal">(private — not visible to user)</span>
                        </label>
                        <textarea
                          id={`notes-${msg._id}`}
                          rows={3}
                          maxLength={1000}
                          placeholder="Add internal notes here…"
                          value={drafts[msg._id].adminNotes}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [msg._id]: { ...prev[msg._id], adminNotes: e.target.value },
                            }))
                          }
                          className="w-full rounded-lg border border-border/60 bg-background/60 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {drafts[msg._id].adminNotes.length} / 1000
                        </p>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === msg._id}
                        onClick={() => handleDelete(msg._id)}
                      >
                        {deletingId === msg._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {deletingId === msg._id ? "Deleting…" : "Delete"}
                      </Button>

                      <div className="flex items-center gap-2">
                        <a href={`mailto:${msg.email}?subject=Re: Your message to TalentSphere`}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Mail className="w-4 h-4" />
                            Reply
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={patchingId === msg._id}
                          onClick={() => handlePatch(msg._id)}
                        >
                          {patchingId === msg._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {patchingId === msg._id ? "Saving…" : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
