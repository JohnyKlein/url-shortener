package com.urlshortener.analytics.messaging;

import java.time.Instant;

public record AnalyticsEvent(
        String shortCode,
        Instant timestamp,
        String ip,
        String userAgent,
        String referer
) {}
