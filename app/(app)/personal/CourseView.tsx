"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import type { Course, Topic, Status } from "@/lib/types";
import { updateTopicStatus, createTopic, deleteTopic } from "@/app/actions/topics";
import { createCourse, seedDefaultCourse } from "@/app/actions/courses";
import { StatusShape } from "@/components/StatusShape";
import { Button, Card, DashMark } from "@/components/ui";

const NEXT_STATUS: Record<Status, Status> = {
  not_started: "in_progress",
  in_progress: "done",
  done: "not_started",
};

export function CourseView({
  initialCourses,
  initialTopics,
  selectedCourseId,
}: {
  initialCourses: Course[];
  initialTopics: Topic[];
  selectedCourseId?: string;
}) {
  const router = useRouter();
  const courses = initialCourses;
  const [activeCourseId, setActiveCourseId] = useState<string>(
    selectedCourseId || initialCourses[0]?.id || "",
  );
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [isPending, startTransition] = useTransition();

  // Modals / forms
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicWeek, setNewTopicWeek] = useState(topics.length + 1);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");

  const activeCourse = courses.find((c) => c.id === activeCourseId);

  // Status cycling with optimistic update
  const handleCycleStatus = (topicId: string, currentStatus: Status) => {
    const next = NEXT_STATUS[currentStatus];
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, status: next } : t)),
    );

    startTransition(async () => {
      const res = await updateTopicStatus(topicId, next);
      if (!res.success) {
        // Revert on failure
        setTopics((prev) =>
          prev.map((t) => (t.id === topicId ? { ...t, status: currentStatus } : t)),
        );
      }
    });
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeCourseId) return;

    startTransition(async () => {
      const res = await createTopic(activeCourseId, newTopicTitle, newTopicWeek);
      if (res.topic) {
        setTopics((prev) => [...prev, res.topic!].sort((a, b) => a.week_number - b.week_number));
        setNewTopicTitle("");
        setNewTopicWeek(topics.length + 2);
        setShowAddTopic(false);
      }
    });
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    startTransition(async () => {
      await deleteTopic(topicId);
    });
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    startTransition(async () => {
      const res = await createCourse(newCourseName, newCourseCode);
      if (res.course) {
        setShowAddCourse(false);
        setNewCourseName("");
        setNewCourseCode("");
        router.push(`/personal?courseId=${res.course.id}`);
      }
    });
  };

  const handleSeedCourse = async () => {
    startTransition(async () => {
      const res = await seedDefaultCourse();
      if (res.course) {
        router.push(`/personal?courseId=${res.course.id}`);
        router.refresh();
      }
    });
  };

  // Progress metrics
  const totalTopics = topics.length;
  const doneTopics = topics.filter((t) => t.status === "done").length;
  const inProgressTopics = topics.filter((t) => t.status === "in_progress").length;
  const percentDone = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  // If no courses exist at all
  if (courses.length === 0) {
    return (
      <div className="dot-grid rounded-card border-2 border-line bg-surface p-8 sm:p-12 text-center max-w-xl mx-auto mt-8">
        <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-accent text-on-accent text-2xl font-black mb-4 glow">
          01
        </div>
        <h2 className="font-display text-3xl font-black uppercase tracking-tight">
          Welcome to Studyboard<DashMark />
        </h2>
        <p className="mt-4 text-ink-muted text-base leading-relaxed">
          Get started right away by setting up your first course tracker. You can initialize the 14-week Go syllabus for <strong className="text-ink">Algoritma dan Pemrograman 1</strong> with one click.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleSeedCourse} disabled={isPending}>
            {isPending ? "Setting up syllabus…" : "🚀 Quickstart: Algoritma & Pemrograman 1"}
          </Button>
          <Button variant="secondary" onClick={() => setShowAddCourse(true)}>
            Create Custom Course
          </Button>
        </div>

        {/* Modal for custom course */}
        {showAddCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <Card className="w-full max-w-md text-left">
              <h3 className="font-display text-xl font-bold uppercase">Add Course</h3>
              <form onSubmit={handleAddCourse} className="mt-4 space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Struktur Data"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Course Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. IF201"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="ghost" onClick={() => setShowAddCourse(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Save Course
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ---------- Top Controls: Course Selector & Actions ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-line pb-6">
        <div className="flex flex-wrap items-center gap-2">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCourseId(c.id);
                router.push(`/personal?courseId=${c.id}`);
              }}
              className={`rounded-full px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase tracking-wide transition-all ${
                c.id === activeCourseId
                  ? "bg-ink text-bg glow shadow-xs"
                  : "border-2 border-line bg-surface text-ink hover:border-ink"
              }`}
            >
              {c.name} {c.code && <span className="font-mono opacity-60 ml-1">({c.code})</span>}
            </button>
          ))}
          <button
            onClick={() => setShowAddCourse(true)}
            className="rounded-full border-2 border-dashed border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-ink-muted hover:border-accent hover:text-ink"
          >
            + New Course
          </button>
        </div>

        <Button onClick={() => setShowAddTopic(true)}>+ Add Topic</Button>
      </div>

      {/* ---------- Progress Header Card ---------- */}
      <Card className="dot-grid overflow-hidden relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              Course Progress · {activeCourse?.name}
            </span>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-5xl font-black tracking-tight">{percentDone}%</span>
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {doneTopics} of {totalTopics} topics done
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs font-mono text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-status-done" /> {doneTopics} Done
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-status-doing" /> {inProgressTopics} In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full border border-status-todo" />{" "}
                {totalTopics - doneTopics - inProgressTopics} Not Started
              </span>
            </div>
          </div>

          {/* Mini Geometric progress indicator */}
          <div className="hidden sm:flex size-20 items-center justify-center rounded-2xl border-2 border-line bg-surface">
            <svg viewBox="0 0 40 40" className="size-14 -rotate-90">
              <circle cx="20" cy="20" r="15" fill="none" stroke="var(--line)" strokeWidth="4" />
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke="var(--status-done)"
                strokeWidth="4"
                strokeDasharray={94.2}
                strokeDashoffset={94.2 - (94.2 * percentDone) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-6 h-3.5 w-full rounded-full bg-bg border border-line overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-accent glow"
            initial={{ width: 0 }}
            animate={{ width: `${percentDone}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </Card>

      {/* ---------- Topics List ---------- */}
      <section aria-label="Course Topics">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">
            Topics by Week<DashMark />
          </h2>
          <span className="font-mono text-xs text-ink-muted">
            Tap shape to cycle: Not started → Doing → Done
          </span>
        </div>

        {topics.length === 0 ? (
          <Card className="text-center py-12">
            <p className="font-mono text-sm text-ink-muted">No topics yet for this course.</p>
            <Button className="mt-4" onClick={() => setShowAddTopic(true)}>
              + Add First Topic
            </Button>
          </Card>
        ) : (
          <Card className="p-0 sm:p-0 overflow-hidden divide-y-2 divide-line">
            {topics.map((topic) => {
              const weekPad = String(topic.week_number).padStart(2, "0");
              return (
                <div
                  key={topic.id}
                  className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg sm:px-6"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="font-display text-2xl sm:text-3xl font-black text-ink-muted group-hover:text-accent transition-colors shrink-0">
                      {weekPad}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-base sm:text-lg truncate text-ink">
                        {topic.title}
                      </p>
                      <p className="font-mono text-xs text-ink-muted">Week {topic.week_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* One-tap status changer */}
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(topic.id, topic.status)}
                      title={`Current: ${topic.status.replace("_", " ")}. Click to advance status.`}
                      className="cursor-pointer p-1 rounded-full transition-transform active:scale-90 hover:bg-surface"
                    >
                      <StatusShape status={topic.status} size={42} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTopic(topic.id)}
                      title="Delete topic"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-ink-muted hover:text-orange text-xs font-mono"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </section>

      {/* ---------- Modal: Add Topic ---------- */}
      <AnimatePresence>
        {showAddTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <Card className="w-full max-w-md">
              <h3 className="font-display text-xl font-bold uppercase">Add New Topic</h3>
              <form onSubmit={handleAddTopic} className="mt-4 space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={newTopicWeek}
                    onChange={(e) => setNewTopicWeek(Number(e.target.value))}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Topic Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pointer & Memory Addressing"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="ghost" onClick={() => setShowAddTopic(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Add Topic
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </AnimatePresence>

      {/* ---------- Modal: Add Course ---------- */}
      <AnimatePresence>
        {showAddCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <Card className="w-full max-w-md">
              <h3 className="font-display text-xl font-bold uppercase">Add Course</h3>
              <form onSubmit={handleAddCourse} className="mt-4 space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Course Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Algoritma dan Pemrograman 2"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-ink-muted">Course Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. IF102"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-line bg-bg px-4 py-2 text-ink focus:border-accent focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="ghost" onClick={() => setShowAddCourse(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Save Course
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
