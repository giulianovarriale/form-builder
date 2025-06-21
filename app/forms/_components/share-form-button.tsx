"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

type Props = {
  url: string;
};

export function ShareFormButton({ url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopied(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleCopy}>
      <Copy />
      {copied ? "Copied!" : "Copy Link"}
    </Button>
  );
}
