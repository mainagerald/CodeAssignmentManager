package com.project.CodeAssignmentManager.repository;

import com.project.CodeAssignmentManager.dto.CodeAssignmentListResponseDto;
import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<CodeAssignment, Long> {
    List<CodeAssignment> findByUser(User user);
    Optional<CodeAssignment> findTopByUserOrderByAssignmentNumberDesc(User user);
    @Query("select a from CodeAssignment a "
            + "where (a.status = 'submitted' and (a.reviewer is null or a.reviewer = :reviewer))"
            +"or a.reviewer = :reviewer ")
    List<CodeAssignment> findByReviewer(User reviewer);
}
