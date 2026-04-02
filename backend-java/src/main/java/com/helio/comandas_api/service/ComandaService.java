package com.helio.comandas_api.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.helio.comandas_api.model.Comanda;
import org.springframework.stereotype.Service;

@Service
public class ComandaService {
    public String salvar(Comanda comanda) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            var docRef = db.collection("comandas").document();
            comanda.setId(docRef.getId());
            docRef.set(comanda).get();
            return comanda.getId();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar no Firebase: " + e.getMessage());
        }
    }
}
