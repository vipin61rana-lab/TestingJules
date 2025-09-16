package com.smartclaims.smartclaims360.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartclaims.smartclaims360.dto.LoginRequest;
import com.smartclaims.smartclaims360.entity.User;
import com.smartclaims.smartclaims360.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        User vipin = new User();
        vipin.setUsername("vipin");
        vipin.setPassword(passwordEncoder.encode("password"));
        vipin.setRoles("ROLE_ADMIN,ROLE_USER");
        userRepository.save(vipin);
    }

    @Test
    void shouldCreateAuthenticationToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("vipin");
        loginRequest.setPassword("password");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").isNotEmpty());
    }

    @Test
    void shouldFailAuthenticationWithWrongPassword() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("vipin");
        loginRequest.setPassword("wrong-password");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
