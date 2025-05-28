package main.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VoteType {
  UPVOTE,
  DOWN_VOTE;

  @JsonValue
  public String getValue() {
    return this.name();
  }

  @JsonCreator
  public static VoteType fromValue(String value) {
    try {
      return VoteType.valueOf(value);
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid vote type: " + value);
    }
  }
}
