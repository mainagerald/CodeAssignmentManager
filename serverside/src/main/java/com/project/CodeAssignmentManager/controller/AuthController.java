package com.project.CodeAssignmentManager.controller;


import com.project.CodeAssignmentManager.dto.JwtAuthResponse;
import com.project.CodeAssignmentManager.dto.SignInRequest;
import com.project.CodeAssignmentManager.dto.SignUpRequest;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<User> signUp(@RequestBody SignUpRequest signUpRequest){
        return ResponseEntity.ok(authService.signUp(signUpRequest));
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtAuthResponse> signIn(@RequestBody SignInRequest signInRequest){
        return ResponseEntity.ok(authService.signIn(signInRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtAuthResponse> refreshToken(@RequestBody String refreshToken){
        refreshToken = refreshToken.replace("\"", "");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody String token){
        return ResponseEntity.ok(authService.isTokenValid(token));
    }
}
