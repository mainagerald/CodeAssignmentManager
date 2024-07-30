package com.project.CodeAssignmentManager.repository;


import com.project.CodeAssignmentManager.enums.Role;
import com.project.CodeAssignmentManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User findByRole(Role role);
}
