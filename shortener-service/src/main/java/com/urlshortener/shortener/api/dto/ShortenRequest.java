package com.urlshortener.shortener.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record ShortenRequest(
        @NotNull @NotEmpty @Size(max = 10) List<UrlEntry> urls
) {
    public record UrlEntry(
            @jakarta.validation.constraints.NotBlank
            @jakarta.validation.constraints.Pattern(regexp = "^https?://.+", message = "Must be a valid http(s) URL")
            String url,
            Instant expiresAt
    ) {}
}
