package com.github.riannegreiros.springboard.services;

import com.github.riannegreiros.springboard.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    @Autowired
    PostRepository postRepository;
}
