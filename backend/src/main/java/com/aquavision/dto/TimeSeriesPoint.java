// src/main/java/com/aquavision/dto/TimeSeriesPoint.java
package com.aquavision.dto;

public record TimeSeriesPoint(
    String month,
    Double level,      // historical — null for future months
    Double predicted   // forecasted — null for historical months
) {}

