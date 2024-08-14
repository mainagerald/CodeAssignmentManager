package com.project.CodeAssignmentManager.repository;

import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<CodeAssignment, Long> {
    List<CodeAssignment> findByUser(User user);
    Optional<CodeAssignment> findTopByUserOrderByAssignmentNumberDesc(User user);
}
