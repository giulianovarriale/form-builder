import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Field } from '@/types'; // Assuming your types are here
import prisma from '@/lib/prisma'; // Import Prisma client
import { getCurrentUser } from '@/app/repositories/current-user-repository'; // Import user repository

// Define a type for conversation history messages
type ConversationMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to validate fields (can be expanded)
function validateFields(fields: any[]): Field[] {
  if (!Array.isArray(fields)) {
    throw new Error('AI response "fields" property is not an array.');
  }
  return fields.map((field: any, index: number) => {
    if (!field || typeof field !== 'object') {
      throw new Error(`Field at index ${index} is not a valid object.`);
    }
    if (!field.type || !["text", "paragraph", "select", "checkbox"].includes(field.type)) {
      throw new Error(`Field at index ${index} has an invalid or missing 'type'. Received: ${field.type}`);
    }
    if (typeof field.label !== 'string' || field.label.trim() === '') {
      throw new Error(`Field at index ${index} has an invalid or missing 'label'.`);
    }
    if (typeof field.isRequired !== 'boolean') {
      // Default isRequired to false if missing, with a warning
      // console.warn(`Field at index ${index} missing 'isRequired', defaulting to false.`);
      field.isRequired = false;
    }

    const validatedField: Partial<Field> = {
      id: field.id || `temp_field_${Date.now()}_${index}`, // Use AI provided ID or generate temporary
      type: field.type,
      label: field.label,
      isRequired: field.isRequired,
    };

    if (field.type === "select" || field.type === "checkbox") {
      if (!Array.isArray(field.options) || field.options.some((opt: any) => !opt || typeof opt.label !== 'string')) {
        // If options are crucial and missing, the AI should ask.
        // For now, we'll let it pass if the AI didn't deem it necessary to ask.
        // Or we could throw here to force AI to ask for options if it provides none.
        // For this draft, let's assume AI includes them or asks.
      }
      (validatedField as any).options = (field.options || []).map((opt: any, optIndex: number) => ({
        id: opt.id || `temp_option_${index}_${optIndex}_${Date.now()}`, // Use AI ID or generate
        label: opt.label,
      }));
    } else {
      (validatedField as any).options = [];
    }
    return validatedField as Field;
  });
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } : { message?: string, conversationHistory?: ConversationMessage[] } = body;

    if (!message && conversationHistory.length === 0) {
      return NextResponse.json({ error: 'Initial message is required' }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Construct messages for OpenAI API
    const messages: ConversationMessage[] = [
      {
        role: "system",
        content: `You are an AI assistant helping a user create a web form.
Your goal is to extract all necessary details for form fields.
The supported field types are: "text", "paragraph", "select", "checkbox".
Each field must have a "type", "label" (user-friendly), and "isRequired" (boolean).
"select" and "checkbox" fields must also have an "options" array, where each option is an object with "id" (unique, simple, e.g., "option_1") and "label".

If the user's message provides enough information to define one or more fields, respond with a JSON object:
{ "status": "success", "fields": [ /* array of field objects */ ] }

If the user's message is ambiguous, or if details are missing (e.g., options for a select field),
you MUST ask a clarifying question. Respond with a JSON object:
{ "status": "clarification_needed", "question": "Your clarifying question here." }

Do NOT try to guess missing information for critical parts like options for select/checkbox. Ask for it.
If generating fields, ensure each field has a temporary unique "id" like "field_xyz". Ensure options also have temporary unique "id"s like "option_abc".

Conversation so far:`
      },
      ...conversationHistory // Add previous turns
    ];

    if (message) { // Add current user message if provided
        messages.push({ role: "user", content: message });
    }


    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // Using a model version that's good with JSON and following instructions
      messages: messages as any, // OpenAI SDK expects specific ChatCompletionMessageParam type
      response_format: { type: "json_object" },
    });

    const aiResponseContent = completion.choices[0]?.message?.content;

    if (!aiResponseContent) {
      return NextResponse.json({ error: 'Failed to get a response from AI' }, { status: 500 });
    }

    let parsedAiResponse;
    try {
      parsedAiResponse = JSON.parse(aiResponseContent);
    } catch (e) {
      console.error("Error parsing AI JSON response:", e, "\nRaw response:", aiResponseContent);
      return NextResponse.json({ error: 'Invalid JSON from AI. The AI did not return valid JSON.', details: aiResponseContent }, { status: 500 });
    }

    if (parsedAiResponse.status === "clarification_needed") {
      if (typeof parsedAiResponse.question !== 'string' || parsedAiResponse.question.trim() === '') {
        console.error("AI asked for clarification but provided no question:", parsedAiResponse);
        return NextResponse.json({ error: 'AI needs clarification but returned an invalid question format.' }, { status: 500 });
      }
      return NextResponse.json({
        status: "clarification_needed",
        question: parsedAiResponse.question,
        updatedHistory: [...messages, {role: "assistant", content: aiResponseContent }] // Return history for client
      });
    }

    if (parsedAiResponse.status === "success") {
      if (!parsedAiResponse.fields) {
        console.error("AI claimed success but provided no fields:", parsedAiResponse);
        // Potentially ask AI to try again or return a clarification request
        return NextResponse.json({ status: "clarification_needed", question: "I seem to have trouble generating the fields. Could you please describe them again?" });
      }
      try {
        const validatedFields = validateFields(parsedAiResponse.fields);

        // --- Prisma Integration Start ---
        const user = await getCurrentUser();
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized. User not found.' }, { status: 401 });
        }

        const newForm = await prisma.form.create({
          data: {
            title: "Your form title here", // Default title
            description: "Your form description here", // Default description
            creatorId: user.id,
            fields: validatedFields as any, // Store the validated fields array as JSON
          },
        });
        // --- Prisma Integration End ---

        return NextResponse.json({
          status: "form_created", // New status indicating form is created
          formId: newForm.id,
          fields: validatedFields, // Still return fields for client to potentially use
          updatedHistory: [...messages, {role: "assistant", content: aiResponseContent }]
        });
      } catch (validationError: any) {
        console.error("Error validating fields or creating form:", validationError, "\nAI response:", parsedAiResponse);
        // If validation or DB save fails, ask for clarification or report error
        return NextResponse.json({
          status: "clarification_needed",
          question: `I had trouble understanding some field details (Error: ${validationError.message}). Could you clarify or try describing that part again?`,
          updatedHistory: [...messages, {role: "assistant", content: aiResponseContent }]
        });
      }
    }

    // Fallback if status is unknown
    console.warn("AI response had an unknown status:", parsedAiResponse);
    return NextResponse.json({ error: 'Received an unknown response format from AI.', details: aiResponseContent }, { status: 500 });

  } catch (error: any) {
    console.error('Error processing request:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: 'OpenAI API Error', details: error.message, code: error.code }, { status: error.status || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
