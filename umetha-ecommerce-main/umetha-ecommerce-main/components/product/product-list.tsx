"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import Link from "next/link";

type Product = Tables<"products">;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await db.getProducts(50); // Get 40 products

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto my-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-64"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.products_id}`}
              key={product.products_id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-gray-100 h-48 flex items-center justify-center">
                {/* If you have product images, you can add them here */}
                <div className="text-gray-400">Product Image</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {product.description}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">
                    SKU: {product.sku}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
