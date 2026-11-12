// src/main/java/com/aquavision/repository/PredictionRepository.java
package com.aquavision.repository;

import com.aquavision.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    // Fetch future predictions for a specific well, latest model run
    List<Prediction> findByWellIdOrderByForecastDateAsc(Long wellId);

    // Latest SHAP values (most recent prediction row for each well)
    List<Prediction> findTop1ByWellIdOrderByGeneratedAtDesc(Long wellId);
}

