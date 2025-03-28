package main.repository;

import java.util.Optional;
import main.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
}
