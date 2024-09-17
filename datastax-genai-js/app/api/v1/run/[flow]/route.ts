import { NextResponse } from "next/server";
import LangflowClient from "./LangflowClient";
const { LANGFLOW_TOKEN, BASE_API_URL, LANGFLOW_ID } = process.env;

const langflowClient = new LangflowClient(
  BASE_API_URL,
  LANGFLOW_TOKEN
);

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  const r = await req.json();
  console.log(params)

  try {
    const response = await langflowClient.runFlow(
      params['flow'],
      LANGFLOW_ID,
      r['input_value'],
      r['input_type'],
      r['output_type'],
      {},
      false,
      (data: { chunk: any; }) => console.log("Received:", data.chunk), // onUpdate
      (message: any) => console.log("Stream Closed:", message), // onClose
      (error: any) => console.log("Stream Error:", error) // onError
    );
    if ( response && response.outputs) {
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error("Main Error", error.message);
    return NextResponse.json({ error: error.message });
  }

}
