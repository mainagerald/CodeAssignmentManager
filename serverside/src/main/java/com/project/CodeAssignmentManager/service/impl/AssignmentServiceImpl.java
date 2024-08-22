package com.project.CodeAssignmentManager.service.impl;

import com.project.CodeAssignmentManager.dto.*;
import com.project.CodeAssignmentManager.enums.AssignmentStatusEnum;
import com.project.CodeAssignmentManager.enums.AuthoritiesEnum;
import com.project.CodeAssignmentManager.exceptions.AssignmentClaimedException;
import com.project.CodeAssignmentManager.exceptions.InvalidAssignmentOrderException;
import com.project.CodeAssignmentManager.exceptions.NotFoundException;
import com.project.CodeAssignmentManager.exceptions.UnauthorizedException;
import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.repository.AssignmentRepository;
import com.project.CodeAssignmentManager.service.AssignmentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {
    private static final Logger log = LoggerFactory.getLogger(AssignmentServiceImpl.class);
    @Autowired
    private final AssignmentRepository assignmentRepository;
    @Override
    @Transactional
    public CodeAssignmentResponseDto createAssignment(CodeAssignmentCreateDto createDto, User user) {
        Optional<CodeAssignment> lastAssignment = assignmentRepository.findTopByUserOrderByAssignmentNumberDesc(user);

        int nextAssignmentNumber = lastAssignment.map(assignment -> assignment.getAssignmentNumber().getAssignmentNumber() + 1).orElse(1);

        if (createDto.getAssignmentNumber().getAssignmentNumber() != nextAssignmentNumber) {
            log.info("trying number: {}", createDto);
            throw new InvalidAssignmentOrderException("You must complete assignments in order. The next assignment you can submit is " + nextAssignmentNumber);
        }

        CodeAssignment assignment = new CodeAssignment();
        assignment.setStatus(AssignmentStatusEnum.PENDING_SUBMISSION.getStatus());
        assignment.setGithubUrl(createDto.getGithubUrl());
        assignment.setBranch(createDto.getBranch());
        assignment.setCodeReviewVideoUrl(createDto.getCodeReviewVideoUrl());
        assignment.setAssignmentNumber(createDto.getAssignmentNumber());
        assignment.setUser(user);

        CodeAssignment savedAssignment = assignmentRepository.save(assignment);
        return convertToResponseDto(savedAssignment);
    }

    @Override
    public List<CodeAssignmentListResponseDto> findByUser(User user) {
        boolean isReviewer = user.getAuthorities().stream().anyMatch(auth -> AuthoritiesEnum.REVIEWER.name()
                .equals(auth.getAuthority()));
        log.info("boolean reviewer: {}", isReviewer);
        if(isReviewer){
            return assignmentRepository.findByReviewer(user).stream()
                    .map(this::convertToListResponseDto)
                    .collect(Collectors.toList());
        } else{
            return assignmentRepository.findByUser(user).stream()
                    .map(this::convertToListResponseDto)
                    .collect(Collectors.toList());
        }

    }

    @Override
    public Optional<CodeAssignmentResponseDto> findById(Long id) {
        return assignmentRepository.findById(id).map(this::convertToResponseDto);
    }

    @Override
    @Transactional
    public CodeAssignmentResponseDto updateAssignment(Long id, CodeAssignmentUpdateDto codeAssignmentDto, User user) {
        return assignmentRepository.findById(id)
                .map(existingAssignment -> {
                    if (!existingAssignment.getUser().getId().equals(user.getId())) {
                        throw new UnauthorizedException("Unauthorized user");
                    }
                    if(existingAssignment.getReviewer()!=null && existingAssignment.getReviewer().getId().equals(user.getId())){
                        existingAssignment.setCodeReviewVideoUrl(codeAssignmentDto.getCodeReviewVideoUrl());
                    }
                    updateAssignmentFromDto(existingAssignment, codeAssignmentDto);
                    return convertToResponseDto(assignmentRepository.save(existingAssignment));
                })
                .orElseThrow(() -> new NotFoundException("Assignment with the given id not found"));
    }
    @Override
    @Transactional
    public CodeAssignmentResponseDto reviewAssignment(Long id, CodeAssignmentUpdateDto codeAssignmentDto, User user) {
        return assignmentRepository.findById(id)
                .map(existingAssignment -> {
                    if(existingAssignment.getReviewer()!=null && existingAssignment.getReviewer().getId().equals(user.getId())){
                        existingAssignment.setCodeReviewVideoUrl(codeAssignmentDto.getCodeReviewVideoUrl());
                    } else{
                        throw new UnauthorizedException("Unauthorized review");
                    }
                    updateAssignmentFromDto(existingAssignment, codeAssignmentDto);
                    return convertToResponseDto(assignmentRepository.save(existingAssignment));
                })
                .orElseThrow(() -> new NotFoundException("Assignment with the given id not found"));
    }

    @Override
    @Transactional
    public CodeAssignmentClaimResponseDto claimAssignment(Long id, User reviewer) {
        CodeAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Assignment not found"));

        // already claimed
        if (assignment.getReviewer() != null) {
            throw new IllegalStateException("Assignment already claimed by another reviewer");
        }

        if (!reviewer.getRole().name().equals("REVIEWER")) {
            throw new UnauthorizedException("User does not have permission to claim this assignment");
        }
        assignment.setReviewer(reviewer);
        assignment.setStatus(AssignmentStatusEnum.IN_REVIEW.getStatus());
        assignmentRepository.save(assignment);

        return mapToClaimResponseDto(assignment);
    }

    private CodeAssignmentResponseDto convertToResponseDto(CodeAssignment assignment) {
        CodeAssignmentResponseDto dto = new CodeAssignmentResponseDto();
        dto.setId(assignment.getId());
        dto.setStatus(assignment.getStatus());
        dto.setGithubUrl(assignment.getGithubUrl());
        dto.setBranch(assignment.getBranch());
        dto.setCodeReviewVideoUrl(assignment.getCodeReviewVideoUrl());
        dto.setAssignmentNumber(assignment.getAssignmentNumber());
        return dto;
    }


    private CodeAssignmentListResponseDto convertToListResponseDto(CodeAssignment assignment) {
        CodeAssignmentListResponseDto dto = new CodeAssignmentListResponseDto();
        dto.setId(assignment.getId());
        dto.setStatus(assignment.getStatus());
        dto.setBranch(assignment.getBranch());
        dto.setGithubUrl(assignment.getGithubUrl());
        dto.setAssignmentNumber(assignment.getAssignmentNumber());
//        dto.setUserId(assignment.getUser().getId());
        return dto;
    }

    private void updateAssignmentFromDto(CodeAssignment assignment, CodeAssignmentUpdateDto dto) {
        assignment.setStatus(dto.getStatus());
        assignment.setBranch(dto.getBranch());
        assignment.setGithubUrl(dto.getGithubUrl());
//        assignment.setCodeReviewVideoUrl(dto.getCodeReviewVideoUrl());
//        if (dto.getAssignmentNumber() != null) {
//            assignment.setAssignmentNumber(dto.getAssignmentNumber());
//        }
    }
    private CodeAssignmentClaimResponseDto mapToClaimResponseDto(CodeAssignment assignment) {
        return new CodeAssignmentClaimResponseDto(
                assignment.getId(),
                assignment.getStatus(),
                assignment.getGithubUrl(),
                assignment.getBranch(),
                assignment.getCodeReviewVideoUrl(),
                assignment.getAssignmentNumber(),
                new ReviewerDto(assignment.getReviewer().getId(), assignment.getReviewer().getEmail())
        );
    }
}