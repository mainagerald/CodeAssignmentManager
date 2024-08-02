package com.project.CodeAssignmentManager.dto;
import lombok.Data;

@Data
public class CodeAssignmentResponseDto {
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    private Long userId;
}

