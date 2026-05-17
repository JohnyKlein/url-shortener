package com.urlshortener.shortener.repository;

import com.urlshortener.shortener.domain.ShortUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShortUrlRepository extends JpaRepository<ShortUrl, UUID> {
    Optional<ShortUrl> findByShortCode(String shortCode);
    boolean existsByShortCode(String shortCode);
    List<ShortUrl> findAllByOwnerIdOrderByCreatedAtDesc(String ownerId);

    @Modifying
    @Query("update ShortUrl s set s.hits = s.hits + 1 where s.shortCode = :code")
    void incrementHits(@Param("code") String code);
}
