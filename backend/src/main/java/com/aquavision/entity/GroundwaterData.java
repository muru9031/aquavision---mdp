// src/main/java/com/aquavision/entity/GroundwaterData.java
package com.aquavision.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "groundwater_data")
public class GroundwaterData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "well_id", nullable = false)
    private Well well;

    @Column(name = "recorded_date", nullable = false)
    private LocalDate recordedDate;

    @Column(precision = 7, scale = 2)
    private BigDecimal rainfall;

    @Column(precision = 5, scale = 2)
    private BigDecimal temperature;

    @Column(name = "soil_moisture", precision = 5, scale = 2)
    private BigDecimal soilMoisture;

    @Column(name = "water_level", nullable = false, precision = 6, scale = 2)
    private BigDecimal waterLevel;

    @Column(name = "extraction_rate", precision = 8, scale = 2)
    private BigDecimal extractionRate;

    // Getters and Setters
    public Long getId()               { return id; }
    public Well getWell()             { return well; }
    public void setWell(Well well)    { this.well = well; }
    public LocalDate getRecordedDate(){ return recordedDate; }
    public void setRecordedDate(LocalDate recordedDate) { this.recordedDate = recordedDate; }
    public BigDecimal getRainfall()   { return rainfall; }
    public void setRainfall(BigDecimal rainfall) { this.rainfall = rainfall; }
    public BigDecimal getTemperature(){ return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
    public BigDecimal getSoilMoisture(){ return soilMoisture; }
    public void setSoilMoisture(BigDecimal soilMoisture) { this.soilMoisture = soilMoisture; }
    public BigDecimal getWaterLevel() { return waterLevel; }
    public void setWaterLevel(BigDecimal waterLevel) { this.waterLevel = waterLevel; }
    public BigDecimal getExtractionRate() { return extractionRate; }
    public void setExtractionRate(BigDecimal extractionRate) { this.extractionRate = extractionRate; }
}
