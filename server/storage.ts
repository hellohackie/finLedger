import {
  users,
  transactions,
  portfolioSummary,
  type User,
  type UpsertUser,
  type Transaction,
  type InsertTransaction,
  type UpdateTransaction,
  type PortfolioSummary,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Transaction operations
  getTransactions(userId: string, options?: {
    limit?: number;
    offset?: number;
    category?: string;
    platform?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ transactions: Transaction[]; total: number }>;
  
  getTransaction(id: number, userId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction>;
  updateTransaction(id: number, userId: string, transaction: Partial<UpdateTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number, userId: string): Promise<boolean>;
  
  // Portfolio operations
  getPortfolioSummary(userId: string): Promise<PortfolioSummary[]>;
  calculatePortfolioMetrics(userId: string): Promise<{
    totalPortfolio: number;
    monthlySpending: number;
    totalInvestments: number;
    transactionCount: number;
  }>;
  
  // Analytics operations
  getTransactionsByCategory(userId: string): Promise<{ category: string; total: number; count: number }[]>;
  getMonthlySpendingTrend(userId: string, months: number): Promise<{ month: string; spending: number; investments: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transaction operations
  async getTransactions(userId: string, options: {
    limit?: number;
    offset?: number;
    category?: string;
    platform?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ transactions: Transaction[]; total: number }> {
    const {
      limit = 50,
      offset = 0,
      category,
      platform,
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = options;

    // Build where conditions
    const conditions = [eq(transactions.userId, userId)];
    
    if (category) {
      conditions.push(eq(transactions.category, category));
    }
    
    if (platform) {
      conditions.push(eq(transactions.platform, platform));
    }
    
    if (search) {
      conditions.push(like(transactions.assetName, `%${search}%`));
    }

    const whereConditions = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Build queries
    let query = db.select().from(transactions).where(whereConditions);
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(transactions).where(whereConditions);

    // Apply sorting
    const sortColumn = sortBy === 'amount' ? transactions.amount : 
                      sortBy === 'platform' ? transactions.platform :
                      sortBy === 'category' ? transactions.category : transactions.date;
    
    query = query.orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn));

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const [transactionResults, countResults] = await Promise.all([
      query,
      countQuery
    ]);

    return {
      transactions: transactionResults,
      total: countResults[0]?.count || 0
    };
  }

  async getTransaction(id: number, userId: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return transaction;
  }

  async createTransaction(transaction: InsertTransaction & { userId: string }): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    
    // Update portfolio summary
    await this.updatePortfolioSummary(transaction.userId);
    
    return newTransaction;
  }

  async updateTransaction(id: number, userId: string, transaction: Partial<UpdateTransaction>): Promise<Transaction | undefined> {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...transaction, updatedAt: new Date() })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    
    if (updatedTransaction) {
      await this.updatePortfolioSummary(userId);
    }
    
    return updatedTransaction;
  }

  async deleteTransaction(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    
    if (result.rowCount && result.rowCount > 0) {
      await this.updatePortfolioSummary(userId);
      return true;
    }
    
    return false;
  }

  // Portfolio operations
  async getPortfolioSummary(userId: string): Promise<PortfolioSummary[]> {
    return await db
      .select()
      .from(portfolioSummary)
      .where(eq(portfolioSummary.userId, userId));
  }

  async calculatePortfolioMetrics(userId: string): Promise<{
    totalPortfolio: number;
    monthlySpending: number;
    totalInvestments: number;
    transactionCount: number;
  }> {
    // Get current month start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate total portfolio value
    const portfolioResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.type} = 'buy' THEN ${transactions.amount}
          WHEN ${transactions.type} = 'sell' THEN -${transactions.amount}
          ELSE 0
        END), 0)`
      })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        sql`${transactions.category} IN ('Stocks', 'Mutual Funds', 'Gold', 'Cryptocurrency')`
      ));

    // Calculate monthly spending
    const monthlySpendingResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
      })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        sql`${transactions.date} >= ${monthStart}`,
        sql`${transactions.category} IN ('UPI', 'Bank Transfer')`
      ));

    // Calculate total investments
    const investmentsResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.type} = 'buy' THEN ${transactions.amount}
          ELSE 0
        END), 0)`
      })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        sql`${transactions.category} IN ('Stocks', 'Mutual Funds', 'Gold', 'Cryptocurrency')`
      ));

    // Count total transactions
    const transactionCountResult = await db
      .select({
        count: sql<number>`COUNT(*)`
      })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    return {
      totalPortfolio: Number(portfolioResult[0]?.total || 0),
      monthlySpending: Number(monthlySpendingResult[0]?.total || 0),
      totalInvestments: Number(investmentsResult[0]?.total || 0),
      transactionCount: Number(transactionCountResult[0]?.count || 0),
    };
  }

  // Analytics operations
  async getTransactionsByCategory(userId: string): Promise<{ category: string; total: number; count: number }[]> {
    return await db
      .select({
        category: transactions.category,
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        count: sql<number>`COUNT(*)`
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.category);
  }

  async getMonthlySpendingTrend(userId: string, months: number = 6): Promise<{ month: string; spending: number; investments: number }[]> {
    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
        spending: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.category} IN ('UPI Payment', 'Bank Transfer') THEN ${transactions.amount}
          ELSE 0
        END), 0)`,
        investments: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.category} IN ('Stocks', 'Mutual Funds', 'Gold', 'Cryptocurrency') AND ${transactions.type} = 'buy' THEN ${transactions.amount}
          ELSE 0
        END), 0)`
      })
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        sql`${transactions.date} >= CURRENT_DATE - INTERVAL '${sql.raw(months.toString())} months'`
      ))
      .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`);

    return result;
  }

  private async updatePortfolioSummary(userId: string): Promise<void> {
    // Delete existing summary
    await db.delete(portfolioSummary).where(eq(portfolioSummary.userId, userId));

    // Recalculate and insert new summary
    const summaryData = await db
      .select({
        category: transactions.category,
        totalValue: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.type} = 'buy' THEN ${transactions.amount}
          WHEN ${transactions.type} = 'sell' THEN -${transactions.amount}
          ELSE 0
        END), 0)`,
        totalQuantity: sql<number>`COALESCE(SUM(CASE 
          WHEN ${transactions.type} = 'buy' THEN ${transactions.quantity}
          WHEN ${transactions.type} = 'sell' THEN -${transactions.quantity}
          ELSE 0
        END), 0)`
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .groupBy(transactions.category);

    if (summaryData.length > 0) {
      await db.insert(portfolioSummary).values(
        summaryData.map(item => ({
          userId,
          category: item.category,
          totalValue: String(item.totalValue),
          totalQuantity: String(item.totalQuantity),
          lastUpdated: new Date(),
        }))
      );
    }
  }
}

export const storage = new DatabaseStorage();
