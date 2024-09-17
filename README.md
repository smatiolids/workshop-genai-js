# GenAI for Javascript Developers

## Prerequisitos

Uma conta no Astra DB. Você pode criar uma aqui: (https://astra.datastax.com/register)

Uma conta na OpenAI. Você pode criar uma aqui: (https://platform.openai.com/)

Recommended version: NODE 18

# Criando o app

Iniciamos a aplicação seguindo o getting started da Vercel (https://sdk.vercel.ai/docs/getting-started/nextjs-app-router)

```
cd datastax-genai-js
npm install 
```

# Variáveis de ambiente

Copiar o .env.example para .env.local

```
cp .env.example .env.local
```

Atualizar as variáveis:

- ASTRA_DB_APPLICATION_TOKEN=""
- ASTRA_DB_API_ENDPOINT=""
- OPENAI_API_KEY=""
- ASTRA_DB_COLLECTION_EX1=nike_run_ex1
- OPENAI_EMBEDDING_MODEL_EX1=text-embedding-ada-002
- ASTRA_DB_COLLECTION_EX2=nike_run_ex2
- OPENAI_EMBEDDING_MODEL_EX2=text-embedding-ada-002
- OPENAI_MODEL="gpt-4-1106-preview"
- LANGFLOW_TOKEN=""
- LANGFLOW_ID=""

# Executando

```
npm run dev
```

# Ex1 - RAG + vectorize

Passos:

- Criar collection "nike_run_ex1" no Astra
- - Vector Enabled Collection
- - Configurar o $vectorize para usar os embeddings da NVIDIA
- Carregar documento em localhost:3000/v1/upload
- Acessar localhost:3000/v1/chat e fazer perguntas sobre a corrida

## Configuração do Vectorize (se utilizar embeddings OpenAI)

- Criar API Key
- - Vincular DB ao escopo da chave
- Criar collection "nike_run"
- Vincular modelo OpenAI "text-embedding-3-small"
- - Dimensões: 1536
- - Similarity Metric: Cosine

# Ex2 - RAG com LangChainJS

Passos:

- Criar collection "nike_run_langchain" no Astra
- - Definir embeddings como "Bring my own"
- - Dimensions = 1536 e Similarity Metric = Dot-Product
- Carregar documento em localhost:3000/v2/upload
- Repetir perguntas em localhost:3000v2/chat
- Acessar localhost:3000/v2/chat e fazer perguntas sobre a corrida

# Ex3 - RAG com Langflow

Passos:

- Criar um fluxo Vector Store RAG
- Adicionar sua chave da OpenAI à variável de ambiente
- Configurar o componente OpenAI Embeddings
- Escolher o Database no Astra
- Criar a collection nike_run_ex3 através da UI do Langflow
- - Dimensions: 1536 e Metric: dot_product
- Carregar o documento para a collection nike_run_ex3
- Testar o fluxo no Playground
- Atualizar variáveis de ambiente (valores disponíveis na tela Python API)
- Usar o Chat Widget

# Ex4 - Stocks & React Components

Passos:

- Acessar localhost:3000/stocks
- Criar collection "stocks" no Astra
- Carregar dados para a collection (A partir do arquivo data/stocks.csv)
- Perguntar sobre preço de ação: AAPL, GOOG, SBUX


# Questões e feedback

Email: samuel.matioli@datastax.com
Linkedin: https://www.linkedin.com/in/samuelmatioli/
