package com.smartclaims.smartclaims360.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ClaimReviewDTO {
    private UUID claimId;
    private String fullName;
    private String address;
    private String phoneNumber;
    private String email;
    private BigDecimal claimAmount;
    private String claimType;
    private String description;
    private LocalDate dateOfIncident;
    private String status;
}
