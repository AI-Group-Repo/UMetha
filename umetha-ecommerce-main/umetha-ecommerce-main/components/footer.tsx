"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  MapPin,
  Phone,
  Mail,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Footer link component (plain text version)
const FooterLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-indigo-600 dark:text-violet-300 hover:text-indigo-800 
                 dark:hover:text-violet-100 transition-colors flex items-center group py-0.5"
      >
        <ChevronRight
          className="h-3 w-3 text-indigo-400 dark:text-violet-500 mr-1.5 
                               transition-transform group-hover:translate-x-1"
        />
        {label}
      </Link>
    </li>
  );
};

export default function Footer() {
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/40 pt-8 border-t border-indigo-100 dark:border-violet-900/30">
      <div className="container mx-auto px-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8 mb-8">
          {/* Logo + Theme toggle */}
          <div className="xl:col-span-1">
            <Image
              src="/Logo.png"
              alt="UMetha"
              width={140}
              height={30}
              className="mx-2 my-2 mt-0 mb-2"
            />
            <div className="flex mt-2 mb-2">
              <motion.div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="mx-4 rounded-full border border-indigo-200 dark:border-violet-800/50 bg-white/80 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-violet-900/30"
                >
                  {theme === "light" ? (
                    <Moon size={18} className="text-indigo-600" />
                  ) : (
                    <Sun size={18} className="text-violet-400" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              Shop
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/new-arrivals" label="New Arrivals" />
              <FooterLink href="/bestsellers" label="Best Sellers" />
              <FooterLink href="/category/bargains" label="Sale" />
              <FooterLink href="/category/fashion/men" label="Men" />
              <FooterLink href="/category/fashion/women" label="Women" />
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              About
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about" label="Our Story" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/careers" label="Careers" />
              <FooterLink href="/press" label="Press" />
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              Help
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/faqs" label="FAQs" />
              <FooterLink href="/shipping" label="Shipping" />
              <FooterLink href="/returns" label="Returns" />
              <FooterLink href="/privacy-policy" label="Privacy Policy" />
              <FooterLink href="/terms-and-conditions" label="Terms & Conditions" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-500 dark:text-violet-400 mt-0.5 shrink-0" />
                <span className="text-sm text-indigo-700 dark:text-violet-300">
                  2150 Colorado Avenue
                  <br />
                  Santa Monica, CA 90404
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-500 dark:text-violet-400 shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="text-sm text-indigo-700 dark:text-violet-300 hover:text-indigo-900"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-500 dark:text-violet-400 shrink-0" />
                <a
                  href="mailto:support@umetha.com"
                  className="text-sm text-indigo-700 dark:text-violet-300 hover:text-indigo-900"
                >
                  support@umetha.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment + Socials */}
      <div className="border-t border-indigo-100 dark:border-violet-900/30 py-2">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Payment Methods */}
            <div className="w-full md:w-auto">
              <h3 className="text-base text-center md:text-left font-semibold text-indigo-800 dark:text-violet-200 mb-3">
                Secure Payment Options
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {[
                  { id: "visa", src: "/visa.svg" },
                  { id: "mastercard", src: "/mastercard.svg" },
                  { id: "paypal", src: "/paypal.svg" },
                  { id: "coinbase", src: "/coinbase.svg" },
                ].map((payment) => (
                  <motion.div
                    key={payment.id}
                    whileHover={{ y: -2 }}
                    className="bg-white dark:bg-indigo-900/40 p-1 rounded-lg"
                  >
                    <Image
                      src={payment.src}
                      alt={`Pay with ${payment.id}`}
                      width={48}
                      height={32}
                      className="h-8 w-auto"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="w-full md:w-auto text-center md:text-left">
              <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
                Follow Us
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href="https://facebook.com" target="_blank" className="text-indigo-600 hover:text-indigo-800 dark:text-violet-300">
                  Facebook
                </Link>
                <Link href="https://instagram.com/umetha24/" target="_blank" className="text-indigo-600 hover:text-indigo-800 dark:text-violet-300">
                  Instagram
                </Link>
                <Link href="https://twitter.com" target="_blank" className="text-indigo-600 hover:text-indigo-800 dark:text-violet-300">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="flex items-center justify-center border-t border-indigo-100 dark:border-violet-900/30 py-2">
        <p className="text-indigo-600/80 dark:text-violet-400/80 text-center">
          © {year} UMetha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
