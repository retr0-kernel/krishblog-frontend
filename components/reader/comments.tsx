"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Send, Shield, ChevronDown, ChevronUp } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface PublicComment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  content: string;
  is_admin_reply: boolean;
  replies?: PublicComment[];
  created_at: string;
}

interface CommentsProps {
  postId: string;
}

function CommentCard({ comment, depth = 0 }: { comment: PublicComment; depth?: number }) {
  const [showReplies, setShowReplies] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`${depth > 0 ? "ml-6 pl-4 border-l-2 border-[hsl(var(--border))]" : ""}`}>
      <div className="py-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
            ${comment.is_admin_reply
              ? "bg-[hsl(var(--accent))] text-white"
              : "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"
            }`}>
            {comment.is_admin_reply ? <Shield className="h-4 w-4" /> : comment.author_name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm font-sans text-[hsl(var(--foreground))]">
                {comment.is_admin_reply ? "Krish (Author)" : comment.author_name}
              </span>
              {comment.is_admin_reply && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--accent))/15] text-[hsl(var(--accent))] font-semibold">
                  Author
                </span>
              )}
              <span className="text-xs text-[hsl(var(--muted-foreground))] font-sans">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            <p className="mt-1.5 text-sm font-sans leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-wrap">
              {comment.content}
            </p>

            {hasReplies && (
              <button
                onClick={() => setShowReplies(s => !s)}
                className="mt-2 flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors font-sans"
              >
                {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div>
          {comment.replies!.map(reply => (
            <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentForm({ postId, onSuccess }: { postId: string; onSuccess: () => void }) {
  const [form, setForm] = useState({ author_name: "", author_email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/v1/public/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message ?? "Failed to submit comment");
      setSubmitted(true);
      setForm({ author_name: "", author_email: "", content: "" });
      setTimeout(() => { setSubmitted(false); onSuccess(); }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-5 rounded-lg bg-[hsl(var(--secondary))] text-center">
        <p className="text-sm font-sans text-[hsl(var(--foreground))] font-medium">
          ✅ Comment submitted! It will appear after moderation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-sans font-medium text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-wider">
            Name *
          </label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            value={form.author_name}
            onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-sans text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/30] focus:border-[hsl(var(--accent))] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-wider">
            Email *
          </label>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={form.author_email}
            onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))}
            className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-sans text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/30] focus:border-[hsl(var(--accent))] transition-colors"
          />
          <p className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))] font-sans">Not displayed publicly</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-sans font-medium text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-wider">
          Comment *
        </label>
        <textarea
          required
          minLength={2}
          maxLength={2000}
          rows={4}
          placeholder="Share your thoughts..."
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-sans text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/30] focus:border-[hsl(var(--accent))] transition-colors resize-none"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-sans">
            Comments are moderated before appearing.
          </span>
          <span className="text-[11px] text-[hsl(var(--muted-foreground))] font-sans">
            {form.content.length}/2000
          </span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-sans">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--accent))] text-white text-sm font-sans font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Submitting..." : "Post Comment"}
      </button>
    </form>
  );
}

export function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/v1/public/posts/${postId}/comments`);
      const data = await res.json();
      if (data.success) setComments(data.data ?? []);
    } catch {}
    setLoading(false);
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const total = comments.length;

  return (
    <section className="mt-16 pt-10 border-t border-[hsl(var(--border))]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: '"Playfair Display", serif' }}>
          <MessageSquare className="h-6 w-6 text-[hsl(var(--accent))]" />
          {loading ? "Comments" : `${total} Comment${total === 1 ? "" : "s"}`}
        </h2>
        <button
          onClick={() => setShowForm(s => !s)}
          className="text-sm font-sans font-medium text-[hsl(var(--accent))] hover:opacity-80 transition-opacity"
        >
          {showForm ? "Cancel" : "Leave a comment"}
        </button>
      </div>

      {/* Comment form */}
      {showForm && (
        <div className="mb-10 p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <h3 className="text-sm font-san font-semibold text-[hsl(var(--foreground))] mb-4 uppercase tracking-wider">
            Leave a Comment
          </h3>
          <CommentForm postId={postId} onSuccess={fetchComments} />
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-20 bg-[hsl(var(--muted))] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3 opacity-40" />
          <p className="text-[hsl(var(--muted-foreground))] font-sans text-sm">No comments yet. Be the first!</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm font-sans font-medium text-[hsl(var(--accent))] hover:opacity-80 transition-opacity"
            >
              Leave a comment →
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[hsl(var(--border))]">
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}

