"use client";

import { motion } from "framer-motion";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Heart,
  Zap,
  Globe,
  Award,
  Coffee,
  Laptop,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const openPositions = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Remote / Santa Monica, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    description: "Join our engineering team to build the future of e-commerce with cutting-edge technologies.",
    requirements: ["5+ years experience", "React/Next.js", "Node.js", "TypeScript"],
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Remote / Santa Monica, CA",
    type: "Full-time",
    salary: "$100k - $150k",
    description: "Create stunning user experiences that delight our customers and drive growth.",
    requirements: ["3+ years experience", "Figma", "Design Systems", "User Research"],
  },
  {
    id: 3,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Santa Monica, CA",
    type: "Full-time",
    salary: "$90k - $130k",
    description: "Lead our marketing initiatives and help us reach millions of fashion enthusiasts worldwide.",
    requirements: ["4+ years experience", "Digital Marketing", "Analytics", "Content Strategy"],
  },
  {
    id: 4,
    title: "Customer Success Specialist",
    department: "Customer Support",
    location: "Remote",
    type: "Full-time",
    salary: "$50k - $70k",
    description: "Be the voice of our customers and help them have the best shopping experience possible.",
    requirements: ["2+ years experience", "Customer Service", "Communication", "Problem Solving"],
  },
  {
    id: 5,
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote / Santa Monica, CA",
    type: "Full-time",
    salary: "$80k - $120k",
    description: "Turn data into insights that drive our business decisions and product strategy.",
    requirements: ["3+ years experience", "SQL", "Python/R", "Data Visualization"],
  },
  {
    id: 6,
    title: "Influencer Partnership Manager",
    department: "Partnerships",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Build and nurture relationships with influencers to expand our brand reach.",
    requirements: ["2+ years experience", "Influencer Marketing", "Negotiation", "Social Media"],
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health, dental, and vision insurance for you and your family.",
  },
  {
    icon: Coffee,
    title: "Flexible Work",
    description: "Remote-first culture with flexible hours and unlimited PTO.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Professional development budget and clear career progression paths.",
  },
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Industry-leading compensation packages with equity options.",
  },
  {
    icon: Laptop,
    title: "Latest Equipment",
    description: "Top-of-the-line laptop and equipment to help you do your best work.",
  },
  {
    icon: Globe,
    title: "Work from Anywhere",
    description: "Work remotely from anywhere in the world with our distributed team.",
  },
  {
    icon: Users,
    title: "Amazing Team",
    description: "Collaborate with talented, passionate people who love what they do.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Regular recognition programs and performance bonuses.",
  },
];

const values = [
  {
    title: "Customer Obsession",
    description: "We put our customers at the center of everything we do.",
  },
  {
    title: "Innovation",
    description: "We embrace new ideas and technologies to stay ahead.",
  },
  {
    title: "Integrity",
    description: "We operate with honesty, transparency, and accountability.",
  },
  {
    title: "Collaboration",
    description: "We work together to achieve extraordinary results.",
  },
];

export default function CareersPage() {
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
              <Briefcase className="h-3 w-3 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
              Build the Future of Fashion E-Commerce
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Join a team of passionate innovators transforming how people shop for fashion online
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Learn About Our Culture
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Team Members", value: "150+" },
              { label: "Countries", value: "25+" },
              { label: "Open Positions", value: openPositions.length.toString() },
              { label: "Employee Satisfaction", value: "98%" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-violet-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-gray-900 dark:text-white">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perks & Benefits
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We invest in our team because they're our most valuable asset
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-indigo-100 dark:border-violet-900/40 hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find your perfect role and start making an impact
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-5xl mx-auto">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-indigo-100 dark:border-violet-900/40 hover:shadow-xl transition-all hover:border-indigo-300 dark:hover:border-violet-700">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-gray-900 dark:text-white mb-2">
                          {position.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {position.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                        {position.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                        <span className="text-sm">{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                        <span className="text-sm">{position.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4 text-indigo-600 dark:text-violet-400" />
                        <span className="text-sm">{position.salary}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Requirements:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {position.requirements.map((req, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-indigo-200 text-indigo-700 dark:border-violet-800 dark:text-violet-300"
                          >
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Zap className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-6">
              Don't See the Perfect Role?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Send Us Your Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

