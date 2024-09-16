"use client";
import Script from "next/script";

export default function Langflow() {
  const endpoint = process.env.NEXT_PUBLIC_FLOW_ID;
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.4/dist/build/static/js/bundle.min.js" />

      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <langflow-chat
          window_title="Langflow RAG"
          flow_id={endpoint}
          host_url=""
          chat_position="bottom-right"
        ></langflow-chat>
      </div>
    </>
  );
}
