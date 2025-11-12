"use client";

import { motion } from "framer-motion";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Download,
  Mail,
  Trophy,
  TrendingUp,
  Users,
  Package,
  Globe,
  ArrowRight,
  ExternalLink,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const pressReleases = [
  {
    id: 1,
    title: "UMetha Raises $50M Series B to Revolutionize Fashion E-Commerce",
    date: "January 15, 2025",
    category: "Funding",
    excerpt: "Leading investors back our vision to transform online shopping with AI-powered virtual try-on technology.",
    link: "#",
  },
  {
    id: 2,
    title: "UMetha Partners with 1000+ Influencers Worldwide",
    date: "December 10, 2024",
    category: "Partnership",
    excerpt: "Expanding our influencer marketplace to connect brands with authentic voices across the globe.",
    link: "#",
  },
  {
    id: 3,
    title: "Virtual Try-On Technology Reaches 1 Million Users",
    date: "November 20, 2024",
    category: "Milestone",
    excerpt: "Our innovative AR technology helps customers make confident purchase decisions from home.",
    link: "#",
  },
  {
    id: 4,
    title: "UMetha Launches Multi-Currency Cryptocurrency Payment",
    date: "October 5, 2024",
    category: "Product",
    excerpt: "Now accepting Bitcoin, Ethereum, and other cryptocurrencies through Coinbase integration.",
    link: "#",
  },
];

const mediaFeatures = [
  {
    outlet: "TechCrunch",
    title: "How UMetha is Disrupting the $2T Fashion Industry",
    date: "January 2025",
    logo: "/tech-logo.png",
    link: "#",
  },
  {
    outlet: "Forbes",
    title: "UMetha Named Top E-Commerce Startup to Watch",
    date: "December 2024",
    logo: "/forbes-logo.png",
    link: "#",
  },
  {
    outlet: "Vogue Business",
    title: "The Future of Online Fashion Shopping is Here",
    date: "November 2024",
    logo: "/vogue-logo.png",
    link: "#",
  },
  {
    outlet: "The Wall Street Journal",
    title: "Virtual Try-On Tech Reduces Returns by 40%",
    date: "October 2024",
    logo: "/wsj-logo.png",
    link: "#",
  },
];

const stats = [
  { label: "Global Customers", value: "2M+", icon: Users },
  { label: "Partner Brands", value: "500+", icon: Package },
  { label: "Countries Served", value: "150+", icon: Globe },
  { label: "Revenue Growth", value: "300%", icon: TrendingUp },
];

const awards = [
  {
    title: "Best E-Commerce Innovation 2024",
    organization: "Tech Innovation Awards",
    year: "2024",
  },
  {
    title: "Top 50 Startups to Watch",
    organization: "Forbes",
    year: "2024",
  },
  {
    title: "Excellence in Customer Experience",
    organization: "Retail Excellence Awards",
    year: "2024",
  },
  {
    title: "Sustainable Business Leader",
    organization: "Green Commerce Initiative",
    year: "2023",
  },
];

const mediaKit = [
  {
    title: "Brand Guidelines",
    description: "Logo usage, color palette, and brand assets",
    icon: FileText,
    fileSize: "2.5 MB",
  },
  {
    title: "High-Res Logos",
    description: "PNG, SVG, and vector formats",
    icon: ImageIcon,
    fileSize: "1.8 MB",
  },
  {
    title: "Product Images",
    description: "Marketing and promotional imagery",
    icon: ImageIcon,
    fileSize: "15 MB",
  },
  {
    title: "Company Fact Sheet",
    description: "Key facts, figures, and milestones",
    icon: FileText,
    fileSize: "500 KB",
  },
  {
    title: "Executive Bios",
    description: "Leadership team backgrounds",
    icon: FileText,
    fileSize: "800 KB",
  },
  {
    title: "Demo Videos",
    description: "Product demonstrations and features",
    icon: Video,
    fileSize: "50 MB",
  },
];

export default function PressPage() {
  return (
    <MainLayout hideShopCategory={true} hideFittingRoom={true}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Newspaper className="h-3 w-3 mr-1" />
              Press & Media
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
              UMetha in the News
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              The latest news, updates, and media coverage from UMetha
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => document.getElementById('press-releases')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Latest News
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => document.getElementById('media-kit')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Download Media Kit
                <Download className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-indigo-600 dark:text-violet-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section id="press-releases" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Press Releases
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stay up to date with our latest announcements and milestones
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-indigo-100 dark:border-violet-900/40 hover:shadow-xl transition-all hover:border-indigo-300 dark:hover:border-violet-700">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Badge className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                        {release.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {release.date}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {release.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {release.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="border-indigo-200 text-indigo-600 dark:border-violet-800 dark:text-violet-400"
                    >
                      Read Full Story
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured In
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what leading publications are saying about UMetha
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mediaFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Newspaper className="h-6 w-6 text-indigo-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {feature.outlet}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {feature.date}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-indigo-600 dark:text-violet-400"
                    >
                      Read Article
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Honored to be recognized by industry leaders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-indigo-100 dark:border-violet-900/40 text-center">
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {award.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {award.organization}
                    </p>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400">
                      {award.year}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section id="media-kit" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Media Kit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Download our brand assets, logos, and press materials
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mediaKit.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-gray-900 dark:text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.fileSize}
                      </span>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Mail className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">
              Press Inquiries
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              For media inquiries, interviews, or additional information, please contact our press team.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <p className="text-lg mb-2">
                <strong>Email:</strong> press@umetha.com
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Contact Press Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

