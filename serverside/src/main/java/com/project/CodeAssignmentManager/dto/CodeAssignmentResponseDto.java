package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import lombok.Data;

@Data
public class CodeAssignmentResponseDto {
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    private AssignmentNumberWrapper assignmentNumberWrapper;

    @Data
    public static class AssignmentNumberWrapper {
        private String name;
        private Integer assignmentNumber;

        public AssignmentNumberWrapper(AssignmentNumberEnum assignmentNumber) {
            this.name = assignmentNumber.getName();
            this.assignmentNumber = assignmentNumber.getAssignmentNumber();
        }
    }

    public void setAssignmentNumber(AssignmentNumberEnum assignmentNumber) {
        this.assignmentNumberWrapper = new AssignmentNumberWrapper(assignmentNumber);
    }
}