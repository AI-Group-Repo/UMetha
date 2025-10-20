import DashboardLayout from "@/app/dashboard/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCircle, Mail, Lock, Bell, Shield, Smartphone } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-indigo-500" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input type="text" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <Input type="text" placeholder="Tell us about yourself" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-500" />
                <CardTitle>Email Settings</CardTitle>
              </div>
              <CardDescription>Manage your email preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <Button>Update Email</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-500" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <Input type="password" />
                </div>
                <Button>Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-500" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Customize your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add notification toggles here */}
                <Button variant="outline">Configure Notifications</Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button>Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Devices */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-indigo-500" />
                <CardTitle>Connected Devices</CardTitle>
              </div>
              <CardDescription>Manage your connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline">View Connected Devices</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
