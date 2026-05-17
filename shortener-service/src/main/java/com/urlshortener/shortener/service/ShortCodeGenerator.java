package com.urlshortener.shortener.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.UUID;

@Component
public class ShortCodeGenerator {

    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int BASE = ALPHABET.length();
    private static final int CODE_LEN = 7;

    private final SecureRandom random = new SecureRandom();

    /**
     * Generates a 7-char base62 code combining UUID entropy with random padding.
     */
    public String generate() {
        long mix = (UUID.randomUUID().getMostSignificantBits() ^ random.nextLong()) & Long.MAX_VALUE;
        StringBuilder sb = new StringBuilder(CODE_LEN);
        for (int i = 0; i < CODE_LEN; i++) {
            sb.append(ALPHABET.charAt((int) (mix % BASE)));
            mix /= BASE;
            if (mix == 0) mix = random.nextLong() & Long.MAX_VALUE;
        }
        return sb.toString();
    }
}
