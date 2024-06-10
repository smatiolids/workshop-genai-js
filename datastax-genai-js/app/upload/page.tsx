"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface ChunkData {
  _id: string;
  $vectorize: string;
  ts: string;
  $vector: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  };

  const handleDelete = async () => {
    const response = await fetch("/api/upload", {
      method: "DELETE",
    });

    const data = await response.json();
    console.log(data);
  };

  const handleGetChunks = async () => {
    const response = await fetch("/api/upload");
    const data = await response.json();
    setChunks(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto mt-4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4">Upload File</h1>
        <form onSubmit={handleUpload} className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Delete All Chunks
          </button>
          <button
            onClick={handleGetChunks}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Get Chunks
          </button>
        </div>
      </div>
      {chunks.length > 0 && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">ID</th>
              <th className="py-2 px-4 border-b border-gray-300">$vectorize</th>
              <th className="py-2 px-4 border-b border-gray-300">Timestamp</th>
              <th className="py-2 px-4 border-b border-gray-300">$vector</th>
            </tr>
          </thead>
          <tbody>
            {chunks.map((chunk) => (
              <tr key={chunk._id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  {chunk._id}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {chunk.$vectorize.substring(0,100)}...
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {chunk.ts}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {chunk.$vector.slice(0,10)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
