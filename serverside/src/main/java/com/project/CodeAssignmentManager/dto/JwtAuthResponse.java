package com.project.CodeAssignmentManager.dto;


import lombok.Data;

@Data
public class JwtAuthResponse {
    private String token;
    private String refreshToken;
}
