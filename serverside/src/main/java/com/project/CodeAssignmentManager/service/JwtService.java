package com.project.CodeAssignmentManager.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {
    String generateAccessToken(UserDetails userDetails);
    String generateRefreshToken(UserDetails userDetails);
    String generateToken(UserDetails userDetails, long expiration);
    String extractUsername(String token);
    boolean isTokenValid(String token, UserDetails userDetails);
    boolean isTokenExpired(String token);
    Long extractUserId(String token);
    boolean isRefreshTokenValid(String token, UserDetails userDetails);
}