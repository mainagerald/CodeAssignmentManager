package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import lombok.Data;

@Data
public class CodeAssignmentListResponseDto {
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private CodeAssignmentResponseDto.AssignmentNumberWrapper assignmentNumber;

    public void setAssignmentNumber(AssignmentNumberEnum assignmentNumber) {
        this.assignmentNumber = new CodeAssignmentResponseDto.AssignmentNumberWrapper(assignmentNumber);
    }
}