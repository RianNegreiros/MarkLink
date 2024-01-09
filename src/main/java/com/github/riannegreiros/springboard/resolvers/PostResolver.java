package com.github.riannegreiros.springboard.resolvers;

import com.github.riannegreiros.springboard.dto.PostDto;
import com.github.riannegreiros.springboard.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class PostResolver {

    @Autowired
    PostService postService;

    @QueryMapping
    public List<PostDto> getPosts() {
        return postService.getPosts();
    }
}
