"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, DollarSign, TrendingUp, LinkIcon, Copy, Share2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/main-layout"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "@/components/ui/chart"

const affiliateData = {
  earnings: {
    total: 12580,
    thisMonth: 2340,
    lastMonth: 1980,
  },
  referrals: {
    total: 156,
    thisMonth: 28,
    lastMonth: 22,
  },
  commissionRate: 10, // percentage
  payoutThreshold: 1000,
  nextPayout: "2023-04-15",
}

const monthlyData = [
  { month: "Jan", earnings: 1200, referrals: 15 },
  { month: "Feb", earnings: 1500, referrals: 18 },
  { month: "Mar", earnings: 1800, referrals: 22 },
  { month: "Apr", earnings: 1400, referrals: 17 },
  { month: "May", earnings: 2100, referrals: 25 },
  { month: "Jun", earnings: 1900, referrals: 23 },
  { month: "Jul", earnings: 2300, referrals: 28 },
  { month: "Aug", earnings: 2500, referrals: 30 },
  { month: "Sep", earnings: 2200, referrals: 26 },
  { month: "Oct", earnings: 2400, referrals: 29 },
  { month: "Nov", earnings: 2000, referrals: 24 },
  { month: "Dec", earnings: 2340, referrals: 28 },
]

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false)
  const affiliateLink = "https://umetha.com/ref/user123"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
        <p className="text-muted-foreground">Track your earnings, referrals, and manage your affiliate account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">₹{affiliateData.earnings.total.toLocaleString()}</span>
              <span className="ml-2 text-sm text-green-500">+18%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ₹{affiliateData.earnings.thisMonth.toLocaleString()} this month
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <DollarSign className="h-8 w-8 text-primary/20" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{affiliateData.referrals.total}</span>
              <span className="ml-2 text-sm text-green-500">+27%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{affiliateData.referrals.thisMonth} this month</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Users className="h-8 w-8 text-primary/20" />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{affiliateData.commissionRate}%</span>
              <span className="ml-2 text-sm text-green-500">Standard</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Earn up to 15% with higher tiers</p>
          </CardContent>
          <CardFooter className="pt-0">
            <TrendingUp className="h-8 w-8 text-primary/20" />
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Your earnings and referrals over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="earnings">
                <TabsList className="mb-4">
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="referrals">Referrals</TabsTrigger>
                </TabsList>

                <TabsContent value="earnings" className="h-[300px]">
                  <ChartContainer>
                    <Chart>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartBar data={monthlyData} x="month" y="earnings" color="var(--chart-primary)" />
                      <ChartXAxis />
                      <ChartYAxis />
                    </Chart>
                  </ChartContainer>
                </TabsContent>

                <TabsContent value="referrals" className="h-[300px]">
                  <ChartContainer>
                    <Chart>
                      <ChartTooltip>
                        <ChartTooltipContent />
                      </ChartTooltip>
                      <ChartBar data={monthlyData} x="month" y="referrals" color="var(--chart-blue)" />
                      <ChartXAxis />
                      <ChartYAxis />
                    </Chart>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Affiliate Link</CardTitle>
              <CardDescription>Share this link to earn commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Input value={affiliateLink} readOnly />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Generate Custom Link
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share on Social Media
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Next Payout</CardTitle>
              <CardDescription>When you'll receive your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">₹{affiliateData.earnings.thisMonth.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payout Threshold</p>
                  <p className="text-lg font-medium">₹{affiliateData.payoutThreshold.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Estimated Payout Date</p>
                  <p className="text-lg font-medium">April 15, 2023</p>
                </div>

                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (affiliateData.earnings.thisMonth / affiliateData.payoutThreshold) * 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  ₹{affiliateData.earnings.thisMonth.toLocaleString()} of ₹
                  {affiliateData.payoutThreshold.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products that generate the most commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Referrals</th>
                    <th className="text-left py-3 px-4 font-medium">Earnings</th>
                    <th className="text-left py-3 px-4 font-medium">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      name: "Premium Cotton Shirt",
                      category: "Western Wear",
                      referrals: 42,
                      earnings: 3780,
                      conversion: 8.5,
                    },
                    {
                      id: 2,
                      name: "Designer Handbag",
                      category: "Accessories",
                      referrals: 36,
                      earnings: 5400,
                      conversion: 7.2,
                    },
                    {
                      id: 3,
                      name: "Luxury Watch",
                      category: "Watches",
                      referrals: 28,
                      earnings: 8400,
                      conversion: 6.3,
                    },
                    {
                      id: 4,
                      name: "Silk Saree",
                      category: "Traditional Wear",
                      referrals: 22,
                      earnings: 4400,
                      conversion: 5.8,
                    },
                    {
                      id: 5,
                      name: "Wireless Earbuds",
                      category: "Electronics",
                      referrals: 18,
                      earnings: 2700,
                      conversion: 4.9,
                    },
                  ].map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.referrals}</td>
                      <td className="py-3 px-4">₹{product.earnings.toLocaleString()}</td>
                      <td className="py-3 px-4">{product.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Tiers</CardTitle>
            <CardDescription>Earn higher rates as you refer more</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { tier: "Bronze", rate: "10%", requirement: "0-50 referrals", current: true },
                { tier: "Silver", rate: "12%", requirement: "51-100 referrals" },
                { tier: "Gold", rate: "13%", requirement: "101-200 referrals" },
                { tier: "Platinum", rate: "15%", requirement: "201+ referrals" },
              ].map((tier, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${tier.current ? "bg-primary/5 border-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tier.tier} Tier</p>
                      <p className="text-sm text-muted-foreground">{tier.requirement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{tier.rate}</p>
                      <p className="text-xs text-muted-foreground">Commission</p>
                    </div>
                  </div>
                  {tier.current && <p className="text-xs text-primary mt-2">Your current tier</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Resources</CardTitle>
            <CardDescription>Tools to help you promote products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Banner Ads",
                  description: "Ready-to-use banner images",
                  icon: (
                    <Image
                      className="h-8 w-8"
                      src="/placeholder.svg?height=32&width=32"
                      alt="Banner ads"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  title: "Product Images",
                  description: "High-quality product photos",
                  icon: (
                    <Image
                      className="h-8 w-8"
                      src="/placeholder.svg?height=32&width=32"
                      alt="Product images"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  title: "Email Templates",
                  description: "Pre-written email campaigns",
                  icon: (
                    <Image
                      className="h-8 w-8"
                      src="/placeholder.svg?height=32&width=32"
                      alt="Email templates"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  title: "Social Media Kit",
                  description: "Posts and stories templates",
                  icon: (
                    <Image
                      className="h-8 w-8"
                      src="/placeholder.svg?height=32&width=32"
                      alt="Social media kit"
                      width={32}
                      height={32}
                    />
                  ),
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-3">
                    {resource.icon}
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-4">Access Resource Center</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

