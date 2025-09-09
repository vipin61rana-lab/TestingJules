package com.smartclaims.smartclaims360.service;

import com.smartclaims.smartclaims360.dto.ClaimRequest;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;

    public Claim createClaim(ClaimRequest claimRequest) {
        Claim claim = new Claim();
        claim.setClaimantName(claimRequest.getClaimantName());
        claim.setClaimAmount(claimRequest.getClaimAmount());
        claim.setClaimType(claimRequest.getClaimType());
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Optional<Claim> getClaimById(UUID id) {
        return claimRepository.findById(id);
    }
}
