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

    @Column(name = "water_level", nullable = false, precision = 6, scale = 2)
    private BigDecimal waterLevel;

    @Column(name = "extraction_rate", precision = 8, scale = 2)
    private BigDecimal extractionRate;

    // Getters
    public Long getId()               { return id; }
    public Well getWell()             { return well; }
    public LocalDate getRecordedDate(){ return recordedDate; }
    public BigDecimal getRainfall()   { return rainfall; }
    public BigDecimal getTemperature(){ return temperature; }
    public BigDecimal getWaterLevel() { return waterLevel; }
    public BigDecimal getExtractionRate() { return extractionRate; }
}

