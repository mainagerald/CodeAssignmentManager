package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponseDto {
    private Long id;
    private String text;
    private LocalDateTime createdAt;
    private Long createdBy;
    private String username;
}
