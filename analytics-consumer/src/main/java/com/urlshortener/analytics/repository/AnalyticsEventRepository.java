package com.urlshortener.analytics.repository;

import com.urlshortener.analytics.domain.AnalyticsEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEventEntity, UUID> {
    long countByShortCode(String shortCode);
}
