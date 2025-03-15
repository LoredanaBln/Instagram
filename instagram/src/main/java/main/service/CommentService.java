package main.service;

import lombok.RequiredArgsConstructor;
import main.entity.Comment;
import main.entity.User;
import main.repository.ICommentRepository;
import main.repository.IPostRepository;
import main.repository.IUserRepository;
import main.service.dto.CommentDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final ICommentRepository commentRepository;
    private final IPostRepository postRepository;
    private final IUserRepository userRepository;

    public List<CommentDTO> getAll() {
        return commentRepository.findAll()
            .stream()
            .map(CommentDTO::withRelationships)
            .collect(Collectors.toList());
    }

    public CommentDTO createComment(CommentDTO request) {
        // TODO: Implement validation for each edge case

        Long authorId = request.getRelationships().getAuthor().getId();
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + authorId));

        Comment comment = new Comment();
        comment.setText(request.getAttributes().getText());
        comment.setImagePath(request.getAttributes().getImagePath());
        comment.setAuthor(author);

        return CommentDTO.withRelationships(commentRepository.save(comment));
    }

    public Comment updateComment(Long id, String newText) {
        Comment comment = commentRepository.findById(id).orElseThrow();
        comment.setText(newText);
        return commentRepository.save(comment);
    }
}
