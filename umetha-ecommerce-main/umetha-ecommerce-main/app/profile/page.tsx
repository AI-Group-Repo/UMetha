"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import MainLayout from "@/components/main-layout";
import {
  User,
  Settings,
  Lock,
  CreditCard,
  MapPin,
  Bell,
  Shield,
} from "lucide-react";
import { useTheme } from "next-themes";

type ProfileData = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function ProfilePage() {
  const { user, supabase, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    // If user is not authenticated, redirect to sign in page
    if (user === null) {
      router.push("/signin");
      return;
    }

    async function loadProfile() {
      setLoading(true);
      try {
        // Fetch profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        // Set profile and form data
        setProfileData(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: user.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          postal_code: data.postal_code || "",
          country: data.country || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description:
            "We couldn't load your profile information. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) loadProfile();
  }, [user, supabase, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    try {
      // Update the profile data in Supabase
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.last_name}`,
          phone_number: formData.phone_number || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          postal_code: formData.postal_code || null,
          country: formData.country || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              first_name: formData.first_name,
              last_name: formData.last_name,
              full_name: `${formData.first_name} ${formData.last_name}`,
              phone_number: formData.phone_number || null,
              address: formData.address || null,
              city: formData.city || null,
              state: formData.state || null,
              postal_code: formData.postal_code || null,
              country: formData.country || null,
              updated_at: new Date().toISOString(),
            }
          : null
      );

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "We couldn't update your profile. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Your new password and confirmation do not match.",
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Your password must be at least 8 characters long.",
      });
      return;
    }

    setUpdatePasswordLoading(true);
    try {
      // Update the password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password,
      });

      if (error) throw error;

      // Clear the password fields
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description:
          error.message ||
          "We couldn't update your password. Please try again later.",
      });
    } finally {
      setUpdatePasswordLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <MainLayout hideShopCategory>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideShopCategory>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
          <aside className="w-full md:w-1/4">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={profileData?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                    {profileData?.first_name?.charAt(0)?.toUpperCase() || ""}
                    {profileData?.last_name?.charAt(0)?.toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{profileData?.full_name}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>
                    Member since:{" "}
                    {new Date(
                      profileData?.created_at || ""
                    ).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6 space-y-2">
              <div className="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-lg flex gap-2 items-center text-indigo-800 dark:text-indigo-300">
                <User size={16} />
                <span className="text-sm font-medium">Account</span>
              </div>

              <div className="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex gap-2 items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <CreditCard size={16} />
                <span className="text-sm">Payment Methods</span>
              </div>

              <div className="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex gap-2 items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <MapPin size={16} />
                <span className="text-sm">Addresses</span>
              </div>

              <div className="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex gap-2 items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <Bell size={16} />
                <span className="text-sm">Notifications</span>
              </div>

              <div className="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex gap-2 items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <Lock size={16} />
                <span className="text-sm">Privacy & Security</span>
              </div>

              <div className="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg flex gap-2 items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                <Shield size={16} />
                <span className="text-sm">Account Protection</span>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                My Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your profile information and account settings
              </p>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800/50">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2" size={20} />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="First Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            placeholder="Email Address"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email address cannot be changed. Contact support for
                            assistance.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Phone Number</Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Updating..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2" size={20} />
                      Address Information
                    </CardTitle>
                    <CardDescription>
                      Update your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street Address"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="State/Province"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="postal_code">Postal/ZIP Code</Label>
                            <Input
                              id="postal_code"
                              name="postal_code"
                              value={formData.postal_code}
                              onChange={handleInputChange}
                              placeholder="Postal/ZIP Code"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Updating..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2" size={20} />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">
                            Current Password
                          </Label>
                          <Input
                            id="current_password"
                            name="current_password"
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            name="new_password"
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            required
                            minLength={8}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Password must be at least 8 characters long
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button type="submit" disabled={updatePasswordLoading}>
                          {updatePasswordLoading
                            ? "Updating..."
                            : "Update Password"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
