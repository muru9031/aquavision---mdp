// src/main/java/com/aquavision/config/MlServiceClient.java
package com.aquavision.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client wired to call the Python FastAPI ML microservice.
 * Usage in a service:
 *
 *   @Autowired RestTemplate mlRestTemplate;
 *
 *   // Trigger a fresh forecast
 *   mlRestTemplate.postForObject(
 *       mlBaseUrl + "/predict/" + wellId,
 *       null,
 *       Void.class
 *   );
 */
@Configuration
public class MlServiceClient {

    @Value("${app.ml.service.base-url}")
    private String mlBaseUrl;

    @Bean
    public RestTemplate mlRestTemplate() {
        return new RestTemplate();
    }

    public String getMlBaseUrl() { return mlBaseUrl; }
}

