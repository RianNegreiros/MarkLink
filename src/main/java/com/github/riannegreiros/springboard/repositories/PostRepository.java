package com.github.riannegreiros.springboard.repositories;

import com.github.riannegreiros.springboard.entities.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, UUID> {
    List<PostEntity> findAllByAuthor_Id(UUID authorId);
}
