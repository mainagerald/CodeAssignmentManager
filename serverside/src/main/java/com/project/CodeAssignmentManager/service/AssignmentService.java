package com.project.CodeAssignmentManager.service;

import com.project.CodeAssignmentManager.dto.*;
import com.project.CodeAssignmentManager.model.User;

import java.util.List;
import java.util.Optional;

public interface AssignmentService {

    CodeAssignmentResponseDto createAssignment(CodeAssignmentCreateDto createDto, User user);
    List<CodeAssignmentListResponseDto> findByUser(User user);
    Optional<CodeAssignmentResponseDto> findById(Long id);
    CodeAssignmentResponseDto updateAssignment(Long id, CodeAssignmentUpdateDto codeAssignmentDto, User user);
    CodeAssignmentClaimResponseDto claimAssignment(Long id, User reviewer);
}