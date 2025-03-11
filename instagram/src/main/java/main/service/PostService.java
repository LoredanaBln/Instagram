package main.service;

import main.entity.Post;
import main.entity.User;
import main.repository.IPostRepository;
import main.repository.IUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final IPostRepository postRepository;
    private final IUserRepository userRepository;

    public PostService(IPostRepository postRepository, IUserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Post createPost(Long userId, Post post) {
        User user = userRepository.findById(userId).orElseThrow();
        post.setAuthor(user);
        return postRepository.save(post);
    }

    List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreationTimeDesc();
    }

}
