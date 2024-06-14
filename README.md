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

- ASTRA_DB_APPLICATION_TOKEN
- ASTRA_DB_API_ENDPOINT
- OPENAI_API_KEY

# Executando

```
npm run dev
```

# Ex1 - RAG + vectorize

Passos:

- Acessar localhost:3000/v1/chat e fazer perguntas sobre financiamento imobiliario
- Configurar o $vectorize
- Criar collection "real_estate_financing" no Astra
- Carregar documento em localhost:3000/v1/upload

## Configuração do Vectorize

- Criar API Key
- - Vincular DB ao escopo da chave
- Criar collection "real_estate_financing"
- Vincular modelo OpenAI "text-embedding-3-small"
- - Dimensões: 1536
- - Similarity Metric: Cosine

# Ex2 - RAG com LangChainJS

Passos:

- Acessar localhost:3000/v2/chat e fazer perguntas sobre financiamento imobiliario
- Criar collection "real_estate_financing_langchain" no Astra
- Carregar documento em localhost:3000/v2/upload
- Repetir perguntas em localhost:3000v2/chat


# Ex3

Passos:

- Acessar localhost:3000/stocks
- Criar collection "stocks" no Astra
- Carregar dados para a collection (A partir do arquivo data/stocks.csv)
- Perguntar sobre preço de ação: AAPL, GOOG, SBUX


# Questões e feedback

Email: samuel.matioli@datastax.com
Linkedin: https://www.linkedin.com/in/samuelmatioli/
