package com.smartclaims.smartclaims360.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ClaimDetailsDTO {
    private BigDecimal claimAmount;
    private String claimType;
    private String description;
    private LocalDate dateOfIncident;
}
