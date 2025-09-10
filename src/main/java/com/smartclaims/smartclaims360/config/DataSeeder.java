package com.smartclaims.smartclaims360.config;

import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ClaimRepository claimRepository;

    @Override
    public void run(String... args) throws Exception {
        if (claimRepository.count() == 0) {
            Claim claim1 = new Claim(null, "John Doe", new BigDecimal("1200.50"), "AUTO", null, null);
            Claim claim2 = new Claim(null, "Jane Smith", new BigDecimal("550.00"), "HOME", null, null);
            Claim claim3 = new Claim(null, "Peter Jones", new BigDecimal("8000.75"), "HEALTH", null, null);
            Claim claim4 = new Claim(null, "Mary Williams", new BigDecimal("250.25"), "DENTAL", null, null);
            Claim claim5 = new Claim(null, "David Brown", new BigDecimal("3450.00"), "LIFE", null, null);

            claimRepository.saveAll(Arrays.asList(claim1, claim2, claim3, claim4, claim5));
        }
    }
}
