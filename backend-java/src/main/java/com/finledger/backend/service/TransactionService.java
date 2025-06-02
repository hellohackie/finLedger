package com.finledger.backend.service;

import com.finledger.backend.dto.TransactionDto;
import com.finledger.backend.entity.Transaction;
import com.finledger.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Page<Transaction> getTransactions(String userId, Pageable pageable) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId, pageable);
    }
    
    public Page<Transaction> getTransactionsByCategory(String userId, String category, Pageable pageable) {
        return transactionRepository.findByUserIdAndCategoryContainingIgnoreCaseOrderByDateDesc(userId, category, pageable);
    }
    
    public Page<Transaction> getTransactionsByPlatform(String userId, String platform, Pageable pageable) {
        return transactionRepository.findByUserIdAndPlatformContainingIgnoreCaseOrderByDateDesc(userId, platform, pageable);
    }
    
    public Page<Transaction> searchTransactions(String userId, String search, Pageable pageable) {
        return transactionRepository.findByUserIdAndAssetNameContainingIgnoreCaseOrderByDateDesc(userId, search, pageable);
    }
    
    public Optional<Transaction> getTransaction(Long id, String userId) {
        return transactionRepository.findByIdAndUserId(id, userId);
    }
    
    public Transaction createTransaction(String userId, TransactionDto.CreateRequest request) {
        Transaction transaction = new Transaction(
            userId,
            request.getPlatform(),
            request.getCategory(),
            request.getType(),
            request.getAssetName(),
            request.getAmount(),
            request.getQuantity(),
            request.getDate(),
            request.getNotes()
        );
        return transactionRepository.save(transaction);
    }
    
    public Optional<Transaction> updateTransaction(Long id, String userId, TransactionDto.CreateRequest request) {
        Optional<Transaction> existingTransaction = transactionRepository.findByIdAndUserId(id, userId);
        
        if (existingTransaction.isPresent()) {
            Transaction transaction = existingTransaction.get();
            transaction.setPlatform(request.getPlatform());
            transaction.setCategory(request.getCategory());
            transaction.setType(request.getType());
            transaction.setAssetName(request.getAssetName());
            transaction.setAmount(request.getAmount());
            transaction.setQuantity(request.getQuantity());
            transaction.setDate(request.getDate());
            transaction.setNotes(request.getNotes());
            return Optional.of(transactionRepository.save(transaction));
        }
        
        return Optional.empty();
    }
    
    public boolean deleteTransaction(Long id, String userId) {
        Optional<Transaction> transaction = transactionRepository.findByIdAndUserId(id, userId);
        if (transaction.isPresent()) {
            transactionRepository.delete(transaction.get());
            return true;
        }
        return false;
    }
    
    public Map<String, Object> getPortfolioMetrics(String userId) {
        long transactionCount = transactionRepository.countByUserId(userId);
        
        BigDecimal totalInvestments = transactionRepository.sumInvestmentsByUserId(userId);
        if (totalInvestments == null) totalInvestments = BigDecimal.ZERO;
        
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        BigDecimal monthlySpending = transactionRepository.sumMonthlySpendingByUserId(userId, monthStart);
        if (monthlySpending == null) monthlySpending = BigDecimal.ZERO;
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalPortfolio", totalInvestments);
        metrics.put("monthlySpending", monthlySpending);
        metrics.put("totalInvestments", totalInvestments);
        metrics.put("transactionCount", transactionCount);
        
        return metrics;
    }
    
    public List<Map<String, Object>> getCategoryAnalytics(String userId) {
        List<Object[]> results = transactionRepository.findCategoryAnalyticsByUserId(userId);
        List<Map<String, Object>> analytics = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", result[0]);
            categoryData.put("total", result[1]);
            categoryData.put("count", result[2]);
            analytics.add(categoryData);
        }
        
        return analytics;
    }
    
    public List<Map<String, Object>> getMonthlyTrends(String userId, int months) {
        LocalDate startDate = LocalDate.now().minusMonths(months);
        List<Object[]> results = transactionRepository.findMonthlyTrendsByUserId(userId, startDate);
        List<Map<String, Object>> trends = new ArrayList<>();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        for (Object[] result : results) {
            Map<String, Object> trend = new HashMap<>();
            
            Integer month = ((Number) result[0]).intValue();
            Integer year = ((Number) result[1]).intValue();
            YearMonth yearMonth = YearMonth.of(year, month);
            
            trend.put("month", yearMonth.format(formatter));
            trend.put("spending", result[2] != null ? result[2] : BigDecimal.ZERO);
            trend.put("investments", result[3] != null ? result[3] : BigDecimal.ZERO);
            trends.add(trend);
        }
        
        return trends;
    }
}