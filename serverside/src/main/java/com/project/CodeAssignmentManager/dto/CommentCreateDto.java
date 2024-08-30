package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;
import lombok.Data;

@Data
public class CommentCreateDto {
    private String text;
    private Long createdBy;
    private Long assignment;
}
