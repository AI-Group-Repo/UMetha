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
            <h1 className="text-4xl font-bold mb-4">Return Policy</h1>
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

      {/* Returns Text */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-black mb-6">Return Policy</h2>
        <p className="text-sm text-black mb-4">
          We want you to be completely satisfied with your purchase. If, for
          any reason, you are not happy, please review our return policy:
        </p>
        <ul className="list-disc list-inside space-y-4 text-sm text-black">
          <li>
            <strong>Return Eligibility:</strong> To be eligible for a return, the
            item must be unused, in its original packaging, and in the same
            condition you received it.
          </li>
          <li>
            <strong>Return Window:</strong> You can request a return within 14
            days from the date of delivery.
          </li>
          <li>
            <strong>Assessment on Merit:</strong> Each return request will be
            assessed individually, considering the nature of the purchase and the
            claim details.
          </li>
          <li>
            <strong>Refunds and Exchanges:</strong> Upon approval of your return,
            you may choose between a refund, exchange, or store credit. Refunds
            will be processed within 5-7 business days of return approval.
          </li>
        </ul>
        <p className="text-sm text-black mt-6">
          For further details or to initiate a return, please contact our support
          team at{" "}
          <a
            href="mailto:support@umetha.com"
            className="text-[#00aafa] hover:underline"
          >
            support@umetha.com
          </a>
          .
        </p>
        <p className="text-sm text-black mt-4">
          <strong>Note:</strong> Return shipping fees may apply unless the return
          is due to a product defect or an error on our part.
        </p>
      </section>
    </div>
  );
}
