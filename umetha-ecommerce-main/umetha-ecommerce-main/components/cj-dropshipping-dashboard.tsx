"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Play, Square, Settings, Package } from "lucide-react";

interface SyncStatus {
  isRunning: boolean;
  hasInterval: boolean;
  isEnabled: boolean;
}

interface SyncResult {
  success: boolean;
  totalProducts: number;
  errors: string[];
  keywords: string[];
  limit: number;
}

export default function CJDropshippingDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<SyncResult | null>(null);
  const [keywords, setKeywords] = useState("fashion,electronics,home,beauty");
  const [limit, setLimit] = useState(10);
  const [intervalHours, setIntervalHours] = useState(6);

  // Fetch sync status
  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/scheduler');
      const data = await response.json();
      setSyncStatus(data.data.status);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  // Test CJ connection
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/cj-products?action=test');
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('✅ CJ Dropshipping connection successful!');
      } else {
        alert('❌ CJ Dropshipping connection failed. Check your API key.');
      }
    } catch (error) {
      alert('❌ Failed to test connection');
    } finally {
      setIsLoading(false);
    }
  };

  // Sync products
  const syncProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sync/cj-products?keywords=${encodeURIComponent(keywords)}&limit=${limit}`);
      const data = await response.json();
      
      setLastSync(data.data);
      
      if (data.status === 'success') {
        alert(`✅ Synced ${data.data.totalProducts} products successfully!`);
      } else {
        alert(`⚠️ Sync completed with ${data.data.errors.length} errors`);
      }
    } catch (error) {
      alert('❌ Failed to sync products');
    } finally {
      setIsLoading(false);
      fetchSyncStatus();
    }
  };

  // Sync trending products
  const syncTrendingProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sync/cj-products?action=trending&limit=${limit}`);
      const data = await response.json();
      
      setLastSync(data.data);
      
      if (data.status === 'success') {
        alert(`✅ Synced ${data.data.totalProducts} trending products successfully!`);
      } else {
        alert(`⚠️ Trending sync completed with ${data.data.errors.length} errors`);
      }
    } catch (error) {
      alert('❌ Failed to sync trending products');
    } finally {
      setIsLoading(false);
      fetchSyncStatus();
    }
  };

  // Cleanup old products
  const cleanupOldProducts = async () => {
    if (!confirm('Are you sure you want to delete all old CJ Dropshipping products? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/cj-products?action=cleanup');
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('✅ Old products deleted successfully!');
      } else {
        alert('❌ Failed to delete old products');
      }
    } catch (error) {
      alert('❌ Failed to cleanup old products');
    } finally {
      setIsLoading(false);
      fetchSyncStatus();
    }
  };

  // Start scheduler
  const startScheduler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/scheduler?action=start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywords.split(',').map(k => k.trim()),
          productsPerKeyword: limit,
          intervalHours: intervalHours,
          enabled: true
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('✅ Scheduler started successfully!');
        fetchSyncStatus();
      } else {
        alert('❌ Failed to start scheduler');
      }
    } catch (error) {
      alert('❌ Failed to start scheduler');
    } finally {
      setIsLoading(false);
    }
  };

  // Stop scheduler
  const stopScheduler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/scheduler?action=stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('✅ Scheduler stopped successfully!');
        fetchSyncStatus();
      } else {
        alert('❌ Failed to stop scheduler');
      }
    } catch (error) {
      alert('❌ Failed to stop scheduler');
    } finally {
      setIsLoading(false);
    }
  };

  // Force sync
  const forceSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/sync/scheduler?action=force', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: keywords.split(',').map(k => k.trim()),
          productsPerKeyword: limit
        })
      });
      
      const data = await response.json();
      
      setLastSync(data.data.result);
      
      if (data.status === 'success') {
        alert(`✅ Force sync completed! Synced ${data.data.result.totalProducts} products`);
      } else {
        alert('❌ Force sync failed');
      }
    } catch (error) {
      alert('❌ Failed to force sync');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CJ Dropshipping Dashboard</h2>
          <p className="text-gray-600">Manage your dropshipping product sync</p>
        </div>
        <Button onClick={fetchSyncStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Button onClick={testConnection} disabled={isLoading} size="sm">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scheduler Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {syncStatus?.hasInterval ? (
                <Badge variant="default" className="bg-green-500">Running</Badge>
              ) : (
                <Badge variant="secondary">Stopped</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {lastSync ? (
                <div>
                  <div className="font-medium">{lastSync.totalProducts} products</div>
                  <div className="text-gray-500">{lastSync.errors.length} errors</div>
                </div>
              ) : (
                <div className="text-gray-500">No sync yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Sync Configuration
          </CardTitle>
          <CardDescription>Configure your CJ Dropshipping sync settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="fashion,electronics,home,beauty"
              />
            </div>
            <div>
              <Label htmlFor="limit">Products per keyword</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                min="1"
                max="50"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="interval">Sync interval (hours)</Label>
            <Input
              id="interval"
              type="number"
              value={intervalHours}
              onChange={(e) => setIntervalHours(Number(e.target.value))}
              min="1"
              max="24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your product sync operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={syncProducts} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Sync Products Now
              </Button>
              
              <Button onClick={syncTrendingProducts} disabled={isLoading} variant="secondary">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Package className="h-4 w-4 mr-2" />}
                Sync Trending Products
              </Button>
              
              <Button onClick={forceSync} disabled={isLoading} variant="outline">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Force Sync
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={cleanupOldProducts} disabled={isLoading} variant="destructive">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Square className="h-4 w-4 mr-2" />}
                Cleanup Old Products
              </Button>
              
              {syncStatus?.hasInterval ? (
                <Button onClick={stopScheduler} disabled={isLoading} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Scheduler
                </Button>
              ) : (
                <Button onClick={startScheduler} disabled={isLoading} variant="default">
                  <Play className="h-4 w-4 mr-2" />
                  Start Scheduler
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Sync Results */}
      {lastSync && (
        <Card>
          <CardHeader>
            <CardTitle>Last Sync Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Products:</span>
                <span className="font-medium">{lastSync.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span>Keywords:</span>
                <span className="font-medium">{lastSync.keywords.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span>Limit per keyword:</span>
                <span className="font-medium">{lastSync.limit}</span>
              </div>
              {lastSync.errors.length > 0 && (
                <div>
                  <span className="text-red-600 font-medium">Errors:</span>
                  <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                    {lastSync.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
