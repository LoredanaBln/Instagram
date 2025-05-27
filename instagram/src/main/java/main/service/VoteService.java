package main.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import main.entity.Post;
import main.entity.User;
import main.entity.Vote;
import main.entity.VoteType;
import main.repository.IPostRepository;
import main.repository.IVoteRepository;
import main.service.dto.VoteCountDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final IVoteRepository voteRepository;
    private final IPostRepository postRepository;
    private final AuthenticationService authenticationService;

    @Transactional
    public Vote vote(Long postId, VoteType voteType, HttpSession session) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User user = authenticationService.getAuthenticatedUser(session);

        if (post.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("Users cannot vote on their own posts");
        }

        Vote existingVote = voteRepository.findByUser_IdAndPost_Id(user.getId(), postId)
                .orElse(null);

        if (existingVote != null) {
            if (existingVote.getType() == voteType) {
                voteRepository.delete(existingVote);
                return null;
            } else {
                existingVote.setType(voteType);
                return voteRepository.save(existingVote);
            }
        }

        Vote vote = new Vote();
        vote.setPost(post);
        vote.setUser(user);
        vote.setType(voteType);
        return voteRepository.save(vote);
    }

    public VoteCountDTO getVoteCount(Long postId) {
        long upvotes = voteRepository.countByPostIdAndType(postId, VoteType.UPVOTE);
        long downvotes = voteRepository.countByPostIdAndType(postId, VoteType.DOWN_VOTE);
        long totalCount = voteRepository.getVoteCountByPostId(postId);
        
        return new VoteCountDTO(postId, totalCount, upvotes, downvotes);
    }
} 