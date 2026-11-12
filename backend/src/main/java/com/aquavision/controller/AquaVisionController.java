package com.aquavision.controller;

import com.aquavision.dto.*;
import com.aquavision.entity.*;
import com.aquavision.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AquaVisionController {

    private final WellRepository wellRepo;
    private final GroundwaterDataRepository gwRepo;
    private final PredictionRepository predRepo;
    private final ObjectMapper objectMapper;

    public AquaVisionController(
            WellRepository wellRepo,
            GroundwaterDataRepository gwRepo,
            PredictionRepository predRepo,
            ObjectMapper objectMapper) {
        this.wellRepo = wellRepo;
        this.gwRepo = gwRepo;
        this.predRepo = predRepo;
        this.objectMapper = objectMapper;
    }

    // 1. GET /api/dashboard/stats or /api/v1/kpi
    @GetMapping({"/dashboard/stats", "/v1/kpi"})
    public ResponseEntity<KpiResponse> getDashboardStats() {
        long totalWells = wellRepo.count();
        long criticalWells = wellRepo.countByStatus(Well.WellStatus.CRITICAL);
        long safeWells = wellRepo.countByStatus(Well.WellStatus.SAFE);
        Double avgDepth = wellRepo.findAverageDepth();

        int ghiScore = Math.max(0, 100 - (int)(criticalWells * 15));
        String ghiLabel = ghiScore >= 75 ? "Optimal"
                        : ghiScore >= 50 ? "Moderate"
                        : "Critical";

        return ResponseEntity.ok(new KpiResponse(
            totalWells,
            criticalWells,
            safeWells,
            avgDepth != null ? Math.round(avgDepth * 10.0) / 10.0 : 0.0,
            ghiScore,
            ghiLabel
        ));
    }

    // 2. GET /api/wells or /api/v1/wells/geo
    @GetMapping({"/wells", "/v1/wells/geo"})
    public ResponseEntity<List<WellGeoDto>> getWells() {
        List<WellGeoDto> dtos = wellRepo.findAll().stream()
            .map(w -> new WellGeoDto(
                w.getId(),
                w.getName(),
                w.getZone(),
                w.getLatitude().doubleValue(),
                w.getLongitude().doubleValue(),
                w.getStatus().name(),
                w.getCurrentLevel().doubleValue()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 3. GET /api/wells/{wellId}/forecast or /api/v1/timeseries/{wellId}
    @GetMapping({"/wells/{wellId}/forecast", "/v1/timeseries/{wellId}"})
    public ResponseEntity<List<TimeSeriesPoint>> getWellForecast(@PathVariable Long wellId) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM");
        List<TimeSeriesPoint> points = new ArrayList<>();

        List<GroundwaterData> history = gwRepo.findByWellIdOrderByRecordedDateAsc(wellId);
        String crossoverMonth = null;

        for (int i = 0; i < history.size(); i++) {
            GroundwaterData gw = history.get(i);
            String month = gw.getRecordedDate().format(fmt);
            boolean isLast = (i == history.size() - 1);
            points.add(new TimeSeriesPoint(
                month,
                gw.getWaterLevel().doubleValue(),
                isLast ? gw.getWaterLevel().doubleValue() : null
            ));
            if (isLast) crossoverMonth = month;
        }

        List<Prediction> preds = predRepo.findByWellIdOrderByForecastDateAsc(wellId);
        for (Prediction p : preds) {
            String month = p.getForecastDate().format(fmt);
            if (month.equals(crossoverMonth)) continue;
            points.add(new TimeSeriesPoint(
                month,
                null,
                p.getPredictedLevel().doubleValue()
            ));
        }

        return ResponseEntity.ok(points);
    }

    // 4. GET /api/wells/{wellId}/shap or /api/v1/shap/{wellId}
    @GetMapping({"/wells/{wellId}/shap", "/v1/shap/{wellId}"})
    public ResponseEntity<List<ShapFeatureDto>> getShapValues(@PathVariable Long wellId) {
        List<Prediction> latest = predRepo.findTop1ByWellIdOrderByGeneratedAtDesc(wellId);

        if (latest.isEmpty() || latest.get(0).getShapValuesJson() == null) {
            return ResponseEntity.ok(List.of());
        }

        try {
            Map<String, Double> raw = objectMapper.readValue(
                latest.get(0).getShapValuesJson(),
                new TypeReference<>() {}
            );

            Map<String, String> labels = Map.of(
                "rainfall", "Lack of Rainfall",
                "extraction", "High Ind. Extraction",
                "extraction_rate", "High Ind. Extraction",
                "temperature", "Temperature Rise",
                "soil_permeability", "Soil Permeability",
                "soil_moisture", "Soil Permeability"
            );

            List<ShapFeatureDto> result = raw.entrySet().stream()
                .map(e -> new ShapFeatureDto(
                    labels.getOrDefault(e.getKey(), e.getKey()),
                    Math.abs(e.getValue()) * (Math.abs(e.getValue()) <= 1.0 ? 100 : 1)
                ))
                .sorted(Comparator.comparingDouble(ShapFeatureDto::importance).reversed())
                .collect(Collectors.toList());

            return ResponseEntity.ok(result);

        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
