package main.repository;

import java.util.Optional;
import main.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITagRepository extends JpaRepository<Tag, Long> {
  Optional<Tag> findByTitle(String tagName);
}