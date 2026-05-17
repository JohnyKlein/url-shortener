package com.urlshortener.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.data.redis.url=redis://localhost:6379",
        "app.jwt.secret=test-secret-key-test-secret-key-test-secret-32"
})
class ApiGatewayApplicationTests {
    @Test
    void contextLoads() {}
}
