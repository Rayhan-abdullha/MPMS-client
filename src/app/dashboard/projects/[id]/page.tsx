"use client";

import React, { useState } from "react";
import {
  Layers,
  MessageSquare,
  CornerDownRight,
  Send,
  CheckCircle,
} from "lucide-react";

interface CommentNode {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

export default function UserProjectDetailView() {
  const [activeSprint, setActiveSprint] = useState<string>("sprint-1");
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

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Project Status Headline Summary [cite: 71] */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wider">
            Active Workspace
          </span>
          <h1 className="text-xl font-bold text-zinc-900 mt-1">
            Enterprise Token Router API
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Automating high-concurrency cart orchestration distribution metrics.
            [cite: 71]
          </p>
        </div>
        <div className="w-full sm:w-48 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-zinc-700">
            <span>Sprint Velocity Progress [cite: 71, 80]</span>
            <span>64%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[64%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Expandable/Selectable Sprint Menu Lists [cite: 71, 72] */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-zinc-400" /> Numbered Sprints [cite:
            72]
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
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${activeSprint === sprint.id ? "border-indigo-600 bg-indigo-50/40 shadow-xs" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    Sprint {sprint.num}: {sprint.title} [cite: 72]
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {sprint.count} structural card blocks active [cite: 72]
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Detail Panel with Threaded Comments [cite: 73] */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Task Details: Optimize Webhook Handshake Logic [cite: 73]
            </h3>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Refactor request signature processing blocks within backend
              middleware arrays to catch expired request attempts early.
            </p>
          </div>

          {/* Simple Threaded Comments Segment [cite: 73] */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-400" /> Activity
              Thread [cite: 73]
            </h4>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-2.5 items-start text-xs"
                >
                  <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-600 border border-zinc-200 shrink-0">
                    {comment.author.substring(0, 2)}
                  </div>
                  <div className="bg-zinc-50 rounded-lg p-2.5 flex-1 border border-zinc-200/40">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-zinc-900">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-zinc-600 leading-relaxed">
                      {comment.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingestion input for adding comments [cite: 73] */}
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
