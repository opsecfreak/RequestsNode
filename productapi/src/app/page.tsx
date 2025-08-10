
'use client';

import React, { useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  // GET request through our API route
  const handleGetProducts = async () => {
    setLoading(true);
    setStatus("Sending GET request...");
    try {
      const res = await fetch("/api/products?page=1&per_page=10");
      if (!res.ok) throw new Error("Failed to fetch products");
      const response = await res.json();
      
      if (response.success) {
        setProducts(response.data);
        setStatus(response.message);
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
    setLoading(false);
  };

  // POST request through our API route
  const handleInsertProduct = async () => {
    setLoading(true);
    setStatus("Inserting product...");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProductName,
          regular_price: newProductPrice,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to insert product");
      const response = await res.json();
      
      if (response.success) {
        setStatus(response.message);
        setProducts((prev) => [response.data, ...prev]);
        setNewProductName("");
        setNewProductPrice("");
      } else {
        throw new Error(response.error);
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">Product API Request Demo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Section 1: Send Request */}
          <section className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Send GET Request</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-full"
              onClick={handleGetProducts}
              disabled={loading}
            >
              {loading ? "Loading..." : "List Products"}
            </button>
            <p className="text-xs text-gray-300">GET /api/products</p>
          </section>

          {/* Section 2: Display Data */}
          <section className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Display Data</h2>
            <div className="bg-gray-900 rounded p-4 text-left text-sm w-full h-40 overflow-auto">
              {products.length === 0 ? (
                <span className="text-gray-400">No products loaded.</span>
              ) : (
                <ul>
                  {products.map((p) => (
                    <li key={p.id} className="mb-2 border-b border-gray-700 pb-2">
                      <span className="font-bold">{p.name}</span> <span className="text-xs">(${p.price || p.regular_price})</span>
                      <br />
                      <span className="text-xs text-gray-400">ID: {p.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Section 3: Insert Product */}
          <section className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Insert Product</h2>
            <input
              className="mb-2 p-2 rounded w-full text-black"
              type="text"
              placeholder="Product Name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <input
              className="mb-2 p-2 rounded w-full text-black"
              type="text"
              placeholder="Product Price"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
            />
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={handleInsertProduct}
              disabled={loading || !newProductName || !newProductPrice}
            >
              {loading ? "Loading..." : "Insert Product"}
            </button>
          </section>

          {/* Section 4: Request Status */}
          <section className="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Request Status</h2>
            <div className="bg-gray-900 rounded p-4 text-left text-sm w-full h-16 flex items-center">
              <span className="text-gray-300">{status || "No request sent yet."}</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
