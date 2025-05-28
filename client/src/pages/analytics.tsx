import { Navigation } from "@/components/navigation";
import { PortfolioChart, TrendChart } from "@/components/charts";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
          <p className="text-gray-600">Insights into your financial activity and portfolio performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioChart />
          <TrendChart />
        </div>
      </main>
    </div>
  );
}
