package com.project.CodeAssignmentManager.service.impl;

import com.project.CodeAssignmentManager.dto.CommentCreateDto;
import com.project.CodeAssignmentManager.dto.CommentResponseDto;
import com.project.CodeAssignmentManager.exceptions.NotFoundException;
import com.project.CodeAssignmentManager.exceptions.UnauthorizedException;
import com.project.CodeAssignmentManager.model.CodeAssignment;
import com.project.CodeAssignmentManager.model.Comment;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.repository.AssignmentRepository;
import com.project.CodeAssignmentManager.repository.CommentRepository;
import com.project.CodeAssignmentManager.repository.UserRepository;
import com.project.CodeAssignmentManager.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private static final Logger log = LoggerFactory.getLogger(CommentServiceImpl.class);
    private final CommentRepository commentRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    @Override
    public CommentResponseDto createComment(CommentCreateDto createDto) {
        User reviewer = userRepository.findById(createDto.getCreatedBy()).orElseThrow(()->new NotFoundException("User not found"));
        CodeAssignment assignment = assignmentRepository.findById(createDto.getAssignment()).orElseThrow(()->new NotFoundException("Assignment Not Found"));
        if (assignment.getReviewer().getId().equals(reviewer.getId())){
            Comment newComment = new Comment();
            newComment.setCreatedBy(reviewer);
            newComment.setText(createDto.getText());
            newComment.setAssignment(assignment);
            newComment.setCreatedAt(LocalDateTime.now());
            var savedComment = commentRepository.save(newComment);

            CommentResponseDto responseDto = new CommentResponseDto();
            responseDto.setCreatedAt(savedComment.getCreatedAt());
            responseDto.setText(savedComment.getText());
            responseDto.setCreatedBy(savedComment.getCreatedBy().getId());
            return responseDto;
        }else {
            throw new UnauthorizedException("Unauthorized to comment");
        }
    }

    @Override
    public Set<CommentResponseDto> getComments(Long assignmentId) {
        log.info("getting comments for id: {}", assignmentId);
        return commentRepository.findByAssignmentId(assignmentId)
                .stream().map(this::convertToListDto).collect(Collectors.toSet());
    }

    private CommentResponseDto convertToListDto(Comment comment){
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedBy(comment.getCreatedBy().getId());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
