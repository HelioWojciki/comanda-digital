package com.helio.comandas_api.controller;

import com.helio.comandas_api.model.Comanda;
import com.helio.comandas_api.service.ComandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comandas")
public class ComandaController {
    @Autowired
    private ComandaService comandaService;

    @GetMapping("/teste")
    public String teste(@RequestParam String nome) throws Exception {
        Comanda c = new Comanda();
        c.setNomeCliente(nome);
        c.setAberta(true);
        return comandaService.salvar(c);
    }
}
