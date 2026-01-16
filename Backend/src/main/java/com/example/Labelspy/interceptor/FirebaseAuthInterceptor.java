package com.example.Labelspy.interceptor;

import com.example.Labelspy.service.FirebaseAuthService;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class FirebaseAuthInterceptor implements HandlerInterceptor {

    private final FirebaseAuthService firebaseAuthService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // public endpoints here
        String path = request.getRequestURI();
        if (path.equals("/api/health") || path.equals("/api/scan")|| path.startsWith("/api/public")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Missing or invalid Authorization header\"}");
            return false;
        }

        String idToken = authHeader.substring(7);

        try {
            // verify token
            String userId = firebaseAuthService.getUserId(idToken);
            String email = firebaseAuthService.getUserEmail(idToken);
            
            request.setAttribute("userId", userId);
            request.setAttribute("userEmail", email);
            request.setAttribute("idToken", idToken);
            
            log.debug("Authenticated user: {} ({})", userId, email);
            return true;
        } catch (FirebaseAuthException e) {
            log.warn("Firebase authentication failed: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or expired token: " + e.getMessage() + "\"}");
            return false;
        }
    }
}

