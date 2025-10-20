"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Bell,
  Lock,
  Store,
  Palette,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MessageSquare,
  ShoppingBag,
  Gift,
  DollarSign,
  Settings2,
  Sun,
  Moon,
  PaintBucket,
  Smartphone,
  Monitor,
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    orderUpdates: true,
    marketing: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "normal",
    colorScheme: "default",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store preferences and account settings
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600">
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 gap-1">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Store Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Store Name</Label>
                  <Input placeholder="Enter your store name" />
                </div>
                <div className="grid gap-2">
                  <Label>Store URL</Label>
                  <div className="flex gap-2">
                    <div className="flex-shrink-0 flex items-center px-3 border rounded-l-md bg-muted">
                      umetha.com/
                    </div>
                    <Input
                      className="rounded-l-none"
                      placeholder="your-store"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <Instagram className="h-5 w-5 text-pink-500" />
                  <Input placeholder="Instagram handle" />
                </div>
                <div className="flex items-center gap-4">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <Input placeholder="Twitter handle" />
                </div>
                <div className="flex items-center gap-4">
                  <Youtube className="h-5 w-5 text-red-500" />
                  <Input placeholder="YouTube channel" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              Notification Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-500" />
                    <Label className="font-medium">Email Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your store activity
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-500" />
                    <Label className="font-medium">Push Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new orders and messages
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Theme Settings</h3>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {["light", "dark", "system"].map((theme) => (
                      <Button
                        key={theme}
                        variant={
                          appearance.theme === theme ? "default" : "outline"
                        }
                        className="h-20 flex-col gap-2"
                        onClick={() => setAppearance({ ...appearance, theme })}
                      >
                        {theme === "light" ? (
                          <Sun className="h-5 w-5" />
                        ) : theme === "dark" ? (
                          <Moon className="h-5 w-5" />
                        ) : (
                          <Settings2 className="h-5 w-5" />
                        )}
                        <span className="capitalize">{theme}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Display Settings</h3>
              <div className="grid gap-6">
                <div className="space-y-4">
                  <Label>Device Optimization</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Smartphone className="h-5 w-5" />
                      <span>Mobile</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Monitor className="h-5 w-5" />
                      <span>Desktop</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <div className="flex-1 flex items-center gap-4">
                    <DollarSign className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-muted-foreground">
                        Connected to your store
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>

                <div className="flex items-center p-4 border rounded-lg">
                  <div className="flex-1 flex items-center gap-4">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Credit Cards</p>
                      <p className="text-sm text-muted-foreground">
                        Add or remove payment cards
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
