export interface TransactionFormData {
  platform: string;
  category: string;
  type: 'buy' | 'sell' | 'transfer';
  assetName: string;
  amount: string;
  quantity?: string;
  date: string;
  notes?: string;
}

export interface DashboardMetrics {
  totalPortfolio: number;
  monthlySpending: number;
  totalInvestments: number;
  transactionCount: number;
}

export interface TransactionFilters {
  search: string;
  category: string;
  platform: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const PLATFORMS = [
  'Groww',
  'Kite (Zerodha)',
  'UPI - PhonePe',
  'UPI - Google Pay',
  'Paytm Money',
  'HDFC Bank',
  'ICICI Bank',
  'SBI',
  'Axis Bank',
] as const;

export const CATEGORIES = [
  'Stocks',
  'Mutual Funds',
  'Gold',
  'UPI Payment',
  'Bank Transfer',
  'Cryptocurrency',
] as const;

export const TRANSACTION_TYPES = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'transfer', label: 'Transfer' },
] as const;
