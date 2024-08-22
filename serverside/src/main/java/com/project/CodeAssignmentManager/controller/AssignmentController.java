package com.project.CodeAssignmentManager.controller;

import com.project.CodeAssignmentManager.dto.*;
import com.project.CodeAssignmentManager.enums.AssignmentNumberEnum;
import com.project.CodeAssignmentManager.enums.AssignmentStatusEnum;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;

    @PostMapping("/create")
    public ResponseEntity<CodeAssignmentResponseDto> addAssignment(@RequestBody CodeAssignmentCreateDto codeAssignmentCreateDto,@AuthenticationPrincipal User user) {
        CodeAssignmentResponseDto assignment = assignmentService.createAssignment(codeAssignmentCreateDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @GetMapping("/fetch")
    public ResponseEntity<List<CodeAssignmentListResponseDto>> getAssignments(@AuthenticationPrincipal User user) {
        List<CodeAssignmentListResponseDto> assignments = assignmentService.findByUser(user);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<CodeAssignmentResponseDto> getAssignmentById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return assignmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("update/{id}")
    public ResponseEntity<CodeAssignmentResponseDto> updateAssignment(
            @PathVariable Long id,
            @RequestBody CodeAssignmentUpdateDto codeAssignmentDto,
            @AuthenticationPrincipal User user) {
        CodeAssignmentResponseDto updatedAssignment = assignmentService.updateAssignment(id, codeAssignmentDto, user);
        return ResponseEntity.ok(updatedAssignment);
    }
    @PutMapping("/claim/{id}")
    public ResponseEntity<CodeAssignmentClaimResponseDto> claimAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal User reviewer
    ) {
        // TODO: throw custom exceptions
        CodeAssignmentClaimResponseDto claimedAssignment = assignmentService.claimAssignment(id, reviewer);
        return ResponseEntity.ok(claimedAssignment);
    }
    @PutMapping("/review/{id}")
    public ResponseEntity<CodeAssignmentResponseDto> reviewAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal User reviewer,
            @RequestBody CodeAssignmentUpdateDto codeAssignmentUpdateDto
    ){
        CodeAssignmentResponseDto reviewedAssignment = assignmentService.reviewAssignment(id, codeAssignmentUpdateDto, reviewer);
        return ResponseEntity.ok(reviewedAssignment);
    }


    @GetMapping("/enums")
    public ResponseEntity<CodeAssignmentEnumsDto> getEnums(@AuthenticationPrincipal User user){
        CodeAssignmentEnumsDto dto = new CodeAssignmentEnumsDto(
                AssignmentStatusEnum.values(),
                AssignmentNumberEnum.values()
        );
        return ResponseEntity.ok(dto);
    }
}