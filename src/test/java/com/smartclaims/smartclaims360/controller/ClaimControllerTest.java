package com.smartclaims.smartclaims360.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartclaims.smartclaims360.dto.ClaimRequest;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ClaimControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClaimRepository claimRepository;

    @Test
    void shouldCreateClaim() throws Exception {
        ClaimRequest claimRequest = new ClaimRequest();
        claimRequest.setClaimantName("John Doe");
        claimRequest.setClaimAmount(new BigDecimal("100.50"));
        claimRequest.setClaimType("AUTO");

        mockMvc.perform(post("/api/v1/claims")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(claimRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.claimantName").value("John Doe"))
                .andExpect(jsonPath("$.claimAmount").value(100.50))
                .andExpect(jsonPath("$.claimType").value("AUTO"))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    void shouldReturnBadRequestWhenClaimantNameIsBlank() throws Exception {
        ClaimRequest claimRequest = new ClaimRequest();
        claimRequest.setClaimantName("");
        claimRequest.setClaimAmount(new BigDecimal("100.50"));
        claimRequest.setClaimType("AUTO");

        mockMvc.perform(post("/api/v1/claims")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(claimRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnBadRequestWhenClaimAmountIsNegative() throws Exception {
        ClaimRequest claimRequest = new ClaimRequest();
        claimRequest.setClaimantName("John Doe");
        claimRequest.setClaimAmount(new BigDecimal("-100.50"));
        claimRequest.setClaimType("AUTO");

        mockMvc.perform(post("/api/v1/claims")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(claimRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldGetAllClaims() throws Exception {
        Claim claim1 = new Claim(null, "John Doe", new BigDecimal("100.50"), "AUTO", "NEW", null);
        Claim claim2 = new Claim(null, "Jane Doe", new BigDecimal("200.00"), "HOME", "NEW", null);
        claimRepository.save(claim1);
        claimRepository.save(claim2);

        mockMvc.perform(get("/api/v1/claims"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldGetClaimById() throws Exception {
        Claim claim = new Claim(null, "John Doe", new BigDecimal("100.50"), "AUTO", "NEW", null);
        Claim savedClaim = claimRepository.save(claim);

        mockMvc.perform(get("/api/v1/claims/" + savedClaim.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedClaim.getId().toString()))
                .andExpect(jsonPath("$.claimantName").value("John Doe"));
    }

    @Test
    void shouldReturnNotFoundForUnknownClaimId() throws Exception {
        mockMvc.perform(get("/api/v1/claims/b1b2b3b4-b5b6-b7b8-b9b0-b1b2b3b4b5b6"))
                .andExpect(status().isNotFound());
    }
}
