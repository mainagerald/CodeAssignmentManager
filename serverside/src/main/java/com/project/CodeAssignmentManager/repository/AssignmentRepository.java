package com.project.CodeAssignmentManager.repository;

import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface AssignmentRepository extends JpaRepository<CodeAssignment, Long> {

    List<CodeAssignment> findByUser(User user);

//    Set<CodeAssignment> findByUserSet(User user);
}
