"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });
  const data = {}; // Optional, allows to send more data
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, data };
}
