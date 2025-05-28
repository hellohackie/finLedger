import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Portfolio() {
  const { data: portfolioSummary, isLoading } = useQuery({
    queryKey: ["/api/portfolio/summary"],
    queryFn: async () => {
      const response = await fetch("/api/portfolio/summary", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch portfolio summary");
      return response.json();
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'stocks':
        return '📈';
      case 'mutual funds':
        return '📊';
      case 'gold':
        return '🥇';
      case 'cryptocurrency':
        return '₿';
      default:
        return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio</h2>
            <p className="text-gray-600">Your investment portfolio breakdown</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const summary = portfolioSummary || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio</h2>
          <p className="text-gray-600">Your investment portfolio breakdown</p>
        </div>

        {summary.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Portfolio Data</h3>
              <p className="text-gray-600 mb-6">
                Start adding transactions to build your portfolio overview
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summary.map((item: any, index: number) => (
              <Card key={index} className="border border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {item.category}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono">
                        {formatCurrency(item.totalValue)}
                      </p>
                    </div>
                    
                    {item.totalQuantity && Number(item.totalQuantity) > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-lg font-semibold text-gray-900 font-mono">
                          {Number(item.totalQuantity).toLocaleString('en-IN', {
                            maximumFractionDigits: 4
                          })}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge 
                        variant={Number(item.totalValue) >= 0 ? "default" : "destructive"}
                        className={Number(item.totalValue) >= 0 ? "bg-green-100 text-green-800" : ""}
                      >
                        {Number(item.totalValue) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        Portfolio
                      </Badge>
                      <p className="text-xs text-gray-500">
                        Updated {new Date(item.lastUpdated).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
