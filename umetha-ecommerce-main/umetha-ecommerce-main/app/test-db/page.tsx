"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDatabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      
      // Test basic connection
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // Test products table
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      // Test categories table
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (productsError) {
        throw new Error(`Products table error: ${productsError.message}`);
      }

      if (categoriesError) {
        throw new Error(`Categories table error: ${categoriesError.message}`);
      }

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setConnectionStatus('success');
    } catch (error) {
      console.error('Database connection error:', error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        {/* Connection Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className={`p-4 rounded-lg ${
            connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
            connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {connectionStatus === 'testing' && '🔄 Testing connection...'}
            {connectionStatus === 'success' && '✅ Database connection successful!'}
            {connectionStatus === 'error' && `❌ Connection failed: ${errorMessage}`}
          </div>
        </div>

        {/* Products Table */}
        {connectionStatus === 'success' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Products Table ({products.length} records)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-900">{product.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">${product.price}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Table */}
        {connectionStatus === 'success' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Categories Table ({categories.length} records)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-900">{category.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{category.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{category.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>If the connection failed, check your Supabase API keys in <code>lib/supabase.ts</code></li>
            <li>If the connection succeeded but tables are empty, run the seeding script: <code>node scripts/seed-products-with-translations.js</code></li>
            <li>Once you have data, visit the <a href="/products" className="text-blue-600 underline">Products page</a> to see the product cards</li>
            <li>Test language switching to see the internationalization in action</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
