"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentOrders() {
  const orders = [
    {
      id: "ORD001",
      customer: { name: "John Doe", image: "https://github.com/shadcn.png" },
      product: "Premium Fitness Watch",
      amount: 199.99,
      status: "completed",
      date: "2 hours ago",
    },
    // Add more orders...
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={order.customer.image} />
                <AvatarFallback>{order.customer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.product}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${order.amount}</p>
              <p className="text-sm text-muted-foreground">{order.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
