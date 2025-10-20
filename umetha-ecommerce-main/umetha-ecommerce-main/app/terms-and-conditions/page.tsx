import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TermsAndConditions() {
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
      <section className="bg-[#87D3FA] mx-6 mt-1 py-2 rounded-lg">
        <div className="container flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
            <Link href="/">
              <p className="inline-block px-6 py-3 bg-[#000040] text-white font-semibold rounded-lg shadow-md hover:bg-[#350680]">
                Browse The Store
              </p>
            </Link>
          </div>
          <div className="flex-end">
            <Image
              src="/terms-and-conditions.png"
              alt="Terms and Conditions"
              width={300}
              height={200}
             
            />
          </div>
        </div>
      </section>

      {/* Terms and Conditions Text */}
      <section className="container mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-black mb-6">Terms and Conditions</h2>
        <p className="text-sm text-black mb-4">
          Welcome to UMetha! These terms and conditions govern your access to
          and use of our website and services. By accessing or using
          umetha.com, you agree to comply with and be bound by these terms. If
          you disagree with any part of these terms, please discontinue use of
          our website and services.
        </p>
        <ol className="list-decimal list-inside space-y-4 text-sm text-black">
          <li>
            <strong>Account Registration</strong>
            <p>
              To access certain features or make purchases, you may be required
              to create an account. You agree to provide accurate and complete
              information and update it as necessary. You are responsible for
              safeguarding your account credentials and any activities conducted
              under your account. Notify us immediately of any unauthorized
              access or security breach.
            </p>
          </li>
          <li>
            <strong>Use of Services</strong>
            <p>
              Our platform is designed to enable browsing, purchasing products,
              and interacting with our community. You agree to use our services
              solely for lawful purposes and in accordance with all applicable
              laws and regulations. Prohibited activities include, but are not
              limited to: engaging in fraudulent or deceptive practices,
              transmitting harmful software, or infringing upon the rights of
              others.
            </p>
          </li>
          <li>
            <strong>Product Information and Availability</strong>
            <p>
              We strive to provide accurate product information, including
              descriptions, pricing, and availability. However, we do not
              guarantee that all information is current or free from errors. We
              reserve the right to correct any inaccuracies or omissions. Product
              images are for illustrative purposes and may not always match the
              actual appearance or features of products due to factors like
              variations in monitor display or product updates.
            </p>
          </li>
          <li>
            <strong>Orders and Payments</strong>
            <p>
              By placing an order, you are making an offer to purchase products or
              services from UMetha. We reserve the right to accept or decline any
              order at our discretion. All prices, taxes, shipping costs, and
              payment methods will be communicated at checkout. By completing
              payment, you agree to the specified terms for your order. If any
              issues arise with your payment or order, we will reach out to you
              promptly to discuss resolution.
            </p>
          </li>
          <li>
            <strong>Shipping and Delivery</strong>
            <p>
              We strive to process and ship orders efficiently, but delivery times
              may vary due to factors outside our control, including location,
              shipping service, and unforeseen delays. Accurate shipping details
              must be provided at checkout. UMetha is not liable for delays or
              delivery issues resulting from incorrect or incomplete addresses.
            </p>
          </li>
          <li>
            <strong>Returns and Refunds</strong>
            <p>
              Returns and refunds are handled per our Return Policy, which
              outlines the process for product returns, exchanges, and refunds.
              We encourage you to review this policy prior to completing a
              purchase to understand your rights and obligations. Return
              eligibility, assessment, and approval are determined on a
              case-by-case basis. Contact our support team at info@umetha.com for
              assistance with returns.
            </p>
          </li>
          <li>
            <strong>Intellectual Property</strong>
            <p>
              All content, trademarks, logos, images, and intellectual property
              displayed on umetha.com are owned by UMetha or our licensors.
              Unauthorized use, reproduction, or distribution of our content is
              prohibited. User-generated content, including comments and reviews,
              must comply with our content guidelines. We reserve the right to
              moderate, modify, or remove content that violates our policies or
              infringes upon the rights of others.
            </p>
          </li>
          <li>
            <strong>Limitation of Liability</strong>
            <p>
              To the extent permitted by law, UMetha disclaims all warranties,
              expressed or implied, related to your use of our platform and
              services. We are not liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from your use or
              inability to use our website.
            </p>
          </li>
          <li>
            <strong>Governing Law and Dispute Resolution</strong>
            <p>
              These terms and conditions are governed by the laws of South Africa.
              Any disputes or claims arising from or in connection with these
              terms will be resolved in accordance with South African arbitration
              or mediation rules, as applicable.
            </p>
          </li>
          <li>
            <strong>Modifications to Terms</strong>
            <p>
              UMetha reserves the right to modify or update these terms and
              conditions at any time. Changes will take effect upon posting on
              our website. We encourage users to review these terms periodically
              for any updates.
            </p>
          </li>
        </ol>
        <p className="text-sm text-black mt-6">
          By using our platform, you agree to adhere to these terms and
          conditions. For any questions or concerns, please reach out to us at{" "}
          <a
            href="mailto:info@umetha.com"
            className="text-[#00aafa] hover:underline"
          >
            info@umetha.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
