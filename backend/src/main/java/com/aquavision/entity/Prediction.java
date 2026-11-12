// src/main/java/com/aquavision/entity/Prediction.java
package com.aquavision.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "well_id", nullable = false)
    private Well well;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Column(name = "predicted_level", nullable = false, precision = 6, scale = 2)
    private BigDecimal predictedLevel;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    // Stored as raw JSON text, serialised from Python SHAP output
    @Column(name = "shap_values_json", columnDefinition = "JSON")
    private String shapValuesJson;

    // Getters
    public Long getId()                  { return id; }
    public Well getWell()                { return well; }
    public LocalDate getForecastDate()   { return forecastDate; }
    public LocalDateTime getGeneratedAt(){ return generatedAt; }
    public BigDecimal getPredictedLevel(){ return predictedLevel; }
    public String getModelVersion()      { return modelVersion; }
    public String getShapValuesJson()    { return shapValuesJson; }
}

