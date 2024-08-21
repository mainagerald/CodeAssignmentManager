package com.project.CodeAssignmentManager.dto;

import lombok.Data;

@Data
public class ReviewerDto {
    private Long id;
    private String email;

    public ReviewerDto(Long id, String email) {
        this.id = id;
        this.email = email;
    }
}
