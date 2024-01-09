package com.github.riannegreiros.springboard.resolvers;

import com.github.riannegreiros.springboard.dto.PostDto;
import com.github.riannegreiros.springboard.dto.UserDto;
import com.github.riannegreiros.springboard.entities.PostEntity;
import com.github.riannegreiros.springboard.services.PostService;
import com.github.riannegreiros.springboard.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
public class PostResolver {

    @Autowired
    PostService postService;

    @Autowired
    UserService userService;

    @QueryMapping
    public List<PostDto> getPosts() {
        return postService.getPosts();
    }

    @SchemaMapping(typeName = "Post")
    public Optional<UserDto> author(PostEntity post) {
        var postId = post.getId();
        if (postId == null) {
            throw new RuntimeException("Post id can no be null");
        }

        return userService.findByPostId(postId);
    }

    @SchemaMapping(typeName = "User")
    public List<PostDto> posts(UUID userId) {
        if (userId == null) {
            throw new RuntimeException("User id can not be null");
        }

        return postService.getPostsByAuthor(userId);
    }
}
