import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  AstraDBVectorStore,
  AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

import { NextResponse } from "next/server";
import test from "node:test";
import { metadata } from "@/app/layout";

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
} = process.env;

const astraConfig: AstraLibArgs = {
  token: ASTRA_DB_APPLICATION_TOKEN as string,
  endpoint: ASTRA_DB_API_ENDPOINT as string,
  namespace: "default_keyspace",
  collection: `${ASTRA_DB_COLLECTION}_langchain`,
  // collectionOptions: {
  //   vector: {
  //     dimension: 1536,
  //     metric: "cosine",
  //   },
  // },
  skipCollectionProvisioning: true,
};

export async function GET(req: Request) {
  /**
   * Returns first 5 documents from the collection
   */
  // const collection = await astraDb.collection(ASTRA_DB_COLLECTION as string);
  // const data = await collection.find({}, { limit: 5 });
  // const documents = await data.toArray();
  // return NextResponse.json(documents);
}

export async function DELETE(req: Request) {
  /**
   * Deletes all the documents from the collection
   */
  // const collection = await astraDb.collection(ASTRA_DB_COLLECTION as string);
  // const res = await collection.deleteAll();
  // return NextResponse.json({ message: res });
}

export async function POST(req: Request) {
  /**
   * Receives a PDF file and generate the embeddings using Langchain methods
   */

  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "File not found" }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const loader = new PDFLoader(new Blob([fileBuffer]));

  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 15,
  });

  const chunks = (await splitter.splitDocuments(docs)).map((doc) => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        source: doc.metadata.source,
      },
    };
  });

  const vectorStore = await AstraDBVectorStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings(),
    astraConfig
  );

  return NextResponse.json({ loaded: chunks.length });
}
