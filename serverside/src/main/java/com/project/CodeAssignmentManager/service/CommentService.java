package com.project.CodeAssignmentManager.service;

import com.project.CodeAssignmentManager.dto.CommentCreateDto;
import com.project.CodeAssignmentManager.dto.CommentResponseDto;
import com.project.CodeAssignmentManager.model.Comment;

import java.util.List;
import java.util.Set;

public interface CommentService {
    CommentResponseDto createComment(CommentCreateDto createDto);
    Set<CommentResponseDto> getComments(Long assignmentId);
}
