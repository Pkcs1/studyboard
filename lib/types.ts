import type { Status } from "@/components/StatusShape";

export type { Status };

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
