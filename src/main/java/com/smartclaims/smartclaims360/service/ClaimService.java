package com.smartclaims.smartclaims360.service;

import com.smartclaims.smartclaims360.dto.ClaimRequest;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.entity.Client;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import com.smartclaims.smartclaims360.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ClientRepository clientRepository;

    @Transactional
    public Claim createClaim(ClaimRequest claimRequest) {
        Client client = new Client();
        client.setFullName(claimRequest.getClaimantName());
        // In a real app, you might search for an existing client first
        Client savedClient = clientRepository.save(client);

        Claim claim = new Claim();
        claim.setClient(savedClient);
        claim.setClaimantName(claimRequest.getClaimantName());
        claim.setClaimAmount(claimRequest.getClaimAmount());
        claim.setClaimType(claimRequest.getClaimType());
        claim.setStatus("NEW"); // Explicitly set status for this flow
        return claimRepository.save(claim);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Optional<Claim> getClaimById(UUID id) {
        return claimRepository.findById(id);
    }

    public void deleteClaims(List<UUID> ids) {
        claimRepository.deleteAllByIdInBatch(ids);
    }

    @Transactional
    public Optional<Claim> updateClaim(UUID id, ClaimRequest claimRequest) {
        return claimRepository.findById(id)
                .map(claim -> {
                    // Update client name if it exists
                    if (claim.getClient() != null) {
                        claim.getClient().setFullName(claimRequest.getClaimantName());
                        clientRepository.save(claim.getClient());
                    }
                    claim.setClaimantName(claimRequest.getClaimantName());
                    claim.setClaimAmount(claimRequest.getClaimAmount());
                    claim.setClaimType(claimRequest.getClaimType());
                    return claimRepository.save(claim);
                });
    }
}
