"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Material, MaterialType } from "@/lib/types";

export async function getMaterials(topicId: string): Promise<Material[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching materials:", error.message);
    return [];
  }

  return (data as Material[]) ?? [];
}

export async function createMaterial(
  topicId: string,
  title: string,
  type: MaterialType,
  url: string,
): Promise<{ material?: Material; error?: string }> {
  if (!title.trim()) return { error: "Material title is required." };
  if (!url.trim()) return { error: "URL is required." };

  const trimmedUrl = url.trim();

  // Basic validation: allow http, https, and obsidian schemes
  const isValidScheme =
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("obsidian://");

  if (!isValidScheme) {
    return {
      error: "URL must start with https://, http://, or obsidian:// (for Obsidian vault links).",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("materials")
    .insert([
      {
        topic_id: topicId,
        title: title.trim(),
        type,
        url: trimmedUrl,
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/personal");
  return { material: data as Material };
}

export async function deleteMaterial(materialId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("materials").delete().eq("id", materialId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/personal");
  return { success: true };
}
