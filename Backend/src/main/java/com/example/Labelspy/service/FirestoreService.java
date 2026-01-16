package com.example.Labelspy.service;

import com.example.Labelspy.dto.*;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FirestoreService {

    private final Firestore firestore;

    private static final String USERS_COLLECTION = "users";


    public UserDto createOrUpdateUser(UserDto userDto) {
        try {
            Map<String, Object> userData = convertUserToMap(userDto);
            firestore.collection(USERS_COLLECTION).document(userDto.getUid()).set(userData);
            log.info("User created/updated: {}", userDto.getUid());
            return getUserById(userDto.getUid());
        } catch (Exception e) {
            log.error("Error creating/updating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create/update user", e);
        }
    }

    public UserDto getUserById(String userId) {
        try {
            DocumentSnapshot document = firestore.collection(USERS_COLLECTION)
                    .document(userId)
                    .get()
                    .get();

            if (!document.exists()) {
                return null;
            }

            return convertMapToUser(document.getData(), userId);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error getting user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get user", e);
        }
    }


    public void deleteUser(String userId) {
        try {
            firestore.collection(USERS_COLLECTION).document(userId).delete();
            log.info("User deleted: {}", userId);
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user", e);
        }
    }


    public void incrementIngredientCounts(String userId, AnalysisResult analysisResult) {
        try {
            firestore.runTransaction((Transaction.Function<Void>) transaction -> {
                DocumentReference userRef = firestore.collection(USERS_COLLECTION).document(userId);
                DocumentSnapshot userDoc = transaction.get(userRef).get();

                Map<String, Integer> currentCounts = new HashMap<>();
                if (userDoc.exists() && userDoc.get("ingredientCounts") instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> countsMap = (Map<String, Object>) userDoc.get("ingredientCounts");
                    for (Map.Entry<String, Object> entry : countsMap.entrySet()) {
                        if (entry.getValue() instanceof Number) {
                            currentCounts.put(entry.getKey(), ((Number) entry.getValue()).intValue());
                        }
                    }
                }

                if (analysisResult.getIngredients() != null) {
                    for (var ingredient : analysisResult.getIngredients()) {
                        String ingredientName = ingredient.getName();
                        if (ingredientName != null && !ingredientName.trim().isEmpty()) {
                            currentCounts.put(ingredientName, currentCounts.getOrDefault(ingredientName, 0) + 1);
                        }
                    }
                }


                transaction.update(userRef, "ingredientCounts", currentCounts);
                return null;
            }).get();
            log.info("Ingredient counts updated for user: {}", userId);
        } catch (Exception e) {
            log.error("Error incrementing ingredient counts: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update ingredient counts", e);
        }
    }


    public List<TopIngredientDto> getTopIngredients(String userId, int limit) {
        try {
            UserDto user = getUserById(userId);
            if (user == null || user.getIngredientCounts() == null || user.getIngredientCounts().isEmpty()) {
                return new ArrayList<>();
            }

            return user.getIngredientCounts().entrySet().stream()
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .limit(limit)
                    .map(entry -> TopIngredientDto.builder()
                            .ingredientName(entry.getKey())
                            .count(entry.getValue())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting top ingredients: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get top ingredients", e);
        }
    }

    public void addScanHistory(String userId, AnalysisResult result) {
        try {
            firestore.runTransaction((Transaction.Function<Void>) transaction -> {
                DocumentReference userRef = firestore.collection(USERS_COLLECTION).document(userId);
                DocumentSnapshot userDoc = transaction.get(userRef).get();

                List<Map<String, Object>> currentHistory = new ArrayList<>();
                if (userDoc.exists() && userDoc.get("scanHistory") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> historyList = (List<Map<String, Object>>) userDoc.get("scanHistory");
                    currentHistory.addAll(historyList);
                }

                ScanSummary summary = new ScanSummary();
                summary.setScanId(result.getScanId());
                summary.setTimestamp(LocalDateTime.now());
                summary.setIngredientNames(result.getIngredients().stream()
                        .map(IngredientInfo::getName)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()));

                currentHistory.add(convertScanSummaryToMap(summary));

                transaction.update(userRef, "scanHistory", currentHistory);
                return null;
            }).get();
            log.info("Scan history added for user: {}", userId);
        } catch (Exception e) {
            log.error("Error adding scan history: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to add scan history", e);
        }
    }


    private Map<String, Object> convertUserToMap(UserDto userDto) {
        Map<String, Object> map = new HashMap<>();
        map.put("uid", userDto.getUid());
        map.put("email", userDto.getEmail());
        map.put("displayName", userDto.getDisplayName());
        map.put("ingredientCounts", userDto.getIngredientCounts() != null ? userDto.getIngredientCounts() : new HashMap<>());

        List<Map<String, Object>> historyMaps = Optional.ofNullable(userDto.getScanHistory())
                .orElse(new ArrayList<>())
                .stream()
                .map(this::convertScanSummaryToMap)
                .collect(Collectors.toList());
        map.put("scanHistory", historyMaps);

        return map;
    }

    @SuppressWarnings("unchecked")
    private UserDto convertMapToUser(Map<String, Object> data, String userId) {
        UserDto.UserDtoBuilder builder = UserDto.builder()
                .uid(userId)
                .email((String) data.get("email"))
                .displayName((String) data.get("displayName"));


        if (data.get("ingredientCounts") instanceof Map) {
            Map<String, Object> countsMap = (Map<String, Object>) data.get("ingredientCounts");
            Map<String, Integer> ingredientCounts = new HashMap<>();
            for (Map.Entry<String, Object> entry : countsMap.entrySet()) {
                if (entry.getValue() instanceof Number) {
                    ingredientCounts.put(entry.getKey(), ((Number) entry.getValue()).intValue());
                }
            }
            builder.ingredientCounts(ingredientCounts);
        } else {
            builder.ingredientCounts(new HashMap<>());
        }


        if (data.get("scanHistory") instanceof List) {
            List<Map<String, Object>> historyList = (List<Map<String, Object>>) data.get("scanHistory");
            List<ScanSummary> scanHistory = historyList.stream().map(item -> {
                ScanSummary summary = new ScanSummary();
                summary.setScanId((String) item.get("scanId"));
                summary.setTimestamp(LocalDateTime.parse((String) item.get("timestamp"))); // Assume ISO format
                @SuppressWarnings("unchecked")
                List<String> ingredientNames = (List<String>) item.get("ingredientNames");
                summary.setIngredientNames(ingredientNames);
                return summary;
            }).collect(Collectors.toList());
            builder.scanHistory(scanHistory);
        } else {
            builder.scanHistory(new ArrayList<>());
        }
        return builder.build();
    }

    private Map<String, Object> convertScanSummaryToMap(ScanSummary summary) {
        Map<String, Object> map = new HashMap<>();
        map.put("scanId", summary.getScanId());
        map.put("timestamp", summary.getTimestamp().toString()); // Store as ISO string
        map.put("ingredientNames", summary.getIngredientNames() != null ? summary.getIngredientNames() : new ArrayList<>());
        return map;
    }
}
