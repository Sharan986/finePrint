package com.example.Labelspy.controller;

import com.example.Labelspy.dto.AnalysisResult;
import com.example.Labelspy.dto.TopIngredientDto;
import com.example.Labelspy.dto.UserDto;
import com.example.Labelspy.service.FirestoreService;
import com.example.Labelspy.service.GeminiService;
import com.example.Labelspy.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {
    private final GeminiService geminiService;
    private final FirestoreService firestoreService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanIngredients(
            @RequestParam("file") MultipartFile image,
            HttpServletRequest request) {
        try {
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please upload an image"));
            }

            if (!isValidImage(image)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Only JPEG and PNG images are allowed"));
            }

            AnalysisResult result = geminiService.analyzeImage(image);

            String userId = RequestUtils.getUserId(request);
            if (userId != null) {
                try {
                    firestoreService.incrementIngredientCounts(userId, result);
                    log.info("Ingredient counts updated for user: {}", userId);
                    firestoreService.addScanHistory(userId, result);
                    log.info("Scan History Updated {}", userId);
                } catch (Exception e) {
                    log.warn("Failed to update ingredient counts: {}", e.getMessage());
                }
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Scan failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }


    @GetMapping("/user/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        try {
            String userId = RequestUtils.getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            UserDto user = firestoreService.getUserById(userId);
            if (user == null) {
                // Create user profile if doesn't exist
                String email = RequestUtils.getUserEmail(request);
                user = UserDto.builder()
                        .uid(userId)
                        .email(email)
                        .displayName(email.split("@")[0])
                        .ingredientCounts(Map.of())
                        .build();
                user = firestoreService.createOrUpdateUser(user);
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error getting user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get user profile: " + e.getMessage()));
        }
    }

    @PostMapping("/user/profile")
    public ResponseEntity<?> createOrUpdateUserProfile(
            @RequestBody(required = false) UserDto partialDto,  // ← key change
            HttpServletRequest request) {

        try {
            String userId  = RequestUtils.getUserId(request);
            String email   = RequestUtils.getUserEmail(request);

            if (userId == null || email == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            UserDto userToSave = UserDto.builder()
                    .uid(userId)
                    .email(email)
                    .build();

            if (partialDto != null) {
                if (partialDto.getDisplayName() != null) {
                    userToSave.setDisplayName(partialDto.getDisplayName());
                }
            } else {
                userToSave.setDisplayName(email.split("@")[0]);
            }

            UserDto saved = firestoreService.createOrUpdateUser(userToSave);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            log.error("Error updating user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update user profile: " + e.getMessage()));
        }
    }


    @DeleteMapping("/user/profile")
    public ResponseEntity<?> deleteUserProfile(HttpServletRequest request) {
        try {
            String userId = RequestUtils.getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            firestoreService.deleteUser(userId);
            return ResponseEntity.ok(Map.of("message", "User account deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/user/top-ingredients")
    public ResponseEntity<?> getTopIngredients(HttpServletRequest request) {
        try {
            String userId = RequestUtils.getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            List<TopIngredientDto> topIngredients = firestoreService.getTopIngredients(userId, 10);
            return ResponseEntity.ok(topIngredients);
        } catch (Exception e) {
            log.error("Error getting top ingredients: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to get top ingredients: " + e.getMessage()));
        }
    }
    @GetMapping("/user/scan-history")
    public ResponseEntity<?> getScanHistory(HttpServletRequest request) {
        try {
            String userId = RequestUtils.getUserId(request);
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            UserDto user = firestoreService.getUserById(userId);
            return ResponseEntity.ok(user.getScanHistory());
        } catch (Exception e) {
            log.error("Error getting scan history: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get scan history"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("LabelSpy is running");
    }

    private boolean isValidImage(MultipartFile image) {
        String contentType = image.getContentType();
        return contentType != null &&
                (contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jpg"));
    }
}

