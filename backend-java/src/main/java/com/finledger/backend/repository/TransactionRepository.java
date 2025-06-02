package com.finledger.backend.repository;

import com.finledger.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Page<Transaction> findByUserIdOrderByDateDesc(String userId, Pageable pageable);
    
    Page<Transaction> findByUserIdAndCategoryContainingIgnoreCaseOrderByDateDesc(
        String userId, String category, Pageable pageable);
    
    Page<Transaction> findByUserIdAndPlatformContainingIgnoreCaseOrderByDateDesc(
        String userId, String platform, Pageable pageable);
    
    Page<Transaction> findByUserIdAndAssetNameContainingIgnoreCaseOrderByDateDesc(
        String userId, String assetName, Pageable pageable);
    
    Optional<Transaction> findByIdAndUserId(Long id, String userId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.userId = :userId")
    long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.type = 'BUY'")
    BigDecimal sumInvestmentsByUserId(@Param("userId") String userId);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId AND t.date >= :startDate")
    BigDecimal sumMonthlySpendingByUserId(@Param("userId") String userId, @Param("startDate") LocalDate startDate);
    
    @Query("SELECT t.category, SUM(t.amount), COUNT(t) FROM Transaction t WHERE t.userId = :userId GROUP BY t.category")
    List<Object[]> findCategoryAnalyticsByUserId(@Param("userId") String userId);
    
    @Query("SELECT EXTRACT(MONTH FROM t.date) as month, EXTRACT(YEAR FROM t.date) as year, " +
           "SUM(CASE WHEN t.type = 'SELL' OR t.type = 'TRANSFER' THEN t.amount ELSE 0 END) as spending, " +
           "SUM(CASE WHEN t.type = 'BUY' THEN t.amount ELSE 0 END) as investments " +
           "FROM Transaction t WHERE t.userId = :userId AND t.date >= :startDate " +
           "GROUP BY EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> findMonthlyTrendsByUserId(@Param("userId") String userId, @Param("startDate") LocalDate startDate);
}