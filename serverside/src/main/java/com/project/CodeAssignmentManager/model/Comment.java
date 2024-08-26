package com.project.CodeAssignmentManager.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
    @ManyToOne
    private CodeAssignment assignment;
    @Column(columnDefinition = "TEXT")
    private String text;
}
