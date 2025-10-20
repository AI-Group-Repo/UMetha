"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  Download,
  Users,
  TrendingUp,
  ShoppingCart,
  Mail,
  MoreVertical,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Sample data
const sampleCustomers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  orders: Math.floor(Math.random() * 20),
  spent: (Math.random() * 1000).toFixed(2),
  lastOrder: new Date(Date.now() - Math.random() * 10000000000),
  status: ["active", "inactive"][Math.floor(Math.random() * 2)],
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}));

interface Customer {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: string;
  lastOrder: Date;
  status: "active" | "inactive";
  avatar: string;
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const columns = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }: { row: { original: Customer } }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row?.original?.avatar} alt={row?.original?.name} />
            <AvatarFallback>{row?.original?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row?.original?.name}</span>
            <span className="text-xs text-muted-foreground">
              {row?.original?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "orders",
      header: "Orders",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.orders}</Badge>
      ),
    },
    {
      accessorKey: "spent",
      header: "Total Spent",
      cell: ({ row }) => (
        <span className="font-medium">
          ${Number(row.original.spent).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "lastOrder",
      header: "Last Order",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(row.original.lastOrder, "MMM d, yyyy")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "success" : "secondary"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Send email</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Block</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      icon: Users,
      trend: "+12%",
    },
    {
      title: "Active Customers",
      value: "892",
      icon: TrendingUp,
      trend: "+5%",
    },
    {
      title: "Orders This Month",
      value: "156",
      icon: ShoppingCart,
      trend: "+8%",
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze your customer base
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email Selected
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend} from last month
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>Active customers</DropdownMenuItem>
            <DropdownMenuItem>Inactive customers</DropdownMenuItem>
            <DropdownMenuItem>High value customers</DropdownMenuItem>
            <DropdownMenuItem>Recent customers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DataTable
        columns={columns}
        data={sampleCustomers}
        onRowSelection={setSelectedCustomers}
      />
    </div>
  );
}
