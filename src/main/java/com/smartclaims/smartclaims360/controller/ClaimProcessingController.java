package com.smartclaims.smartclaims360.controller;

import com.smartclaims.smartclaims360.dto.ClaimDetailsDTO;
import com.smartclaims.smartclaims360.dto.ClientDTO;
import com.smartclaims.smartclaims360.dto.ClaimReviewDTO;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.entity.Client;
import com.smartclaims.smartclaims360.service.ClaimProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/processing")
@RequiredArgsConstructor
public class ClaimProcessingController {

    private final ClaimProcessingService claimProcessingService;

    @PostMapping("/client")
    public ResponseEntity<?> saveClientInfo(@RequestBody ClientDTO clientDTO) {
        Claim newClaim = claimProcessingService.createClaimWithClient(clientDTO);
        return ResponseEntity.ok(Collections.singletonMap("claimId", newClaim.getId()));
    }

    @PutMapping("/claim/{claimId}")
    public ResponseEntity<?> saveClaimDetails(@PathVariable UUID claimId, @RequestBody ClaimDetailsDTO claimDetailsDTO) {
        claimProcessingService.updateClaimDetails(claimId, claimDetailsDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/claim/{claimId}")
    public ResponseEntity<ClaimReviewDTO> getClaimForReview(@PathVariable UUID claimId) {
        Claim claim = claimProcessingService.getClaimForReview(claimId);
        Client client = claim.getClient();

        ClaimReviewDTO reviewDTO = new ClaimReviewDTO();
        reviewDTO.setClaimId(claim.getId());
        reviewDTO.setStatus(claim.getStatus());
        reviewDTO.setClaimAmount(claim.getClaimAmount());
        reviewDTO.setClaimType(claim.getClaimType());
        reviewDTO.setDescription(claim.getDescription());
        reviewDTO.setDateOfIncident(claim.getDateOfIncident());

        if (client != null) {
            reviewDTO.setFullName(client.getFullName());
            reviewDTO.setAddress(client.getAddress());
            reviewDTO.setPhoneNumber(client.getPhoneNumber());
            reviewDTO.setEmail(client.getEmail());
        }

        return ResponseEntity.ok(reviewDTO);
    }

    @PostMapping("/submit/{claimId}")
    public ResponseEntity<?> submitClaim(@PathVariable UUID claimId) {
        claimProcessingService.submitClaim(claimId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Claim submitted successfully"));
    }
}
