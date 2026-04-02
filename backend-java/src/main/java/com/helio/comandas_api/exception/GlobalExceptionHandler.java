package com.helio.comandas_api.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> tratarErroGenerico(Exception ex) {
        System.out.println("Erro detectado: " + ex.getMessage());
        return ResponseEntity.status(500).body("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> tratarRunTime(RuntimeException ex) {
        return ResponseEntity.status(400).body("Ocorreu um erro na requisição: " + ex.getMessage());
    }
}
