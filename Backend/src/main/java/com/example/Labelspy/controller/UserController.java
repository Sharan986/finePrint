package com.example.Labelspy.controller;

import com.example.Labelspy.dto.AnalysisResult;
import com.example.Labelspy.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final GeminiService geminiService;

    @PostMapping("/scan")
    public ResponseEntity<?> scanIngredients(@RequestParam("file") MultipartFile image) {
        try {
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body("Please upload an image");
            }

            if (!isValidImage(image)) {
                return ResponseEntity.badRequest().body("Only JPEG and PNG images are allowed");
            }

            AnalysisResult result = geminiService.analyzeImage(image);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Analysis failed: " + e.getMessage());
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

