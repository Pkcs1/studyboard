"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types";

export async function getNote(topicId: string): Promise<Note | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("topic_id", topicId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching note:", error.message);
    return null;
  }

  return (data as Note) ?? null;
}

export async function saveNote(
  topicId: string,
  content: string,
  source?: string,
): Promise<{ note?: Note; error?: string }> {
  const supabase = await createClient();

  // Upsert the single note per topic/user
  const { data, error } = await supabase
    .from("notes")
    .upsert(
      {
        topic_id: topicId,
        content: content,
        source: source?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "topic_id,user_id" },
    )
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/personal");
  return { note: data as Note };
}
