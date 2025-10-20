import React from "react";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/main-layout";
export default function Returns() {
  return (
    <MainLayout hideFittingRoom hideRoomVisualizer hideShopCategory>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-start">
          <Link href="/">
            <Image src="/Logo.png" alt="UMetha Logo" width={160} height={40} />
          </Link>
        </div>
      </header>

      {/* Banner Section */}
      <section className="bg-[#87D3FA]  mx-6 mt-1 py-2 rounded-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-4">Learn More About UMetha!</h1>
            <Link href="/">
              <p className="inline-block px-6 py-3 bg-[#000040] text-white font-semibold rounded-lg shadow-md hover:bg-[#350680]">
                Browse The Store
              </p>
            </Link>
          </div>
          <div className="flex-end">
            <Image
              src="/about.png"
              alt="Return Policy"
              width={300}
              height={200}
              
            />
          </div>
        </div>
      </section>

      {/* about Text */}
      <section className="container mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">About UMetha</h2>
        <p className="text-lg text-black mb-4 px-8">
        UMetha is a global e-commerce platform connecting customers with premium products from
        carefully selected suppliers worldwide. Owned by All Things Ads and Ultimate Holdings,
        the latter being an esteemed investment firm with nearly $700 million in capital raised on
        behalf of its clients, UMetha leverages industry-leading insights and experience to deliver
        quality and value.
        Our team at UMetha is committed to excellence, drawing on extensive research and
        expertise honed from years of experience in global commerce. Our approach is rooted in a
        deep understanding of product quality, market trends, and customer needs.
        UMetha’s Leadership comes from it’s parent entity, and can be found here: All Things Ads – Leadership
        </p>
        
      </section>
    </div>
    </MainLayout>
    
  );
}
