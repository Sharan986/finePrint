package com.example.Labelspy.config;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
@Slf4j
public class FirestoreConfig {

    @Bean
    @DependsOn("firebaseApp")
    public Firestore firestore(FirebaseApp firebaseApp) {
        Firestore firestore = FirestoreClient.getFirestore();
        log.info("Firestore initialized successfully");
        return firestore;
    }
}

