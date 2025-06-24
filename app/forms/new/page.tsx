"use client"; // Required for useState and event handlers

import { useState } from "react";
import { createForm } from "@/app/actions/create-form";
import FormBuilder from "@/components/form/form-builder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { AIChatAssistant } from "@/components/ai-chat-assistant/AIChatAssistant";
import { Bot } from "lucide-react";

export default function Page() {
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4 mr-4 md:mr-0"> {/* Adjust margin for alignment */}
        <Dialog open={isAiAssistantOpen} onOpenChange={setIsAiAssistantOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Bot className="mr-2 h-4 w-4" /> Create with AI
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]"> {/* Increased width */}
            <DialogHeader>
              <DialogTitle>AI Form Assistant</DialogTitle>
              <DialogDescription>
                Describe the fields you need, and the AI will help you generate the form.
              </DialogDescription>
            </DialogHeader>
            <AIChatAssistant onClose={() => setIsAiAssistantOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <FormBuilder
        title="Create a new form"
        description="Use the buttons on the left panel to add fields to your form, or use the AI Assistant."
        action={{ label: "Create Form", handler: createForm }}
      />
    </>
  );
}
