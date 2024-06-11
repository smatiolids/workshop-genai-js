import { DataAPIClient } from "@datastax/astra-db-ts";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse";

/**
 * Based on: https://github.com/datastax/astra-db-ts
 */

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN || "");
const astraDb = client.db(ASTRA_DB_API_ENDPOINT || "");

function splitText(text: String, chunkSize = 1000) {
  const result = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    result.push(text.slice(i, i + chunkSize));
  }
  return result;
}

export async function GET(req: Request) {
  /**
   * Returns first 5 documents from the collection
   */
  const collection = await astraDb.collection(ASTRA_DB_COLLECTION as string);
  const data = await collection.find({}, { limit: 5 });
  const documents = await data.toArray();
  return NextResponse.json(documents);
}

export async function DELETE(req: Request) {
  /**
   * Deletes all the documents from the collection
   */
  const collection = await astraDb.collection(ASTRA_DB_COLLECTION as string);
  const res = await collection.deleteAll();
  return NextResponse.json({ message: res });
}

export async function POST(req: Request) {
  /**
   * Receives a PDF file, extract its content, separate it in chunks and store it on Astra
   */

  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "File not found" }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  console.log(fileBuffer);
  const data = await pdfParse(fileBuffer);

  const pdfContent = data.text;
  const chunks = splitText(pdfContent, 1000);
  console.log(chunks);

  const collection = await astraDb.collection(ASTRA_DB_COLLECTION as string);
  let count = 0;

  for (const chunk of chunks) {
    count++;
    console.log(`Inserting chunk ${count}: "${chunk.substring(0, 10)}..."`);
    await collection.insertOne({
      $vectorize: chunk,
      ts: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    fileName: file.name,
    size: file.size,
    chunks: count
  });
}
