package com.finledger.backend.dto;

import com.finledger.backend.entity.Transaction;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDto {
    
    // Request DTO for creating/updating transactions
    public static class CreateRequest {
        @NotBlank(message = "Platform is required")
        private String platform;
        
        @NotBlank(message = "Category is required")
        private String category;
        
        @NotNull(message = "Transaction type is required")
        private Transaction.TransactionType type;
        
        @NotBlank(message = "Asset name is required")
        private String assetName;
        
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
        private BigDecimal amount;
        
        @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than 0")
        private BigDecimal quantity;
        
        @NotNull(message = "Date is required")
        private LocalDate date;
        
        private String notes;
        
        // Constructors
        public CreateRequest() {}
        
        // Getters and Setters
        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public Transaction.TransactionType getType() { return type; }
        public void setType(Transaction.TransactionType type) { this.type = type; }
        
        public String getAssetName() { return assetName; }
        public void setAssetName(String assetName) { this.assetName = assetName; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
    
    // Response DTO for returning transaction data
    public static class Response {
        private Long id;
        private String platform;
        private String category;
        private Transaction.TransactionType type;
        private String assetName;
        private BigDecimal amount;
        private BigDecimal quantity;
        private LocalDate date;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        // Constructors
        public Response() {}
        
        public Response(Transaction transaction) {
            this.id = transaction.getId();
            this.platform = transaction.getPlatform();
            this.category = transaction.getCategory();
            this.type = transaction.getType();
            this.assetName = transaction.getAssetName();
            this.amount = transaction.getAmount();
            this.quantity = transaction.getQuantity();
            this.date = transaction.getDate();
            this.notes = transaction.getNotes();
            this.createdAt = transaction.getCreatedAt();
            this.updatedAt = transaction.getUpdatedAt();
        }
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getPlatform() { return platform; }
        public void setPlatform(String platform) { this.platform = platform; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public Transaction.TransactionType getType() { return type; }
        public void setType(Transaction.TransactionType type) { this.type = type; }
        
        public String getAssetName() { return assetName; }
        public void setAssetName(String assetName) { this.assetName = assetName; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}