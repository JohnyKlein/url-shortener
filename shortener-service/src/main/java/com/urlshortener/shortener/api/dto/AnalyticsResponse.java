package com.urlshortener.shortener.api.dto;

public record AnalyticsResponse(String shortCode, long hits, String originalUrl) {}
