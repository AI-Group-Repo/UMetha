"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MessageCircle, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

type InfluencerSummary = {
  id: string;
  name: string;
  avatar_url?: string | null;
  store_type: string;
  business_models: string[];
  product_count: number;
  bio?: string | null;
};

const STORE_COLORS: Record<string, string> = {
  "AI Drop Shipping": "bg-blue-600/10 text-blue-600",
  "Direct Marketing": "bg-purple-600/10 text-purple-600",
  "Affiliate Marketing": "bg-emerald-600/10 text-emerald-600",
};

const STORE_DESCRIPTIONS: Record<string, string> = {
  "AI Drop Shipping":
    "AI-powered sourcing, automated fulfillment, zero inventory risk.",
  "Direct Marketing":
    "Influencers manage their own catalog, pricing, and fulfillment.",
  "Affiliate Marketing":
    "Top ClickBank picks with instant commissions and curated funnels.",
};

export default function InfluencerMarketplacePage() {
  const [influencers, setInfluencers] = useState<InfluencerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chattingWith, setChattingWith] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadInfluencers = async () => {
      try {
        const response = await fetch("/api/influencers");
        if (!response.ok) {
          throw new Error("Failed to load influencers");
        }
        const data = await response.json();
        setInfluencers(data.influencers || []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load influencer marketplace right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInfluencers();
  }, []);

  const handleStartChat = async (influencerId: string) => {
    if (!user) {
      toast.error("Sign in to chat with influencers.");
      router.push("/signin");
      return;
    }

    setChattingWith(influencerId);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/chat/create-conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({ influencerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start chat");
      }

      const data = await response.json();
      if (data.conversation?.id) {
        router.push(`/chat/${data.conversation.id}`);
      }
    } catch (error) {
      console.error("Unable to start conversation", error);
      toast.error("Unable to open chat. Please try again.");
    } finally {
      setChattingWith(null);
    }
  };

  const sortedInfluencers = useMemo(
    () =>
      [...influencers].sort((a, b) =>
        b.product_count === a.product_count
          ? a.name.localeCompare(b.name)
          : b.product_count - a.product_count
      ),
    [influencers]
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-8 py-10">
        <div className="space-y-3 text-center">
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            Discover Top Influencer Stores
          </Badge>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Browse Influencer Mini Stores
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every storefront is curated by the influencer who owns it. Browse
            their inventory, chat directly, and purchase securely—buyers can
            shop, influencers manage everything else.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse border-dashed">
                <div className="h-48 w-full rounded-lg bg-muted" />
              </Card>
            ))}
          </div>
        ) : sortedInfluencers.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No influencer stores yet</CardTitle>
              <CardDescription>
                Our team is onboarding new creators. Check back soon for curated
                storefronts.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {sortedInfluencers.map((influencer) => {
              const storeColor =
                STORE_COLORS[influencer.store_type] ||
                "bg-slate-600/10 text-slate-600";
              return (
                <Card
                  key={influencer.id}
                  className="flex flex-col border-indigo-50 shadow-sm"
                >
                  <CardHeader className="flex flex-row items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={influencer.avatar_url ?? undefined} />
                      <AvatarFallback>
                        {influencer.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl">
                          {influencer.name}
                        </CardTitle>
                        <Badge className={storeColor}>
                          {influencer.store_type}
                        </Badge>
                      </div>
                      <CardDescription>
                        {influencer.bio ||
                          STORE_DESCRIPTIONS[influencer.store_type] ||
                          "Exclusive influencer storefront"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Active Products
                        </p>
                        <p className="text-2xl font-semibold">
                          {influencer.product_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Business Models
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {influencer.business_models.length > 0 ? (
                            influencer.business_models.map((model) => (
                              <Badge
                                key={model}
                                variant="outline"
                                className="text-xs"
                              >
                                {model
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Direct marketing
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        asChild
                        className="flex-1"
                        variant="secondary"
                      >
                        <Link href={`/influencer/${influencer.id}/store`}>
                          <Store className="mr-2 h-4 w-4" />
                          View Store
                        </Link>
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleStartChat(influencer.id)}
                        disabled={chattingWith === influencer.id}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {chattingWith === influencer.id
                          ? "Opening Chat..."
                          : "Chat"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Buyers can browse and purchase products. Influencers keep
                      full control over publishing, pricing, and fulfillment.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}


