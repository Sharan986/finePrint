package com.example.Labelspy.service;

import com.example.Labelspy.config.GeminiConfig;
import com.example.Labelspy.dto.AnalysisResult;
import com.example.Labelspy.dto.IngredientInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

    private final RestTemplate restTemplate;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;

    public AnalysisResult analyzeImage(MultipartFile image) throws Exception {

        String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
        String mimeType = image.getContentType();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gemini-2.5-flash");

        Map<String, Object> textPart = Map.of("text", getPrompt());
        Map<String, Object> imagePart = Map.of(
                "inline_data", Map.of(
                        "mime_type", mimeType,
                        "data", base64Image
                )
        );

        Map<String, Object> content = Map.of(
                "parts", new Object[]{imagePart, textPart}
        );

        requestBody.put("contents", new Object[]{content});

        Map<String, Object> generationConfig = Map.of(
                "temperature", 0.2,
                "maxOutputTokens", 10000,
                "responseMimeType", "application/json"
        );
        requestBody.put("generationConfig", generationConfig);

        Map<String, Object> safetySettings = Map.of(
                "category", "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold", "BLOCK_LOW_AND_ABOVE"
        );
        requestBody.put("safetySettings", new Object[]{safetySettings});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                geminiConfig.getApiUrl() + "?key=" + geminiConfig.getApiKey(),
                HttpMethod.POST,
                entity,
                String.class
        );

        return parseResponse(response.getBody());
    }

    private String getPrompt() {
        return """
            Analyze the ingredient list from this product image and return structured information.
            
            Extract ALL ingredients you can identify and for each one provide:
            1. Name (standardized name)
            2. E-number if applicable
            3. Category (Preservative, Color, Emulsifier, Sweetener, etc.)
            4. Purpose (what it does in the product)
            5. Simple description (what it is)
            6. Alternative names (common aliases)
            7. Origin (Natural, Synthetic, or Both)
            8. General safety note (if known)
            
            IMPORTANT: Return ONLY valid JSON with this exact structure:
            {
              "scanId": "generate-a-random-uuid",
              "ingredients": [
                {
                  "name": "ingredient name",
                  "eNumber": "E100 or null",
                  "category": "category",
                  "purpose": "what it does",
                  "description": "simple description",
                  "alternativeNames": ["alias1", "alias2"],
                  "origin": "Natural/Synthetic/Both",
                  "safetyNote": "general information"
                }
              ],
              "summary": "brief overall summary",
            }
            
            Be factual and objective. No medical claims.
            """;
    }

    private AnalysisResult parseResponse(String responseBody) throws Exception {
        log.debug("Raw Gemini response: {}", responseBody);

        JsonNode root = objectMapper.readTree(responseBody);

        JsonNode promptFeedback = root.path("promptFeedback");
        if (!promptFeedback.isMissingNode() && !promptFeedback.path("blockReason").isMissingNode()) {
            String blockReason = promptFeedback.path("blockReason").asText();
            throw new RuntimeException("Gemini blocked the prompt: " + blockReason);
        }

        JsonNode candidates = root.path("candidates");
        if (candidates.isMissingNode() || !candidates.isArray() || candidates.size() == 0) {
            throw new RuntimeException("No candidates found in Gemini response");
        }


        JsonNode firstCandidate = candidates.get(0);

        String finishReason = firstCandidate.path("finishReason").asText();
        if (!"STOP".equals(finishReason)) {
            log.warn("Gemini finish reason: {}", finishReason);
        }

        JsonNode content = firstCandidate.path("content");
        JsonNode parts = content.path("parts");
        if (parts.isMissingNode() || !parts.isArray() || parts.size() == 0) {
            throw new RuntimeException("No content parts found in Gemini response");
        }

        String jsonText = parts.get(0).path("text").asText();


        jsonText = jsonText
                .replace("```json", "")
                .replace("```", "")
                .trim();

        return objectMapper.readValue(jsonText, AnalysisResult.class);
    }
}