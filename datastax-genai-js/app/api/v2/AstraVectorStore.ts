import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";
import { OpenAIEmbeddings } from "@langchain/openai";
const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION_EX2,
  OPENAI_EMBEDDING_MODEL_EX2
} = process.env;

let vectorStorePromise: Promise<AstraDBVectorStore>;

const astraConfig: AstraLibArgs = {
  token: ASTRA_DB_APPLICATION_TOKEN as string,
  endpoint: ASTRA_DB_API_ENDPOINT as string,
  namespace: "default_keyspace",
  collection: `${ASTRA_DB_COLLECTION_EX2}`,
  skipCollectionProvisioning: true,
};

/**
 * Initialize and get the vector store as a promise.
 * @returns {Promise<AstraDBVectorStore>} A promise that resolves to the AstraDBVectorStore.
 */
export async function getVectorStore() {
  if (!vectorStorePromise) {
    vectorStorePromise = initVectorStore();
  }
  return vectorStorePromise;
}

async function initVectorStore() {
  try {
    // Initialize the vector store.
    const vectorStore = await AstraDBVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({model:OPENAI_EMBEDDING_MODEL_EX2}),
      astraConfig
    );

    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
}
