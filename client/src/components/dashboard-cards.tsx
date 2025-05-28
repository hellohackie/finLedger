import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CreditCard, PiggyBank, ArrowUpDown } from "lucide-react";
import { DashboardMetrics } from "@/lib/types";

interface DashboardCardsProps {
  metrics: DashboardMetrics;
  isLoading: boolean;
}

export function DashboardCards({ metrics, isLoading }: DashboardCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Portfolio",
      value: formatCurrency(metrics.totalPortfolio),
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      change: "+12.5%",
      changeColor: "text-green-600",
    },
    {
      title: "This Month Spent",
      value: formatCurrency(metrics.monthlySpending),
      icon: CreditCard,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      change: "+8.2%",
      changeColor: "text-red-600",
    },
    {
      title: "Investments",
      value: formatCurrency(metrics.totalInvestments),
      icon: PiggyBank,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+15.3%",
      changeColor: "text-green-600",
    },
    {
      title: "Total Transactions",
      value: metrics.transactionCount.toString(),
      icon: ArrowUpDown,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+23",
      changeColor: "text-green-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${card.changeColor}`}>
                  {card.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
