import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>DataStax - Gen AI for JS Developers</title>
        <meta name="description" content="Navigate to different chat versions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to DataStax - Gen AI for JS Developers Workshop</h1>
        <p className="mb-8">Exercises:</p>
        <div className="space-y-4">
          <a 
            href="/v1/chat" 
            className="block w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Go to V1 Chat
          </a>
          <a 
            href="/v1/upload" 
            className="block w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Go to V1 Upload
          </a>          
          <a 
            href="/v2/chat" 
            className="block w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Go to V2 Chat
          </a>
          <a 
            href="/v2/upload" 
            className="block w-full py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Go to V2 Upload
          </a>
          <a 
            href="/stocks" 
            className="block w-full py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Go to Stocks
          </a>
        </div>
      </main>
    </div>
  )
}
