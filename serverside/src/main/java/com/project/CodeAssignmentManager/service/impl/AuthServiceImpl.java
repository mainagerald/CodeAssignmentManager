package com.project.CodeAssignmentManager.service.impl;

import com.project.CodeAssignmentManager.dto.JwtAuthResponse;
import com.project.CodeAssignmentManager.dto.SignInRequest;
import com.project.CodeAssignmentManager.dto.SignUpRequest;
import com.project.CodeAssignmentManager.enums.Role;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.repository.UserRepository;
import com.project.CodeAssignmentManager.service.AuthService;
import com.project.CodeAssignmentManager.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public User signUp(SignUpRequest signUpRequest) {
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.USER);
        return userRepository.save(user);
    }

    public JwtAuthResponse signIn(SignInRequest signInRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(), signInRequest.getPassword()));
        var user = userRepository.findByEmail(signInRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email address"));
        return createJwtAuthResponse(user);
    }

    public JwtAuthResponse refreshToken(String refreshToken) {
        try {
            String userEmail = jwtService.extractUsername(refreshToken);
            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            if (jwtService.isRefreshTokenValid(refreshToken, user)) {
                return createJwtAuthResponse(user);
            } else {
                throw new IllegalArgumentException("Invalid refresh token");
            }
        } catch (Exception e) {
            log.error("Error refreshing token: ", e);
            throw new IllegalArgumentException("Invalid refresh token");
        }
    }

    private JwtAuthResponse createJwtAuthResponse(User user) {
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(accessToken);
        jwtAuthResponse.setRefreshToken(refreshToken);
        return jwtAuthResponse;
    }

    public boolean isTokenValid(String token) {
        try {
            String userEmail = jwtService.extractUsername(token);
            var user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email address!"));
            return jwtService.isTokenValid(token, user);
        } catch (Exception e) {
            log.error("Error occurred: {}", e.getMessage());
            return false;
        }
    }
}