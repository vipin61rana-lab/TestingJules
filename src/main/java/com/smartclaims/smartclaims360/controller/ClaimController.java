package com.smartclaims.smartclaims360.controller;

import com.smartclaims.smartclaims360.dto.ClaimRequest;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping("/health")
    public String healthCheck() {
        return "SmartClaims360 API is running";
    }

    @PostMapping("/claims")
    public ResponseEntity<Claim> createClaim(@Valid @RequestBody ClaimRequest claimRequest) {
        Claim createdClaim = claimService.createClaim(claimRequest);
        return new ResponseEntity<>(createdClaim, HttpStatus.CREATED);
    }

    @GetMapping("/claims")
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable UUID id) {
        return claimService.getClaimById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
