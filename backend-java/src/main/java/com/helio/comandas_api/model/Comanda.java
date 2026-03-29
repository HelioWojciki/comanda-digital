package com.helio.comandas_api.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comanda {

    private String id;
    private String nomeCliente;
    private double valorTotal;
    private boolean aberta;
    private LocalDateTime dataCriacao;

    public Comanda (){
        this.dataCriacao = LocalDateTime.now();
        this.aberta = true;
        this.valorTotal = 0.0;
    }
}
