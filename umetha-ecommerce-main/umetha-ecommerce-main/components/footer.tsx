"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// Adjusted FooterLink component spacing
const FooterLink = ({ href, labelKey }: { href: string; labelKey: string }) => {
  const { t } = useTranslation();
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
        {t(labelKey)}
      </Link>
    </li>
  );
};

export default function Footer() {
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

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
        {/* Main Grid Layout - Reduced vertical gap and bottom margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8 mb-8">
         
          <div className="xl:col-span-1">
            <Image
              src="/Logo.png"
              alt="UMetha"
              width={140}
              height={30}
              className="mx-2 my-2 mt-0 mb-2"
            />
           
            <div className="flex mt-2 mb-2">
                {/* Theme Toggle */}
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

          {/* Quick Links Columns - Adjusted margins */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              {t('homepage.shop')}
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/new-arrivals" labelKey="footer.new_arrivals" />
              <FooterLink href="/bestsellers" labelKey="footer.best_sellers" />
              <FooterLink href="/category/bargains" labelKey="footer.sale" />
              <FooterLink href="/category/fashion/men" labelKey="footer.men" />
              <FooterLink href="/category/fashion/women" labelKey="footer.women" />
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              {t('homepage.about')}
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about" labelKey="footer.our_story" />
              <FooterLink href="/blog" labelKey="footer.blog" />
              <FooterLink href="/careers" labelKey="footer.careers" />
              <FooterLink href="/press" labelKey="footer.press" />
            </ul>
          </div>

          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              {t('homepage.help')}
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/faqs" labelKey="footer.faqs" />
              <FooterLink href="/shipping" labelKey="footer.shipping" />
              <FooterLink href="/returns" labelKey="footer.returns" />
              <FooterLink href="/privacy-policy" labelKey="footer.privacy_policy" />
              <FooterLink href="/terms-and-conditions" labelKey="footer.terms_and_conditions"/>
               
              
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-semibold text-indigo-800 dark:text-violet-200 mb-3">
              {t('homepage.contact_us')}
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

      {/* footer's second section */}
      <div className="border-t border-indigo-100 dark:border-violet-900/30 py-2">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Payment Methods */}
            <div className="w-full md:w-auto">
              <h3 className="text-base text-center md:text-left font-semibold text-indigo-800 dark:text-violet-200 mb-3">
                {t('homepage.secure_payment_options')}
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

            {/* Social Media */}
            <div className="w-full md:w-auto">
              <h3 className="text-base text-center md:text-left font-semibold text-indigo-800 dark:text-violet-200 mb-3">
                {t('homepage.follow_us')}
              </h3>
              <motion.div
                className="flex items-center justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Facebook Button */}
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md shadow-gray-200 dark:shadow-black/30 group transition-all duration-300"
                >
                  <svg
                    className="transition-all duration-300 group-hover:scale-110"
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 72 72"
                    fill="none"
                  >
                    <path
                      d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z"
                      fill="#337FFF"
                    />
                  </svg>
                </motion.a>

                {/* Instagram Button */}
                <motion.a
                  href="https://instagram.com/umetha24/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md shadow-gray-200 dark:shadow-black/30 group transition-all duration-300"
                >
                  <svg
                    className="transition-all duration-300 group-hover:scale-110"
                    width="28"
                    height="28"
                    viewBox="0 0 72 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint0_radial_7092_54471)"/>
                    <path d="M27.4456 35.7808C27.4456 31.1786 31.1776 27.4468 35.7826 27.4468C40.3875 27.4468 44.1216 31.1786 44.1216 35.7808C44.1216 40.383 40.3875 44.1148 35.7826 44.1148C31.1776 44.1148 27.4456 40.383 27.4456 35.7808ZM22.9377 35.7808C22.9377 42.8708 28.6883 48.618 35.7826 48.618C42.8768 48.618 48.6275 42.8708 48.6275 35.7808C48.6275 28.6908 42.8768 22.9436 35.7826 22.9436C28.6883 22.9436 22.9377 28.6908 22.9377 35.7808ZM46.1342 22.4346C46.1339 23.0279 46.3098 23.608 46.6394 24.1015C46.9691 24.595 47.4377 24.9797 47.9861 25.2069C48.5346 25.4342 49.1381 25.4939 49.7204 25.3784C50.3028 25.2628 50.8378 24.9773 51.2577 24.5579C51.6777 24.1385 51.9638 23.6041 52.0799 23.0222C52.1959 22.4403 52.1367 21.8371 51.9097 21.2888C51.6828 20.7406 51.2982 20.2719 50.8047 19.942C50.3112 19.6122 49.7309 19.436 49.1372 19.4358H49.136C48.3402 19.4361 47.5771 19.7522 47.0142 20.3144C46.4514 20.8767 46.1349 21.6392 46.1342 22.4346ZM25.6765 56.1302C23.2377 56.0192 21.9121 55.6132 21.0311 55.2702C19.8632 54.8158 19.0299 54.2746 18.1538 53.4002C17.2777 52.5258 16.7354 51.6938 16.2827 50.5266C15.9393 49.6466 15.533 48.3214 15.4222 45.884C15.3009 43.2488 15.2767 42.4572 15.2767 35.781C15.2767 29.1048 15.3029 28.3154 15.4222 25.678C15.5332 23.2406 15.9425 21.918 16.2827 21.0354C16.7374 19.8682 17.2789 19.0354 18.1538 18.1598C19.0287 17.2842 19.8612 16.7422 21.0311 16.2898C21.9117 15.9466 23.2377 15.5406 25.6765 15.4298C28.3133 15.3086 29.1054 15.2844 35.7826 15.2844C42.4598 15.2844 43.2527 15.3106 45.8916 15.4298C48.3305 15.5408 49.6539 15.9498 50.537 16.2898C51.7049 16.7422 52.5382 17.2854 53.4144 18.1598C54.2905 19.0342 54.8308 19.8682 55.2855 21.0354C55.6289 21.9154 56.0351 23.2406 56.146 25.678C56.2673 28.3154 56.2915 29.1048 56.2915 35.781C56.2915 42.4572 56.2673 43.2466 56.146 45.884C56.0349 48.3214 55.6267 49.6462 55.2855 50.5266C54.8308 51.6938 54.2893 52.5266 53.4144 53.4002C52.5394 54.2738 51.7049 54.8158 50.537 55.2702C49.6565 55.6134 48.3305 56.0194 45.8916 56.1302C43.2549 56.2514 42.4628 56.2756 35.7826 56.2756C29.1024 56.2756 28.3125 56.2514 25.6765 56.1302ZM25.4694 10.9322C22.8064 11.0534 20.9867 11.4754 19.3976 12.0934C17.7518 12.7316 16.3585 13.5878 14.9663 14.977C13.5741 16.3662 12.7195 17.7608 12.081 19.4056C11.4626 20.9948 11.0403 22.8124 10.9191 25.4738C10.7958 28.1394 10.7676 28.9916 10.7676 35.7808C10.7676 42.57 10.7958 43.4222 10.9191 46.0878C11.0403 48.7494 11.4626 50.5668 12.081 52.156C12.7195 53.7998 13.5743 55.196 14.9663 56.5846C16.3583 57.9732 17.7518 58.8282 19.3976 59.4682C20.9897 60.0862 22.8064 60.5082 25.4694 60.6294C28.138 60.7506 28.9893 60.7808 35.7826 60.7808C42.5759 60.7808 43.4286 60.7526 46.0958 60.6294C48.759 60.5082 50.5774 60.0862 52.1676 59.4682C53.8124 58.8282 55.2066 57.9738 56.5989 56.5846C57.9911 55.1954 58.8438 53.7998 59.4842 52.156C60.1026 50.5668 60.5268 48.7492 60.6461 46.0878C60.7674 43.4202 60.7956 42.57 60.7956 35.7808C60.7956 28.9916 60.7674 28.1394 60.6461 25.4738C60.5248 22.8122 60.1026 20.9938 59.4842 19.4056C58.8438 17.7618 57.9889 16.3684 56.5989 14.977C55.2088 13.5856 53.8124 12.7316 52.1696 12.0934C50.5775 11.4754 48.7588 11.0514 46.0978 10.9322C43.4306 10.811 42.5779 10.7808 35.7846 10.7808C28.9913 10.7808 28.138 10.809 25.4694 10.9322Z" fill="url(#paint1_radial_7092_54471)"/>
                    <defs>
                      <radialGradient id="paint0_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.4144 61.017) scale(65.31 65.2708)">
                        <stop offset="0.09" stopColor="#FA8F21"/>
                        <stop offset="0.78" stopColor="#D82D7E"/>
                      </radialGradient>
                      <radialGradient id="paint1_radial_7092_54471" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41.1086 63.257) scale(51.4733 51.4424)">
                        <stop offset="0.64" stopColor="#8C3AAA" stopOpacity="0" />
                        <stop offset="1" stopColor="#8C3AAA" />
                      </radialGradient>
                    </defs>
                  </svg>
                </motion.a>

                {/* Twitter Button */}
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-md shadow-gray-200 dark:shadow-black/30 group transition-all duration-300"
                >
                  <svg className="transition-all duration-300 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 72 72" fill="none">
                    <path d="M40.7568 32.1716L59.3704 11H54.9596L38.7974 29.383L25.8887 11H11L30.5205 38.7983L11 61H15.4111L32.4788 41.5869L46.1113 61H61L40.7557 32.1716H40.7568ZM34.7152 39.0433L32.7374 36.2752L17.0005 14.2492H23.7756L36.4755 32.0249L38.4533 34.7929L54.9617 57.8986H48.1865L34.7152 39.0443V39.0433Z" fill="black"/>
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* footer's third section */}
      <div className="flex items-center justify-center border-t border-indigo-100 dark:border-violet-900/30 py-2">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center justify-center">
            <p className="text-indigo-600/80 dark:text-violet-400/80 text-center">
                © {year} UMetha. {t('homepage.all_rights_reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
