package com.smartclaims.smartclaims360.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ClaimRequest {

    @NotBlank(message = "Claimant name cannot be blank")
    private String claimantName;

    @Positive(message = "Claim amount must be positive")
    private BigDecimal claimAmount;

    private String claimType;
}
