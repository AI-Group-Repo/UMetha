import { Collaboration } from "@/components/influencer/collaboration-tracker";

export const sampleCollaborations: Collaboration[] = [
  {
    id: "collab-1",
    brandName: "Luxe Cosmetics",
    brandLogo: "/beauty-banner1.jpeg",
    campaignName: "Summer Glow Collection Launch",
    status: "active",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    budget: 5000,
    spent: 3200,
    targets: {
      sales: 500,
      reach: 100000,
      engagement: 15,
    },
    performance: {
      sales: 320,
      reach: 87500,
      engagement: 12,
    },
    products: [
      {
        id: "prod-1",
        name: "Glow Serum",
        image: "/beauty-banner2.jpeg",
        soldUnits: 180,
        revenue: 5400,
      },
      {
        id: "prod-2",
        name: "Highlighting Powder",
        image: "/beauty-banner3.jpeg",
        soldUnits: 140,
        revenue: 4200,
      },
      {
        id: "prod-3",
        name: "SPF 50 Moisturizer",
        image: "/blend.jpeg",
        soldUnits: 95,
        revenue: 2850,
      },
    ],
    recentActivities: [
      {
        type: "content",
        date: "2025-04-08",
        description:
          "Instagram Reel with Glow Serum posted - 15k views in first 24 hours",
      },
      {
        type: "milestone",
        date: "2025-04-05",
        description: "Campaign reached 50% of sales target",
      },
      {
        type: "payment",
        date: "2025-04-01",
        description: "Second milestone payment of $1,500 processed",
      },
      {
        type: "message",
        date: "2025-03-28",
        description: "Content approval for TikTok campaign",
      },
    ],
  },
  {
    id: "collab-2",
    brandName: "Urban Athletics",
    brandLogo: "/Nike.jpeg",
    campaignName: "Spring Activewear Collection",
    status: "active",
    startDate: "2025-03-01",
    endDate: "2025-04-30",
    budget: 7500,
    spent: 4500,
    targets: {
      sales: 800,
      reach: 250000,
      engagement: 20,
    },
    performance: {
      sales: 580,
      reach: 210000,
      engagement: 18,
    },
    products: [
      {
        id: "prod-4",
        name: "Performance Leggings",
        image: "/fashion-slide2.png",
        soldUnits: 250,
        revenue: 12500,
      },
      {
        id: "prod-5",
        name: "Breathable Tank Top",
        image: "/fashion-slider.png",
        soldUnits: 180,
        revenue: 5400,
      },
      {
        id: "prod-6",
        name: "Lightweight Runners",
        image: "/shoes.jpg",
        soldUnits: 150,
        revenue: 18000,
      },
    ],
    recentActivities: [
      {
        type: "milestone",
        date: "2025-04-09",
        description: "Campaign reached 70% of sales target",
      },
      {
        type: "content",
        date: "2025-04-07",
        description: "YouTube workout video featuring products - 25k views",
      },
      {
        type: "message",
        date: "2025-04-03",
        description: "Discussing potential extension of campaign",
      },
      {
        type: "payment",
        date: "2025-03-15",
        description: "First milestone payment of $3,000 processed",
      },
    ],
  },
  {
    id: "collab-3",
    brandName: "Eco Home",
    brandLogo: "/chair.jpg",
    campaignName: "Sustainable Living Series",
    status: "pending",
    startDate: "2025-05-01",
    endDate: "2025-06-30",
    budget: 4000,
    spent: 0,
    targets: {
      sales: 350,
      reach: 80000,
      engagement: 12,
    },
    performance: {
      sales: 0,
      reach: 0,
      engagement: 0,
    },
    products: [
      {
        id: "prod-7",
        name: "Bamboo Organizer Set",
        image: "/chair.jpeg",
        soldUnits: 0,
        revenue: 0,
      },
      {
        id: "prod-8",
        name: "Recycled Glass Vases",
        image: "/room.webp",
        soldUnits: 0,
        revenue: 0,
      },
    ],
    recentActivities: [
      {
        type: "message",
        date: "2025-04-10",
        description: "Contract received for review",
      },
      {
        type: "message",
        date: "2025-04-05",
        description: "Product samples shipping confirmation",
      },
      {
        type: "message",
        date: "2025-03-29",
        description: "Initial campaign brief and timeline discussion",
      },
    ],
  },
  {
    id: "collab-4",
    brandName: "Luxury Lane",
    brandLogo: "/Gucci.jpg",
    campaignName: "Spring Accessories Collection",
    status: "completed",
    startDate: "2025-01-15",
    endDate: "2025-03-15",
    budget: 9000,
    spent: 9000,
    targets: {
      sales: 600,
      reach: 300000,
      engagement: 18,
    },
    performance: {
      sales: 720,
      reach: 350000,
      engagement: 22,
    },
    products: [
      {
        id: "prod-9",
        name: "Designer Handbag",
        image: "/handbag1.jpg",
        soldUnits: 320,
        revenue: 96000,
      },
      {
        id: "prod-10",
        name: "Silk Scarf",
        image: "/scarf.jpg",
        soldUnits: 280,
        revenue: 28000,
      },
      {
        id: "prod-11",
        name: "Leather Crossbody",
        image: "/crossbag.webp",
        soldUnits: 120,
        revenue: 24000,
      },
    ],
    recentActivities: [
      {
        type: "milestone",
        date: "2025-03-20",
        description:
          "Final campaign report delivered - 120% of targets achieved",
      },
      {
        type: "payment",
        date: "2025-03-18",
        description: "Final payment of $3,000 processed",
      },
      {
        type: "content",
        date: "2025-03-10",
        description: "Campaign wrap-up video posted - 45k views",
      },
      {
        type: "milestone",
        date: "2025-02-15",
        description: "Campaign exceeded sales target by 10%",
      },
    ],
  },
  {
    id: "collab-5",
    brandName: "Tech Innovations",
    brandLogo: "/LG-TV.jpeg",
    campaignName: "Smart Home Essentials",
    status: "draft",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    budget: 6500,
    spent: 0,
    targets: {
      sales: 450,
      reach: 200000,
      engagement: 15,
    },
    performance: {
      sales: 0,
      reach: 0,
      engagement: 0,
    },
    products: [
      {
        id: "prod-12",
        name: "Smart Speaker",
        image: "/devices.jpeg",
        soldUnits: 0,
        revenue: 0,
      },
      {
        id: "prod-13",
        name: "Home Security Camera",
        image: "/security.jpeg",
        soldUnits: 0,
        revenue: 0,
      },
      {
        id: "prod-14",
        name: "Smart Lighting Kit",
        image: "/smartTV.jpeg",
        soldUnits: 0,
        revenue: 0,
      },
    ],
    recentActivities: [
      {
        type: "message",
        date: "2025-04-07",
        description: "Initial product selection and campaign concept",
      },
      {
        type: "message",
        date: "2025-04-02",
        description: "Brand introduction and collaboration interest",
      },
    ],
  },
];

// Helper functions for collaboration data management
export function getInfluencerCollaborations(influencerId: number) {
  // In a real app, this would filter collaborations by influencer ID
  return sampleCollaborations;
}

export function getBrandCollaborations(brandId: number) {
  // In a real app, this would filter collaborations by brand ID
  return sampleCollaborations;
}

export function getCollaborationMetrics(collaborationId: string) {
  const collaboration = sampleCollaborations.find(
    (c) => c.id === collaborationId
  );
  if (!collaboration) return null;

  const salesPerformance =
    (collaboration.performance.sales / collaboration.targets.sales) * 100;
  const reachPerformance =
    (collaboration.performance.reach / collaboration.targets.reach) * 100;
  const engagementPerformance =
    (collaboration.performance.engagement / collaboration.targets.engagement) *
    100;

  return {
    id: collaboration.id,
    campaignName: collaboration.campaignName,
    brandName: collaboration.brandName,
    salesTarget: collaboration.targets.sales,
    salesActual: collaboration.performance.sales,
    salesPerformance,
    reachTarget: collaboration.targets.reach,
    reachActual: collaboration.performance.reach,
    reachPerformance,
    engagementTarget: collaboration.targets.engagement,
    engagementActual: collaboration.performance.engagement,
    engagementPerformance,
    budget: collaboration.budget,
    spent: collaboration.spent,
    budgetUtilization: (collaboration.spent / collaboration.budget) * 100,
    status: collaboration.status,
    startDate: new Date(collaboration.startDate),
    endDate: new Date(collaboration.endDate),
    daysLeft: Math.ceil(
      (new Date(collaboration.endDate).getTime() - new Date().getTime()) /
        (1000 * 3600 * 24)
    ),
  };
}
