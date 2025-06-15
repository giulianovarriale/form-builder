"use client";

import { signOut } from "@/app/actions/sign-out";
import { useTransition } from "react";

type Props = {
  loadingState: React.ReactNode;
} & React.ComponentProps<"button">;

export function SignOutButton({ children, loadingState, ...rest }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(signOut);
  }

  return (
    <button {...rest} disabled={pending} onClick={handleClick}>
      {pending ? loadingState : children}
    </button>
  );
}
