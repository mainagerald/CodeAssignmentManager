package com.project.CodeAssignmentManager.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CodeAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String status;
    private String githubUrl;
    private String branch;
    private String codeReviewVideoUrl;
    @ManyToOne(optional = false)
    private User user;
}
