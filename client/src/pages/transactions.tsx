import { Navigation } from "@/components/navigation";
import { TransactionTable } from "@/components/transaction-table";

export default function Transactions() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Transactions</h2>
          <p className="text-gray-600">View and manage all your financial transactions</p>
        </div>

        <TransactionTable />
      </main>
    </div>
  );
}
