// src/main/java/com/aquavision/repository/WellRepository.java
package com.aquavision.repository;

import com.aquavision.entity.Well;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WellRepository extends JpaRepository<Well, Long> {

    // Count by status (for KPI cards)
    long countByStatus(Well.WellStatus status);

    // Average depth across all wells
    @Query("SELECT AVG(w.currentLevel) FROM Well w")
    Double findAverageDepth();
}

