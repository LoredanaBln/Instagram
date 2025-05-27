package main.repository;

import main.entity.Vote;
import main.entity.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IVoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUser_IdAndPost_Id(Long userId, Long postId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.post.id = :postId AND v.type = :type")
    long countByPostIdAndType(@Param("postId") Long postId, @Param("type") VoteType type);
    
    @Query("SELECT COALESCE(SUM(CASE WHEN vote.type = 'UPVOTE' THEN 1 WHEN vote.type = 'DOWN_VOTE' THEN -1 ELSE 0 END), 0) FROM Vote vote WHERE vote.post.id = :postId")
    long getVoteCountByPostId(@Param("postId") Long postId);
} 