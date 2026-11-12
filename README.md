# AquaVision AI - Smart Groundwater Intelligence & Decision Support Platform

AquaVision AI is an end-to-end groundwater intelligence terminal that combines real-time environmental data ingestion, machine learning-driven forecasting (Hybrid LSTM-XGBoost), explainable AI (SHAP), and interactive GIS hydrogeological mapping.

---

## 🌟 Key Features

1. **Interactive GIS Well Mapping:**
   - Visual spatial distribution of monitoring borewells categorized as Safe, Vulnerable, or Critical.
   - Interactive popups displaying well depth, telemetry, and zone classification.

2. **Predictive Forecasting (Hybrid LSTM-XGBoost):**
   - Seamless past-vs-future depth trends with 6-month continuous projection horizons.

3. **SHAP Explainability Analytics:**
   - Feature attribution breakdown explaining why aquifers are depleting (Rainfall deficit, Industrial extraction, Soil permeability, Temperature).

4. **Real-Time Data Ingestion:**
   - Automated ingestion pipeline pulling live surface precipitation, temperature, and soil moisture from Open-Meteo & CGWB telemetry.

5. **Actionable AI Recommendations:**
   - Automated alert system issuing zone-specific conservation protocols based on dynamic drawdown risk.

---

## 🏗️ Architecture & Tech Stack

```
[External APIs (Open-Meteo, CGWB)]
              │
              ▼
    [Python ML Pipeline] ──(Inference & Ingestion)──┐
                                                    │
                                                    ▼
                                           [MySQL Database]
                                           (aquavision_db)
                                                    ▲
                                                    │
                                          [Spring Boot API]
                                          (Java 17 / JPA)
                                                    ▲
                                                    │
                                           [React Dashboard]
                                           (Vite / Tailwind / Recharts / Leaflet)
```

- **Frontend:** React 19, Vite, Tailwind CSS v4, Recharts, React-Leaflet, Lucide React, React Router
- **Backend:** Java 17+, Spring Boot 3.3.4, Spring Data JPA, Hibernate, MySQL Connector
- **Database:** MySQL 8.0 (`aquavision_db`)
- **Machine Learning & Pipeline:** Python 3, PyMySQL, SQLAlchemy, XGBoost, SHAP, Scikit-learn, Open-Meteo REST API

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
Run the schema script located at `backend/sql/schema.sql` to initialize tables and initial telemetry:
```sql
CREATE DATABASE aquavision_db;
-- Import backend/sql/schema.sql
```

### 2. Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 3. Python ML & Real-Time Pipeline
```bash
cd ml_service
pip install -r requirements.txt
python data_collector.py   # Run real-time ingestion
python daily_job.py        # Run ML training & forecast scheduler
```

### 4. React Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
