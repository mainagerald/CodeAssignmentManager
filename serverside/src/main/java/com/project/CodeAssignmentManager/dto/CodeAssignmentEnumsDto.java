package com.project.CodeAssignmentManager.dto;

import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import com.project.CodeAssignmentManager.enums.AssignmentStatusEnum;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class CodeAssignmentEnumsDto {
    private AssignmentNumberEnum[] assignmentNumberEnums;
    private AssignmentStatusEnum[] assignmentStatusEnums;

    public CodeAssignmentEnumsDto(AssignmentStatusEnum[] assignmentStatusEnums, AssignmentNumberEnum[] assignmentNumberEnums) {
            this.assignmentNumberEnums = assignmentNumberEnums;
            this.assignmentStatusEnums = assignmentStatusEnums;
    }
}
