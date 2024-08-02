package com.project.CodeAssignmentManager.service;

import com.project.CodeAssignmentManager.dto.CodeAssignmentListResponseDto;
import com.project.CodeAssignmentManager.dto.CodeAssignmentResponseDto;
import com.project.CodeAssignmentManager.dto.CodeAssignmentUpdateDto;
import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;

import java.util.List;
import java.util.Optional;

public interface AssignmentService {

    CodeAssignmentResponseDto createAssignment(User user);
    List<CodeAssignmentListResponseDto> findByUser(User user);
    Optional<CodeAssignmentResponseDto> findById(Long id);
    CodeAssignmentResponseDto updateAssignment(Long id, CodeAssignmentUpdateDto codeAssignmentDto, User user);
}
