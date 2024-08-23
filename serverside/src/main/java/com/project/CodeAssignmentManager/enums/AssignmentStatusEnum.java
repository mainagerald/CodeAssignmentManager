package com.project.CodeAssignmentManager.enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AssignmentStatusEnum {
    PENDING_SUBMISSION("Pending Submission", 1),
    SUBMITTED("Submitted", 2),
    IN_REVIEW("In review", 3),
    NEEDS_UPDATE("Needs update", 4),
    COMPLETED("Completed", 5),
    RESUBMITTED("Resubmitted", 6);

    private final String status;
    private final Integer step;

    AssignmentStatusEnum(String status, Integer step) {
        this.status = status;
        this.step = step;
    }
    public String getStatus(){
        return status;
    }
    public Integer getStep(){
        return step;
    }
}
