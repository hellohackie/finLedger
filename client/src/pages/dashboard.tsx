import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { DashboardCards } from "@/components/dashboard-cards";
import { TransactionForm } from "@/components/transaction-form";
import { TransactionTable } from "@/components/transaction-table";
import { PortfolioChart, TrendChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, FileText, CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/portfolio/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/portfolio/metrics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch metrics");
      return response.json();
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to export data");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Implement CSV import functionality
        toast({
          title: "Coming Soon",
          description: "CSV import functionality will be available soon",
        });
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <DashboardCards 
            metrics={metrics || { totalPortfolio: 0, monthlySpending: 0, totalInvestments: 0, transactionCount: 0 }} 
            isLoading={metricsLoading} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form */}
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>

          {/* Transaction Table */}
          <div className="lg:col-span-2">
            <TransactionTable />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioChart />
          <TrendChart />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="border border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center px-4 py-3 h-auto"
                  onClick={handleExport}
                >
                  <Download className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700">Export Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center px-4 py-3 h-auto"
                  onClick={handleImport}
                >
                  <Upload className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700">Import CSV</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center px-4 py-3 h-auto"
                  onClick={() => toast({ title: "Coming Soon", description: "Report generation will be available soon" })}
                >
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700">Generate Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center px-4 py-3 h-auto"
                  onClick={() => toast({ title: "Coming Soon", description: "Backup functionality will be available soon" })}
                >
                  <CloudUpload className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-gray-700">Backup Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
