package com.example.Labelspy.interceptor;

import com.example.Labelspy.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class FirebaseAuthInterceptor implements HandlerInterceptor {

    private final FirebaseAuthService firebaseAuthService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        if (path.equals("/api/health") || path.startsWith("/api/public")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        boolean isScanPath = path.equals("/api/scan");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (isScanPath) {
                // optional auth for scan endpoint
                log.info("No auth header for scan; proceeding unauthenticated");
                return true;
            } else {
                sendError(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Missing or invalid Authorization header");
                return false;
            }
        }

        String idToken = authHeader.substring(7);

        try {
            String userId = firebaseAuthService.getUserId(idToken);
            String email = firebaseAuthService.getUserEmail(idToken);

            request.setAttribute("userId", userId);
            request.setAttribute("userEmail", email);
            request.setAttribute("idToken", idToken);

            log.debug("Authenticated user: {} ({})", userId, email);
            return true;
        } catch (FirebaseAuthException e) {
            log.warn("Firebase authentication failed: {}", e.getMessage());
            if (isScanPath) {
                log.debug("Invalid token for scan; proceeding unauthenticated");
                return true;
            } else {
                sendError(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid or expired token: " + e.getMessage());
                return false;
            }
        }
    }


    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\": \"" + message.replace("\"", "\\\"") + "\"}");
    }
}

