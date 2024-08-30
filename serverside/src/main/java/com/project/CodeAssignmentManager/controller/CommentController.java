package com.project.CodeAssignmentManager.controller;

import com.project.CodeAssignmentManager.dto.CommentCreateDto;
import com.project.CodeAssignmentManager.dto.CommentResponseDto;
import com.project.CodeAssignmentManager.model.Comment;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<CommentResponseDto> addComment(@Valid @RequestBody CommentCreateDto createDto, @AuthenticationPrincipal User user){
        return ResponseEntity.ok(commentService.createComment(createDto));
    }
    @GetMapping("/comments{id}")
    public ResponseEntity<Set<CommentResponseDto>> getComments(@RequestParam Long id){
        return ResponseEntity.ok(commentService.getComments(id));
    }
}
