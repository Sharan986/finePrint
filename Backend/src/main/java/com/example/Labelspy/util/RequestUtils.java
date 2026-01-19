package com.example.Labelspy.util;

import jakarta.servlet.http.HttpServletRequest;

public class RequestUtils {

    public static String getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        return userId != null ? userId.toString() : null;
    }

    public static String getUserEmail(HttpServletRequest request) {
        Object email = request.getAttribute("userEmail");
        return email != null ? email.toString() : null;
    }

    public static String getIdToken(HttpServletRequest request) {
        Object token = request.getAttribute("idToken");
        return token != null ? token.toString() : null;
    }
}

