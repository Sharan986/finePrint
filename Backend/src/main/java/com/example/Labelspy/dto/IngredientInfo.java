package com.example.Labelspy.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IngredientInfo {
    private String name;
    @JsonProperty("eNumber")
    private String eNumber;
    private String category;
    private String purpose;
    private String description;
    private List<String> alternativeNames;
    private String origin;
    private String safetyNote;
}
