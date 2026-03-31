package com.helio.comandas_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  // para o Firebase (Obrigatório)
@AllArgsConstructor // para Dev
public class ItemComanda {
    private String nome;
    private double preco;
}