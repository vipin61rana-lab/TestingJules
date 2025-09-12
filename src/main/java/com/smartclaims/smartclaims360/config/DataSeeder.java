package com.smartclaims.smartclaims360.config;

import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.entity.Client;
import com.smartclaims.smartclaims360.entity.User;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import com.smartclaims.smartclaims360.repository.ClientRepository;
import com.smartclaims.smartclaims360.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedClaims();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User vipin = new User();
            vipin.setUsername("vipin");
            vipin.setPassword(passwordEncoder.encode("password"));
            vipin.setRoles("ROLE_ADMIN,ROLE_USER");
            userRepository.save(vipin);

            User rahul = new User();
            rahul.setUsername("rahul");
            rahul.setPassword(passwordEncoder.encode("password"));
            rahul.setRoles("ROLE_USER");
            userRepository.save(rahul);
        }
    }

    private void seedClaims() {
        if (claimRepository.count() == 0 && clientRepository.count() == 0) {
            Client client1 = new Client(null, "John Doe", "123 Maple St", "555-0101", "john.doe@example.com");
            Client client2 = new Client(null, "Jane Smith", "456 Oak Ave", "555-0102", "jane.smith@example.com");
            Client client3 = new Client(null, "Peter Jones", "789 Pine Ln", "555-0103", "peter.jones@example.com");
            clientRepository.saveAll(List.of(client1, client2, client3));

            Claim claim1 = new Claim(null, client1, "John Doe", new BigDecimal("1200.50"), "AUTO", "Car accident", LocalDate.now().minusDays(10), "SUBMITTED", null);
            Claim claim2 = new Claim(null, client2, "Jane Smith", new BigDecimal("550.00"), "HOME", "Water damage", LocalDate.now().minusDays(5), "NEW", null);
            Claim claim3 = new Claim(null, client3, "Peter Jones", new BigDecimal("8000.75"), "HEALTH", "Hospital stay", LocalDate.now().minusDays(20), "IN_PROGRESS", null);

            claimRepository.saveAll(Arrays.asList(claim1, claim2, claim3));
        }
    }
}
