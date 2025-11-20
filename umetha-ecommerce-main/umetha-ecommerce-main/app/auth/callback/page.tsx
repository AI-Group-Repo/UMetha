"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from 'react-i18next';
export default function AuthCallbackPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Ensure profile exists for OAuth users
          const user = data.session.user;
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          // Create profile if it doesn't exist
          if (!profile || profileError) {
            await supabase.from("profiles").upsert({
              id: user.id,
              email: user.email,
              role: "USER",
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
              first_name: user.user_metadata?.given_name || "",
              last_name: user.user_metadata?.family_name || "",
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }

          toast({
            title: t("authentication_successful"),
            description: "Welcome to UMetha!",
          });
          router.push("/");
        } else {
          toast({
            title: t("authentication_failed"),
            description: "Unable to complete the authentication process",
            variant: "destructive",
          });
          router.push("/signin");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast({
          title: t("authentication_error"),
          description: "An error occurred during the authentication process.",
          variant: "destructive",
        });
        router.push("/signin");
      }
    };

    handleOAuthCallback();
  }, [router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("completing_authentication")}
        </h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          {t("please_wait_while_we_process_your_sign_in")}
        </p>
      </div>
    </div>
  );
}
