package com.github.riannegreiros.springboard.dto;

import java.util.UUID;

public record PostDto(UUID id, String title, String description) {
}
