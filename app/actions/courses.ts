"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }

  return (data as Course[]) ?? [];
}

export async function createCourse(name: string, code?: string): Promise<{ course?: Course; error?: string }> {
  if (!name.trim()) return { error: "Course name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .insert([{ name: name.trim(), code: code?.trim() || null }])
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/personal");
  return { course: data as Course };
}

export async function seedDefaultCourse(): Promise<{ course?: Course; error?: string }> {
  const supabase = await createClient();

  // 1. Create course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .insert([
      {
        name: "Algoritma dan Pemrograman 1",
        code: "IF101",
      },
    ])
    .select()
    .single();

  if (courseError) return { error: courseError.message };

  // 2. Default 14-week Go syllabus topics
  const defaultTopics = [
    { week_number: 1, title: "Pengenalan Algoritma & Bahasa Go" },
    { week_number: 2, title: "Tipe Data, Variabel & Konstanta" },
    { week_number: 3, title: "Operator & Format Input/Output" },
    { week_number: 4, title: "Percabangan: if, else & switch" },
    { week_number: 5, title: "Perulangan: for loop variations" },
    { week_number: 6, title: "Fungsi (Functions) & Multiple Returns" },
    { week_number: 7, title: "Fungsi Rekursif & Persiapan UTS" },
    { week_number: 8, title: "Pointer & Memory Reference" },
    { week_number: 9, title: "Array & Slice Manipulation" },
    { week_number: 10, title: "Map (Key-Value Collections)" },
    { week_number: 11, title: "Struct & Receiver Methods" },
    { week_number: 12, title: "Algoritma Pencarian (Linear & Binary)" },
    { week_number: 13, title: "Algoritma Pengurutan (Bubble, Selection)" },
    { week_number: 14, title: "File I/O & Persiapan UAS" },
  ];

  const topicsToInsert = defaultTopics.map((t) => ({
    course_id: course.id,
    title: t.title,
    week_number: t.week_number,
    status: "not_started",
  }));

  const { error: topicsError } = await supabase.from("topics").insert(topicsToInsert);

  if (topicsError) {
    return { error: topicsError.message };
  }

  revalidatePath("/personal");
  return { course: course as Course };
}
