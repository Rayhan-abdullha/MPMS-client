"use client";

import React, { useState } from "react";
import {
  Layers,
  MessageSquare,
  Send,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface CommentNode {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

export default function UserProjectDetailView() {
  const [activeSprint, setActiveSprint] = useState<string>("sprint-1");
  const [loggedHours, setLoggedHours] = useState<number>(14);
  const [hoursInput, setHoursInput] = useState<string>("");
  const [comments, setComments] = useState<CommentNode[]>([
    {
      id: "c-1",
      author: "Asif Rahman",
      message:
        "Automated cryptographic verification hashes match our regional cluster signatures.",
      timestamp: "2h ago",
    },
    {
      id: "c-2",
      author: "Nisha Sultana",
      message:
        "The production webhook listener throws minor type errors on payload extraction.",
      timestamp: "45m ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const postThreadedComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        author: "User Evaluation Node",
        message: newComment,
        timestamp: "Just now",
      },
    ]);
    setNewComment("");
  };

  // ✅ Core Requirement: Let users log tracking hours directly against their assigned backlog scope
  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueHours = parseFloat(hoursInput);
    if (!isNaN(uniqueHours) && uniqueHours > 0) {
      setLoggedHours((prev) => prev + uniqueHours);

      // Chronologically insert audit trails directly inside the active thread log matrix
      setComments((prev) => [
        ...prev,
        {
          id: `audit-${Date.now()}`,
          author: "System Logging Node",
          message: `Logged ${uniqueHours} working development hours against this milestone pipeline.`,
          timestamp: "Just now",
        },
      ]);
      setHoursInput("");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Project Status Headline Summary */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">
            User Workspace Node
          </span>
          <h1 className="text-xl font-bold text-zinc-900 mt-1">
            Enterprise Token Router API
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Automating high-concurrency cart orchestration distribution metrics.
          </p>
        </div>
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-zinc-700">
            <span>Sprint Completion Rate</span>
            <span>64%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[64%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sprints Consumer List Indicator Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-zinc-400" /> Allocated Project
              Milestones
            </h3>
            {[
              {
                id: "sprint-1",
                num: 1,
                title: "Database Migration Core",
                count: 4,
              },
              {
                id: "sprint-2",
                num: 2,
                title: "API Integration Hooks",
                count: 2,
              },
            ].map((sprint) => (
              <div
                key={sprint.id}
                onClick={() => setActiveSprint(sprint.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  activeSprint === sprint.id
                    ? "border-indigo-600 bg-indigo-50/40 shadow-xs"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">
                      Sprint {sprint.num}: {sprint.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {sprint.count} structural card blocks active
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ User Panel Feature Component: Numeric Time Log Summary Metrics Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" /> Effort
                Accountability Track
              </h4>
              <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 px-2 py-0.5 rounded">
                Total: {loggedHours} hrs
              </span>
            </div>

            <form onSubmit={handleLogTime} className="flex gap-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                placeholder="Log spent hours (e.g., 3.5)"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 bg-white text-zinc-900 outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer outline-none"
              >
                Log Hours
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Detail Panel with Threaded Comments */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 space-y-6">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-bold text-zinc-900">
                Task Details: Optimize Webhook Handshake Logic
              </h3>
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px] tracking-wide uppercase">
                Review Required
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Refactor request signature processing blocks within backend
              middleware arrays to catch expired request attempts early.
            </p>
          </div>

          {/* Simple Threaded Comments Segment */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-400" /> Activity
              Thread
            </h4>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-2.5 items-start text-xs"
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                      comment.id.startsWith("audit")
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-zinc-100 border-zinc-200 text-zinc-600"
                    }`}
                  >
                    {comment.author.substring(0, 2)}
                  </div>
                  <div
                    className={`rounded-lg p-2.5 flex-1 border ${
                      comment.id.startsWith("audit")
                        ? "bg-emerald-50/30 border-emerald-100 text-emerald-800"
                        : "bg-zinc-50 border-zinc-200/40 text-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-zinc-900">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="leading-relaxed">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingestion input for adding comments */}
            <form
              onSubmit={postThreadedComment}
              className="flex gap-2 items-center pt-2"
            >
              <input
                type="text"
                placeholder="Write a message into the thread context..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
