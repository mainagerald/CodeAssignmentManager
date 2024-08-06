package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import lombok.Data;

@Data
public class CodeAssignmentCreateDto {
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    private AssignmentNumberEnum assignmentNumber;
}