package com.github.riannegreiros.springboard.services;

import com.github.riannegreiros.springboard.dto.UserDto;
import com.github.riannegreiros.springboard.entities.PostEntity;
import com.github.riannegreiros.springboard.entities.UserEntity;
import com.github.riannegreiros.springboard.repositories.PostRepository;
import com.github.riannegreiros.springboard.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PostRepository postRepository;

    public Optional<UserDto> findByPostId(UUID postId) {
        PostEntity post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post does not exist for this user postId: " + postId));

        Optional<UserEntity> user = userRepository.findById(post.getAuthor().getId());

    return user.map(userEntity -> new UserDto(post.getAuthor().getId(), post.getAuthor().getName()));
    }
}
