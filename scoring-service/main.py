from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI()

class VoteRequest(BaseModel):
    user_id: int
    post_id: int
    is_upvote: bool
    voter_id: int
    is_comment: bool

class ScoreResponse(BaseModel):
    points: float
    voter_penalty: float

# Scoring constants
POST_UPVOTE_POINTS = 2.5
POST_DOWNVOTE_POINTS = -1.5
COMMENT_UPVOTE_POINTS = 5.0
COMMENT_DOWNVOTE_POINTS = -2.5
DOWNVOTE_COMMENT_PENALTY = -1.5  # Penalty for downvoting comments

@app.post("/calculate-score", response_model=ScoreResponse)
async def calculate_score(vote: VoteRequest):
    points = 0
    if vote.is_comment:  # Comment vote
        if vote.is_upvote:
            points = COMMENT_UPVOTE_POINTS
        else:
            points = COMMENT_DOWNVOTE_POINTS
    else:  # post vote
        if vote.is_upvote:
            points = POST_UPVOTE_POINTS
        else:
            points = POST_DOWNVOTE_POINTS
    
    # Apply voter penalty for downvoting comments
    voter_penalty = 0
    if vote.is_comment and not vote.is_upvote:
        voter_penalty = DOWNVOTE_COMMENT_PENALTY
    
    return ScoreResponse(points=points, voter_penalty=voter_penalty)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True) 