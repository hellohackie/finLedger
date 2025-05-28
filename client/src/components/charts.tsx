import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function PortfolioChart() {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["/api/analytics/categories"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/categories", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch category data");
      return response.json();
    },
  });

  const COLORS = ['#1976D2', '#388E3C', '#F57C00', '#9C27B0', '#F44336', '#607D8B'];

  const chartData = categoryData?.map((item: any, index: number) => ({
    name: item.category,
    value: Number(item.total),
    color: COLORS[index % COLORS.length],
  })) || [];

  if (isLoading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Portfolio Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-48 h-48 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Portfolio Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-500">No portfolio data available</p>
              <p className="text-sm text-gray-400 mt-1">Add some transactions to see your portfolio breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle>Portfolio Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(value),
                  'Amount'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {chartData.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(item.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendChart() {
  const { data: trendData, isLoading } = useQuery({
    queryKey: ["/api/analytics/trends"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/trends?months=6", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch trend data");
      return response.json();
    },
  });

  const chartData = trendData?.map((item: any) => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { 
      month: 'short',
      year: '2-digit' 
    }),
    spending: Number(item.spending),
    investments: Number(item.investments),
  })) || [];

  if (isLoading) {
    return (
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-48 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-500">No trend data available</p>
              <p className="text-sm text-gray-400 mt-1">Add more transactions to see spending trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-100">
      <CardHeader>
        <CardTitle>Monthly Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    notation: 'compact',
                  }).format(value)
                }
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(value),
                  name === 'spending' ? 'Spending' : 'Investments'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="spending" 
                stroke="#F57C00" 
                strokeWidth={2}
                name="Spending"
              />
              <Line 
                type="monotone" 
                dataKey="investments" 
                stroke="#1976D2" 
                strokeWidth={2}
                name="Investments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
