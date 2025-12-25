import { redirect } from "next/navigation";

// Root page just bounces to the public landing. Nothing fancy.
export default function Home() {
  redirect("/delivery");
}
