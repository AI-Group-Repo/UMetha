import { Suspense } from "react";
import MainLayout from "@/components/main-layout";
import DealsOfTheDay from "@/components/deals-of-the-day";
import PromoBanner from "@/components/promo-banner";
import Suggestions from "@/components/suggestions";
import PromoGrid from "@/components/promo-grid";
import AiChatBot from "@/components/ai-chat-bot";
import BestSellers from "@/components/best-sellers";

export default function Home() {
  return (
    <MainLayout>
      {/* Promo banner with increased negative margins to make it wider */}
      <div className="px-2 md:px-6 -mx-4 md:-mx-8 lg:-mx-12 mb-6">
        <PromoBanner />
      </div>

      <div className="flex flex-col gap-6">
        <PromoGrid />
        <DealsOfTheDay />
        <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={<div>Loading...</div>}>
            <BestSellers />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <Suggestions />
          </Suspense>
        </div>
      </div>
      <AiChatBot />
    </MainLayout>
  );
}
