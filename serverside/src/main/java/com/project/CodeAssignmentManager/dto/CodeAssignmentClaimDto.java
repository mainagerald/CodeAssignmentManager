package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.model.User;
import lombok.Data;

@Data
public class CodeAssignmentClaimDto {
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    private ReviewerDto reviewer;
}
