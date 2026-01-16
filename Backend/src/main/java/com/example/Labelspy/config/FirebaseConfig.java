package com.example.Labelspy.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.project.id}")
    private String projectId;

    @Value("${firebase.credentials.path:}")
    private String credentialsPath;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions.Builder builder = FirebaseOptions.builder()
                    .setProjectId(projectId);

            GoogleCredentials credentials;
            if (credentialsPath != null && !credentialsPath.isEmpty()) {
                try (FileInputStream serviceAccount = new FileInputStream(credentialsPath)) {
                    credentials = GoogleCredentials.fromStream(serviceAccount);
                    log.info("Firebase initialized with credentials file: {}", credentialsPath);
                }
            } else {
                // loading from classpath or environment variable
                InputStream serviceAccount = getClass().getClassLoader()
                        .getResourceAsStream("firebase-credentials.json");
                if (serviceAccount != null) {
                    credentials = GoogleCredentials.fromStream(serviceAccount);
                    log.info("Firebase initialized with classpath credentials");
                } else {
                    // default credentials (for cloud environments)
                    credentials = GoogleCredentials.getApplicationDefault();
                    log.info("Firebase initialized with default credentials");
                }
            }

            builder.setCredentials(credentials);
            FirebaseOptions options = builder.build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        return FirebaseAuth.getInstance(firebaseApp());
    }
}

