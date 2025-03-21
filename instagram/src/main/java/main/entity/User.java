package main.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  @Column(name = "image_path")
  private String imagePath;

  private String email;

  @Enumerated(EnumType.STRING)
  private UserType role;

  private double score;

  private boolean isBanned;

  @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
  private List<Post> posts = new ArrayList<>();

  @PrePersist
  protected void onCreate() {
    this.role = UserType.USER;
    this.score = 0.0;
    this.isBanned = false;
  }
}
