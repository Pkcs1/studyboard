"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Topic, Status } from "@/lib/types";

export async function getTopics(courseId: string): Promise<Topic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", courseId)
    .order("week_number", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching topics:", error.message);
    return [];
  }

  return (data as Topic[]) ?? [];
}

export async function updateTopicStatus(
  topicId: string,
  newStatus: Status,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("topics")
    .update({ status: newStatus })
    .eq("id", topicId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/personal");
  return { success: true };
}

export async function createTopic(
  courseId: string,
  title: string,
  weekNumber: number,
): Promise<{ topic?: Topic; error?: string }> {
  if (!title.trim()) return { error: "Topic title is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("topics")
    .insert([
      {
        course_id: courseId,
        title: title.trim(),
        week_number: Number(weekNumber) || 1,
        status: "not_started",
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/personal");
  return { topic: data as Topic };
}

export async function deleteTopic(topicId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("topics").delete().eq("id", topicId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/personal");
  return { success: true };
}

export async function updateTopicTitle(
  topicId: string,
  title: string,
): Promise<{ success: boolean; error?: string }> {
  if (!title.trim()) return { success: false, error: "Title cannot be empty." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("topics")
    .update({ title: title.trim() })
    .eq("id", topicId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/personal");
  return { success: true };
}
