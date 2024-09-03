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
        var username = reviewer.getUsername();
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
            responseDto.setUsername(username);
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

    @Override
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(()->new NotFoundException("No comment found with the given id"));
        commentRepository.deleteById(commentId);
    }

    @Override
    public CommentResponseDto editComment(Long id, CommentCreateDto createDto, User logged) {
        User editor = userRepository.findById(createDto.getCreatedBy()).orElseThrow(()-> new NotFoundException("No user attached to comment"));
        if(!editor.getId().equals(logged.getId())){
          throw new UnauthorizedException("User unauthorized to edit the comment");
        }
        Comment comment = commentRepository.findById(id).orElseThrow(()-> new NotFoundException("No comment with the given id!"));
        comment.setText(createDto.getText());
        comment.setCreatedAt(LocalDateTime.now());
        var savedComment = commentRepository.save(comment);
        CommentResponseDto responseDto = new CommentResponseDto();
        responseDto.setText(savedComment.getText());
        responseDto.setCreatedAt(savedComment.getCreatedAt());
        responseDto.setCreatedBy(savedComment.getCreatedBy().getId());
        responseDto.setId(savedComment.getId());
        responseDto.setUsername(editor.getFirstName());
        return responseDto;
    }

    private CommentResponseDto convertToListDto(Comment comment){
        User creator = userRepository.findById(comment.getCreatedBy().getId()).orElseThrow(()-> new NotFoundException("Commenter not found"));
        var username = creator.getFirstName();
        log.info("logging creator: {}", creator);
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setText(comment.getText());
        dto.setCreatedBy(creator.getId());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUsername(username);
        return dto;
    }
}
