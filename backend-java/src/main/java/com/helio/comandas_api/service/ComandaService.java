package com.helio.comandas_api.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.helio.comandas_api.model.Comanda;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public List<Comanda> listarTodos() {
        try {
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<QuerySnapshot> query = db.collection("comandas").get();

            QuerySnapshot querySnapshot = query.get();
            List<QueryDocumentSnapshot> documentos = querySnapshot.getDocuments();

            return documentos.stream()
                    .map(doc -> doc.toObject(Comanda.class))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar todas as comandas do Firebase: " + e.getMessage());
        }
    }

    public List<Comanda> listarAbertas() {
        try {
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<QuerySnapshot> query = db.collection("comandas")
                    .whereEqualTo("aberta", true)
                    .get();

            QuerySnapshot querySnapshot = query.get();
            List<QueryDocumentSnapshot> documentos = querySnapshot.getDocuments();

            return documentos.stream()
                    .map(doc -> doc.toObject(Comanda.class))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar as comandas abertas: " + e.getMessage());
        }
    }

    public void deletar(String id) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<WriteResult> query = db.collection("comandas").document(id).delete();

            query.get();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar a comanda: " + e.getMessage());
        }
    }

}
