package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import com.project.CodeAssignmentManager.model.User;
import lombok.Data;

@Data
public class CodeAssignmentClaimResponseDto {
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    private AssignmentNumberEnum assignmentNumber;
    private ReviewerDto reviewer;

    public CodeAssignmentClaimResponseDto(Long id, String status, String githubUrl, String branch, String codeReviewVideoUrl, AssignmentNumberEnum assignmentNumber, ReviewerDto reviewerDto) {

    }
}
