package com.example.Labelspy.dto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ScanSummary {
    private String scanId;
    private LocalDateTime timestamp;
    private List<String> ingredientNames; // Simplified: just names for dashboard
}
