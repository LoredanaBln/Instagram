package main.service;

import lombok.RequiredArgsConstructor;
import main.entity.Post;
import main.entity.User;
import main.repository.IPostRepository;
import main.repository.IUserRepository;
import main.service.dto.PostDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final IPostRepository commentRepository;
    private final IPostRepository postRepository;
    private final IUserRepository userRepository;

    public List<PostDTO> getAll() {
        return commentRepository.findAll()
            .stream()
            .map(PostDTO::withRelationships)
            .collect(Collectors.toList());
    }

    public PostDTO createComment(PostDTO request) {
        // TODO: Implement validation for each edge case

        Long authorId = request.getRelationships().getAuthor().getId();
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + authorId));

        Post post = new Post();
        post.setTitle(request.getAttributes().getTitle());
        post.setText(request.getAttributes().getText());
        post.setImagePath(request.getAttributes().getImagePath());
        post.setAuthor(author);

        return PostDTO.withRelationships(commentRepository.save(post));
    }

    public Post updateComment(Long id, String newText) {
        Post post = commentRepository.findById(id).orElseThrow();
        post.setText(newText);
        return commentRepository.save(post);
    }
}
