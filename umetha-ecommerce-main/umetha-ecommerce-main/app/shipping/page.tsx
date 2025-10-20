import React from "react";
import Image from "next/image";
import Link from "next/link";


export default function Returns() {
  return (
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
            <h1 className="text-4xl font-bold mb-4">Shipping!</h1>
            <Link href="/">
              <p className="inline-block px-6 py-3 bg-[#000040] text-white font-semibold rounded-lg shadow-md hover:bg-[#350680]">
                Browse The Store
              </p>
            </Link>
          </div>
          <div className="flex-end">
            <Image
              src="/umetha-van.png"
              alt="umetha van"
              width={300}
              height={200}
              
            />
          </div>
        </div>
      </section>

      
    </div>
  );
}
