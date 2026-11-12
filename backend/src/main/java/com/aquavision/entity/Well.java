// src/main/java/com/aquavision/entity/Well.java
package com.aquavision.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "wells")
public class Well {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String zone;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WellStatus status;

    @Column(name = "current_level", nullable = false, precision = 6, scale = 2)
    private BigDecimal currentLevel;

    @Column(name = "installation_date")
    private LocalDate installationDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // --- Enum ---
    public enum WellStatus { SAFE, VULNERABLE, CRITICAL }

    // --- Getters & Setters ---
    public Long getId()                        { return id; }
    public String getName()                    { return name; }
    public String getZone()                    { return zone; }
    public BigDecimal getLatitude()            { return latitude; }
    public BigDecimal getLongitude()           { return longitude; }
    public WellStatus getStatus()              { return status; }
    public BigDecimal getCurrentLevel()        { return currentLevel; }
    public LocalDate getInstallationDate()     { return installationDate; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
}

