package com.project.CodeAssignmentManager.service;

import com.project.CodeAssignmentManager.dto.JwtAuthResponse;
import com.project.CodeAssignmentManager.dto.RefreshTokenRequest;
import com.project.CodeAssignmentManager.dto.SignInRequest;
import com.project.CodeAssignmentManager.dto.SignUpRequest;
import com.project.CodeAssignmentManager.model.User;

public interface AuthService {
    User signUp(SignUpRequest signUpRequest);
    JwtAuthResponse signIn(SignInRequest signInRequest);
    JwtAuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);
    boolean isTokenValid(String token);
}
