package com.finledger.backend.controller;

import com.finledger.backend.dto.TransactionDto;
import com.finledger.backend.entity.Transaction;
import com.finledger.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5000", allowCredentials = "true")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getTransactions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String platform,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(direction, sortBy));
        
        Page<Transaction> transactionPage;
        
        if (search != null && !search.trim().isEmpty()) {
            transactionPage = transactionService.searchTransactions(userId, search, pageable);
        } else if (category != null && !category.trim().isEmpty()) {
            transactionPage = transactionService.getTransactionsByCategory(userId, category, pageable);
        } else if (platform != null && !platform.trim().isEmpty()) {
            transactionPage = transactionService.getTransactionsByPlatform(userId, platform, pageable);
        } else {
            transactionPage = transactionService.getTransactions(userId, pageable);
        }
        
        List<TransactionDto.Response> transactions = transactionPage.getContent()
                .stream()
                .map(TransactionDto.Response::new)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactions);
        
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", transactionPage.getNumber() + 1);
        pagination.put("limit", transactionPage.getSize());
        pagination.put("total", transactionPage.getTotalElements());
        pagination.put("totalPages", transactionPage.getTotalPages());
        response.put("pagination", pagination);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDto.Response> getTransaction(
            @PathVariable Long id, 
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        Optional<Transaction> transaction = transactionService.getTransaction(id, userId);
        if (transaction.isPresent()) {
            return ResponseEntity.ok(new TransactionDto.Response(transaction.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<TransactionDto.Response> createTransaction(
            @Valid @RequestBody TransactionDto.CreateRequest request,
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        Transaction transaction = transactionService.createTransaction(userId, request);
        return ResponseEntity.ok(new TransactionDto.Response(transaction));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDto.Response> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDto.CreateRequest request,
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        Optional<Transaction> updatedTransaction = transactionService.updateTransaction(id, userId, request);
        if (updatedTransaction.isPresent()) {
            return ResponseEntity.ok(new TransactionDto.Response(updatedTransaction.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id, 
            Authentication authentication) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        boolean deleted = transactionService.deleteTransaction(id, userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    private String getUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        return oauth2User.getAttribute("sub");
    }
}