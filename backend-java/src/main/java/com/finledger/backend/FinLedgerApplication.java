package com.finledger.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FinLedgerApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinLedgerApplication.class, args);
    }
}