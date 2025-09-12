package com.smartclaims.smartclaims360.service;

import com.smartclaims.smartclaims360.dto.ClaimDetailsDTO;
import com.smartclaims.smartclaims360.dto.ClientDTO;
import com.smartclaims.smartclaims360.entity.Claim;
import com.smartclaims.smartclaims360.entity.Client;
import com.smartclaims.smartclaims360.repository.ClaimRepository;
import com.smartclaims.smartclaims360.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimProcessingService {

    private final ClientRepository clientRepository;
    private final ClaimRepository claimRepository;

    @Transactional
    public Claim createClaimWithClient(ClientDTO clientDTO) {
        Client client = new Client();
        client.setFullName(clientDTO.getFullName());
        client.setAddress(clientDTO.getAddress());
        client.setPhoneNumber(clientDTO.getPhoneNumber());
        client.setEmail(clientDTO.getEmail());
        Client savedClient = clientRepository.save(client);

        Claim claim = new Claim();
        claim.setClient(savedClient);
        claim.setClaimantName(savedClient.getFullName()); // Keep claimantName for now
        claim.setStatus("DRAFT_CLIENT_SAVED");

        return claimRepository.save(claim);
    }

    @Transactional
    public Claim updateClaimDetails(UUID claimId, ClaimDetailsDTO claimDetailsDTO) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));

        claim.setClaimAmount(claimDetailsDTO.getClaimAmount());
        claim.setClaimType(claimDetailsDTO.getClaimType());
        claim.setDescription(claimDetailsDTO.getDescription());
        claim.setDateOfIncident(claimDetailsDTO.getDateOfIncident());
        claim.setStatus("DRAFT_DETAILS_SAVED");

        return claimRepository.save(claim);
    }

    public Claim getClaimForReview(UUID claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
    }

    @Transactional
    public Claim submitClaim(UUID claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
        claim.setStatus("SUBMITTED");
        return claimRepository.save(claim);
    }
}
