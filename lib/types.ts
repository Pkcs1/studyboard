import type { Status } from "@/components/StatusShape";

export type { Status };

export type MaterialType = "drive" | "pdf" | "slides" | "obsidian" | "other";

export interface Course {
  id: string;
  user_id: string;
  name: string;
  code: string | null;
  created_at: string;
}

export interface Topic {
  id: string;
  course_id: string;
  user_id: string;
  title: string;
  week_number: number;
  status: Status;
  created_at: string;
}

export interface Material {
  id: string;
  topic_id: string;
  user_id: string;
  title: string;
  type: MaterialType;
  url: string;
  created_at: string;
}

export interface Note {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  source: string | null;
  created_at: string;
  updated_at: string;
}
