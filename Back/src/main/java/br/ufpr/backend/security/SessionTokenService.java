package br.ufpr.backend.security;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class SessionTokenService {
    private static final Duration LIFETIME = Duration.ofHours(8);
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public IssuedToken issue(AuthenticatedUser user) {
        Instant expiresAt = Instant.now().plus(LIFETIME);
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessions.put(token, new Session(user, expiresAt));
        sessions.entrySet().removeIf(entry -> !entry.getValue().expiresAt().isAfter(Instant.now()));
        return new IssuedToken(token, expiresAt);
    }

    public AuthenticatedUser resolve(String token) {
        Session session = sessions.get(token);
        if (session == null) {
            return null;
        }
        if (!session.expiresAt().isAfter(Instant.now())) {
            sessions.remove(token, session);
            return null;
        }
        return session.user();
    }

    public void revoke(String token) {
        sessions.remove(token);
    }

    public record IssuedToken(String value, Instant expiresAt) {}
    private record Session(AuthenticatedUser user, Instant expiresAt) {}
}
