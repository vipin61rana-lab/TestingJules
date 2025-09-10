package com.smartclaims.smartclaims360.controller;

import com.smartclaims.smartclaims360.dto.ClaimRequest;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Claims", description = "Claims API")
public class ClaimController {

    private final ClaimService claimService;

    @Operation(summary = "Health check endpoint", description = "Returns a simple message to indicate that the API is running.")
    @GetMapping("/health")
    public String healthCheck() {
        return "SmartClaims360 API is running";
    }

    @Operation(summary = "Create a new claim", description = "Creates a new claim and saves it to the database.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Claim created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request body")
    })
    @PostMapping("/claims")
    public ResponseEntity<Claim> createClaim(@Valid @RequestBody ClaimRequest claimRequest) {
        Claim createdClaim = claimService.createClaim(claimRequest);
        return new ResponseEntity<>(createdClaim, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all claims", description = "Returns a list of all claims.")
    @GetMapping("/claims")
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @Operation(summary = "Get a claim by ID", description = "Returns a single claim by its ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Claim found"),
            @ApiResponse(responseCode = "404", description = "Claim not found")
    })
    @GetMapping("/claims/{id}")
    public ResponseEntity<Claim> getClaimById(@PathVariable UUID id) {
        return claimService.getClaimById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete claims by IDs", description = "Deletes one or more claims based on a list of IDs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Claims deleted successfully")
    })
    @DeleteMapping("/claims")
    public ResponseEntity<Void> deleteClaims(@RequestBody List<UUID> ids) {
        claimService.deleteClaims(ids);
        return ResponseEntity.noContent().build();
    }
}
