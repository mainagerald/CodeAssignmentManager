package com.project.CodeAssignmentManager.enums;

import lombok.Getter;

@Getter
public enum AssignmentNumberEnum {
    ASSIGNMENT_1(1, "simple"),
    ASSIGNMENT_2(2, "mid-medium"),
    ASSIGNMENT_3(3, "medium"),
    ASSIGNMENT_4(4, "mid-hard"),
    ASSIGNMENT_5(5, "hard"),
    ASSIGNMENT_6(6, "professional"),
    ASSIGNMENT_7(7, "word-class"),
    ASSIGNMENT_8(8, "legendary"),
    ASSIGNMENT_9(9, "ultimate");

    private final Integer assignmentNumber;
    private final String name;

    AssignmentNumberEnum(Integer assignmentNumber, String name) {
        this.assignmentNumber = assignmentNumber;
        this.name = name;
    }
}
