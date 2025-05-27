package main.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import main.entity.Tag;
import main.repository.ITagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TagService {
  private final ITagRepository tagRepository;

  private String cleanTagName(String tagName) {
    String cleanTag = tagName.trim();
    return cleanTag.startsWith("#") ? cleanTag : "#" + cleanTag;
  }

  @Transactional
  public Set<Tag> createOrGetTags(List<String> tagNames) {
    if (tagNames == null || tagNames.isEmpty()) {
      return Set.of();
    }

    return tagNames.stream()
        .map(this::cleanTagName)
        .map(
            cleanTagName -> {
              // First try to find existing tag
              return tagRepository
                  .findByTitle(cleanTagName)
                  .orElseGet(
                      () -> {
                        // If not found, create and save new tag
                        Tag newTag = new Tag();
                        newTag.setTitle(cleanTagName);
                        return tagRepository.save(newTag);
                      });
            })
        .collect(Collectors.toSet());
  }

  @Transactional
  public void deleteUnusedTags() {
    List<Tag> unusedTags =
        tagRepository.findAll().stream()
            .filter(tag -> tag.getPosts().isEmpty())
            .collect(Collectors.toList());
    tagRepository.deleteAll(unusedTags);
  }
}
