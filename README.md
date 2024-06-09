# workshop-genai-js

## Prerequisites

An Astra DB account. You can create one here (https://astra.datastax.com/register)
An OpenAI account and api key create one here (https://platform.openai.com/)


Create a Vector Database in Astra and generate and Application Token.

Copy to supplied .env.example to .env and enter your credentials for OpenAI and AstraDB:

OPENAI_API_KEY: API key for OPENAI
ASTRA_DB_API_ENDPOINT: Your Astra DB vector database endpoint
ASTRA_DB_APPLICATION_TOKEN: The generated app token for your Astra database

# Criando o app

Iniciamos a aplicação seguindo o getting started da Vercel (https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)

```
npx create-next-app@latest
cd datastax-genai-js
npm install ai @ai-sdk/openai zod
touch .env.local
```