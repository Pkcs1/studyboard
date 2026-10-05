"use client";

import { useEffect, useState, useTransition } from "react";
import Markdown from "react-markdown";
import type { Material, MaterialType, Note } from "@/lib/types";
import { getMaterials, createMaterial, deleteMaterial } from "@/app/actions/materials";
import { getNote, saveNote } from "@/app/actions/notes";
import { MaterialBadge } from "@/components/MaterialIcon";
import { Button } from "@/components/ui";

const MATERIAL_TYPES: { label: string; value: MaterialType }[] = [
  { label: "Drive", value: "drive" },
  { label: "PDF", value: "pdf" },
  { label: "Slides", value: "slides" },
  { label: "Obsidian", value: "obsidian" },
  { label: "Other", value: "other" },
];

export function TopicWorkspace({ topicId }: { topicId: string }) {
  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState<MaterialType>("drive");
  const [matUrl, setMatUrl] = useState("");
  const [matError, setMatError] = useState("");

  // Notes state
  const [noteContent, setNoteContent] = useState("");
  const [noteSource, setNoteSource] = useState("");
  const [notesLoading, setNotesLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Load materials & note when topicId changes
  useEffect(() => {
    let isMounted = true;

    getMaterials(topicId).then((data) => {
      if (isMounted) {
        setMaterials(data);
        setMaterialsLoading(false);
      }
    });

    getNote(topicId).then((data: Note | null) => {
      if (isMounted) {
        setNoteContent(data?.content || "");
        setNoteSource(data?.source || "");
        setNotesLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [topicId]);

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    setMatError("");

    startTransition(async () => {
      const res = await createMaterial(topicId, matTitle, matType, matUrl);
      if (res.error) {
        setMatError(res.error);
        return;
      }
      if (res.material) {
        setMaterials((prev) => [...prev, res.material!]);
        setMatTitle("");
        setMatUrl("");
        setShowAddMaterial(false);
      }
    });
  };

  const handleDeleteMaterial = (id: string) => {
    startTransition(async () => {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      await deleteMaterial(id);
    });
  };

  const handleSaveNote = () => {
    startTransition(async () => {
      const res = await saveNote(topicId, noteContent, noteSource);
      if (!res.error) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-surface/50 p-5 sm:p-6 rounded-b-2xl border-t-2 border-line">
      {/* ========================================================
          LEFT COLUMN: MATERIALS LIBRARY
          ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold uppercase tracking-wide">
              Materials Library
            </span>
            <span className="font-mono text-xs text-ink-muted">({materials.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddMaterial(!showAddMaterial)}
            className="font-mono text-xs uppercase font-bold text-accent hover:underline cursor-pointer"
          >
            {showAddMaterial ? "Close Form" : "+ Add Link"}
          </button>
        </div>

        {/* Add Material Form */}
        {showAddMaterial && (
          <form
            onSubmit={handleAddMaterial}
            className="rounded-xl border-2 border-dashed border-accent/40 bg-bg p-4 space-y-3"
          >
            <div>
              <label className="font-mono text-[11px] uppercase text-ink-muted">Title / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Slide PPT Pertemuan 3"
                value={matTitle}
                onChange={(e) => setMatTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink focus:border-accent focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[11px] uppercase text-ink-muted">Type</label>
                <select
                  value={matType}
                  onChange={(e) => setMatType(e.target.value as MaterialType)}
                  className="mt-1 block w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                >
                  {MATERIAL_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase text-ink-muted">
                  {matType === "obsidian" ? "Obsidian URI" : "URL Link"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    matType === "obsidian"
                      ? "obsidian://open?vault=Kuliah&file=Week3"
                      : "https://drive.google.com/..."
                  }
                  value={matUrl}
                  onChange={(e) => setMatUrl(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink focus:border-accent focus:outline-hidden"
                />
              </div>
            </div>

            {matError && (
              <p className="text-xs text-orange font-mono">{matError}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddMaterial(false)}
                className="py-1 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="py-1 px-4 text-xs">
                Save Link
              </Button>
            </div>
          </form>
        )}

        {/* Materials List */}
        {materialsLoading ? (
          <p className="font-mono text-xs text-ink-muted py-2">Loading materials…</p>
        ) : materials.length === 0 ? (
          <div className="rounded-xl border border-line/60 bg-bg/60 p-4 text-center">
            <p className="font-mono text-xs text-ink-muted">No materials attached yet.</p>
            <p className="text-xs text-ink-muted mt-1">
              Attach Google Drive folders, slide links, PDFs, or Obsidian notes.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {materials.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MaterialBadge type={m.type} />
                  <span className="font-medium text-sm truncate text-ink">{m.title}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                  >
                    Open ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDeleteMaterial(m.id)}
                    title="Delete link"
                    className="p-1 text-ink-muted hover:text-orange text-xs font-mono"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          RIGHT COLUMN: NOTES & SOURCES
          ======================================================== */}
      <div className="space-y-4 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold uppercase tracking-wide">
            Notes &amp; Sources
          </span>

          <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                !isPreview ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                isPreview ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {notesLoading ? (
          <p className="font-mono text-xs text-ink-muted py-2">Loading notes…</p>
        ) : isPreview ? (
          <div className="rounded-xl border border-line bg-bg p-4 flex-1 min-h-[160px] overflow-auto prose prose-sm max-w-none text-ink">
            {noteContent ? (
              <div className="space-y-2 text-sm leading-relaxed">
                <Markdown
                  components={{
                    h1: ({ ...props }) => (
                      <h1 className="font-display font-bold text-lg border-b border-line pb-1 mt-2 mb-2" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2 className="font-display font-semibold text-base mt-2 mb-1" {...props} />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="font-display font-medium text-sm mt-2 mb-1 text-accent" {...props} />
                    ),
                    p: ({ ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                    code: ({ ...props }) => (
                      <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs border border-line" {...props} />
                    ),
                    pre: ({ ...props }) => (
                      <pre className="rounded-lg bg-surface p-3 font-mono text-xs overflow-x-auto border border-line my-2" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                      <blockquote className="border-l-4 border-accent pl-3 italic text-ink-muted my-2" {...props} />
                    ),
                  }}
                >
                  {noteContent}
                </Markdown>
              </div>
            ) : (
              <p className="font-mono text-xs text-ink-muted italic">
                No note content written yet. Switch to &quot;Write&quot; mode to add Markdown notes.
              </p>
            )}

            {noteSource && (
              <div className="mt-4 pt-3 border-t border-line/60 font-mono text-xs text-ink-muted">
                Source: <span className="text-ink font-medium">{noteSource}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 flex-1 flex flex-col">
            <textarea
              rows={6}
              placeholder="Write your study notes here in Markdown... (e.g. ## Key Concepts, `code`, - bullet points)"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full flex-1 rounded-xl border border-line bg-bg p-3.5 font-mono text-xs sm:text-sm text-ink focus:border-accent focus:outline-hidden leading-relaxed resize-y min-h-[140px]"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Source attribution (e.g. Slide 14, Go in Action p. 45)"
                value={noteSource}
                onChange={(e) => setNoteSource(e.target.value)}
                className="rounded-lg border border-line bg-bg px-3 py-1.5 font-mono text-xs text-ink focus:border-accent focus:outline-hidden flex-1"
              />

              <div className="flex items-center justify-end gap-2">
                {savedSuccess && (
                  <span className="font-mono text-xs text-teal font-semibold">Saved ✓</span>
                )}
                <Button
                  type="button"
                  onClick={handleSaveNote}
                  disabled={isPending}
                  className="py-1 px-4 text-xs"
                >
                  {isPending ? "Saving…" : "Save Note"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
