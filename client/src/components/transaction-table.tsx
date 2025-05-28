import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Transaction } from "@shared/schema";
import { TransactionFilters, PaginationData, CATEGORIES } from "@/lib/types";

export function TransactionTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    category: "",
    platform: "",
    sortBy: "date",
    sortOrder: "desc",
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/transactions",
      { page, ...filters }
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.platform) params.append("platform", filters.platform);

      const response = await fetch(`/api/transactions?${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/metrics"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return "bg-green-100 text-green-800";
      case 'sell':
        return "bg-red-100 text-red-800";
      case 'transfer':
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    // Convert "all" back to empty string for API compatibility
    const filterValue = value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: filterValue }));
    setPage(1); // Reset to first page when filtering
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactionMutation.mutate(id);
    }
  };

  const transactions: Transaction[] = data?.transactions || [];
  const pagination: PaginationData = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  return (
    <Card className="border border-gray-100">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No transactions found.</p>
            <p className="text-sm mt-2">Add your first transaction to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-500">Date</TableHead>
                  <TableHead className="font-medium text-gray-500">Asset</TableHead>
                  <TableHead className="font-medium text-gray-500">Platform</TableHead>
                  <TableHead className="font-medium text-gray-500">Type</TableHead>
                  <TableHead className="font-medium text-gray-500">Amount</TableHead>
                  <TableHead className="font-medium text-gray-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {formatDate(transaction.date!.toString())}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.assetName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {transaction.platform}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> transactions
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
