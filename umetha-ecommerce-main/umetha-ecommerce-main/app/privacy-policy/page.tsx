import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md ">
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <Link href="/">
              <p className="inline-block px-6 py-3 bg-[#000040] text-white font-semibold rounded-lg shadow-md hover:bg-[#350680]">
                Browse The Store
              </p>
            </Link>
          </div>
          <div className="flex-end">
            <Image
              src="/privacy-policy.png"
              alt="Privacy Policy"
              width={300}
              height={200}
             
            />
          </div>
        </div>
      </section>

      {/* Privacy Policy Text */}
      <section className="container mx-auto py-12 px-12">
        <h2 className="text-2xl font-bold text-black mb-6">Privacy Policy</h2>
        <p className="text-sm text-black mb-4">
          Welcome to UMetha. We are committed to protecting your privacy and
          ensuring that your personal information is handled in a safe and
          responsible manner. This Privacy Policy outlines how we collect, use,
          and protect your information.
        </p>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="text-sm text-black mb-4">
          When you visit, register, or make a purchase on our website, we may
          collect the following information:
        </p>
        <ul className="list-disc list-inside text-sm text-black mb-4">
          <li>
            <strong>Personal Information:</strong> Includes your name, email
            address, contact number, shipping and billing address, and payment
            information.
          </li>
          <li>
            <strong>Technical Data:</strong> Information on how you use our
            site, such as IP address, browser type, and device information. This
            helps us improve our services and enhance user experience.
          </li>
          <li>
            <strong>Usage Information:</strong> Information about your activity
            on our website, such as pages visited, items viewed, and purchase
            history.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <p className="text-sm text-black mb-4">
          We may use the information we collect in the following ways:
        </p>
        <ul className="list-disc list-inside text-sm text-black mb-4">
          <li>To process orders and provide customer support.</li>
          <li>To improve our website and services based on customer feedback.</li>
          <li>To send you promotional emails (only if you have opted in).</li>
          <li>To protect against fraud and unauthorized transactions.</li>
        </ul>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          3. Cookies and Tracking Technologies
        </h2>
        <p className="text-sm text-black mb-4">
          We use cookies and similar technologies to enhance your browsing
          experience. Cookies allow us to remember your preferences, personalize
          content, and analyze site traffic. You can choose to disable cookies
          in your browser settings; however, this may affect certain
          functionalities of the website.
        </p>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          4. Sharing Your Information
        </h2>
        <p className="text-sm text-black mb-4">
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties except as necessary to provide services, comply
          with legal obligations, or protect our rights. We may share
          information with:
        </p>
        <ul className="list-disc list-inside text-sm text-black mb-4">
          <li>
            <strong>Service Providers:</strong> Such as payment processors and
            shipping partners, to fulfill your orders.
          </li>
          <li>
            <strong>Third-Party Analytics:</strong> Services like Google
            Analytics to help us understand website usage and improve our
            services.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          5. Security of Your Information
        </h2>
        <p className="text-sm text-black mb-4">
          We implement industry-standard security measures to protect your
          information from unauthorized access, alteration, or disclosure.
          However, please note that no internet transmission is fully secure,
          and we cannot guarantee the absolute security of your information.
        </p>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          6. Your Rights
        </h2>
        <p className="text-sm text-black mb-4">
          Depending on your jurisdiction, you may have the right to:
        </p>
        <ul className="list-disc list-inside text-sm text-black mb-4">
          <li>Access your personal information.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Withdraw consent for data processing (where consent is required).</li>
        </ul>
        <p className="text-sm text-black mb-4">
          To exercise these rights, please contact us at support@umetha.com.
        </p>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          7. Updates to This Policy
        </h2>
        <p className="text-sm text-black mb-4">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. The latest version will
          always be available on this page. We encourage you to review this
          policy periodically.
        </p>

        <h2 className="text-lg font-semibold text-black mt-6 mb-2">
          8. Contact Us
        </h2>
        <p className="text-sm text-black">
          If you have any questions regarding our Privacy Policy or your
          personal information, please contact us at:{" "}
          <a
            href="mailto:support@umetha.com"
            className="text-[#00aafa] hover:underline"
          >
            support@umetha.com
          </a>
        </p>
        <p className="text-sm text-black">support@umetha.com</p>
      </section>
    </div>
  );
}
