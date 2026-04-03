package com.helio.comandas_api.controller;

import com.helio.comandas_api.model.Comanda;
import com.helio.comandas_api.service.ComandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comandas")
public class ComandaController {
    @Autowired
    private ComandaService comandaService;

    @PostMapping
    public ResponseEntity<Comanda> salvar(@RequestBody Comanda novaComanda) {
        Comanda comandaProcessada = new Comanda(novaComanda.getNomeCliente());

        if (novaComanda.getItens() != null) {
            novaComanda.getItens().forEach(comandaProcessada::adicionarItem);
        }

        String idGerado = comandaService.salvar(comandaProcessada);
        comandaProcessada.setId(idGerado);

        return ResponseEntity.status(HttpStatus.CREATED).body(comandaProcessada);
    }

    @GetMapping
    public ResponseEntity<List<Comanda>> listar() {
        List<Comanda> lista = comandaService.listarTodos();

        if (lista.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(lista);
    }
}
