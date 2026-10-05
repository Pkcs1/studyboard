import { redirect } from "next/navigation";

/* The home page just sends you to your Personal dashboard (or to /login if signed out). */
export default function Home() {
  redirect("/personal");
}
