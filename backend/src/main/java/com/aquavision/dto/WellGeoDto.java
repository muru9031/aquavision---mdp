// src/main/java/com/aquavision/dto/WellGeoDto.java
package com.aquavision.dto;

public record WellGeoDto(
    Long   id,
    String name,
    String zone,
    double latitude,
    double longitude,
    String status,
    double currentLevel
) {}

