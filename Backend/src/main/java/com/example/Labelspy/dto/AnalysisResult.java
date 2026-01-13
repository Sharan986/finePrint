package com.example.Labelspy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnalysisResult {
    private String scanId;
    private List<IngredientInfo> ingredients;
    private String summary;
}