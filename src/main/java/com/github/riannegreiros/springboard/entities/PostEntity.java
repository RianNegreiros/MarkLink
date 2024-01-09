package com.github.riannegreiros.springboard.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "tb_posts")
public class PostEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "UUID")
    private UUID id;

    @Column
    private String title;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private UserEntity author;

    public PostEntity() {
    }

    public PostEntity(UUID id, String title, String description, UserEntity author) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserEntity getAuthor() {
        return author;
    }

    public void setAuthor(UserEntity author) {
        this.author = author;
    }
}
