import { DataAPIClient } from "@datastax/astra-db-ts";
import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse";
import { promises as fs } from "fs";
import { existsSync } from "fs";
import path from "path";
import { get_encoding } from "tiktoken";
const encoding = get_encoding("cl100k_base");

const {
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_COLLECTION,
  OPENAI_API_KEY,
  OPENAI_EMBEDDING_MODEL,
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
  //   console.log(data);

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

  //   const destinationPath = path.join(process.cwd(), "public/tmp");
  //   console.log(destinationPath);

  //   const fileArrayBuffer = await file.arrayBuffer();

  //   if (!existsSync(destinationPath)) {
  //     fs.mkdir(destinationPath, { recursive: true });
  //   }

  //   await fs.writeFile(
  //     path.join(destinationPath, file.name),
  //     Buffer.from(fileArrayBuffer)
  //   );

  return NextResponse.json({
    fileName: file.name,
    size: file.size,
    chunks: count,
    // content: pdfContent,
  });
}
