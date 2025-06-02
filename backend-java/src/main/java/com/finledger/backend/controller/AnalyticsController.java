package com.finledger.backend.controller;

import com.finledger.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5000", allowCredentials = "true")
public class AnalyticsController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping("/portfolio/metrics")
    public ResponseEntity<Map<String, Object>> getPortfolioMetrics(Authentication authentication) {
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        Map<String, Object> metrics = transactionService.getPortfolioMetrics(userId);
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/analytics/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategoryAnalytics(Authentication authentication) {
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<Map<String, Object>> analytics = transactionService.getCategoryAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/analytics/trends")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyTrends(
            Authentication authentication,
            @RequestParam(defaultValue = "6") int months) {
        
        String userId = getUserId(authentication);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        List<Map<String, Object>> trends = transactionService.getMonthlyTrends(userId, months);
        return ResponseEntity.ok(trends);
    }
    
    private String getUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        return oauth2User.getAttribute("sub");
    }
}