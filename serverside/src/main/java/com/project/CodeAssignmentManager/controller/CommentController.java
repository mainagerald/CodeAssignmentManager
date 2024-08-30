package com.project.CodeAssignmentManager.controller;

import com.project.CodeAssignmentManager.dto.CommentCreateDto;
import com.project.CodeAssignmentManager.dto.CommentResponseDto;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/comments")
public class CommentController {
    private static final Logger log = LoggerFactory.getLogger(CommentController.class);
    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<CommentResponseDto> addComment(@Valid @RequestBody CommentCreateDto createDto, @AuthenticationPrincipal User user){
        return ResponseEntity.ok(commentService.createComment(createDto));
    }
    @GetMapping("/comments{id}")
    public ResponseEntity<Set<CommentResponseDto>> getComments(@RequestParam Long id){
        return ResponseEntity.ok(commentService.getComments(id));
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> removeComment(@PathVariable Long id){
        log.info("deleting commentId: {}", id);
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
