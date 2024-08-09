package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import com.project.CodeAssignmentManager.enums.AssignmentStatusEnum;
import lombok.Data;

@Data
public class CodeAssignmentEnumsDto {
    private AssignmentNumberEnum[] assignmentNumberEnums = AssignmentNumberEnum.values();
    private AssignmentStatusEnum[] assignmentStatusEnums = AssignmentStatusEnum.values();
}
