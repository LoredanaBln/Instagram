package main.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "tag")
public class Tag {
  @Id
  @Column(name = "id", nullable = false)
  private Long tag_id;

  @ManyToOne
  @JoinColumn(name = "post_post_id")
  private Post post;

  private String title;
}
