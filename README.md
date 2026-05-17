# Enterprise URL Shortener Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21-orange)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)

A cloud-native URL shortener platform built with microservices using Java 21, Spring Boot, and Next.js. Features JWT authentication, Redis caching, RabbitMQ asynchronous processing, Docker/Kubernetes support, and free-tier cloud deployment.

---

## 📐 Architecture

```text
                ┌────────────────┐
                │   Frontend     │  (Next.js + Tailwind on Vercel)
                └───────┬────────┘
                        │ HTTPS
                ┌───────▼────────┐
                │  API Gateway   │  (Spring Cloud Gateway + JWT + Rate Limit)
                └───┬────────┬───┘
                    │        │
        ┌───────────▼──┐  ┌──▼────────────────┐
        │ auth-service │  │ shortener-service │──┐
        └──────────────┘  └─────────┬─────────┘  │
                                    │            │ publishes
                                    │ Redis      ▼
                                    │      ┌───────────┐
                                    │      │ RabbitMQ  │ (CloudAMQP)
                                    │      └─────┬─────┘
                                    │            │
                                    │       ┌────▼──────────────┐
                                    │       │ analytics-consumer│
                                    │       └───────────────────┘
                                    │
                                ┌───▼────┐
                                │   H2   │ (file-persisted)
                                └────────┘
```
