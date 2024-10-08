package com.project.CodeAssignmentManager.service;

import com.project.CodeAssignmentManager.dto.CommentCreateDto;
import com.project.CodeAssignmentManager.dto.CommentResponseDto;
import com.project.CodeAssignmentManager.model.Comment;
import com.project.CodeAssignmentManager.model.User;

import java.util.List;
import java.util.Set;

public interface CommentService {
    CommentResponseDto createComment(CommentCreateDto createDto);
    Set<CommentResponseDto> getComments(Long assignmentId);
    void deleteComment(Long commentId);
    CommentResponseDto editComment(Long id, CommentCreateDto createDto, User logged);
}
