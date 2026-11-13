-- ============================================================
-- AquaVision AI - Full Database Schema
-- Run this on your MySQL instance: aquavision_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS aquavision_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aquavision_db;

-- -------------------------------------------------------
-- TABLE 1: wells
-- Master record for each physical monitoring borewell
-- -------------------------------------------------------
CREATE TABLE wells (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL,
    zone            VARCHAR(50)     NOT NULL COMMENT 'e.g. Zone A, Zone B',
    latitude        DECIMAL(10, 7)  NOT NULL,
    longitude       DECIMAL(10, 7)  NOT NULL,
    status          ENUM('SAFE','VULNERABLE','CRITICAL') NOT NULL DEFAULT 'SAFE',
    current_level   DECIMAL(6, 2)   NOT NULL COMMENT 'Depth to water in meters',
    installation_date DATE          NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_wells_status (status),
    INDEX idx_wells_zone (zone)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- TABLE 2: groundwater_data
-- Periodic sensor/field observations per well
-- -------------------------------------------------------
CREATE TABLE groundwater_data (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    well_id         BIGINT          NOT NULL,
    recorded_date   DATE            NOT NULL,
    rainfall        DECIMAL(7, 2)   NULL     COMMENT 'mm of rainfall that day',
    temperature     DECIMAL(5, 2)   NULL     COMMENT 'Surface temp in Celsius',
    water_level     DECIMAL(6, 2)   NOT NULL COMMENT 'Depth to water in meters',
    soil_moisture   DECIMAL(5, 2)   NULL     COMMENT 'Percentage',
    extraction_rate DECIMAL(8, 2)   NULL     COMMENT 'Cubic meters extracted',
    PRIMARY KEY (id),
    UNIQUE KEY uq_well_date (well_id, recorded_date),
    FOREIGN KEY (well_id) REFERENCES wells(id) ON DELETE CASCADE,
    INDEX idx_gw_date (recorded_date),
    INDEX idx_gw_well (well_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- TABLE 3: predictions
-- ML model output stored after every forecast run
-- -------------------------------------------------------
CREATE TABLE predictions (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    well_id         BIGINT          NOT NULL,
    forecast_date   DATE            NOT NULL COMMENT 'Target date being predicted',
    generated_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP COMMENT 'When ML ran',
    predicted_level DECIMAL(6, 2)   NOT NULL COMMENT 'Forecasted depth in meters',
    model_version   VARCHAR(50)     NULL     DEFAULT 'LSTM-XGBoost-v1',
    shap_values_json JSON           NULL     COMMENT 'Serialised SHAP feature contributions',
    PRIMARY KEY (id),
    UNIQUE KEY uq_well_forecast (well_id, forecast_date),
    FOREIGN KEY (well_id) REFERENCES wells(id) ON DELETE CASCADE,
    INDEX idx_pred_well (well_id),
    INDEX idx_pred_date (forecast_date)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- SEED DATA — Tamil Nadu, India Monitoring Borewells
-- -------------------------------------------------------
INSERT INTO wells (id, name, zone, latitude, longitude, status, current_level, installation_date) VALUES
  (1, 'Coimbatore Central',  'Zone West',    11.0168, 76.9558, 'SAFE',       16.5, '2019-03-10'),
  (2, 'Chennai Metro Basin',  'Zone North',   13.0827, 80.2707, 'VULNERABLE', 18.2, '2020-07-22'),
  (3, 'Madurai Vaigai Aquifer','Zone South',   9.9252,  78.1198, 'CRITICAL',   22.1, '2018-11-05'),
  (4, 'Salem Industrial Hub', 'Zone Central', 11.6643, 78.1460, 'SAFE',       14.8, '2021-01-15'),
  (5, 'Trichy Cauvery Basin', 'Zone Central', 10.7905, 78.7047, 'CRITICAL',   23.5, '2017-06-30'),
  (6, 'Tirunelveli South',    'Zone South',   8.7139,  77.7567, 'VULNERABLE', 19.9, '2022-04-18');

INSERT INTO groundwater_data (well_id, recorded_date, rainfall, temperature, water_level, extraction_rate) VALUES
  (1, '2026-01-01', 12.5, 18.2, 16.5, 450.0),
  (1, '2026-02-01', 10.0, 19.5, 16.8, 460.0),
  (1, '2026-03-01',  8.0, 21.0, 17.2, 480.0),
  (1, '2026-04-01',  3.5, 24.0, 17.9, 510.0),
  (1, '2026-05-01',  1.0, 27.3, 18.5, 530.0),
  (1, '2026-06-01',  0.5, 30.1, 18.5, 540.0);

INSERT INTO predictions (well_id, forecast_date, predicted_level, shap_values_json) VALUES
  (1, '2026-07-01', 19.2, '{"rainfall":-0.80,"extraction":0.65,"temperature":0.30,"soil_permeability":0.40}'),
  (1, '2026-08-01', 19.8, '{"rainfall":-0.80,"extraction":0.68,"temperature":0.32,"soil_permeability":0.38}'),
  (1, '2026-09-01', 20.5, '{"rainfall":-0.78,"extraction":0.70,"temperature":0.35,"soil_permeability":0.37}'),
  (1, '2026-10-01', 20.1, '{"rainfall":-0.75,"extraction":0.60,"temperature":0.28,"soil_permeability":0.42}'),
  (1, '2026-11-01', 19.5, '{"rainfall":-0.70,"extraction":0.55,"temperature":0.22,"soil_permeability":0.43}'),
  (1, '2026-12-01', 18.9, '{"rainfall":-0.65,"extraction":0.50,"temperature":0.18,"soil_permeability":0.45}');

