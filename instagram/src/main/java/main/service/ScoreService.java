package main.service;

import lombok.*;
import main.entity.User;
import main.entity.Vote;
import main.entity.VoteType;
import main.repository.IUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.annotation.JsonProperty;

import static main.config.Constants.SCORING_SERVICE_URL;

@Service
@RequiredArgsConstructor
public class ScoreService {
    private final IUserRepository userRepository;
    private final RestTemplate restTemplate;

    public void calculateScore(Vote vote, boolean isRemoving) {
        try {
            // Check if the post has a parent to determine if it's a comment
            boolean isComment = vote.getPost().getParent() != null;
            
            var request = new ScoreRequest(
                vote.getPost().getAuthor().getId().intValue(),
                vote.getPost().getId().intValue(),
                vote.getType() == VoteType.UPVOTE,
                vote.getUser().getId().intValue(),
                isComment
            );


            var response = restTemplate.postForObject(
                    SCORING_SERVICE_URL + "/calculate-score",
                        request,
                        ScoreResponse.class
            );


            User user = vote.getPost().getAuthor();
            // If removing points, multiply by -1
            double pointsToAdd = isRemoving ? -response.getPoints() : response.getPoints();
            user.setScore(user.getScore() + pointsToAdd);
            userRepository.save(user);

            if (response.getVoterPenalty() != 0) {
                User voter = vote.getUser();
                // If removing points, multiply by -1
                double penaltyToAdd = isRemoving ? -response.getVoterPenalty() : response.getVoterPenalty();
                voter.setScore(voter.getScore() + penaltyToAdd);
                userRepository.save(voter);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate score: " + e.getMessage());
        }
    }
}

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
class ScoreRequest {
    @JsonProperty("user_id")
    private Integer userId;
    
    @JsonProperty("post_id")
    private Integer postId;
    
    @JsonProperty("is_upvote")
    private Boolean isUpvote;
    
    @JsonProperty("voter_id")
    private Integer voterId;

    @JsonProperty("is_comment")
    private Boolean isComment;

    @Override
    public String toString() {
        return String.format("ScoreRequest{userId=%d, postId=%d, isUpvote=%s, voterId=%d, isComment=%s}",
            userId, postId, isUpvote, voterId, isComment);
    }
}

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
class ScoreResponse {
    private Double points;
    
    @JsonProperty("voter_penalty")
    private Double voterPenalty;

    @Override
    public String toString() {
        return String.format("ScoreResponse{points=%.2f, voterPenalty=%.2f}",
            points, voterPenalty);
    }
} 