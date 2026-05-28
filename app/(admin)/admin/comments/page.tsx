"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, CheckCircle, XCircle, Trash2, Reply, ChevronDown, ChevronUp, Shield, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { adminGetComments, adminApproveComment, adminReplyComment, adminDeleteComment } from "@/lib/api";
import type { Comment } from "@/types";

type Filter = "all" | "pending" | "approved";

function CommentRow({
  comment,
  onApprove,
  onDelete,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  onApprove: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-[hsl(var(--border))] pl-4" : ""}>
      <div className="py-4 border-b border-[hsl(var(--border))/50]">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
            ${comment.is_admin_reply ? "bg-[hsl(var(--accent))] text-white" : "bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))]"}`}>
            {comment.is_admin_reply ? <Shield className="h-4 w-4" /> : comment.author_name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{comment.author_name}</span>
              {comment.author_email && (
                <span className="text-xs text-[hsl(var(--muted-foreground))]">({comment.author_email})</span>
              )}
              {comment.is_admin_reply && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--accent))/15] text-[hsl(var(--accent))] font-semibold">
                  Admin Reply
                </span>
              )}
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase tracking-wider
                ${comment.is_approved ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>
                {comment.is_approved ? "Approved" : "Pending"}
              </span>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            {/* Actions */}
            {!comment.is_admin_reply && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {!comment.is_approved ? (
                  <button
                    onClick={() => onApprove(comment.id, true)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors font-sans font-medium"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                ) : (
                  <button
                    onClick={() => onApprove(comment.id, false)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors font-sans font-medium"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Unapprove
                  </button>
                )}
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))/10] transition-colors font-sans font-medium"
                >
                  <Reply className="h-3.5 w-3.5" /> Reply
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors font-sans font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}

            {comment.is_admin_reply && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors font-sans font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete reply
                </button>
              </div>
            )}

            {hasReplies && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1 mt-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors font-sans"
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {hasReplies && expanded && (
        <div>
          {comment.replies!.map(reply => (
            <CommentRow
              key={reply.id}
              comment={reply}
              onApprove={onApprove}
              onDelete={onDelete}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReplyModal({ commentId, onClose, onReplied }: { commentId: string; onClose: () => void; onReplied: () => void }) {
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await adminReplyComment(token, commentId, content);
      onReplied();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
          Reply as Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            autoFocus
            required
            minLength={2}
            maxLength={2000}
            rows={5}
            placeholder="Write your reply..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm font-sans text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))/30] focus:border-[hsl(var(--accent))] transition-colors resize-none"
          />
          {error && <p className="text-sm text-red-500 font-sans">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-sans rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="px-4 py-2 text-sm font-sans font-medium rounded-lg bg-[hsl(var(--accent))] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCommentsPage() {
  const { token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const approved = filter === "all" ? undefined : filter === "approved";
    const data = await adminGetComments(token, approved);
    setComments(data);
    setLoading(false);
  }, [token, filter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleApprove = async (id: string, val: boolean) => {
    if (!token) return;
    try {
      await adminApproveComment(token, id, val);
      fetchComments();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this comment?")) return;
    try {
      await adminDeleteComment(token, id);
      fetchComments();
    } catch {}
  };

  const pending = comments.filter(c => !c.is_approved && !c.is_admin_reply).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: '"Playfair Display", serif' }}>
            <MessageSquare className="h-6 w-6 text-[hsl(var(--accent))]" />
            Comments
            {pending > 0 && (
              <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-sans font-semibold">
                {pending} pending
              </span>
            )}
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] font-sans mt-1">
            Moderate, approve, and reply to reader comments.
          </p>
        </div>
        <button
          onClick={fetchComments}
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors font-sans text-[hsl(var(--muted-foreground))]"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-[hsl(var(--secondary))] p-1 rounded-lg w-fit">
        {(["all", "pending", "approved"] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-sans font-medium rounded-md capitalize transition-colors
              ${filter === f ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm" : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-[hsl(var(--muted))] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))] opacity-30 mb-3" />
          <p className="text-[hsl(var(--muted-foreground))] font-sans">No comments yet.</p>
        </div>
      ) : (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary))/30]">
            <span className="text-xs font-mono text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              {comments.length} comment{comments.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="divide-y divide-[hsl(var(--border))/50] px-4">
            {comments.map(comment => (
              <CommentRow
                key={comment.id}
                comment={comment}
                onApprove={handleApprove}
                onDelete={handleDelete}
                onReply={setReplyingTo}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reply modal */}
      {replyingTo && (
        <ReplyModal
          commentId={replyingTo}
          onClose={() => setReplyingTo(null)}
          onReplied={fetchComments}
        />
      )}
    </div>
  );
}

