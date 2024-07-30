// src/main/java/com/example/demoSecurity/service/impl/UserServiceImpl.java
package com.project.CodeAssignmentManager.service.impl;

import com.project.CodeAssignmentManager.repository.UserRepository;
import com.project.CodeAssignmentManager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));
    }
}
