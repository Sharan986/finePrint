package com.example.Labelspy.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirebaseAuthService {

    private final FirebaseAuth firebaseAuth;

    /**
     * Validates Firebase ID token and returns decoded token
     * @param idToken Firebase ID token from client
     * @return Decoded FirebaseToken containing user information
     * @throws FirebaseAuthException if token is invalid
     */
    public FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        try {
            return firebaseAuth.verifyIdToken(idToken);
        } catch (FirebaseAuthException e) {
            log.error("Firebase token verification failed: {}", e.getMessage());
            throw e;
        }
    }

    /**
     * Gets user ID from Firebase token
     * @param idToken Firebase ID token
     * @return User UID
     * @throws FirebaseAuthException if token is invalid
     */
    public String getUserId(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = verifyToken(idToken);
        return decodedToken.getUid();
    }

    /**
     * Gets user email from Firebase token
     * @param idToken Firebase ID token
     * @return User email
     * @throws FirebaseAuthException if token is invalid
     */
    public String getUserEmail(String idToken) throws FirebaseAuthException {
        FirebaseToken decodedToken = verifyToken(idToken);
        return decodedToken.getEmail();
    }
}

