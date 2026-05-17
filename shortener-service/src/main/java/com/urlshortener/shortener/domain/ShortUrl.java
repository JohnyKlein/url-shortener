package com.urlshortener.shortener.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "short_urls", indexes = {
        @Index(name = "idx_short_code", columnList = "shortCode", unique = true),
        @Index(name = "idx_owner", columnList = "ownerId")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShortUrl {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 16)
    private String shortCode;

    @Column(nullable = false, length = 2048)
    private String originalUrl;

    @Column(length = 64)
    private String ownerId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private long hits = 0L;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
