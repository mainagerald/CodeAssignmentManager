package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import com.project.CodeAssignmentManager.enums.AssignmentStatusEnum;
import com.project.CodeAssignmentManager.model.Comment;
import lombok.Data;

@Data
public class CodeAssignmentListResponseDto {
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private AssignmentNumberEnum assignmentNumber;
    private AssignmentNumberEnum[] assignmentNumberEnums = AssignmentNumberEnum.values();
    private AssignmentStatusEnum[] assignmentStatusEnums = AssignmentStatusEnum.values();

}