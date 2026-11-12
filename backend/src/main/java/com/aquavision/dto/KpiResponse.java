// src/main/java/com/aquavision/dto/KpiResponse.java
package com.aquavision.dto;

public record KpiResponse(
    long    totalWells,
    long    criticalWells,
    long    safeWells,
    double  avgDepthToWater,
    int     ghiScore,
    String  ghiLabel
) {}

// ----------------------------------------------------------------
// src/main/java/com/aquavision/dto/WellGeoDto.java
// ----------------------------------------------------------------
// package com.aquavision.dto;
// public record WellGeoDto(
//     Long   id,
//     String name,
//     String zone,
//     double latitude,
//     double longitude,
//     String status,
//     double currentLevel
// ) {}

// ----------------------------------------------------------------
// src/main/java/com/aquavision/dto/TimeSeriesPoint.java
// ----------------------------------------------------------------
// public record TimeSeriesPoint(
//     String month,
//     Double level,     // historical – null for future points
//     Double predicted  // forecasted – null for past points
// ) {}

// ----------------------------------------------------------------
// src/main/java/com/aquavision/dto/ShapFeatureDto.java
// ----------------------------------------------------------------
// public record ShapFeatureDto(String feature, double importance) {}

