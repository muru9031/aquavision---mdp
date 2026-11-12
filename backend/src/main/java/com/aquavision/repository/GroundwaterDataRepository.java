// src/main/java/com/aquavision/repository/GroundwaterDataRepository.java
package com.aquavision.repository;

import com.aquavision.entity.GroundwaterData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GroundwaterDataRepository extends JpaRepository<GroundwaterData, Long> {

    // Fetch all readings for a well, ordered chronologically
    List<GroundwaterData> findByWellIdOrderByRecordedDateAsc(Long wellId);
}

