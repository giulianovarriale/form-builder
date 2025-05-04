import { redirect } from "next/navigation";
import { getCurrentUser } from "./repositories/current-user-repository";

export default async function Page() {
  const currentUser = await getCurrentUser;

  if (!currentUser) {
    redirect("/sign-in");
  }

  redirect("/forms");
}
