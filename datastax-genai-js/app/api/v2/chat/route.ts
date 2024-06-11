import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
  StreamingTextResponse,
  streamText,
  StreamData,
  CoreMessage,
  LangChainAdapter,
} from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { getVectorStore } from "../AstraVectorStore";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN || "");
const astraDb = client.db(ASTRA_DB_API_ENDPOINT || "");

const openai2 = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Constants for templates
const SYSTEM_TEMPLATE = `You are an AI assistant who answers question abour real estate financing in Brazil.
        You are talking to people interested in public financing from CAIXA, a public bank in Brazil. 
        Use the below context to augment what you know about real estate.
        The context will provide you with the most recent page data from CAIXA's website.
        If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
        Format responses using markdown where applicable and don't return images.
        ----------------
        START CONTEXT
        {context}
        END CONTEXT
`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages[messages?.length - 1]?.content;
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever(10);

  const openAIModel = new ChatOpenAI({ model: "gpt-4-turbo" });

  const msgs = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(msgs);

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    openAIModel,
    new StringOutputParser(),
  ]);

  console.log(chain);

  const stream = await chain.stream(latestMessage);

  const aiStream = LangChainAdapter.toAIStream(stream);

  return new StreamingTextResponse(aiStream);
}
