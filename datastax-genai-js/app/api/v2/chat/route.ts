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
  LangChainAdapter,
} from "ai";
import { getVectorStore } from "../AstraVectorStore";

// Constants for templates
const SYSTEM_TEMPLATE = `You are an AI assistant who answers question abour real estate financing in Brazil.
        You are talking to people interested in public financing from a public bank in Brazil. 
        Use the below context to augment what you know about real estate.
        The context will provide you with the most recent page data from bank's website.
        If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
        Format responses using markdown where applicable and don't return images.
`      
// + `        ----------------
//         START CONTEXT
//         {context}
//         END CONTEXT
// `;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {

  const { messages } = await req.json();
  const latestMessage = messages[messages?.length - 1]?.content;
  // const vectorStore = await getVectorStore();
  // const retriever = vectorStore.asRetriever(10);

  const openAIModel = new ChatOpenAI({ model: "gpt-4-turbo" });

  const msgs = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(msgs);

  const chain = RunnableSequence.from([
    {
      // context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    openAIModel,
    new StringOutputParser(),
  ]);

  const stream = await chain.stream(latestMessage);

  const aiStream = LangChainAdapter.toAIStream(stream);

  return new StreamingTextResponse(aiStream);
}
