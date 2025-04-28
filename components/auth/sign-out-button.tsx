"use client";

import { signOut } from "@/app/actions/sign-out";

export function SignOutButton({
  children,
  ...rest
}: React.ComponentProps<"button">) {
  return (
    <button {...rest} onClick={() => signOut()}>
      {children}
    </button>
  );
}
