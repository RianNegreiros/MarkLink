package com.github.riannegreiros.springboard.services;

import com.github.riannegreiros.springboard.dto.PostDto;
import com.github.riannegreiros.springboard.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    PostRepository postRepository;

    public List<PostDto> getPosts() {
        return postRepository.findAll()
                .stream()
                .map(postEntity -> new PostDto(postEntity.getId(), postEntity.getTitle(), postEntity.getDescription()))
                .collect(Collectors.toList());
    }

    public List<PostDto> getPostsByAuthor(UUID userId) {
        return postRepository.findAllByAuthor_Id(userId).stream()
                .map(postEntity -> new PostDto(postEntity.getId(), postEntity.getTitle(), postEntity.getDescription()))
                .collect(Collectors.toList());
    }
}
