package com.example.Labelspy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    private String uid;
    private String email;
    private String displayName;
    private Map<String, Integer> ingredientCounts;
    private List<ScanSummary> scanHistory;
}
