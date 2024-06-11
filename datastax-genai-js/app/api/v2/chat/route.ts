import { openai } from '@ai-sdk/openai';
import OpenAI from 'openai';
import { StreamingTextResponse, streamText, StreamData, CoreMessage } from "ai";
import { DataAPIClient } from '@datastax/astra-db-ts'

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN || '');
const astraDb = client.db(ASTRA_DB_API_ENDPOINT || '');


const openai2 = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("Messages:", messages)

  const latestMessage = messages[messages?.length - 1]?.content;

  let docContext = "";

  // const embedding = await openai2.embeddings.create({
  //   model: OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  //   input: latestMessage,
  //   encoding_format: "float",
  // });

  try {
    const collection = await astraDb.collection(ASTRA_DB_COLLECTION||'');
    const cursor = collection.find({}, {
      sort: {
        $vectorize: latestMessage
      },
      limit: 10,
    });

    const documents = await cursor.toArray();
    console.log(documents)

    const docsMap = documents?.map((doc) => doc['$vectorize']);

    docContext = JSON.stringify(docsMap);
  } catch (e) {
    console.log("Error querying db...");
    docContext = "";
  }

  const Prompt: CoreMessage = {
    role: "system",
    content: `You are an AI assistant who answers question abour real estate financing in Brazil.
        You are talking to people interested in public financing from CAIXA, a public bank in Brazil. 
        Use the below context to augment what you know about real estate.
        The context will provide you with the most recent page data from CAIXA's website.
        If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
        Format responses using markdown where applicable and don't return images.
        ----------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        ----------------
        QUESTION: ${latestMessage}
        ----------------      
        `,
  };
  console.log(Prompt)

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: [Prompt],
  });

  const data = new StreamData();

  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });

  return new StreamingTextResponse(stream, {}, data);
}
