"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation'; // For redirection
import { Loader2 } from 'lucide-react';

// Define types for conversation messages locally or import if defined globally
type Message = {
  role: 'user' | 'assistant' | 'system'; // System messages might not be displayed
  content: string;
};

interface AIChatAssistantProps {
  onClose?: () => void; // Optional: If used in a modal that needs to be closed
}

export function AIChatAssistant({ onClose }: AIChatAssistantProps) {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start with a greeting from the assistant
    setConversationHistory([
      { role: 'assistant', content: "Hello! Tell me about the fields you'd like to have for this form." }
    ]);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversationHistory]);

  const handleSendMessage = async () => {
    if (!currentUserInput.trim() && conversationHistory.length <= 1) return; // Don't send empty initial messages

    const newUserMessage: Message = { role: 'user', content: currentUserInput };
    // Add user message to history immediately for responsiveness
    const currentHistory = [...conversationHistory, newUserMessage];
    setConversationHistory(currentHistory);
    setCurrentUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newUserMessage.content, // Send only the latest user message
          conversationHistory: conversationHistory.slice(1) // Send previous relevant history, excluding initial greeting
         }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }

      const data = await response.json();

      setConversationHistory(data.updatedHistory || []); // API should return the full updated history

      if (data.status === 'form_created' && data.formId) {
        // Form created, redirect to edit page
        setConversationHistory(prev => [...prev, {role: 'assistant', content: `Great! Your form has been created. Redirecting you to the editor...`}]);
        router.push(`/forms/${data.formId}/edit`);
        if (onClose) onClose(); // Close modal if applicable
      } else if (data.status === 'clarification_needed' && data.question) {
        // AI is asking a question, it's already in updatedHistory from API
      } else if (data.status === 'success' && data.fields) {
        // This case might not happen if API always goes to form_created or clarification
        // but good to handle. The AI response is already in updatedHistory.
         setConversationHistory(prev => [...prev, {role: 'assistant', content: `I have the field information. (Developer note: waiting for next step like confirmation or save)`}]);
      }

    } catch (err: any) {
      console.error("AIChatAssistant Error:", err);
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      // Add error message to chat for visibility
      setConversationHistory(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">AI Form Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef as any}>
          {conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-3 rounded-lg max-w-[85%] ${
                msg.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-slate-100 text-slate-800 mr-auto'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center p-2">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
              <p className="text-sm text-slate-500 ml-2">AI is thinking...</p>
            </div>
          )}
           {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">
              <p className="text-sm font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Describe your form fields..."
            value={currentUserInput}
            onChange={(e) => setCurrentUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !currentUserInput.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
