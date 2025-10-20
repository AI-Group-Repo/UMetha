"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Server,
  Shield,
  Database,
  Bell,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function CommandCenter() {
  const systemStatus = {
    services: [
      {
        name: "API Server",
        status: "operational",
        uptime: "99.99%",
        lastIncident: "None",
      },
      {
        name: "Database",
        status: "operational",
        uptime: "99.95%",
        lastIncident: "3 days ago",
      },
      {
        name: "Storage",
        status: "operational",
        uptime: "99.98%",
        lastIncident: "7 days ago",
      },
      {
        name: "Authentication",
        status: "operational",
        uptime: "99.99%",
        lastIncident: "None",
      },
    ],
    recentEvents: [
      {
        type: "info",
        message: "System backup completed successfully",
        time: "10 minutes ago",
      },
      {
        type: "warning",
        message: "High CPU usage detected",
        time: "1 hour ago",
      },
      {
        type: "success",
        message: "Security patches applied",
        time: "2 hours ago",
      },
      {
        type: "error",
        message: "Failed login attempts detected",
        time: "3 hours ago",
      },
    ],
    metrics: {
      cpuUsage: "45%",
      memoryUsage: "62%",
      diskSpace: "78%",
      networkLoad: "28%",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Command Center</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor and manage system performance, security, and maintenance
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStatus.services.map((service) => (
          <Card key={service.name} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{service.name}</h3>
              <Badge
                variant={
                  service.status === "operational" ? "success" : "destructive"
                }
                className="capitalize"
              >
                {service.status}
              </Badge>
            </div>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  Uptime
                </dt>
                <dd className="text-lg font-semibold">{service.uptime}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500 dark:text-gray-400">
                  Last Incident
                </dt>
                <dd className="text-sm">{service.lastIncident}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Metrics */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Metrics
          </h3>
          <div className="space-y-6">
            {Object.entries(systemStatus.metrics).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Events */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Events
          </h3>
          <div className="space-y-4">
            {systemStatus.recentEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                {event.type === "info" && (
                  <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5" />
                )}
                {event.type === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                )}
                {event.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                )}
                {event.type === "error" && (
                  <Shield className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="w-full">
            <Database className="h-4 w-4 mr-2" />
            Backup Database
          </Button>
          <Button className="w-full" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Update System
          </Button>
          <Button className="w-full" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
          <Button className="w-full" variant="outline">
            <Server className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </Card>
    </div>
  );
}
