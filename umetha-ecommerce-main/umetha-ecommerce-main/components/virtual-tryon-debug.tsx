"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VirtualTryOnDebug() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [customApiKey, setCustomApiKey] = useState("fd57fdce5d923edb588a6bb46b5e4bb0");
  const [customPrompt, setCustomPrompt] = useState("Test prompt for Gemini API");

  const testAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with a simple GET request first
      console.log("Testing GET endpoint...");
      const getResponse = await fetch("/api/test-virtual-tryon");
      const getData = await getResponse.json();
      console.log("GET response:", getData);
      
      // Test with a simple POST request
      console.log("Testing POST endpoint...");
      const postResponse = await fetch("/api/test-virtual-tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          message: "Testing virtual try-on API"
        }),
      });

      const postData = await postResponse.json();
      console.log("POST response:", postData);
      
      setResult({
        getTest: getData,
        postTest: postData
      });
    } catch (err) {
      console.error("Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const testNanoBananaEndpoints = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing Nano Banana API endpoints...");
      const response = await fetch("/api/test-nanobanana");
      const data = await response.json();
      console.log("Nano Banana test response:", data);
      
      setResult({
        type: "nano_banana_test",
        data: data
      });
    } catch (err) {
      console.error("Nano Banana test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!customEndpoint || !customApiKey) {
      setError("Please provide both endpoint and API key");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing custom endpoint:", customEndpoint);
      const response = await fetch("/api/test-nanobanana", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: customEndpoint,
          apiKey: customApiKey
        }),
      });

      const data = await response.json();
      console.log("Custom endpoint test response:", data);
      
      setResult({
        type: "custom_endpoint_test",
        data: data
      });
    } catch (err) {
      console.error("Custom endpoint test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const testGeminiAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing Google Gemini API...");
      const response = await fetch("/api/test-gemini");
      const data = await response.json();
      console.log("Gemini API test response:", data);
      
      setResult({
        type: "gemini_test",
        data: data
      });
    } catch (err) {
      console.error("Gemini API test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const testGeminiCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      setError("Please provide a custom prompt");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing Gemini API with custom prompt:", customPrompt);
      const response = await fetch("/api/test-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: customPrompt
        }),
      });

      const data = await response.json();
      console.log("Gemini custom prompt test response:", data);
      
      setResult({
        type: "gemini_custom_test",
        data: data
      });
    } catch (err) {
      console.error("Gemini custom prompt test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Virtual Try-On API Debug</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testAPI} disabled={isLoading} className="flex-1">
            {isLoading ? "Testing..." : "Test Basic API"}
          </Button>
          <Button onClick={testGeminiAPI} disabled={isLoading} variant="outline" className="flex-1">
            {isLoading ? "Testing..." : "Test Gemini API"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={testNanoBananaEndpoints} disabled={isLoading} variant="outline" className="flex-1">
            {isLoading ? "Testing..." : "Test Nano Banana Endpoints"}
          </Button>
          <Button onClick={testGeminiCustomPrompt} disabled={isLoading} variant="outline" className="flex-1">
            {isLoading ? "Testing..." : "Test Gemini Custom"}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Test Custom Prompt</h4>
          <div className="space-y-2">
            <textarea
              placeholder="Enter custom prompt for Gemini API"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-2 border rounded h-20"
            />
            <Button onClick={testGeminiCustomPrompt} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Custom Prompt"}
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Test Custom Endpoint (Legacy)</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter API endpoint URL"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Enter API key"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <Button onClick={testCustomEndpoint} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Test Custom Endpoint"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">API Response:</h4>
          
          {result.type === "nano_banana_test" && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Nano Banana Endpoint Test Results:</h5>
              {result.data.results?.map((endpoint: any, index: number) => (
                <div key={index} className={`p-2 rounded mb-2 ${
                  endpoint.status === "SUCCESS" 
                    ? "bg-green-100 border border-green-300" 
                    : "bg-red-100 border border-red-300"
                }`}>
                  <div className="font-medium">{endpoint.endpoint}</div>
                  <div className="text-sm">
                    Status: {endpoint.status} | Code: {endpoint.statusCode}
                  </div>
                  <div className="text-xs text-gray-600">{endpoint.message}</div>
                  {endpoint.errorType && (
                    <div className="text-xs text-red-600">Error: {endpoint.errorType}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {result.type === "gemini_test" && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Google Gemini API Test Result:</h5>
              <div className={`p-2 rounded ${
                result.data.success 
                  ? "bg-green-100 border border-green-300" 
                  : "bg-red-100 border border-red-300"
              }`}>
                <div className="font-medium">Google Gemini API</div>
                <div className="text-sm">Status: {result.data.success ? "SUCCESS" : "FAILED"}</div>
                <div className="text-xs text-gray-600">{result.data.message}</div>
                {result.data.response && (
                  <div className="text-xs text-blue-600 mt-1">Response: {result.data.response}</div>
                )}
                {result.data.error && (
                  <div className="text-xs text-red-600">Error: {result.data.error}</div>
                )}
              </div>
            </div>
          )}

          {result.type === "gemini_custom_test" && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Gemini Custom Prompt Test Result:</h5>
              <div className={`p-2 rounded ${
                result.data.success 
                  ? "bg-green-100 border border-green-300" 
                  : "bg-red-100 border border-red-300"
              }`}>
                <div className="font-medium">Custom Prompt Test</div>
                <div className="text-sm">Status: {result.data.success ? "SUCCESS" : "FAILED"}</div>
                <div className="text-xs text-gray-600">{result.data.message}</div>
                {result.data.prompt && (
                  <div className="text-xs text-blue-600 mt-1">Prompt: {result.data.prompt}</div>
                )}
                {result.data.response && (
                  <div className="text-xs text-green-600 mt-1">Response: {result.data.response}</div>
                )}
                {result.data.error && (
                  <div className="text-xs text-red-600">Error: {result.data.error}</div>
                )}
              </div>
            </div>
          )}

          {result.type === "custom_endpoint_test" && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">Custom Endpoint Test Result:</h5>
              <div className={`p-2 rounded ${
                result.data.success 
                  ? "bg-green-100 border border-green-300" 
                  : "bg-red-100 border border-red-300"
              }`}>
                <div className="font-medium">{result.data.endpoint}</div>
                <div className="text-sm">Status: {result.data.success ? "SUCCESS" : "FAILED"}</div>
                <div className="text-xs text-gray-600">{result.data.message}</div>
                {result.data.error && (
                  <div className="text-xs text-red-600">Error: {result.data.error}</div>
                )}
              </div>
            </div>
          )}
          
          <pre className="text-xs text-green-700 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}
