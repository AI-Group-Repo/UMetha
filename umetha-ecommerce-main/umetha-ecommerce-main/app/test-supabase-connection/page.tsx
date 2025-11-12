'use client';

import { useState, useEffect } from 'react';
import { supabase, db } from '@/lib/supabase';

export default function TestSupabaseConnection() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [productCount, setProductCount] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.log('Auth error (expected if not logged in):', authError.message);
      }

      // Test database query
      const { data: products, error: dbError } = await db.getProducts(5);
      
      if (dbError) {
        setError(`Database error: ${dbError.message}`);
        setConnectionStatus('❌ Database connection failed');
        return;
      }

      setProducts(products || []);
      setProductCount(products?.length || 0);
      setConnectionStatus('✅ Supabase connection successful!');
      
    } catch (err) {
      setError(`Connection error: ${err}`);
      setConnectionStatus('❌ Connection failed');
    }
  };

  const testSearch = async () => {
    try {
      const { data: searchResults, error } = await db.searchProducts('test');
      if (error) {
        setError(`Search error: ${error.message}`);
      } else {
        console.log('Search results:', searchResults);
        setProducts(searchResults || []);
      }
    } catch (err) {
      setError(`Search error: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <p className="text-lg">{connectionStatus}</p>
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Database Info</h2>
        <p className="mb-2">Products found: {productCount}</p>
        <button 
          onClick={testSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Search Function
        </button>
      </div>

      {products.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.products_id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-6">
        <h3 className="font-bold">Security Recommendations:</h3>
        <ul className="list-disc list-inside mt-2">
          <li>Enable RLS policies for products and suppliers tables</li>
          <li>Enable leaked password protection in Auth settings</li>
          <li>Configure additional MFA options</li>
        </ul>
      </div>
    </div>
  );
}

