package com.smartclaims.smartclaims360.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClaimController {

    @GetMapping("/health")
    public String healthCheck() {
        return "SmartClaims360 API is running";
    }
}
