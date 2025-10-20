"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Youtube,
  Save,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    bio: "",
    email: "",
    instagram: "",
    twitter: "",
    youtube: "",
    avatar_url: "",
  });

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select(
              "first_name, last_name, full_name, bio, avatar_url, social_links"
            )
            .eq("id", user.id)
            .single();

          if (error) throw error;

          // Set profile data from Supabase
          setProfile({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            full_name: data.full_name || "",
            bio:
              data.bio ||
              "Fashion influencer passionate about sustainable fashion.",
            email: user.email || "",
            instagram: data.social_links?.instagram || "",
            twitter: data.social_links?.twitter || "",
            youtube: data.social_links?.youtube || "",
            avatar_url: data.avatar_url || "",
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name} ${profile.last_name}`,
          bio: profile.bio,
          social_links: {
            instagram: profile.instagram,
            twitter: profile.twitter,
            youtube: profile.youtube,
          },
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar fallback text
  const getAvatarFallback = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `avatar-${user.id}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setLoading(true);
    try {
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      // Update the user profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile((prev) => ({ ...prev, avatar_url: publicUrl.publicUrl }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.email) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Influencer Profile</h1>
        <Button
          onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            "Edit Profile"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-purple-200 dark:border-purple-800">
                {profile.avatar_url ? (
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={profile.full_name || "Profile"}
                  />
                ) : null}
                <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="h-8 w-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white">
                    <Camera className="h-4 w-4" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {profile.full_name ||
                  `${profile.first_name} ${profile.last_name}` ||
                  user?.email?.split("@")[0]}
              </h2>
              <Badge className="mt-1 bg-gradient-to-r from-indigo-500 to-purple-500">
                Fashion Influencer
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1 bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-6">Social Links</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Instagram className="h-5 w-5 text-pink-600" />
              <Input
                name="instagram"
                value={profile.instagram}
                onChange={handleChange}
                placeholder="Instagram username"
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Twitter className="h-5 w-5 text-blue-500" />
              <Input
                name="twitter"
                value={profile.twitter}
                onChange={handleChange}
                placeholder="Twitter username"
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Youtube className="h-5 w-5 text-red-600" />
              <Input
                name="youtube"
                value={profile.youtube}
                onChange={handleChange}
                placeholder="YouTube channel"
                disabled={!isEditing}
              />
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="font-semibold mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Account Type</span>
              <Badge variant="outline">Influencer</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Profile Visibility</span>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                Public
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Verification Status</span>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
              >
                Verified
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
