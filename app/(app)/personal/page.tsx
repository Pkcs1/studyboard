import type { Metadata } from "next";
import { getCourses } from "@/app/actions/courses";
import { getTopics } from "@/app/actions/topics";
import { CourseView } from "./CourseView";

export const metadata: Metadata = {
  title: "Personal Dashboard · Studyboard",
  description: "Track course topics and study progress.",
};

export default async function PersonalPage(props: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const courses = await getCourses();

  // Pick requested course or default to first course
  const activeCourseId = searchParams.courseId || courses[0]?.id || "";
  const topics = activeCourseId ? await getTopics(activeCourseId) : [];

  return (
    <div className="pt-6">
      <CourseView
        key={activeCourseId}
        initialCourses={courses}
        initialTopics={topics}
        selectedCourseId={activeCourseId}
      />
    </div>
  );
}
