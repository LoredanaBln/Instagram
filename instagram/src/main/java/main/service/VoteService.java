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
    private final ScoreService scoreService;

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

        Vote savedVote;
        if (existingVote != null) {
            if (existingVote.getType() == voteType) {
                // If same vote type, remove the vote and subtract points
                scoreService.calculateScore(existingVote, true);
                voteRepository.delete(existingVote);
                savedVote = null;
            } else {
                // If different vote type, update the vote and recalculate points
                scoreService.calculateScore(existingVote, true);
                existingVote.setType(voteType);
                savedVote = voteRepository.save(existingVote);
                scoreService.calculateScore(savedVote, false);
            }
        } else {
            Vote vote = new Vote();
            vote.setPost(post);
            vote.setUser(user);
            vote.setType(voteType);
            savedVote = voteRepository.save(vote);
            scoreService.calculateScore(savedVote, false);
        }

        return savedVote;
    }

    public VoteCountDTO getVoteCount(Long postId) {
        long upvotes = voteRepository.countByPostIdAndType(postId, VoteType.UPVOTE);
        long downvotes = voteRepository.countByPostIdAndType(postId, VoteType.DOWN_VOTE);
        long totalCount = voteRepository.getVoteCountByPostId(postId);
        
        return new VoteCountDTO(postId, totalCount, upvotes, downvotes);
    }
} 